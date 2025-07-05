# CareerForge AI - Real-Time API Documentation

## Overview
CareerForge AI provides comprehensive real-time APIs for skills analysis, job matching, resume optimization, and market analysis using advanced AI capabilities.

## Base URL
```
http://localhost:8000
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔄 Real-Time Analysis Endpoints

### 1. Skills Analysis
**POST** `/realtime/skills-analysis`

Analyze skills from text with AI enhancement.

**Request Body:**
```json
{
  "text": "I have experience with Python, React, and AWS",
  "job_description": "Looking for a Python developer with cloud experience",
  "analysis_type": "comprehensive"
}
```

**Response:**
```json
{
  "skills": ["python", "react", "aws"],
  "ai_analysis": {
    "skills": ["Python", "React", "AWS"],
    "proficiency": "intermediate",
    "recommendations": ["Learn Docker", "Study Kubernetes"]
  },
  "job_match": {
    "match_score": 85.5,
    "matched_skills": ["python", "aws"],
    "missing_skills": ["docker"]
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "confidence": 0.95
}
```

### 2. Job Matching
**POST** `/realtime/job-matching`

Real-time job matching with detailed analysis.

**Request Body:**
```json
{
  "resume_text": "Experienced Python developer with 5 years in web development",
  "job_description": "Senior Python Developer needed for cloud-based applications",
  "match_criteria": ["skills", "experience", "education"]
}
```

**Response:**
```json
{
  "match_score": 87.5,
  "matched_skills": ["python", "web development"],
  "missing_skills": ["kubernetes"],
  "extra_skills": ["javascript", "sql"],
  "ai_analysis": {
    "match_percentage": 87.5,
    "strengths": ["Strong Python skills", "Web development experience"],
    "improvements": ["Learn containerization"],
    "interview_tips": ["Highlight cloud experience"],
    "salary_insights": "Market rate: $120k-$150k"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 3. Resume Optimization
**POST** `/realtime/resume-optimization`

Optimize resume for ATS, LinkedIn, or generate cover letters.

**Request Body:**
```json
{
  "resume_data": {
    "name": "John Doe",
    "skills": ["Python", "React", "AWS"],
    "experience": [{"role": "Developer", "company": "Tech Corp"}]
  },
  "job_description": "Senior Python Developer position",
  "optimization_type": "ats"
}
```

**Response:**
```json
{
  "optimization_type": "ats",
  "optimized_resume": {
    "headline": "Senior Python Developer | React | AWS",
    "summary": "Results-driven developer with 5+ years experience...",
    "ats_score": 92,
    "keywords": ["python", "react", "aws", "senior", "developer"],
    "recommendations": ["Add more quantifiable achievements"]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 4. Comprehensive Analysis
**POST** `/realtime/comprehensive-analysis`

Complete analysis including skills, job matching, and optimization.

**Request Body:**
```json
{
  "content": "Python developer with React and AWS experience",
  "analysis_type": "full_career_analysis",
  "user_id": "user123"
}
```

---

## 🎯 Skills & Jobs Endpoints

### 1. Get All Skills
**GET** `/skills-jobs/skills`

**Response:**
```json
{
  "skills_database": {
    "programming_languages": ["Python", "Java", "JavaScript"],
    "frameworks": ["React", "Angular", "Vue.js"],
    "databases": ["MySQL", "PostgreSQL", "MongoDB"],
    "cloud_platforms": ["AWS", "Azure", "Google Cloud"],
    "devops_tools": ["Docker", "Kubernetes", "Jenkins"],
    "ai_ml": ["TensorFlow", "PyTorch", "Scikit-learn"],
    "soft_skills": ["Leadership", "Communication", "Problem Solving"]
  },
  "total_categories": 7,
  "total_skills": 150
}
```

### 2. Skills by Category
**GET** `/skills-jobs/skills/{category}`

**Response:**
```json
{
  "category": "programming_languages",
  "skills": ["Python", "Java", "JavaScript", "TypeScript"],
  "count": 4
}
```

### 3. Skill Analysis
**POST** `/skills-jobs/skill-analysis`

**Request Body:**
```json
{
  "skill_name": "Python",
  "category": "programming_languages",
  "proficiency_level": "intermediate"
}
```

**Response:**
```json
{
  "skill": "Python",
  "location": "global",
  "analysis": {
    "demand_level": "High",
    "salary_range": "$80k-$150k",
    "job_opportunities": "Excellent",
    "growth_trend": "Positive",
    "related_skills": ["Django", "Flask", "Data Science"]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 4. Job Matching
**POST** `/skills-jobs/job-match`

**Request Body:**
```json
{
  "resume_skills": ["Python", "React", "AWS"],
  "job_description": "Senior Python Developer needed for cloud applications",
  "match_criteria": ["skills", "experience"]
}
```

### 5. Market Analysis
**POST** `/skills-jobs/market-analysis`

**Request Body:**
```json
{
  "skills": ["Python", "React", "AWS"],
  "location": "United States",
  "timeframe": "6months"
}
```

### 6. Skill Recommendations
**POST** `/skills-jobs/skill-recommendations`

**Request Body:**
```json
{
  "current_skills": ["Python", "JavaScript"],
  "target_role": "Senior Full Stack Developer",
  "experience_level": "mid"
}
```

### 7. Popular Skills
**GET** `/skills-jobs/popular-skills`

**Response:**
```json
{
  "popular_skills": {
    "programming": ["Python", "JavaScript", "Java", "TypeScript"],
    "frameworks": ["React", "Node.js", "Angular", "Vue.js"],
    "databases": ["MySQL", "PostgreSQL", "MongoDB", "Redis"],
    "cloud": ["AWS", "Azure", "Google Cloud", "Docker"],
    "ai_ml": ["TensorFlow", "PyTorch", "Scikit-learn", "Pandas"]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🔌 WebSocket Real-Time Communication

### WebSocket Connection
**WS** `/realtime/ws/{user_id}`

Connect to real-time updates for skills analysis, job matching, and optimization.

**Message Types:**

1. **Skills Analysis**
```json
{
  "type": "skills_analysis",
  "data": {
    "text": "Python developer with React experience"
  },
  "user_id": "user123"
}
```

2. **Job Matching**
```json
{
  "type": "job_matching",
  "data": {
    "skills": ["Python", "React"],
    "job_description": "Senior Python Developer position"
  },
  "user_id": "user123"
}
```

3. **Resume Optimization**
```json
{
  "type": "resume_optimization",
  "data": {
    "resume_data": {...},
    "job_description": "Python Developer role",
    "optimization_type": "ats"
  },
  "user_id": "user123"
}
```

4. **Comprehensive Analysis**
```json
{
  "type": "comprehensive_analysis",
  "data": {
    "content": "Python developer resume",
    "analysis_type": "full_career_analysis"
  },
  "user_id": "user123"
}
```

---

## 🏥 Health Check Endpoints

### Real-Time Health
**GET** `/realtime/health`

### Skills & Jobs Health
**GET** `/skills-jobs/health`

### Real-Time Status
**GET** `/realtime/status`

---

## 📊 Error Responses

All endpoints return consistent error responses:

```json
{
  "detail": "Error message description"
}
```

Common HTTP Status Codes:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## 🚀 Usage Examples

### Python Client Example
```python
import requests
import json

# Skills Analysis
response = requests.post(
    "http://localhost:8000/realtime/skills-analysis",
    json={
        "text": "Python developer with React and AWS experience",
        "analysis_type": "comprehensive"
    },
    headers={"Authorization": "Bearer your_token"}
)

print(response.json())
```

### JavaScript Client Example
```javascript
// Real-time skills analysis
const response = await fetch('/realtime/skills-analysis', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your_token'
    },
    body: JSON.stringify({
        text: 'Python developer with React experience',
        analysis_type: 'comprehensive'
    })
});

const result = await response.json();
console.log(result);
```

### WebSocket Example
```javascript
const ws = new WebSocket('ws://localhost:8000/realtime/ws/user123');

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log('Received:', data);
};

// Send skills analysis request
ws.send(JSON.stringify({
    type: 'skills_analysis',
    data: {
        text: 'Python developer with React experience'
    },
    user_id: 'user123'
}));
```

---

## 🔧 Configuration

### Environment Variables
```bash
OPENAI_API_KEY=your_openai_api_key
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Rate Limiting
- Skills Analysis: 10 requests/minute
- Job Matching: 15 requests/minute
- Resume Optimization: 5 requests/minute
- WebSocket: No rate limiting

---

## 📈 Performance

- **Response Time**: < 2 seconds for most operations
- **AI Processing**: < 5 seconds for complex analysis
- **WebSocket Latency**: < 100ms for real-time updates
- **Concurrent Users**: Supports 1000+ simultaneous connections

---

## 🔒 Security

- JWT Authentication required for most endpoints
- Rate limiting to prevent abuse
- Input validation and sanitization
- Secure WebSocket connections
- API key protection for admin endpoints

---

## 📞 Support

For API support and questions:
- Email: support@careerforge.ai
- Documentation: https://docs.careerforge.ai
- GitHub: https://github.com/careerforge/ai-api 