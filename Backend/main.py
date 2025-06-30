from fastapi import FastAPI, File, UploadFile, Form, Depends, HTTPException, Request, status, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
import fitz  # <--- PyMuPDF
import os
import re
import tempfile
import docx2txt
import pypdf
import uvicorn
import spacy
import openai
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from sentence_transformers import SentenceTransformer, util
from dotenv import load_dotenv
import hashlib
import secrets
from pathlib import Path
import json
from Backend.utils import parse_resume, parse_resume_with_job_matching, allowed_file
from fastapi import Query
from typing import List
import logging
from voice_assistant import router as voice_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ─── Load Environment Variables ───────────────────────────────────────
load_dotenv("key.env")
load_dotenv(".env")

# ─── App Setup ─────────────────────────────────────────────────
app = FastAPI(title="CareerForge API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include voice assistant router
app.include_router(voice_router, prefix="/api/voice", tags=["voice-assistant"])

# ─── Security & Config ─────────────────────────────────────────
SECRET_KEY = "tkfs9uMwZuPsW6OGj-jVu8WfKc7YqsAfLg7rqHeUuRU"  
ALGORITHM = "HS256"
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

# ─── Databases ─────────────────────────────────────────────────
users_db = {
    "testuser": {
        "username": "testuser",
        "email": "test@example.com",
        "full_name": "Test User",
        "disabled": False,
        "hashed_password": hash_password("mysecret123"),
    }
}

# ─── Models ─────────────────────────────────────────────────────
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData:
    def __init__(self, username: Optional[str] = None):
        self.username = username


class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class ParsedResume(BaseModel):
    full_name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    skills: List[str]
    experience: List[Dict]
    location: Optional[str]
    education: List[str]

# ─── Utilities ──────────────────────────────────────────────────
def get_user(username: str):
    return users_db.get(username)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception

    user = users_db.get(token_data.username)
    if user is None:
        raise credentials_exception
    return user

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

# ─── NLP Models ─────────────────────────────────────────────────
nlp = spacy.load("en_core_web_sm")
model = SentenceTransformer("all-MiniLM-L6-v2")

async def openai_chat(messages: List[Dict]):
    res = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        max_tokens=800
    )
    return res.choices[0].message.content.strip()

def extract_text_from_content(content: bytes, filename: str) -> str:
    suffix = os.path.splitext(filename)[1].lower()
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(content)
        tmp.flush()
        tmp_path = tmp.name
    
    try:
        if suffix == ".pdf":
            with fitz.open(stream=content, filetype="pdf") as doc:
                text = ""
                for page in doc:
                    text += page.get_text()
        elif suffix in [".docx", ".doc"]:
            text = docx2txt.process(tmp_path)
        else:
            text = content.decode('utf-8', errors='ignore')
        return text
    finally:
        os.unlink(tmp_path)

