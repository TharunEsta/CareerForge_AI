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
from Backend.job_matcher import (
    match_resume_to_job as match_resume_to_job_logic,
    analyze_job_description as analyze_job_description_logic,
    get_skill_recommendations as get_skill_recommendations_logic,
    analyze_market_trends as analyze_market_trends_logic,
)

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

@router.post("/skills-analysis")
async def realtime_skills_analysis(request: SkillAnalysisRequest):
    """Real-time skills analysis with AI enhancement"""
    try:
        # Use new logic for comprehensive skill extraction and AI analysis
        result = await analyze_job_description_logic(request.text)
        # Optionally, if job_description is provided, do job matching
        job_match = None
        if request.job_description:
            job_match = await match_resume_to_job_logic(result["skills"], request.job_description)
        return {
            "skills": result["skills"],
            "ai_analysis": result["ai_analysis"],
            "job_match": job_match,
            "timestamp": result["timestamp"],
            "confidence": 0.98
        }
    except Exception as e:
        logger.error("Error in real-time skills analysis: %s", e)
        raise HTTPException(status_code=500, detail=f"Skills analysis failed: {str(e)}")

# ============================================================================
# REAL-TIME JOB MATCHING
# ============================================================================

@router.post("/job-matching")
async def realtime_job_matching(request: JobMatchRequest):
    """Real-time job matching with AI enhancement"""
    try:
        # Use new logic for comprehensive job matching
        resume_skills_result = await analyze_job_description_logic(request.resume_text)
        resume_skills = resume_skills_result["skills"]
        result = await match_resume_to_job_logic(resume_skills, request.job_description)
        return result
    except Exception as e:
        logger.error("Error in real-time job matching: %s", e)
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
        logger.error("Error in resume optimization: %s", e)
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
        logger.error("Error in ATS optimization: %s", e)
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
        logger.error("Error in LinkedIn optimization: %s", e)
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
        logger.error("Error in cover letter generation: %s", e)
        raise HTTPException(status_code=500, detail=f"Cover letter generation failed: {str(e)}")

# ============================================================================
# REAL-TIME ANALYSIS ENDPOINTS
# ============================================================================

@router.post("/comprehensive-analysis")
async def comprehensive_analysis(request: RealTimeAnalysisRequest):
    """Comprehensive real-time analysis (skills, job match, recommendations, market trends)"""
    try:
        # Analyze job description
        job_analysis = await analyze_job_description_logic(request.content)
        # Skill recommendations (if user_id or target role is provided)
        skill_recs = await get_skill_recommendations_logic(job_analysis["skills"], request.analysis_type)
        # Market trends
        market_trends = await analyze_market_trends_logic(job_analysis["skills"])
        return {
            "job_analysis": job_analysis,
            "skill_recommendations": skill_recs,
            "market_trends": market_trends,
            "timestamp": job_analysis["timestamp"]
        }
    except Exception as e:
        logger.error("Error in comprehensive analysis: %s", e)
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

    @staticmethod
    async def send_personal_message(message: str, websocket: WebSocket):
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
    await websocket.accept()
    try:
        await websocket.send_json({"type": "info", "data": {"message": "Connected. Send your resume/job description for real-time analysis."}})
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type")
            payload = data.get("data", {})
            if msg_type == "job_match":
                resume_text = payload.get("resume_text", "")
                job_description = payload.get("job_description", "")
                await websocket.send_json({"type": "progress", "data": {"message": "Analyzing resume and job description..."}})
                resume_skills_result = await analyze_job_description_logic(resume_text)
                resume_skills = resume_skills_result["skills"]
                result = await match_resume_to_job_logic(resume_skills, job_description)
                await websocket.send_json({"type": "job_match_result", "data": result})
            elif msg_type == "skills_analysis":
                text = payload.get("text", "")
                await websocket.send_json({"type": "progress", "data": {"message": "Analyzing skills..."}})
                result = await analyze_job_description_logic(text)
                await websocket.send_json({"type": "skills_analysis_result", "data": result})
            elif msg_type == "skill_recommendations":
                skills = payload.get("skills", [])
                target_role = payload.get("target_role", "")
                await websocket.send_json({"type": "progress", "data": {"message": "Generating skill recommendations..."}})
                recs = await get_skill_recommendations_logic(skills, target_role)
                await websocket.send_json({"type": "skill_recommendations_result", "data": recs})
            elif msg_type == "market_trends":
                skills = payload.get("skills", [])
                await websocket.send_json({"type": "progress", "data": {"message": "Analyzing market trends..."}})
                trends = await analyze_market_trends_logic(skills)
                await websocket.send_json({"type": "market_trends_result", "data": trends})
            else:
                await websocket.send_json({"type": "error", "data": {"message": "Unknown message type."}})
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected: %s", user_id)
    except Exception as e:
        await websocket.send_json({"type": "error", "data": {"message": str(e)}})
        logger.error("WebSocket error: %s", e)

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def extract_keywords_from_job(job_description: str) -> List[str]:
    """Extract keywords from job description"""
    keywords = []
    
    # Common job-related keywords to extract
    keyword_patterns = [
        r'\b(senior|junior|lead|principal|staff)\b',
        r'\b(developer|engineer|architect|manager|director)\b',
        r'\b(experience|years|required|preferred|minimum)\b',
        r'\b(responsibilities|duties|requirements|qualifications)\b',
        r'\b(salary|compensation|benefits|remote|hybrid|onsite)\b',
        r'\b(team|collaboration|communication|leadership)\b',
        r'\b(agile|scrum|waterfall|kanban|devops)\b',
        r'\b(api|rest|graphql|microservices|monolith)\b',
        r'\b(testing|qa|quality|automation|ci/cd)\b',
        r'\b(cloud|aws|azure|gcp|docker|kubernetes)\b'
    ]
    
    job_desc_lower = job_description.lower()
    
    for pattern in keyword_patterns:
        matches = re.findall(pattern, job_desc_lower)
        keywords.extend(matches)
    
    # Remove duplicates and return
    return list(set(keywords))

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