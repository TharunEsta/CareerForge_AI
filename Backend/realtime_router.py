"""
Real-time API Router for CareerForge AI
Handles skills analysis, job matching, resume optimization, and real-time processing
"""

import json
import logging
import re
from datetime import datetime
from typing import Dict, List, Optional, Any
from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field
import openai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

# Setup logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/realtime", tags=["realtime"])

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class SkillAnalysisRequest(BaseModel):
    text: str = Field(..., description="Text to analyze for skills")
    job_description: Optional[str] = Field(None, description="Job description for matching")
    analysis_type: str = Field("comprehensive", description="Type of analysis")

class JobMatchRequest(BaseModel):
    resume_text: str = Field(..., description="Resume text")
    job_description: str = Field(..., description="Job description")
    match_criteria: List[str] = Field(["skills", "experience", "education"], description="Match criteria")

class ResumeOptimizationRequest(BaseModel):
    resume_data: Dict[str, Any] = Field(..., description="Resume data")
    job_description: str = Field(..., description="Target job description")
    optimization_type: str = Field("ats", description="Optimization type: ats, linkedin, cover_letter")

class RealTimeAnalysisRequest(BaseModel):
    content: str = Field(..., description="Content to analyze")
    analysis_type: str = Field(..., description="Type of analysis")
    user_id: str = Field(..., description="User ID")

class WebSocketMessage(BaseModel):
    type: str = Field(..., description="Message type")
    data: Dict[str, Any] = Field(..., description="Message data")
    user_id: str = Field(..., description="User ID")

# ============================================================================
# REAL-TIME SKILLS ANALYSIS
# ============================================================================

async def analyze_skills_realtime(text: str, job_description: Optional[str] = None) -> Dict[str, Any]:
    """Real-time skills analysis with AI enhancement"""
    try:
        # Basic skill extraction
        skills = extract_skills_from_text(text)
        
        # AI-enhanced analysis
        if openai.api_key:
            prompt = f"""
            Analyze the following text for technical skills and competencies:
            
            Text: {text}
            
            Please provide:
            1. Technical skills found
            2. Skill proficiency levels
            3. Missing skills for job market
            4. Skill recommendations
            
            Format as JSON.
            """
            
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.3
            )
            
            ai_analysis = json.loads(response.choices[0].message.content)
        else:
            ai_analysis = {"skills": skills, "proficiency": "basic", "recommendations": []}
        
        # Job matching if job description provided
        job_match = None
        if job_description:
            job_match = await match_skills_to_job(skills, job_description)
        
        return {
            "skills": skills,
            "ai_analysis": ai_analysis,
            "job_match": job_match,
            "timestamp": datetime.now().isoformat(),
            "confidence": 0.95
        }
        
    except Exception as e:
        logger.error(f"Error in real-time skills analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Skills analysis failed: {str(e)}")

def extract_skills_from_text(text: str) -> List[str]:
    """Extract skills from text using pattern matching"""
    skill_patterns = [
        r'\b(python|java|c\+\+|javascript|react|angular|vue|node\.js)\b',
        r'\b(sql|mysql|postgresql|mongodb|redis)\b',
        r'\b(aws|azure|gcp|docker|kubernetes|jenkins)\b',
        r'\b(machine learning|ai|nlp|computer vision|deep learning)\b',
        r'\b(html|css|bootstrap|tailwind|sass|less)\b',
        r'\b(git|github|gitlab|bitbucket|svn)\b',
        r'\b(agile|scrum|kanban|waterfall)\b',
        r'\b(linux|unix|windows|macos)\b',
        r'\b(excel|power bi|tableau|looker)\b',
        r'\b(photoshop|illustrator|figma|sketch)\b'
    ]
    
    skills = []
    text_lower = text.lower()
    
    for pattern in skill_patterns:
        matches = re.findall(pattern, text_lower)
        skills.extend(matches)
    
    return list(set(skills))

# ============================================================================
# REAL-TIME JOB MATCHING
# ============================================================================

