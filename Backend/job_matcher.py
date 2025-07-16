"""
Real-time Job Matching System
Handles comprehensive job matching with AI enhancement, skill analysis, and real-time processing
"""


import json
import logging
import os
import re
from datetime import datetime
from typing import Any

import openai
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


def extract_skills_from_text(_):
    # skills_list removed as it is unused
    pass  # Implement skill extraction logic here if needed

# Load environment variables
load_dotenv()

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

# Setup logging
logger = logging.getLogger(__name__)

# Load sentence transformer model for semantic matching
try:
    model = SentenceTransformer('all-MiniLM-L6-v2')
    logger.info("Loaded pretrained SentenceTransformer: all-MiniLM-L6-v2")
except Exception as model_error:
    logger.error("Error loading sentence transformer: %s", model_error)
    model = None

# Comprehensive skills database
SKILLS_DATABASE = {
    "programming_languages": [
        "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Go", "Rust",
        "PHP", "Ruby", "Swift", "Kotlin", "Scala", "R", "MATLAB", "Perl", "Dart"
    ],
    "frameworks": [
        "React", "Angular", "Vue.js", "Node.js", "Express", "Django", "Flask",
        "Spring", "Laravel", "Ruby on Rails", "ASP.NET", "FastAPI", "Gin",
        "Next.js", "Nuxt.js", "Svelte", "Ember.js"
    ],
    "databases": [
        "MySQL", "PostgreSQL", "MongoDB", "Redis", "Cassandra", "Oracle",
        "SQL Server", "SQLite", "Neo4j", "Elasticsearch", "DynamoDB",
        "MariaDB", "CouchDB", "InfluxDB", "TimescaleDB"
    ],
    "cloud_platforms": [
        "AWS", "Azure", "Google Cloud", "IBM Cloud", "Oracle Cloud",
        "DigitalOcean", "Heroku", "Vercel", "Netlify", "Firebase",
        "Alibaba Cloud", "Tencent Cloud"
    ],
    "devops_tools": [
        "Docker", "Kubernetes", "Jenkins", "GitLab CI", "GitHub Actions",
        "Terraform", "Ansible", "Chef", "Puppet", "Prometheus", "Grafana",
        "ELK Stack", "Splunk", "Datadog", "New Relic"
    ],
    "ai_ml": [
        "TensorFlow", "PyTorch", "Scikit-learn", "Keras", "OpenCV",
        "NLTK", "spaCy", "Hugging Face", "Pandas", "NumPy", "Matplotlib",
        "Seaborn", "Plotly", "Jupyter", "MLflow", "Kubeflow"
    ],
    "soft_skills": [
        "Leadership", "Communication", "Problem Solving", "Teamwork",
        "Time Management", "Adaptability", "Creativity", "Critical Thinking",
        "Project Management", "Agile", "Scrum", "Kanban"
    ]
}

