from fastapi import FastAPI, File, UploadFile, Form, Depends, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
import stripe 
import fitz  # <--- PyMuPDF
import os
import re
import tempfile
import docx2txt
import PyPDF2
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
from utils import parse_resume, parse_resume_with_job_matching, extract_skills_from_job_description, match_skills, generate_learning_plan, allowed_file, rewrite_resume, optimize_for_linkedin
from fastapi import Query
from typing import List

# ─── Load OpenAI API Key ───────────────────────────────────────

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# ─── Validate API Key ───────────────────────────────────────────
load_dotenv("key.env")
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise RuntimeError("OPENAI_API_KEY not found in key.env file.")

# ─── Initialize OpenAI Client ──────────────────────────────────

openai.api_key = os.getenv("OPENAI_API_KEY")
# response = openai.ChatCompletion.create(...)  # Removed: missing model parameter and not needed here

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
def get_user(username: str):
    return users_db.get(username)

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
        "credits": 10,
        "plan": "free"
    }
}

credits_db = {
    "user1@example.com": 5
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
    credits: int = 0
    plan: str = "free"

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

# ✅ Stripe Product/Price Mapping
PLAN_PRICE_MAP = {
    "basic": os.getenv("STRIPE_BASIC_PRICE_ID"),
    "premium": os.getenv("STRIPE_PREMIUM_PRICE_ID")
}

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

def extract_text(file):
    # If file is a Path object, open it and wrap in a dummy object with .filename
    if isinstance(file, Path):
        with open(file, "rb") as f:
            class DummyUploadFile:
                def __init__(self, file, filename):
                    self.file = file
                    self.filename = filename
            file = DummyUploadFile(f, file.name)
    suffix = os.path.splitext(file.filename)[1].lower()
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(file.file.read())
        tmp.flush()
        tmp_path = tmp.name
    try:
        if suffix == ".pdf":
            text = "".join([p.extract_text() or '' for p in PyPDF2.PdfReader(tmp_path).pages])
        elif suffix in [".docx", ".doc"]:
            text = docx2txt.process(tmp_path)
        else:
            text = open(tmp_path, encoding="utf-8", errors="ignore").read()
    finally:
        os.unlink(tmp_path)
    return text

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


@app.post("/api/resume/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    try:
        email = current_user.email
        
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        # Validate file type
        allowed_types = [".pdf", ".docx", ".doc"]
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed types: {', '.join(allowed_types)}"
            )
        
        # Create user-specific upload directory
        upload_dir = Path("uploads") / email
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        # Clear old files
        for old_file in upload_dir.glob("*.*"):
            try:
                old_file.unlink()
            except Exception as e:
                print(f"Error deleting old file {old_file}: {e}")
        
        # Save new file
        file_path = upload_dir / file.filename
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Parse resume from the saved file
        with open(file_path, "rb") as f:
            class DummyUploadFile:
                def __init__(self, file, filename):
                    self.file = file
                    self.filename = filename
            dummy_file = DummyUploadFile(f, file.filename)
            text = extract_text(dummy_file)
        parsed_data = parse_resume(text)
        
        return {
            "message": "Resume uploaded successfully",
            "parsed_data": parsed_data
        }
    except Exception as e:
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
            text = extract_text(dummy_file)
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

# ✅ Create Stripe Checkout Session
@app.post("/create_checkout")
def create_checkout(plan: str = Form(...), email: str = Depends(get_current_user)):
    if plan not in PLAN_PRICE_MAP:
        raise HTTPException(status_code=400, detail="Invalid plan")

    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            customer_email=email,
            line_items=[{
                "price": PLAN_PRICE_MAP[plan],
                "quantity": 1,
            }],
            mode="payment",
            success_url=f"{FRONTEND_URL}/success?plan={plan}",
            cancel_url=f"{FRONTEND_URL}/cancel",
            metadata={"email": email, "plan": plan}
        )
        return {"checkout_url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ Stripe Webhook
@app.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    # Handle successful payment
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        email = session["metadata"]["email"]
        plan = session["metadata"]["plan"]

        if email in users_db:
            users_db[email]["plan"] = plan
            users_db[email]["credits"] = 100 if plan == "premium" else 20

    return JSONResponse(status_code=200, content={"status": "success"})

# 💳 Subscription Plans
PLAN_FEATURES = {
    "free": ["resume_upload", "ats_score"],
    "basic": ["resume_upload", "ats_score", "match_jobs", "rewrite_resume", "chat_resume", "cover_letter"],
    "premium": ["all"]
}

# ✅ Check if feature is accessible based on plan
def check_feature_access(email: str, feature: str):
    user_plan = users_db[email]["plan"]
    if "all" in PLAN_FEATURES.get(user_plan, []):
        return
    if feature not in PLAN_FEATURES.get(user_plan, []):
        raise HTTPException(status_code=403, detail=f"{feature} not allowed in your current plan. Please upgrade.")

# 📥 Signup
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
        "credits": 5,
        "plan": "free"
    }
    credits_db[email] = 5
    
    return User(username=email, email=email, full_name=full_name, credits=5)