def parse_resume(text: str) -> ParsedResume:
    doc = nlp(text)
    
    # Extract email first
    email = next(iter(re.findall(r'[\w.+-]+@[\w-]+\.[\w.-]+', text)), None)
    
    # Extract name (improved logic)
    name = None
    
    # Try to extract name from email first
    if email:
        # Get the part before @ and split by common separators
        email_name = email.split('@')[0]
        # Remove common separators and numbers
        email_name = re.sub(r'[._0-9]', ' ', email_name)
        # Split into words and capitalize
        name_parts = [word.capitalize() for word in email_name.split() if word]
        if name_parts:
            name = ' '.join(name_parts)
    
    # If no name found from email, look in the resume text
    if not name:
        # Common section headers to exclude
        section_headers = [
            'key skills', 'experience', 'education', 'summary', 'objective',
            'performance', 'dashboards', 'projects', 'achievements', 'certifications',
            'technical skills', 'professional experience', 'work experience'
        ]
        
        # Common non-name words to exclude
        non_name_words = [
            'resume', 'cv', 'curriculum vitae', 'llama', 'gpt', 'chat', 'ai',
            'machine learning', 'artificial intelligence', 'data science'
        ]
        
        # First try to find name near the email
        if email:
            # Get lines containing the email
            email_lines = [line for line in text.split('\n') if email in line]
            for line in email_lines:
                # Look at the line before and after the email line
                line_index = text.split('\n').index(line)
                context_lines = []
                if line_index > 0:
                    context_lines.append(text.split('\n')[line_index - 1])
                context_lines.append(line)
                if line_index < len(text.split('\n')) - 1:
                    context_lines.append(text.split('\n')[line_index + 1])
                
                for context_line in context_lines:
                    doc_line = nlp(context_line)
                    for ent in doc_line.ents:
                        if ent.label_ == "PERSON":
                            name_parts = ent.text.split()
                            if len(name_parts) <= 3:  # Names are usually 1-3 words
                                if (not any(header in ent.text.lower() for header in section_headers) and
                                    not any(word in ent.text.lower() for word in non_name_words) and
                                    all(part[0].isupper() for part in name_parts)):
                                    name = ent.text
                                    break
                    if name:
                        break
                if name:
                    break
        
        # If still no name found, try the first few lines
        if not name:
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
                
                doc_line = nlp(line)
                for ent in doc_line.ents:
                    if ent.label_ == "PERSON":
                        name_parts = ent.text.split()
                        if len(name_parts) <= 3:
                            if (not any(header in ent.text.lower() for header in section_headers) and
                                not any(word in ent.text.lower() for word in non_name_words) and
                                all(part[0].isupper() for part in name_parts)):
                                name = ent.text
                                break
                if name:
                    break
    
    # Extract phone
    phone = next(iter(re.findall(r'(\+?\d[\d \-()]{7,}\d)', text)), None)
    
    # Extract location
    location = next((ent.text for ent in doc.ents if ent.label_ == "GPE"), None)
    
    # Extract skills (look for technical terms and tools)
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
    
    # Extract experience (look for company names and job titles)
    experience = []
    lines = text.split('\n')
    current_company = None
    current_role = None
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Look for company names (usually in all caps or with specific patterns)
        if re.search(r'[A-Z][A-Z\s]+(?:Inc\.?|LLC|Ltd\.?|Corp\.?|Company|Technologies|Solutions)?$', line):
            if current_company and current_role:
                experience.append({
                    "company": current_company,
                    "role": current_role
                })
            current_company = line
            current_role = None
        # Look for job titles (usually contain words like "Engineer", "Developer", "Manager", etc.)
        elif re.search(r'(?:Engineer|Developer|Manager|Analyst|Consultant|Specialist|Lead|Architect)', line, re.IGNORECASE):
            current_role = line
    
    # Add the last experience entry if exists
    if current_company and current_role:
        experience.append({
            "company": current_company,
            "role": current_role
        })
    
    # Extract education
    education = []
    education_keywords = ['bachelor', 'master', 'phd', 'bca', 'mca', 'b.tech', 'm.tech']
    for line in lines:
        line = line.strip().lower()
        if any(keyword in line for keyword in education_keywords):
            education.append(line.title())
    
    return ParsedResume(
        full_name=name,
        email=email,
        phone=phone,
        location=location,
        skills=list(set(skills)),  # Remove duplicates
        experience=experience,
        education=education
    )

# ─── Routes ─────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "CareerForge API is running"}