async def match_skills_to_job(skills: List[str], job_description: str) -> Dict[str, Any]:
    """Real-time job matching with AI enhancement"""
    try:
        # Extract job requirements
        job_skills = extract_skills_from_text(job_description)
        
        # Calculate match score
        matched_skills = [skill for skill in job_skills if skill in skills]
        missing_skills = [skill for skill in job_skills if skill not in skills]
        
        match_score = len(matched_skills) / max(1, len(job_skills)) * 100
        
        # AI-enhanced analysis
        if openai.api_key:
            prompt = f"""
            Analyze job-candidate match:
            
            Job Description: {job_description}
            Candidate Skills: {', '.join(skills)}
            Required Skills: {', '.join(job_skills)}
            
            Provide:
            1. Match percentage
            2. Strengths
            3. Areas for improvement
            4. Recommendations
            
            Format as JSON.
            """
            
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=400,
                temperature=0.3
            )
            
            ai_analysis = json.loads(response.choices[0].message.content)
        else:
            ai_analysis = {
                "match_percentage": match_score,
                "strengths": matched_skills,
                "improvements": missing_skills,
                "recommendations": []
            }
        
        return {
            "match_score": match_score,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "ai_analysis": ai_analysis,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in job matching: {e}")
        raise HTTPException(status_code=500, detail=f"Job matching failed: {str(e)}")

# ============================================================================
# REAL-TIME RESUME OPTIMIZATION
# ============================================================================

async def optimize_resume_realtime(resume_data: Dict[str, Any], job_description: str, optimization_type: str) -> Dict[str, Any]:
    """Real-time resume optimization with AI"""
    try:
        if optimization_type == "ats":
            return await optimize_for_ats(resume_data, job_description)
        elif optimization_type == "linkedin":
            return await optimize_for_linkedin_realtime(resume_data)
        elif optimization_type == "cover_letter":
            return await generate_cover_letter_realtime(resume_data, job_description)
        else:
            raise HTTPException(status_code=400, detail="Invalid optimization type")
            
    except Exception as e:
        logger.error(f"Error in resume optimization: {e}")
        raise HTTPException(status_code=500, detail=f"Resume optimization failed: {str(e)}")

async def optimize_for_ats(resume_data: Dict[str, Any], job_description: str) -> Dict[str, Any]:
    """Optimize resume for ATS systems"""
    try:
        if openai.api_key:
            prompt = f"""
            Optimize this resume for ATS (Applicant Tracking System):
            
            Resume: {json.dumps(resume_data, indent=2)}
            Job Description: {job_description}
            
            Provide:
            1. Optimized resume sections
            2. Keyword suggestions
            3. ATS score
            4. Formatting recommendations
            
            Format as JSON.
            """
            
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=800,
                temperature=0.3
            )
            
            optimization = json.loads(response.choices[0].message.content)
        else:
            optimization = {
                "optimized_resume": resume_data,
                "ats_score": 75,
                "keywords": extract_keywords_from_job(job_description),
                "recommendations": ["Add more keywords", "Improve formatting"]
            }
        
        return {
            "optimization_type": "ats",
            "optimized_resume": optimization,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in ATS optimization: {e}")
        raise HTTPException(status_code=500, detail=f"ATS optimization failed: {str(e)}")

async def optimize_for_linkedin_realtime(resume_data: Dict[str, Any]) -> Dict[str, Any]:
    """Optimize resume for LinkedIn profile"""
    try:
        if openai.api_key:
            prompt = f"""
            Create an optimized LinkedIn profile from this resume:
            
            Resume: {json.dumps(resume_data, indent=2)}
            
            Provide:
            1. Professional headline
            2. Summary section
            3. Experience descriptions
            4. Skills section
            5. Profile completeness score
            
            Format as JSON.
            """
            
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=600,
                temperature=0.4
            )
            
            linkedin_profile = json.loads(response.choices[0].message.content)
        else:
            linkedin_profile = {
                "headline": f"{resume_data.get('title', 'Professional')} | {', '.join(resume_data.get('skills', [])[:3])}",
                "summary": f"Experienced professional with expertise in {', '.join(resume_data.get('skills', [])[:5])}",
                "experience": resume_data.get('experience', []),
                "skills": resume_data.get('skills', []),
                "completeness_score": 85
            }
        
        return {
            "optimization_type": "linkedin",
            "linkedin_profile": linkedin_profile,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in LinkedIn optimization: {e}")
        raise HTTPException(status_code=500, detail=f"LinkedIn optimization failed: {str(e)}")

async def generate_cover_letter_realtime(resume_data: Dict[str, Any], job_description: str) -> Dict[str, Any]:
    """Generate personalized cover letter"""
    try:
        if openai.api_key:
            prompt = f"""
            Create a personalized cover letter:
            
            Resume: {json.dumps(resume_data, indent=2)}
            Job Description: {job_description}
            
            Write a compelling cover letter that:
            1. Highlights relevant experience
            2. Addresses job requirements
            3. Shows enthusiasm
            4. Includes specific achievements
            
            Format as JSON with 'cover_letter' field.
            """
            
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.6
            )
            
            cover_letter = json.loads(response.choices[0].message.content)
        else:
            cover_letter = {
                "cover_letter": f"Dear Hiring Manager,\n\nI am excited to apply for this position. My background in {', '.join(resume_data.get('skills', [])[:3])} makes me a strong candidate.\n\nSincerely,\n{resume_data.get('name', 'Your Name')}"
            }
        
        return {
            "optimization_type": "cover_letter",
            "cover_letter": cover_letter,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in cover letter generation: {e}")
        raise HTTPException(status_code=500, detail=f"Cover letter generation failed: {str(e)}")

# ============================================================================
# REAL-TIME ANALYSIS ENDPOINTS
# ============================================================================

@router.post("/skills-analysis")
async def realtime_skills_analysis(request: SkillAnalysisRequest):
    """Real-time skills analysis endpoint"""
    return await analyze_skills_realtime(request.text, request.job_description)

@router.post("/job-matching")
async def realtime_job_matching(request: JobMatchRequest):
    """Real-time job matching endpoint"""
    skills = extract_skills_from_text(request.resume_text)
    return await match_skills_to_job(skills, request.job_description)

@router.post("/resume-optimization")
async def realtime_resume_optimization(request: ResumeOptimizationRequest):
    """Real-time resume optimization endpoint"""
    return await optimize_resume_realtime(
        request.resume_data, 
        request.job_description, 
        request.optimization_type
    )

@router.post("/comprehensive-analysis")
async def comprehensive_analysis(request: RealTimeAnalysisRequest):
    """Comprehensive real-time analysis"""
    try:
        # Skills analysis
        skills_result = await analyze_skills_realtime(request.content)
        
        # Job matching (if job description available)
        job_match_result = None
        if "job" in request.analysis_type.lower():
            job_match_result = await match_skills_to_job(
                skills_result["skills"], 
                request.content
            )
        
        # Resume optimization
        optimization_result = None
        if "optimize" in request.analysis_type.lower():
            optimization_result = await optimize_resume_realtime(
                {"content": request.content}, 
                request.content, 
                "ats"
            )
        
        return {
            "user_id": request.user_id,
            "analysis_type": request.analysis_type,
            "skills_analysis": skills_result,
            "job_matching": job_match_result,
            "optimization": optimization_result,
            "timestamp": datetime.now().isoformat(),
            "processing_time": "real-time"
        }
        
    except Exception as e:
        logger.error(f"Error in comprehensive analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Comprehensive analysis failed: {str(e)}")

# ============================================================================
# WEBSOCKET REAL-TIME COMMUNICATION
# ============================================================================

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                self.active_connections.remove(connection)

manager = ConnectionManager()

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = WebSocketMessage.parse_raw(data)
            
            # Process real-time analysis based on message type
            if message.type == "skills_analysis":
                result = await analyze_skills_realtime(message.data["text"])
                await manager.send_personal_message(
                    json.dumps({"type": "skills_result", "data": result}),
                    websocket
                )
            
            elif message.type == "job_matching":
                result = await match_skills_to_job(
                    message.data["skills"], 
                    message.data["job_description"]
                )
                await manager.send_personal_message(
                    json.dumps({"type": "job_match_result", "data": result}),
                    websocket
                )
            
            elif message.type == "resume_optimization":
                result = await optimize_resume_realtime(
                    message.data["resume_data"],
                    message.data["job_description"],
                    message.data["optimization_type"]
                )
                await manager.send_personal_message(
                    json.dumps({"type": "optimization_result", "data": result}),
                    websocket
                )
            
            elif message.type == "comprehensive_analysis":
                result = await comprehensive_analysis(
                    RealTimeAnalysisRequest(
                        content=message.data["content"],
                        analysis_type=message.data["analysis_type"],
                        user_id=user_id
                    )
                )
                await manager.send_personal_message(
                    json.dumps({"type": "comprehensive_result", "data": result}),
                    websocket
                )
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def extract_keywords_from_job(job_description: str) -> List[str]:
    """Extract keywords from job description"""
    keywords = []
    # Add keyword extraction logic here
    return keywords

# ============================================================================
# HEALTH CHECK AND STATUS
# ============================================================================

@router.get("/health")
async def realtime_health_check():
    """Health check for real-time services"""
    return {
        "status": "healthy",
        "services": {
            "skills_analysis": "active",
            "job_matching": "active", 
            "resume_optimization": "active",
            "websocket": "active"
        },
        "timestamp": datetime.now().isoformat()
    }

@router.get("/status")
async def realtime_status():
    """Get real-time service status"""
    return {
        "active_connections": len(manager.active_connections),
        "ai_available": bool(openai.api_key),
        "services": ["skills", "jobs", "matching", "optimization"],
        "timestamp": datetime.now().isoformat()
    } 