# 💳 Upgrade plan
@app.post("/upgrade_plan")
def upgrade_plan(plan: str = Form(...), email: str = Depends(get_current_user)):
    if plan not in PLAN_FEATURES:
        raise HTTPException(status_code=400, detail="Invalid plan")
    users_db[email]["plan"] = plan
    return {"message": f"Plan upgraded to {plan}", "plan": plan}

# 👤 Get user info
@app.get("/get_user_info")
def get_user_info(email: str = Depends(get_current_user)):
    user = users_db[email]
    return {"email": email, "full_name": user["full_name"], "plan": user["plan"], "credits": user["credits"]}

# 📄 Match resume + auto rewrite if match_score < 80
@app.post("/match_resume")
async def match_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    current_user: User = Depends(get_current_user)
):
    try:
        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        if not allowed_file(file.filename):
            raise HTTPException(status_code=400, detail="Invalid file type")
        
        # Process the resume
        resume_data = parse_resume(file)
        
        if job_description:
            # Check feature access and credits for resume rewriting and LinkedIn optimization
            check_feature_access(current_user.email, "resume_rewrite")
            if users_db[current_user.email]["credits"] <= 0:
                raise HTTPException(status_code=402, detail="Insufficient credits")
            users_db[current_user.email]["credits"] -= 1
            
            # Rewrite resume for better ATS score
            rewritten_resume = rewrite_resume(resume_data, job_description)
            
            # Optimize for LinkedIn
            linkedin_profile = optimize_for_linkedin(resume_data)
            
            # Match resume with job description
            job_skills = extract_skills_from_job_description(job_description)
            matched, missing = match_skills(job_skills, resume_data['skills'])
            learning_plan = generate_learning_plan(missing)
            
            # Combine all results
            result = {
                'original_resume': resume_data,
                'rewritten_resume': rewritten_resume,
                'linkedin_profile': linkedin_profile,
                'job_skills': job_skills,
                'matched_skills': matched,
                'missing_skills': missing,
                'learning_plan': learning_plan,
                'ats_score': rewritten_resume['ats_score'],
                'linkedin_completeness': linkedin_profile['completeness_score'],
                'credits_left': users_db[current_user.email]["credits"]
            }
            
            return result
        else:
            # If no job description, return only the ATS score (free)
            return {
                'original_resume': resume_data,
                'ats_score': calculate_ats_score(resume_data, "")
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 💬 Resume Chat
@app.post("/chat_with_resume")
def chat_with_resume(
    prompt: str = Form(...),
    resume_text: str = Form(...),
    email: str = Depends(get_current_user)
):
    check_feature_access(email, "chat_resume")
    if users_db[email]["credits"] <= 0:
        raise HTTPException(status_code=402, detail="No credits left")
    users_db[email]["credits"] -= 1

    # GPT logic placeholder
    return {
        "response": f"(GPT chat reply) Based on your resume: {resume_text[:100]}... and your prompt: {prompt}",
        "credits_left": users_db[email]["credits"]
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
def job_match(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    top_n: int = 3
):
    try:
        # Log the request
        print(f"Job match request from user: {current_user.email}")
        print(f"File details - Name: {file.filename}, Content-Type: {file.content_type}")
        
        # Check feature access and credits
        check_feature_access(current_user.email, "match_jobs")
        if users_db[current_user.email]["credits"] <= 0:
            raise HTTPException(status_code=402, detail="Insufficient credits")
        users_db[current_user.email]["credits"] -= 1

        # Validate file extension
        ext = file.filename.rsplit('.', 1)[-1].lower()
        if ext not in utils.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type. Allowed types: {', '.join(utils.ALLOWED_EXTENSIONS)}"
            )

        # Read jobs from jobs.json
        try:
            with open("Backend/jobs.json", "r", encoding="utf-8") as f:
                jobs = json.load(f)
            print(f"Successfully loaded {len(jobs)} jobs from jobs.json")
        except Exception as e:
            print(f"Error loading jobs.json: {str(e)}")
            raise HTTPException(status_code=500, detail="Error loading job data")

        # Parse resume
        try:
            # Create a temporary file to store the uploaded content
            with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{ext}') as tmp:
                content = file.file.read()
                if not content:
                    raise ValueError("Empty file content")
                tmp.write(content)
                tmp.flush()
                tmp_path = tmp.name

            try:
                # Create a file-like object for the parser
                class DummyFileStorage:
                    def __init__(self, filepath):
                        self.filename = filepath
                        self.stream = open(filepath, 'rb')
                        self.content_type = file.content_type

                resume_data = utils.parse_resume(DummyFileStorage(tmp_path))
                print(f"Successfully parsed resume: {resume_data}")
            finally:
                # Clean up the temporary file
                os.unlink(tmp_path)
                print("Cleaned up temporary file")

        except Exception as e:
            print(f"Error parsing resume: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error parsing resume: {str(e)}")

        # Extract skills from resume
        resume_skills = resume_data.get("skills", [])
        print(f"Extracted skills from resume: {resume_skills}")

        # Match to jobs
        try:
            job_matches = []
            for job in jobs:
                job_skills = [s.lower() for s in job.get("skills_required", [])]
                matched = [s for s in resume_skills if s.lower() in job_skills]
                missing = [s for s in job_skills if s.lower() not in resume_skills]
                score = int(100 * len(matched) / max(1, len(job_skills)))
                job_matches.append({
                    "title": job["title"],
                    "company": job["company"],
                    "description": job["description"],
                    "skills_required": job["skills_required"],
                    "matched_skills": matched,
                    "missing_skills": missing,
                    "match_score": score
                })
            print(f"Successfully matched {len(job_matches)} jobs")
        except Exception as e:
            print(f"Error matching jobs: {str(e)}")
            raise HTTPException(status_code=500, detail="Error matching jobs")

        # Sort by match score
        job_matches.sort(key=lambda x: x["match_score"], reverse=True)
        
        # Get top matches
        top_matches = job_matches[:top_n]
        print(f"Selected top {len(top_matches)} matches")
        
        # Calculate overall match score
        overall_score = sum(match["match_score"] for match in top_matches) / len(top_matches) if top_matches else 0
        
        # Get all missing skills
        all_missing_skills = list(set(skill for match in top_matches for skill in match["missing_skills"]))
        
        # Log success
        print(f"Successfully completed job matching for user: {current_user.email}")
        
        return {
            "match_score": overall_score,
            "missing_skills": all_missing_skills,
            "learning_plan": f"To improve your job matches, consider learning: {', '.join(all_missing_skills)}" if all_missing_skills else "Your skills match well with the available jobs!",
            "top_matches": top_matches,
            "credits_left": users_db[current_user.email]["credits"]
        }
    except HTTPException as he:
        # Log HTTP exceptions
        print(f"HTTP Exception for user {current_user.email}: {str(he)}")
        raise he
    except Exception as e:
        # Log other exceptions
        print(f"Unexpected error processing job match for user {current_user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/test")
async def test_endpoint():
    return {"message": "Backend is working!"}

@app.post("/api/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(None),
    current_user: User = Depends(get_current_user)
):
    try:
        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        if not allowed_file(file.filename):
            raise HTTPException(status_code=400, detail="Invalid file type")
        
        # Process the resume
        resume_data = parse_resume(file)
        
        if job_description:
            # Match resume with job description
            job_skills = extract_skills_from_job_description(job_description)
            matched, missing = match_skills(job_skills, resume_data['skills'])
            learning_plan = generate_learning_plan(missing)
            
            resume_data.update({
                'job_skills': job_skills,
                'matched_skills': matched,
                'missing_skills': missing,
                'learning_plan': learning_plan
            })
        
        return resume_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Service is running"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        workers=1
    )