@app.post("/api/resume/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        if not allowed_file(file.filename):
            raise HTTPException(status_code=400, detail="File type not allowed")
        
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        text = extract_text_from_content(content, file.filename)
        resume_data = parse_resume(text)
        return resume_data
            
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error uploading resume: {e}")
        raise HTTPException(status_code=500, detail=str(e))

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
            class DummyUploadFile:
                def __init__(self, file, filename):
                    self.file = file
                    self.filename = filename
            dummy_file = DummyUploadFile(f, latest_file.name)
            text = extract_text_from_content(f.read(), latest_file.name)
            parsed_data = parse_resume(text)
        
        return parsed_data
    except HTTPException as e:
        # Let FastAPI handle HTTPExceptions
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/search_subscriptions")
def search_subscriptions(query: str = Query(...)):
    results = []
    for email, data in users_db.items():
        if (
            query.lower() in email.lower()
            or query.lower() in data.get("plan", "").lower()
            or query.lower() in data.get("full_name", "").lower()
        ):
            results.append({
                "email": email,
                "full_name": data.get("full_name", ""),
                "plan": data.get("plan", ""),
                "credits": data.get("credits", 0)
            })
    return results

@app.post("/signup", response_model=User)
async def signup(
    email: str = Form(...),
    password: str = Form(...),
    full_name: str = Form(...)
):
    if email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    users_db[email] = {
        "username": email,
        "email": email,
        "full_name": full_name,
        "disabled": False,
        "hashed_password": hash_password(password),
    }
    
    return User(username=email, email=email, full_name=full_name)

@app.get("/get_user_info")
def get_user_info(email: str = Depends(get_current_user)):
    user = users_db[email]
    return {
        "email": email,
        "full_name": user["full_name"],
    }

@app.post("/forgot-password")
async def forgot_password(email: str = Form(...)):
    if email not in users_db:
        # Don't reveal if email exists or not for security
        return {"message": "If your email is registered, you will receive a password reset link"}
    
    # Generate reset token
    token = generate_reset_token()
    # Store token with expiration (1 hour)
    password_reset_tokens[token] = {
        "email": email,
        "expires": datetime.utcnow() + timedelta(hours=1)
    }
    
    # In a real application, you would send an email here
    # For development, we'll just return the token
    return {
        "message": "If your email is registered, you will receive a password reset link",
        "token": token  # Remove this in production
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
async def job_match(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    top_n: int = 3
):
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        if not allowed_file(file.filename):
            raise HTTPException(status_code=400, detail="File type not allowed")
        
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        text = extract_text_from_content(content, file.filename)
        resume_data = parse_resume(text)
        return resume_data
            
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error matching job: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/test")
async def test_endpoint():
    return {"message": "Backend is working!"}

@app.post("/api/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: Optional[str] = Form(None),
    current_user: dict = Depends(get_current_user)
):
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        if not allowed_file(file.filename):
            raise HTTPException(status_code=400, detail="File type not allowed")
        
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        text = extract_text_from_content(content, file.filename)
        if job_description:
            resume_data = parse_resume_with_job_matching(text, job_description)
        else:
            resume_data = parse_resume(text)
        return resume_data
            
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error analyzing resume: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Service is running"}

@app.post("/match_resume")
async def match_resume(
    file: UploadFile = File(...),
    job_description: Optional[str] = Form(None),
    current_user: dict = Depends(get_current_user)
):
    # Restrict to basic or premium plans
    if current_user.get("plan", "free") == "free":
        raise HTTPException(status_code=403, detail="Upgrade your plan to access this feature.")
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")
        if not allowed_file(file.filename):
            raise HTTPException(status_code=400, detail="File type not allowed")
        if not job_description:
            raise HTTPException(status_code=400, detail="Job description is required")
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        text = extract_text_from_content(content, file.filename)
        resume_data = parse_resume_with_job_matching(text, job_description)
        return resume_data
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error matching resume: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat_with_resume")
async def chat_with_resume(
    prompt: str = Form(...),
    resume_text: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        if not prompt or not resume_text:
            raise HTTPException(status_code=400, detail="Prompt and resume text are required")
        # For demonstration, echo the prompt and resume_text
        # Replace with OpenAI or other LLM call as needed
        response = f"Prompt: {prompt}\nResume: {resume_text[:100]}..."  # Truncate resume for brevity
        return {"response": response}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/user/plan")
def get_user_plan(current_user: dict = Depends(get_current_user)):
    email = current_user.get("email")
    user = users_db.get(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"plan": user.get("plan", "free")}

@app.post("/api/user/upgrade")
def upgrade_user_plan(
    plan: str = Body(..., embed=True),
    current_user: dict = Depends(get_current_user)
):
    email = current_user.get("email")
    user = users_db.get(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if plan not in ["free", "basic", "premium"]:
        raise HTTPException(status_code=400, detail="Invalid plan")
    user["plan"] = plan
    return {"message": f"Plan upgraded to {plan}"}

@app.post("/parse-resume")
async def parse_resume_endpoint(text: str):
    return parse_resume(text)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        workers=1
    )