class RealTimeJobMatcher:
    """Real-time job matching with AI enhancement"""
    
    def __init__(self):
        self.model = model
        self.skills_cache = {}
        self.job_cache = {}
        
    @staticmethod
    def extract_skills_from_text(text: str) -> list[str]:
        """Extract skills from text using comprehensive pattern matching"""
        if not text:
            return []
            
        text_lower = text.lower()
        found_skills = []
        
        # Extract all skills from database
        for _, skills in SKILLS_DATABASE.items():
            for skill in skills:
                # Check for exact match and variations
                skill_variations = [
                    skill.lower(),
                    skill.lower().replace(" ", ""),
                    skill.lower().replace(" ", "-"),
                    skill.lower().replace(" ", "_")
                ]
                
                for variation in skill_variations:
                    if variation in text_lower:
                        found_skills.append(skill)
                        break
        
        # Additional pattern matching for common skill mentions
        skill_patterns = [
            r'\b(python|java|javascript|react|angular|vue|node\.js)\b',
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
        
        for pattern in skill_patterns:
            matches = re.findall(pattern, text_lower)
            found_skills.extend([match.title() for match in matches])
        
        return list(set(found_skills))
    
    async def analyze_job_description(self, job_description: str) -> dict[str, Any]:
        """Analyze job description with AI enhancement"""
        try:
            # Extract skills from job description
            job_skills = self.extract_skills_from_text(job_description)
            
            # AI-enhanced analysis
            if openai.api_key:
                prompt = f"""
                Analyze this job description and provide detailed insights:
                
                Job Description: {job_description}
                
                Please provide:
                1. Required skills and their importance levels
                2. Experience level (Junior/Mid/Senior)
                3. Industry/domain
                4. Key responsibilities
                5. Salary range estimate
                6. Required qualifications
                7. Nice-to-have skills
                
                Format as JSON with these fields:
                - required_skills: [list of skills with importance levels]
                - experience_level: "junior/mid/senior"
                - industry: "string"
                - responsibilities: [list]
                - salary_range: "string"
                - qualifications: [list]
                - nice_to_have: [list]
                """
                
                response = await openai.ChatCompletion.acreate(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=600,
                    temperature=0.3
                )
                
                ai_analysis = json.loads(response.choices[0].message.content)
            else:
                # Fallback analysis
                ai_analysis = {
                    "required_skills": job_skills,
                    "experience_level": "mid",
                    "industry": "Technology",
                    "responsibilities": ["Develop software", "Collaborate with team"],
                    "salary_range": "$60k-$120k",
                    "qualifications": ["Bachelor's degree", "Relevant experience"],
                    "nice_to_have": []
                }
            
            return {
                "skills": job_skills,
                "ai_analysis": ai_analysis,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as error:
            logger.error("Error analyzing job description: %s", error)
            return {
                "skills": self.extract_skills_from_text(job_description),
                "ai_analysis": {},
                "error": str(error)
            }
    
    async def match_resume_to_job(self, resume_skills: list[str], job_description: str) -> dict[str, Any]:
        """Real-time resume to job matching with comprehensive analysis"""
        try:
            # Analyze job description
            job_analysis = await self.analyze_job_description(job_description)
            job_skills = job_analysis["skills"]
            
            # Calculate match metrics
            matched_skills = [skill for skill in job_skills if skill in resume_skills]
            missing_skills = [skill for skill in job_skills if skill not in resume_skills]
            extra_skills = [skill for skill in resume_skills if skill not in job_skills]
            
            # Calculate match score
            match_score = len(matched_skills) / max(1, len(job_skills)) * 100
            
            # Semantic similarity using sentence transformers
            semantic_score = 0
            if self.model and resume_skills and job_skills:
                try:
                    resume_text = " ".join(resume_skills)
                    job_text = " ".join(job_skills)
                    
                    resume_embedding = self.model.encode([resume_text])
                    job_embedding = self.model.encode([job_text])
                    
                    similarity = cosine_similarity(resume_embedding, job_embedding)[0][0]
                    semantic_score = similarity * 100
                except Exception as exc:
                    logger.error("Error calculating semantic similarity: %s", exc)
            
            # AI-enhanced match analysis
            if openai.api_key:
                prompt = f"""
                Analyze the match between candidate and job:
                
                Candidate Skills: {', '.join(resume_skills)}
                Job Skills: {', '.join(job_skills)}
                Match Score: {match_score}%
                
                Provide:
                1. Detailed match analysis
                2. Strengths of the candidate
                3. Areas for improvement
                4. Interview preparation tips
                5. Salary negotiation insights
                6. Career development suggestions
                
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
                    "match_analysis": f"Match score: {match_score}%",
                    "strengths": matched_skills,
                    "improvements": missing_skills,
                    "interview_tips": ["Highlight relevant experience"],
                    "salary_insights": "Research market rates",
                    "career_suggestions": ["Learn missing skills"]
                }
            
            return {
                "match_score": match_score,
                "semantic_score": semantic_score,
                "overall_score": (match_score + semantic_score) / 2,
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "extra_skills": extra_skills,
                "job_analysis": job_analysis,
                "ai_analysis": ai_analysis,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as match_error:
            logger.error("Error in job matching: %s", match_error)
            return {
                "error": str(match_error),
                "match_score": 0,
                "matched_skills": [],
                "missing_skills": [],
                "timestamp": datetime.now().isoformat()
            }
    
    @staticmethod
    async def get_skill_recommendations(current_skills: list[str], target_role: str) -> dict[str, Any]:
        """Get personalized skill recommendations"""
        try:
            if openai.api_key:
                prompt = f"""
                Provide skill recommendations for career advancement:
                
                Current Skills: {', '.join(current_skills)}
                Target Role: {target_role}
                
                Provide:
                1. Missing skills for target role
                2. Skill priority (High/Medium/Low)
                3. Learning path and resources
                4. Time to acquire each skill
                5. Market demand for each skill
                6. Salary impact of acquiring skills
                
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
                recommendations = {
                    "missing_skills": [],
                    "priority": "Medium",
                    "learning_path": "Online courses",
                    "time_to_acquire": "3-6 months",
                    "resources": ["Coursera", "Udemy", "YouTube"],
                    "market_demand": "High",
                    "salary_impact": "10-20% increase"
                }
            
            return {
                "current_skills": current_skills,
                "target_role": target_role,
                "recommendations": recommendations,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as err:
            logger.error("Error getting skill recommendations: %s", err)
            return {
                "error": str(err),
                "recommendations": {},
                "timestamp": datetime.now().isoformat()
            }
    
    @staticmethod
    async def analyze_market_trends(skills: list[str]) -> dict[str, Any]:
        """Analyze market trends for skills"""
        try:
            if openai.api_key:
                prompt = f"""
                Analyze market trends for these skills: {', '.join(skills)}
                
                Provide:
                1. Market demand trends
                2. Salary trends
                3. Emerging opportunities
                4. Risk factors
                5. Future outlook
                6. Geographic hotspots
                
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
                    "outlook": "Positive",
                    "hotspots": ["Silicon Valley", "New York", "London"]
                }
            
            return {
                "skills": skills,
                "trends": trends,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as exc:
            logger.error("Error analyzing market trends: %s", exc)
            return {
                "error": str(exc),
                "trends": {},
                "timestamp": datetime.now().isoformat()
            }

# Global instance
job_matcher = RealTimeJobMatcher()

# Convenience functions for API endpoints
async def match_resume_to_job(resume_skills: list[str], job_description: str) -> dict[str, Any]:
    """Convenience function for API endpoints"""
    return await job_matcher.match_resume_to_job(resume_skills, job_description)

async def analyze_job_description(job_description: str) -> dict[str, Any]:
    """Convenience function for job analysis"""
    return await job_matcher.analyze_job_description(job_description)

async def get_skill_recommendations(current_skills: list[str], target_role: str) -> dict[str, Any]:
    """Convenience function for skill recommendations"""
    return await job_matcher.get_skill_recommendations(current_skills, target_role)

async def analyze_market_trends(skills: list[str]) -> dict[str, Any]:
    """Convenience function for market analysis"""
    return await job_matcher.analyze_market_trends(skills)
