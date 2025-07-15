"""
CareerForge AI - Main API Server
FastAPI-based backend for AI-powered career optimization
"""

# Standard library imports
import hashlib
import logging
import os
import re
import secrets
import tempfile
from contextlib import asynccontextmanager
from datetime import UTC, datetime, timedelta

import docx2txt
import fitz  # PyMuPDF
import openai
import spacy

# Third-party imports
import uvicorn
from dotenv import load_dotenv
from fastapi import (
    Body,
    Depends,
    FastAPI,
    File,
    Form,
    Header,
    HTTPException,
    Path,
    Request,
    UploadFile,
    status,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt
from pydantic import BaseModel, EmailStr
from sentence_transformers import SentenceTransformer
from slowapi.errors import RateLimitExceeded
from slowapi.extension import Limiter 
from slowapi.util import get_remote_address

# Local application imports
from models import RevokedToken, SessionLocal
from payment_router import router as payment_router
from realtime_router import router as realtime_router
from schemas import User as UserModel
from skills_jobs_router import router as skills_jobs_router
from subscription_router import router as subscription_router
from usage_tracker import usage_tracker
from utils import (
    allowed_file,
    parse_resume,
    parse_resume_with_job_matching,
    setup_logging,
)
from Backend.schemas import User as DBUser
from Backend.auth import get_password_hash, verify_password
from sqlalchemy.orm import Session

rate_limiter = Limiter(key_func=get_remote_address)

# Load environment variables (must come *after* all imports)
load_dotenv("key.env")
load_dotenv(".env")
load_dotenv(".env.local")

# Setup uploads directory
uploads_dir = "uploads"
os.makedirs(uploads_dir, exist_ok=True)

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Global state
app_state = {}

@asynccontextmanager
async def lifespan(_app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("Starting CareerForge AI API server...")
    app_state["startup_time"] = "2024-01-01T00:00:00Z"
    
    yield
    
    # Shutdown
    logger.info("Shutting down CareerForge AI API server...")

# Create FastAPI app
app = FastAPI(
    title="CareerForge AI API",
    description="AI-powered career optimization platform",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(payment_router, prefix="/api/payment", tags=["payment"])
app.include_router(subscription_router, prefix="/api/subscription", tags=["subscription"])
app.include_router(skills_jobs_router, prefix="/api/skills-jobs", tags=["skills-jobs"])
app.include_router(realtime_router, prefix="/api/realtime", tags=["realtime"])
app.include_router(subscription_router, prefix="/api/subscription", tags=["subscription"])

# Security & Config
SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password reset tokens storage
password_reset_tokens = {}

# Simple password hashing for now
def hash_password(password: str) -> str:
    """Simple password hashing using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return hash_password(plain_password) == hashed_password

def generate_reset_token() -> str:
    """Generate a secure random token"""
    return secrets.token_urlsafe(32)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class ParsedResume(BaseModel):
    full_name: str | None
    email: str | None
    phone: str | None
    skills: list[str]
    experience: list[dict]
    location: str | None
    education: list[str]

# Utilities
def get_user(username: str):
    return users_db.get(username)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_jti_from_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("jti"), payload.get("exp")
    except Exception:
        return None, None

async def get_current_user(token: str = None):
    if token is None:
        token = Depends(oauth2_scheme)
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        jti: str = payload.get("jti")
        if username is None or jti is None:
            raise credentials_exception
    except Exception as err:
        raise credentials_exception from err
    db = SessionLocal()
    # Check if token is revoked
    revoked = db.query(RevokedToken).filter(
        RevokedToken.jti == jti, 
        RevokedToken.expires_at > datetime.now(UTC)
    ).first()
    revoked = db.query(RevokedToken).filter(RevokedToken.jti == jti, RevokedToken.expires_at > datetime.now(UTC)).first()
    if revoked:
        db.close()
        raise HTTPException(
            status_code=401, 
            detail="Token has been revoked. Please log in again."
        )
    user = db.query(UserModel).filter(UserModel.username == username).first()
    db.close()
    if user is None:
        raise credentials_exception
    return user

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db = SessionLocal()
    user = db.query(DBUser).filter(DBUser.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        db.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    db.close()
    return {"access_token": access_token, "token_type": "bearer"}

# NLP Models
nlp = spacy.load("en_core_web_sm")
model = SentenceTransformer("all-MiniLM-L6-v2")

def extract_text_from_content(contents: bytes, filename: str) -> str:
    suffix = os.path.splitext(filename)[1].lower()
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(contents)
        tmp.flush()
        tmp_path = tmp.name
    
    try:
        if suffix == ".pdf":
            with fitz.open(stream=contents, filetype="pdf") as doc:
                text = ""
                for page in doc:
                    text += page.get_text()
        elif suffix in [".docx", ".doc"]:
            text = docx2txt.process(tmp_path)
        else:
            text = contents.decode('utf-8', errors='ignore')
        return text
    finally:
        os.unlink(tmp_path)

def extract_email(text: str):
    return next(iter(re.findall(r'[\w.+-]+@[\w-]+\.[\w.-]+', text)), None)

def _extract_name_from_email(email):
    if not email:
        return None
    email_name = email.split('@')[0]
    email_name = re.sub(r'[._0-9]', ' ', email_name)
    name_parts = [word.capitalize() for word in email_name.split() if word]
    if name_parts:
        return ' '.join(name_parts)
    return None

def _is_valid_name_entity(ent, section_headers, non_name_words):
    name_parts = ent.text.split()
    return (
        ent.label_ == "PERSON"
        and len(name_parts) <= 3
        and not any(header in ent.text.lower() for header in section_headers)
        and not any(word in ent.text.lower() for word in non_name_words)
        and all(part and part[0].isupper() for part in name_parts)
    )

def _extract_name_near_email(text, email, nlp_model, section_headers, non_name_words):
    if not email:
        return None
    lines = text.split('\n')
    email_lines = [line for line in lines if email in line]
    for line in email_lines:
        line_index = lines.index(line)
        context_lines = []
        if line_index > 0:
            context_lines.append(lines[line_index - 1])
        context_lines.append(line)
        if line_index < len(lines) - 1:
            context_lines.append(lines[line_index + 1])
        for context_line in context_lines:
            doc_line = nlp_model(context_line)
            for ent in doc_line.ents:
                if _is_valid_name_entity(ent, section_headers, non_name_words):
                    return ent.text
    return None

def _extract_name_from_first_lines(text, nlp_model, section_headers, non_name_words):
    first_lines = text.split('\n')[:10]
    for line in first_lines:
        line = line.strip()
        if not line:
            continue
        line_lower = line.lower()
        if any(header in line_lower for header in section_headers):
            continue
        if len(line.split()) > 4:
            continue
        if any(word in line_lower for word in non_name_words):
            continue
        doc_line = nlp_model(line)
        for ent in doc_line.ents:
            if _is_valid_name_entity(ent, section_headers, non_name_words):
                return ent.text
    return None

def extract_name(text: str, email: str, nlp_model):
    section_headers = [
        'key skills', 'experience', 'education', 'summary', 'objective',
        'performance', 'dashboards', 'projects', 'achievements', 'certifications',
        'technical skills', 'professional experience', 'work experience'
    ]
    non_name_words = [
        'resume', 'cv', 'curriculum vitae', 'llama', 'gpt', 'chat', 'ai',
        'machine learning', 'artificial intelligence', 'data science'
    ]
    name = _extract_name_from_email(email)
    if name:
        return name
    name = _extract_name_near_email(text, email, nlp_model, section_headers, non_name_words)
    if name:
        return name
    name = _extract_name_from_first_lines(text, nlp_model, section_headers, non_name_words)
    return name

def extract_phone(text: str):
    return next(iter(re.findall(r'(\+?\d[\d \-()]{7,}\d)', text)), None)

def extract_location(doc):
    return next((ent.text for ent in doc.ents if ent.label_ == "GPE"), None)

def extract_skills(text: str):
    skills = []
    skill_keywords = [
        "python", "java", "javascript", "react", "node", "sql", "aws", "docker",
        "kubernetes", "machine learning", "ai", "ml", "nlp", "tensorflow", "pytorch",
        "excel", "power bi", "netsuite", "linkedin", "bert", "computer vision",
        "prompt engineering", "critical thinking", "conflict management"
    ]
    text_lower = text.lower()
    for skill in skill_keywords:
        if skill in text_lower:
            skills.append(skill.title())
    return list(set(skills))

def extract_experience(text: str):
    experience = []
    lines = text.split('\n')
    current_company = None
    current_role = None
    for line in lines:
        line = line.strip()
        if not line:
            continue
        if re.search(
            r'[A-Z][A-Z\s]+(?:Inc\.?|LLC|Ltd\.?|Corp\.?|Company|Technologies|Solutions)?$', 
            line
        ):
            if current_company and current_role:
                experience.append({
                    "company": current_company,
                    "role": current_role
                })
            current_company = line
            current_role = None
        elif re.search(
            r'(?:Engineer|Developer|Manager|Analyst|Consultant|Specialist|Lead|Architect)', 
            line, 
            re.IGNORECASE
        ):
            current_role = line
    if current_company and current_role:
        experience.append({
            "company": current_company,
            "role": current_role
        })
    return experience

def extract_education(text: str):
    education = []
    education_keywords = ['bachelor', 'master', 'phd', 'bca', 'mca', 'b.tech', 'm.tech']
    lines = text.split('\n')
    for line in lines:
        line = line.strip().lower()
        if any(keyword in line for keyword in education_keywords):
            education.append(line.title())
    return education

# Routes

@app.post("/api/resume/upload")
async def upload_resume(request: Request, file: UploadFile = None, current_user: dict = None):
    if file is None:
        file = File(...)
    if current_user is None:
        current_user = Depends(get_current_user)
    allowed_types = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain"
    ]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail="Only PDF, DOCX, or TXT files are allowed."
        )
    if file.filename == "":
        raise HTTPException(status_code=400, detail="No file uploaded")
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty file uploaded")
    if len(contents) > 5 * 1024 * 1024:  # 5MB limit
        raise HTTPException(status_code=400, detail="File size must be less than 5MB.")
    try:
        text = extract_text_from_content(contents, file.filename)
        parsed_data = parse_resume(text)
        return {
            "message": "Resume uploaded and parsed successfully",
            "parsed_resume": parsed_data.dict()
        }
    except Exception as e:
        logger.error("Error processing resume: %s", e)
        raise HTTPException(status_code=500, detail="Failed to process resume") from e



# Example GET Endpoint
@app.get("/api/some-endpoint")
async def my_endpoint(request: Request):
    return {"message": "Hello! You are within the rate limit."}




        
@app.get("/api/resume/parsed")
async def get_parsed_resume(current_user: User = Depends(get_current_user)):
    try:
        email = current_user.email
        
        # Get the most recent resume file
        upload_dir = Path("uploads") / email
        if not upload_dir.exists():
            raise HTTPException(status_code=404, detail="No resume uploaded yet")
        
        resume_files = list(upload_dir.glob("*.*"))
        if not resume_files:
            raise HTTPException(status_code=404, detail="No resume uploaded yet")
        
        # Get the most recent file
        latest_file = max(resume_files, key=lambda x: x.stat().st_mtime)
        
        # Parse resume
        with open(latest_file, "rb") as f:
            text = extract_text_from_content(f.read(), latest_file.name)
            parsed_data = parse_resume(text)
        
        return parsed_data
    except HTTPException as e:
        # Let FastAPI handle HTTPExceptions
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/signup", response_model=User)
async def signup(email: str = Form(...), password: str = Form(...), full_name: str = Form(...)):
    db = SessionLocal()
    existing = db.query(DBUser).filter(DBUser.email == email).first()
    if existing:
        db.close()
        raise HTTPException(status_code=400, detail="Email already registered")
    user = create_user(db, email, password, full_name)
    db.close()
    return User(username=user.username, email=user.email, full_name=user.full_name)

@app.get("/get_user_info")
def get_user_info(email: str = Depends(get_current_user)):
    user = users_db[email]
    return {
        "email": email,
        "full_name": user["full_name"],
    }

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@example.com")

def send_email(to_email: str, subject: str, body: str):
    # Placeholder for real email sending logic
    logger.info("Sending email from %s to %s: %s\n%s", ADMIN_EMAIL, to_email, subject, body)
    # Integrate with SMTP or email service here


@app.post("/forgot-password")
async def forgot_password(email: str = Form(...)):
    if email not in users_db:
        # Don't reveal if email exists or not for security
        return {"message": "If your email is registered, you will receive a password reset link"}
    token = generate_reset_token()
    password_reset_tokens[token] = {
        "email": email,
        "expires": datetime.utcnow() + timedelta(hours=1)
    }
    # Send password reset email
    reset_link = f"https://yourdomain.com/reset-password?token={token}"
    send_email(
        to_email=email,
        subject="Password Reset Request",
        body=f"Click the link to reset your password: {reset_link}"
    )
    return {
        "message": "If your email is registered, you will receive a password reset link"
    }

@app.post("/reset-password")
async def reset_password(
    token: str = Form(...),
    new_password: str = Form(...)
):
    if token not in password_reset_tokens:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    
    token_data = password_reset_tokens[token]
    if datetime.utcnow() > token_data["expires"]:
        del password_reset_tokens[token]
        raise HTTPException(status_code=400, detail="Token has expired")
    
    email = token_data["email"]
    users_db[email]["hashed_password"] = hash_password(new_password)
    
    # Remove used token
    del password_reset_tokens[token]
    
    return {"message": "Password has been reset successfully"}

@app.post("/job_match")
async def job_match(file: UploadFile = None, current_user: dict = None, _top_n: int = 3):
    if file is None:
        file = File(...)
    if current_user is None:
        current_user = Depends(get_current_user)
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")
        if not allowed_file(file.filename):
            raise HTTPException(status_code=400, detail="File type not allowed")
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        text = extract_text_from_content(contents, file.filename)
        resume_data = parse_resume(text)
        return resume_data
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error("Error matching job: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e

@app.post("/api/analyze-resume")
async def analyze_resume(file: UploadFile = None, job_description: str = None, current_user: dict = None):
    if file is None:
        file = File(...)
    if job_description is None:
        job_description = Form(None)
    if current_user is None:
        current_user = Depends(get_current_user)
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")
        if not allowed_file(file.filename):
            raise HTTPException(status_code=400, detail="File type not allowed")
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        text = extract_text_from_content(contents, file.filename)
        if job_description:
            resume_data = parse_resume_with_job_matching(text, job_description)
        else:
            resume_data = parse_resume(text)
        return resume_data
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error("Error analyzing resume: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e



@app.post("/match_resume")
async def match_resume(file: UploadFile = None, job_description: str = None, current_user: dict = None):
    if file is None:
        file = File(...)
    if job_description is None:
        job_description = Form(None)
    if current_user is None:
        current_user = Depends(get_current_user)
    # Restrict to basic or premium plans
    if current_user.get("plan", "free") == "free":
        raise HTTPException(
            status_code=403, 
            detail="Upgrade your plan to access this feature."
        )
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")
        if not allowed_file(file.filename):
            raise HTTPException(status_code=400, detail="File type not allowed")
        if not job_description:
            raise HTTPException(status_code=400, detail="Job description is required")
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        text = extract_text_from_content(contents, file.filename)
        resume_data = parse_resume_with_job_matching(text, job_description)
        return resume_data
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error("Error matching resume: %s", e)
        raise HTTPException(status_code=500, detail=f"Resume matching failed: {str(e)}")

@app.post("/chat_with_resume")
async def chat_with_resume(prompt: str = None, resume_text: str = None, current_user: dict = None):
    if prompt is None:
        prompt = Form(...)
    if resume_text is None:
        resume_text = Form(...)
    if current_user is None:
        current_user = Depends(get_current_user)
    try:
        if not prompt or not resume_text:
            raise HTTPException(
                status_code=400, 
                detail="Prompt and resume text are required"
            )
        response = (
            f"Prompt: {prompt}\nResume: {resume_text[:100]}..."  # Truncate resume for brevity
        )
        return {"response": response}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

@app.post("/cover-letter-rewrite")
async def cover_letter_rewrite(resume_data: dict = None, job_description: str = None, original_cover_letter: str = None):
    if resume_data is None:
        resume_data = Body(...)
    if job_description is None:
        job_description = Body(...)
    if original_cover_letter is None:
        original_cover_letter = Body(...)
    # Try OpenAI if available
    try:
        if openai.api_key:
            prompt = (
                f"Rewrite the following cover letter to better match the job description.\n\n"
                f"Job Description:\n{job_description}\n\n"
                f"Resume Data:\n{resume_data}\n\n"
                f"Original Cover Letter:\n{original_cover_letter}\n\n"
                f"Rewritten Cover Letter:"
            )
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system", 
                        "content": "You are a helpful assistant that rewrites cover letters for job applications."
                    },
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.7
            )
            rewritten = response.choices[0].message.content.strip()
            return {"rewritten_cover_letter": rewritten}
    except Exception as e:
        print(f"OpenAI error: {e}")
    skills = ', '.join(resume_data.get('skills', []))
    full_name = resume_data.get('full_name', 'Your Name')
    rewritten = (
        f"Dear Hiring Manager,\n\n"
        f"I am excited to apply for this position. My background in {skills} "
        f"and experience in similar roles make me a strong fit. "
        f"I am eager to contribute to your team.\n\n"
        f"Sincerely,\n{full_name}"
    )
    return {"rewritten_cover_letter": rewritten}

@app.post("/gpt-chat")
async def gpt_chat(messages: list = None):
    if messages is None:
        messages = Body(...)
    try:
        if openai.api_key:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=300,
                temperature=0.7
            )
            reply = response.choices[0].message.content.strip()
            logger.info("GPT chat reply: %s", reply)
            return {"reply": reply}
    except Exception as e:
        logger.error("OpenAI error: %s", e)
        return {"reply": "Sorry, the AI chat is currently unavailable."}
    return {"reply": "Sorry, the AI chat is currently unavailable."}

# User Logout Endpoint
@app.post("/logout")
async def logout(token: str = None):
    """Logout endpoint (JWT logout is client-side; this is for UI flow)"""
    if token is None:
        token = Header(...)
    jti, exp = get_jti_from_token(token)
    if not jti or not exp:
        return {"error": "Invalid token"}
    db = SessionLocal()
    expires_at = datetime.fromtimestamp(exp, tz=UTC)
    revoked = RevokedToken(jti=jti, expires_at=expires_at)
    db.add(revoked)
    db.commit()
    db.close()
    logger.info("User logged out. Token revoked: %s", jti)
    return {"message": "Logged out successfully."}

# Admin Analytics Endpoint (API Key Protected)
ADMIN_API_KEY = "supersecretadminkey"  # Change this in production!

@app.get("/admin/analytics")
async def admin_analytics(x_api_key: str = None):
    """Admin analytics endpoint (requires X-API-KEY header)"""
    if x_api_key is None:
        x_api_key = Header(...)
    if x_api_key != ADMIN_API_KEY:
        logger.warning("Unauthorized analytics access attempt.")
        return {"error": "Unauthorized"}
    db = SessionLocal()
    try:
        user_count = db.query(UserModel).count()
    except Exception as e:
        logger.error("User count error: %s", e)
        user_count = 0
    try:
        resume_count = len([f for f in os.listdir(uploads_dir) if f.endswith('.pdf')])
    except Exception as e:
        logger.error("Resume count error: %s", e)
        resume_count = 0
    try:
        job_match_count = len([f for f in os.listdir(uploads_dir) if f.endswith('.json')])
    except Exception as e:
        logger.error("JobMatch count error: %s", e)
        job_match_count = 0
    analytics = {
        "user_count": user_count,
        "resumes_parsed": resume_count,
        "jobs_matched": job_match_count,
        "chats": 0  # No chat model yet
    }
    logger.info("Admin analytics accessed: %s", analytics)
    db.close()
    return analytics

# Admin User Management Endpoints
@app.get("/admin/users")
async def admin_list_users(x_api_key: str = None):
    if x_api_key is None:
        x_api_key = Header(...)
    if x_api_key != ADMIN_API_KEY:
        return {"error": "Unauthorized"}
    db = SessionLocal()
    users = db.query(UserModel).all()
    user_list = [
        {
            "id": u.id,
            "email": u.email,
            "username": u.username,
            "full_name": u.full_name,
            "plan": u.plan,
            "is_active": u.is_active,
            "created_at": u.created_at
        } for u in users
    ]
    db.close()
    return {"users": user_list}

@app.get("/admin/users/{user_id}")
async def admin_get_user(user_id: int = None, x_api_key: str = None):
    if user_id is None:
        user_id = Path(...)
    if x_api_key is None:
        x_api_key = Header(...)
    if x_api_key != ADMIN_API_KEY:
        return {"error": "Unauthorized"}
    
    db = SessionLocal()
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    
    if not user:
        db.close()
        return {"error": "User not found"}
    
    user_data = {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "full_name": user.full_name,
        "plan": user.plan,
        "is_active": user.is_active,
        "created_at": user.created_at
    }
    
    db.close()
    return user_data


@app.post("/admin/users/{user_id}/deactivate")
async def admin_deactivate_user(user_id: int = None, x_api_key: str = None):
    if user_id is None:
        user_id = Path(...)
    if x_api_key is None:
        x_api_key = Header(...)
    if x_api_key != ADMIN_API_KEY:
        return {"error": "Unauthorized"}
    db = SessionLocal()
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        db.close()
        return {"error": "User not found"}
    user.is_active = False
    db.commit()
    db.close()
    return {"message": "User deactivated"}

@app.post("/admin/users/{user_id}/activate")
async def admin_activate_user(user_id: int = None, x_api_key: str = None):
    if user_id is None:
        user_id = Path(...)
    if x_api_key is None:
        x_api_key = Header(...)
    if x_api_key != ADMIN_API_KEY:
        return {"error": "Unauthorized"}
    db = SessionLocal()
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        db.close()
        return {"error": "User not found"}
    user.is_active = True
    db.commit()
    db.close()
    return {"message": "User activated"}

@app.delete("/admin/users/{user_id}")
async def admin_delete_user(user_id: int = None, x_api_key: str = None):
    if user_id is None:
        user_id = Path(...)
    if x_api_key is None:
        x_api_key = Header(...)
    if x_api_key != ADMIN_API_KEY:
        return {"error": "Unauthorized"}
    db = SessionLocal()
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        db.close()
        return {"error": "User not found"}
    db.delete(user)
    db.commit()
    db.close()
    return {"message": "User deleted"}

@app.get("/admin/logs")
async def admin_logs(x_api_key: str = None, lines: int = 100):
    if x_api_key is None:
        x_api_key = Header(...)
    if x_api_key != ADMIN_API_KEY:
        return {"error": "Unauthorized"}
    if not os.path.exists(LOG_FILE):
        return {"logs": []}
    with open(LOG_FILE, encoding="utf-8") as f:
        all_lines = f.readlines()
    last_lines = all_lines[-lines:]
    return {"logs": last_lines}

# Log all requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info("%s %s", request.method, request.url)
    response = await call_next(request)
    return response

# SECURITY NOTE: For production, always deploy behind HTTPS (e.g., with a reverse proxy like Nginx or on a platform that enforces HTTPS).
# For sensitive data at rest, use database encryption or encrypted file storage (e.g., AWS KMS, GCP KMS, or disk encryption).

# ERROR MONITORING: For production, integrate Sentry or another error monitoring service for real-time alerts.
# Example:
# import sentry_sdk
# sentry_sdk.init(dsn="your_sentry_dsn", traces_sample_rate=1.0)

# Add this after the imports
LOG_FILE = "backend.log"

# Usage tracking endpoints
@app.post("/api/usage/track")
async def track_usage(user_id: str, feature: str, user_plan: str = "free"):
    """Track usage of a feature for a user"""
    try:
        result = usage_tracker.increment_usage(user_id, feature, user_plan)
        return result
    except Exception as e:
        logger.error("Error tracking usage: %s", e)
        raise HTTPException(status_code=500, detail="Failed to track usage")

@app.get("/api/usage/check/{user_id}/{feature}")
async def check_usage(user_id: str, feature: str, user_plan: str = "free"):
    """Check if user can use a feature"""
    try:
        result = usage_tracker.check_usage_limit(user_id, feature, user_plan)
        return result
    except Exception as e:
        logger.error("Error checking usage: %s", e)
        raise HTTPException(status_code=500, detail="Failed to check usage")

@app.get("/api/usage/summary/{user_id}")
async def get_usage_summary(user_id: str, user_plan: str = "free"):
    """Get usage summary for a user"""
    try:
        result = usage_tracker.get_user_usage_summary(user_id, user_plan)
        return result
    except Exception as e:
        logger.error("Error getting usage summary: %s", e)
        raise HTTPException(status_code=500, detail="Failed to get usage summary")

@app.post("/api/usage/reset/{user_id}")
async def reset_usage(user_id: str, feature: str = None):
    """Reset usage for a user (admin function)"""
    try:
        usage_tracker.reset_user_usage(user_id, feature)
        return {"message": "Usage reset successfully"}
    except Exception as e:
        logger.error("Error resetting usage: %s", e)
        raise HTTPException(status_code=500, detail="Failed to reset usage")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "CareerForge AI API",
        "version": "1.0.0",
        "startup_time": app_state.get("startup_time")
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "CareerForge AI API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

# Mount static files (if needed)
# app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize the rate limiter
rate_limiter = Limiter(key_func=get_remote_address)
app.state.limiter = rate_limiter

# Optionally, add exception handler for rate limit exceeded
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded"}
    )

# Update signup endpoint
def create_user(db: Session, email: str, password: str, full_name: str):
    hashed_password = get_password_hash(password)
    user = DBUser(
        username=email,
        email=email,
        full_name=full_name,
        hashed_password=hashed_password,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",  # Only accessible from localhost
        port=8000,
        reload=True,
        log_level="info"
    )
