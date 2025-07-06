"""
Skills and Jobs Router for CareerForge AI
Handles skills database, job matching, market analysis, and real-time recommendations
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from fastapi import APIRouter, HTTPException, BackgroundTasks
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

router = APIRouter(prefix="/skills-jobs", tags=["skills-jobs"])

# ============================================================================
# SKILLS DATABASE
# ============================================================================

SKILLS_DATABASE = {
    "programming_languages": [
        "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Go", "Rust",
        "PHP", "Ruby", "Swift", "Kotlin", "Scala", "R", "MATLAB", "Perl"
    ],
    "frameworks": [
        "React", "Angular", "Vue.js", "Node.js", "Express", "Django", "Flask",
        "Spring", "Laravel", "Ruby on Rails", "ASP.NET", "FastAPI", "Gin"
    ],
    "databases": [
        "MySQL", "PostgreSQL", "MongoDB", "Redis", "Cassandra", "Oracle",
        "SQL Server", "SQLite", "Neo4j", "Elasticsearch", "DynamoDB"
    ],
    "cloud_platforms": [
        "AWS", "Azure", "Google Cloud", "IBM Cloud", "Oracle Cloud",
        "DigitalOcean", "Heroku", "Vercel", "Netlify"
    ],
    "devops_tools": [
        "Docker", "Kubernetes", "Jenkins", "GitLab CI", "GitHub Actions",
        "Terraform", "Ansible", "Chef", "Puppet", "Prometheus", "Grafana"
    ],
    "ai_ml": [
        "TensorFlow", "PyTorch", "Scikit-learn", "Keras", "OpenCV",
        "NLTK", "spaCy", "Hugging Face", "Pandas", "NumPy", "Matplotlib"
    ],
    "soft_skills": [
        "Leadership", "Communication", "Problem Solving", "Teamwork",
        "Time Management", "Adaptability", "Creativity", "Critical Thinking"
    ]
}

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class SkillRequest(BaseModel):
    skill_name: str = Field(..., description="Name of the skill")
    category: Optional[str] = Field(None, description="Skill category")
    proficiency_level: Optional[str] = Field("beginner", description="Proficiency level")

class JobMatchRequest(BaseModel):
    resume_skills: List[str] = Field(..., description="Skills from resume")
    job_description: str = Field(..., description="Job description")
    match_criteria: List[str] = Field(["skills", "experience"], description="Match criteria")

class MarketAnalysisRequest(BaseModel):
    skills: List[str] = Field(..., description="Skills to analyze")
    location: Optional[str] = Field("global", description="Geographic location")
    timeframe: Optional[str] = Field("6months", description="Analysis timeframe")

class SkillRecommendationRequest(BaseModel):
    current_skills: List[str] = Field(..., description="Current skills")
    target_role: str = Field(..., description="Target job role")
    experience_level: str = Field("mid", description="Experience level")

# ============================================================================
# SKILLS ANALYSIS FUNCTIONS
# ============================================================================

async def analyze_skill_market_demand(skill: str, location: str = "global") -> Dict[str, Any]:
    """Analyze market demand for a specific skill"""
    try:
        if openai.api_key:
            prompt = f"""
            Analyze market demand for the skill: {skill}
            Location: {location}
            
            Provide:
            1. Market demand level (High/Medium/Low)
            2. Salary range
            3. Job opportunities
            4. Growth trend
            5. Related skills
            
            Format as JSON.
            """
            
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300,
                temperature=0.3
            )
            
            analysis = json.loads(response.choices[0].message.content)
        else:
            # Fallback analysis
            analysis = {
                "demand_level": "Medium",
                "salary_range": "$60k-$120k",
                "job_opportunities": "Good",
                "growth_trend": "Positive",
                "related_skills": []
            }
        
        return {
            "skill": skill,
            "location": location,
            "analysis": analysis,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error("Error analyzing skill demand: %s", e)
        raise HTTPException(status_code=500, detail=f"Skill analysis failed: {str(e)}")

async def get_skill_recommendations(current_skills: List[str], target_role: str) -> Dict[str, Any]:
    """Get skill recommendations based on current skills and target role"""
    try:
        if openai.api_key:
            prompt = f"""
            Recommend skills for career advancement:
            
            Current Skills: {', '.join(current_skills)}
            Target Role: {target_role}
            
            Provide:
            1. Missing skills for target role
            2. Skill priority (High/Medium/Low)
            3. Learning path
            4. Time to acquire
            5. Resources for learning
            
            Format as JSON.
            """
            
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=400,
                temperature=0.4
            )
            
            recommendations = json.loads(response.choices[0].message.content)
        else:
            # Fallback recommendations
            recommendations = {
                "missing_skills": [],
                "priority": "Medium",
                "learning_path": "Online courses",
                "time_to_acquire": "3-6 months",
                "resources": ["Coursera", "Udemy", "YouTube"]
            }
        
        return {
            "current_skills": current_skills,
            "target_role": target_role,
            "recommendations": recommendations,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error("Error getting skill recommendations: %s", e)
        raise HTTPException(status_code=500, detail=f"Skill recommendations failed: {str(e)}")

# ============================================================================
# JOB MATCHING FUNCTIONS
# ============================================================================

async def match_job_realtime(resume_skills: List[str], job_description: str) -> Dict[str, Any]:
    """Real-time job matching with detailed analysis"""
    try:
        # Extract job requirements
        job_skills = extract_skills_from_job_description(job_description)
        
        # Calculate match metrics
        matched_skills = [skill for skill in job_skills if skill in resume_skills]
        missing_skills = [skill for skill in job_skills if skill not in resume_skills]
        extra_skills = [skill for skill in resume_skills if skill not in job_skills]
        
        match_score = len(matched_skills) / max(1, len(job_skills)) * 100
        
        # AI-enhanced analysis
        if openai.api_key:
            prompt = f"""
            Analyze job-candidate match:
            
            Job Description: {job_description}
            Candidate Skills: {', '.join(resume_skills)}
            Required Skills: {', '.join(job_skills)}
            
            Provide:
            1. Match percentage
            2. Strengths analysis
            3. Areas for improvement
            4. Interview preparation tips
            5. Salary negotiation insights
            
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
            ai_analysis = {
                "match_percentage": match_score,
                "strengths": matched_skills,
                "improvements": missing_skills,
                "interview_tips": ["Highlight relevant experience"],
                "salary_insights": "Research market rates"
            }
        
        return {
            "match_score": match_score,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "extra_skills": extra_skills,
            "ai_analysis": ai_analysis,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error("Error in job matching: %s", e)
        raise HTTPException(status_code=500, detail=f"Job matching failed: {str(e)}")

def extract_skills_from_job_description(job_description: str) -> List[str]:
    """Extract skills from job description using pattern matching"""
    all_skills = []
    for _, skills in SKILLS_DATABASE.items():
        all_skills.extend(skills)
    
    found_skills = []
    job_desc_lower = job_description.lower()
    
    for skill in all_skills:
        if skill.lower() in job_desc_lower:
            found_skills.append(skill)
    
    return found_skills

# ============================================================================
# MARKET ANALYSIS FUNCTIONS
# ============================================================================

async def analyze_market_trends(skills: List[str], location: str = "global") -> Dict[str, Any]:
    """Analyze market trends for multiple skills"""
    try:
        if openai.api_key:
            prompt = f"""
            Analyze market trends for skills: {', '.join(skills)}
            Location: {location}
            
            Provide:
            1. Market demand trends
            2. Salary trends
            3. Emerging opportunities
            4. Risk factors
            5. Future outlook
            
            Format as JSON.
            """
            
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=400,
                temperature=0.3
            )
            
            trends = json.loads(response.choices[0].message.content)
        else:
            trends = {
                "demand_trends": "Stable",
                "salary_trends": "Increasing",
                "opportunities": "Good",
                "risks": "Low",
                "outlook": "Positive"
            }
        
        return {
            "skills": skills,
            "location": location,
            "trends": trends,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error("Error analyzing market trends: %s", e)
        raise HTTPException(status_code=500, detail=f"Market analysis failed: {str(e)}")

# ============================================================================
# API ENDPOINTS
# ============================================================================

@router.get("/skills")
async def get_all_skills():
    """Get all available skills from database"""
    return {
        "skills_database": SKILLS_DATABASE,
        "total_categories": len(SKILLS_DATABASE),
        "total_skills": sum(len(skills) for skills in SKILLS_DATABASE.values())
    }

@router.get("/skills/{category}")
async def get_skills_by_category(category: str):
    """Get skills by category"""
    if category not in SKILLS_DATABASE:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return {
        "category": category,
        "skills": SKILLS_DATABASE[category],
        "count": len(SKILLS_DATABASE[category])
    }

@router.post("/skill-analysis")
async def analyze_skill(request: SkillRequest):
    """Analyze a specific skill"""
    return await analyze_skill_market_demand(request.skill_name, request.category)

@router.post("/job-match")
async def match_job(request: JobMatchRequest):
    """Match resume skills to job description"""
    return await match_job_realtime(request.resume_skills, request.job_description)

@router.post("/market-analysis")
async def analyze_market(request: MarketAnalysisRequest):
    """Analyze market trends for skills"""
    return await analyze_market_trends(request.skills, request.location)

@router.post("/skill-recommendations")
async def get_recommendations(request: SkillRecommendationRequest):
    """Get skill recommendations for career advancement"""
    return await get_skill_recommendations(request.current_skills, request.target_role)

@router.get("/popular-skills")
async def get_popular_skills():
    """Get currently popular skills in the market"""
    popular_skills = {
        "programming": ["Python", "JavaScript", "Java", "TypeScript"],
        "frameworks": ["React", "Node.js", "Angular", "Vue.js"],
        "databases": ["MySQL", "PostgreSQL", "MongoDB", "Redis"],
        "cloud": ["AWS", "Azure", "Google Cloud", "Docker"],
        "ai_ml": ["TensorFlow", "PyTorch", "Scikit-learn", "Pandas"]
    }
    
    return {
        "popular_skills": popular_skills,
        "timestamp": datetime.now().isoformat()
    }

@router.get("/skill-categories")
async def get_skill_categories():
    """Get all skill categories"""
    return {
        "categories": list(SKILLS_DATABASE.keys()),
        "description": {
            "programming_languages": "Programming and scripting languages",
            "frameworks": "Web and application frameworks",
            "databases": "Database technologies",
            "cloud_platforms": "Cloud computing platforms",
            "devops_tools": "DevOps and deployment tools",
            "ai_ml": "Artificial Intelligence and Machine Learning",
            "soft_skills": "Non-technical skills"
        }
    }

# ============================================================================
# BACKGROUND TASKS
# ============================================================================

async def update_skills_database():
    """Background task to update skills database"""
    # This would typically fetch from external APIs
    logger.info("Updating skills database...")
    await asyncio.sleep(1)  # Simulate API call
    logger.info("Skills database updated")

@router.post("/update-skills")
async def trigger_skills_update(background_tasks: BackgroundTasks):
    """Trigger skills database update"""
    background_tasks.add_task(update_skills_database)
    return {"message": "Skills database update triggered"}

# ============================================================================
# HEALTH CHECK
# ============================================================================

@router.get("/health")
async def skills_jobs_health():
    """Health check for skills and jobs services"""
    return {
        "status": "healthy",
        "services": {
            "skills_analysis": "active",
            "job_matching": "active",
            "market_analysis": "active",
            "recommendations": "active"
        },
        "database": {
            "categories": len(SKILLS_DATABASE),
            "total_skills": sum(len(skills) for skills in SKILLS_DATABASE.values())
        },
        "timestamp": datetime.now().isoformat()
    } 