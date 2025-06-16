import re
import docx2txt
import spacy
import pdfplumber
from spacy.matcher import Matcher
import tempfile
import os
from datetime import datetime
from typing import Dict, List, Optional

# Load spaCy model once
nlp = spacy.load("en_core_web_sm")

# Master skill list (expand as needed)
SKILLS = [
    'machine learning', 'deep learning', 'nlp', 'natural language processing',
    'computer vision', 'python', 'java', 'c++', 'c#', 'javascript',
    'sql', 'nosql', 'mongodb', 'mysql', 'postgresql', 'data analysis',
    'data visualization', 'pandas', 'numpy', 'matplotlib', 'seaborn',
    'tensorflow', 'keras', 'pytorch', 'scikit-learn', 'flask', 'django',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'linux', 'git',
    'html', 'css', 'react', 'angular', 'node.js'
]

EDUCATION = [
    'ssc', '10th', 'matriculation', 'cbse', 'icse',
    'intermediate', '12th', 'hsc', 'b.tech', 'btech', 'be',
    'm.tech', 'mtech', 'me', 'bsc', 'msc', 'bca', 'mca',
    'bcom', 'mcom', 'ba', 'ma', 'phd'
]

# LinkedIn specific sections and keywords
LINKEDIN_SECTIONS = {
    'headline': ['headline', 'title', 'current position'],
    'summary': ['summary', 'about', 'profile summary'],
    'experience': ['experience', 'work experience', 'employment'],
    'education': ['education', 'academic background'],
    'skills': ['skills', 'expertise', 'competencies'],
    'certifications': ['certifications', 'certificates', 'accreditations'],
    'projects': ['projects', 'portfolio', 'achievements'],
    'volunteer': ['volunteer', 'volunteering', 'community service']
}

LINKEDIN_KEYWORDS = {
    'headline': ['senior', 'lead', 'principal', 'architect', 'engineer', 'developer', 'manager', 'director'],
    'summary': ['passionate', 'experienced', 'expert', 'specialist', 'professional', 'dedicated'],
    'experience': ['achieved', 'increased', 'decreased', 'improved', 'developed', 'led', 'managed', 'created'],
    'skills': ['expert', 'proficient', 'skilled', 'experienced', 'advanced', 'intermediate', 'beginner']
}

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# --- File Parsing ---

def extract_text_from_pdf(file_storage):
    # Create a temporary file to store the PDF content
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
        # Write the file content to the temporary file
        tmp.write(file_storage.stream.read())
        tmp.flush()
        tmp_path = tmp.name

    try:
        # Open the temporary file with pdfplumber
        with pdfplumber.open(tmp_path) as pdf:
            text = '\n'.join([page.extract_text() or '' for page in pdf.pages])
        return text
    finally:
        # Clean up the temporary file
        os.unlink(tmp_path)

def extract_text_from_docx(file_storage):
    # docx2txt.process accepts FileStorage directly
    return docx2txt.process(file_storage)

def extract_text_from_txt(file_storage):
    return file_storage.stream.read().decode('utf-8')

def extract_text(file_storage, ext):
    ext = ext.lower()
    if ext == 'pdf':
        return extract_text_from_pdf(file_storage)
    elif ext == 'docx':
        return extract_text_from_docx(file_storage)
    elif ext == 'txt':
        return extract_text_from_txt(file_storage)
    else:
        raise ValueError("Unsupported file format.")

# --- Resume Feature Extraction ---

def extract_name(doc):
    matcher = Matcher(nlp.vocab)
    pattern = [{'POS': 'PROPN'}, {'POS': 'PROPN'}]  # simple two proper nouns pattern
    matcher.add('NAME', [pattern])
    matches = matcher(doc)
    for match_id, start, end in matches:
        span = doc[start:end]
        return span.text
    return None

def extract_email(text):
    match = re.search(r'[\w\.-]+@[\w\.-]+', text)
    return match.group(0) if match else None

def extract_skills(text):
    found = [skill for skill in SKILLS if skill in text.lower()]
    return list(set(found))

def extract_education(text):
    found = [degree for degree in EDUCATION if degree in text.lower()]
    return list(set(found))

def extract_total_experience(text):
    years = [int(y) for y in re.findall(r'(\d{4})', text) if 1900 < int(y) < 2100]
    return max(years) - min(years) if len(years) >= 2 else 0

# --- Job Matching Functions ---

def extract_skills_from_job_description(job_description: str) -> List[str]:
    """Extract relevant skills from job description."""
    # Common technical skills to look for
    technical_skills = [
        "Python", "Java", "JavaScript", "React", "Node.js", "SQL", "MongoDB",
        "AWS", "Docker", "Kubernetes", "Git", "Agile", "Scrum", "DevOps",
        "Machine Learning", "Data Science", "AI", "Cloud Computing"
    ]
    
    found_skills = []
    job_desc_lower = job_description.lower()
    
    for skill in technical_skills:
        if skill.lower() in job_desc_lower:
            found_skills.append(skill)
    
    return found_skills

def match_skills(job_skills, resume_skills):
    matched = [skill for skill in job_skills if skill in resume_skills]
    missing = [skill for skill in job_skills if skill not in resume_skills]
    return matched, missing

def generate_learning_plan(missing_skills):
    if not missing_skills:
        return "You have all the required skills for this job."
    plan = "To fill the skill gaps, consider learning: " + ", ".join(missing_skills)
    return plan

# --- Main Parser + Matcher ---

def parse_resume(file_storage):
    ext = file_storage.filename.rsplit('.', 1)[1].lower()
    text = extract_text(file_storage, ext)
    doc = nlp(text)

    return {
        'name': extract_name(doc),
        'email': extract_email(text),
        'skills': extract_skills(text),
        'education': extract_education(text),
        'total_experience': extract_total_experience(text)
    }

def parse_resume_with_job_matching(file_storage, job_description_text):
    resume_data = parse_resume(file_storage)
    job_skills = extract_skills_from_job_description(job_description_text)
    matched, missing = match_skills(job_skills, resume_data['skills'])
    learning_plan = generate_learning_plan(missing)

    resume_data.update({
        'job_skills': job_skills,
        'matched_skills': matched,
        'missing_skills': missing,
        'learning_plan': learning_plan
    })
    return resume_data

def rewrite_resume(resume_data: dict, job_description: str) -> dict:
    """Rewrite resume to better match job description and improve ATS score."""
    # Extract key information from job description
    job_skills = extract_skills_from_job_description(job_description)
    job_keywords = extract_keywords(job_description)
    
    # Enhance resume sections
    enhanced_resume = {
        'name': resume_data.get('name', ''),
        'email': resume_data.get('email', ''),
        'phone': resume_data.get('phone', ''),
        'headline': generate_ats_headline(resume_data, job_description),
        'summary': enhance_summary(resume_data, job_description),
        'skills': enhance_skills(resume_data.get('skills', []), job_skills),
        'experience': enhance_experience(resume_data.get('experience', []), job_keywords),
        'education': resume_data.get('education', []),
        'certifications': resume_data.get('certifications', []),
        'ats_score': calculate_ats_score(resume_data, job_description)
    }
    
    return enhanced_resume

def extract_keywords(text: str) -> List[str]:
    """Extract important keywords from text."""
    doc = nlp(text)
    keywords = []
    
    # Extract named entities
    for ent in doc.ents:
        if ent.label_ in ['ORG', 'PRODUCT', 'GPE']:
            keywords.append(ent.text.lower())
    
    # Extract noun phrases
    for chunk in doc.noun_chunks:
        if len(chunk.text.split()) <= 3:  # Avoid long phrases
            keywords.append(chunk.text.lower())
    
    return list(set(keywords))

def generate_ats_headline(resume_data: dict, job_description: str) -> str:
    """Generate an ATS-friendly headline."""
    current_role = resume_data.get('current_role', '')
    top_skills = resume_data.get('skills', [])[:3]
    job_title = extract_job_title(job_description)
    
    if job_title and current_role:
        return f"{current_role} | {job_title} | {' | '.join(top_skills)}"
    elif current_role:
        return f"{current_role} | {' | '.join(top_skills)}"
    else:
        return f"Professional | {' | '.join(top_skills)}"

def extract_job_title(job_description: str) -> str:
    """Extract job title from job description."""
    # Common job title patterns
    patterns = [
        r'looking for a (.*?)(?:to|who|with|in)',
        r'seeking a (.*?)(?:to|who|with|in)',
        r'position: (.*?)(?:\n|$)',
        r'role: (.*?)(?:\n|$)',
        r'title: (.*?)(?:\n|$)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, job_description, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    
    return ""

def enhance_summary(resume_data: dict, job_description: str) -> str:
    """Enhance professional summary for better ATS score."""
    skills = resume_data.get('skills', [])
    experience = resume_data.get('experience', [])
    job_skills = extract_skills_from_job_description(job_description)
    
    # Start with a strong opening
    summary = f"Results-driven professional with expertise in {', '.join(skills[:5])}.\n\n"
    
    # Add key achievements
    if experience:
        summary += "Key achievements:\n"
        for exp in experience[:3]:
            if 'achievements' in exp:
                summary += f"• {exp['achievements'][0]}\n"
    
    # Add relevant skills
    matched_skills = [skill for skill in job_skills if skill in skills]
    if matched_skills:
        summary += f"\nProficient in {', '.join(matched_skills)}."
    
    return summary

def enhance_skills(skills: List[str], job_skills: List[str]) -> List[str]:
    """Enhance skills section for better ATS score."""
    enhanced_skills = []
    
    # Add job-specific skills first
    for skill in job_skills:
        if skill not in enhanced_skills:
            enhanced_skills.append(skill)
    
    # Add remaining skills
    for skill in skills:
        if skill not in enhanced_skills:
            enhanced_skills.append(skill)
    
    return enhanced_skills

def enhance_experience(experience: List[Dict], job_keywords: List[str]) -> List[Dict]:
    """Enhance experience section for better ATS score."""
    enhanced_experience = []
    
    for exp in experience:
        enhanced_exp = exp.copy()
        
        # Enhance role description
        if 'role' in exp:
            enhanced_exp['role'] = enhance_role_description(exp['role'], job_keywords)
        
        # Enhance achievements
        if 'achievements' in exp:
            enhanced_exp['achievements'] = [
                enhance_achievement(achievement, job_keywords)
                for achievement in exp['achievements']
            ]
        
        enhanced_experience.append(enhanced_exp)
    
    return enhanced_experience

def enhance_role_description(role: str, job_keywords: List[str]) -> str:
    """Enhance role description with relevant keywords."""
    enhanced_role = role
    
    # Add relevant keywords if not present
    for keyword in job_keywords:
        if keyword not in enhanced_role.lower():
            enhanced_role += f" | {keyword.title()}"
    
    return enhanced_role

def enhance_achievement(achievement: str, job_keywords: List[str]) -> str:
    """Enhance achievement description with relevant keywords."""
    enhanced_achievement = achievement
    
    # Add relevant keywords if not present
    for keyword in job_keywords:
        if keyword not in enhanced_achievement.lower():
            enhanced_achievement += f" utilizing {keyword}"
    
    return enhanced_achievement

def calculate_ats_score(resume_data: dict, job_description: str) -> int:
    """Calculate ATS compatibility score."""
    job_skills = extract_skills_from_job_description(job_description)
    job_keywords = extract_keywords(job_description)
    
    # Calculate skill match score
    resume_skills = resume_data.get('skills', [])
    matched_skills = [skill for skill in job_skills if skill in resume_skills]
    skill_score = len(matched_skills) / max(1, len(job_skills)) * 40
    
    # Calculate keyword match score
    resume_text = ' '.join([
        resume_data.get('summary', ''),
        ' '.join(resume_data.get('skills', [])),
        ' '.join([exp.get('role', '') for exp in resume_data.get('experience', [])])
    ]).lower()
    
    matched_keywords = [keyword for keyword in job_keywords if keyword in resume_text]
    keyword_score = len(matched_keywords) / max(1, len(job_keywords)) * 30
    
    # Calculate format score
    format_score = 30  # Base score for proper formatting
    
    # Deduct points for missing sections
    required_sections = ['name', 'email', 'phone', 'summary', 'experience', 'education']
    for section in required_sections:
        if not resume_data.get(section):
            format_score -= 5
    
    return int(skill_score + keyword_score + format_score)

# --- LinkedIn Optimization Functions ---

def optimize_for_linkedin(resume_data: dict) -> dict:
    """Generate an optimized LinkedIn profile from resume data."""
    linkedin_profile = {
        'headline': generate_linkedin_headline(resume_data),
        'summary': generate_linkedin_summary(resume_data),
        'experience': format_linkedin_experience(resume_data.get('experience', [])),
        'skills': optimize_linkedin_skills(resume_data.get('skills', [])),
        'education': format_linkedin_education(resume_data.get('education', [])),
        'certifications': extract_certifications(resume_data),
        'recommendations': generate_linkedin_recommendations(resume_data),
        'completeness_score': calculate_profile_completeness(resume_data)
    }
    return linkedin_profile

def generate_linkedin_headline(resume_data: dict) -> str:
    """Generate an optimized LinkedIn headline."""
    current_role = resume_data.get('current_role', '')
    top_skills = resume_data.get('skills', [])[:3]
    
    if current_role:
        return f"{current_role} | {' | '.join(top_skills)}"
    else:
        return f"Professional | {' | '.join(top_skills)}"

def generate_linkedin_summary(resume_data: dict) -> str:
    """Generate an optimized LinkedIn summary."""
    skills = resume_data.get('skills', [])
    experience = resume_data.get('experience', [])
    
    summary = f"Results-driven professional with expertise in {', '.join(skills[:5])}.\n\n"
    
    if experience:
        summary += "Key achievements:\n"
        for exp in experience[:3]:
            if 'achievements' in exp:
                summary += f"• {exp['achievements'][0]}\n"
    
    return summary

def format_linkedin_experience(experience: List[Dict]) -> List[Dict]:
    """Format experience for LinkedIn profile."""
    formatted_experience = []
    
    for exp in experience:
        formatted_exp = {
            'title': exp.get('role', ''),
            'company': exp.get('company', ''),
            'duration': exp.get('duration', ''),
            'description': exp.get('details', ''),
            'location': exp.get('location', ''),
            'achievements': exp.get('achievements', [])
        }
        formatted_experience.append(formatted_exp)
    
    return formatted_experience

def optimize_linkedin_skills(skills: List[str]) -> List[Dict]:
    """Optimize skills for LinkedIn profile."""
    return [{'name': skill, 'endorsements': 0} for skill in skills]

def format_linkedin_education(education: List[str]) -> List[Dict]:
    """Format education for LinkedIn profile."""
    formatted_education = []
    
    for edu in education:
        formatted_edu = {
            'school': edu,
            'degree': '',
            'field_of_study': '',
            'start_date': '',
            'end_date': ''
        }
        formatted_education.append(formatted_edu)
    
    return formatted_education

def extract_certifications(resume_data: dict) -> List[Dict]:
    """Extract certifications from resume data."""
    certifications = resume_data.get('certifications', [])
    formatted_certs = []
    
    for cert in certifications:
        formatted_cert = {
            'name': cert,
            'issuing_organization': '',
            'issue_date': '',
            'expiration_date': '',
            'credential_id': ''
        }
        formatted_certs.append(formatted_cert)
    
    return formatted_certs

def generate_linkedin_recommendations(resume_data: dict) -> List[Dict]:
    """Generate LinkedIn recommendation templates."""
    recommendations = [
        {
            'type': 'Manager',
            'template': f"I had the pleasure of managing {resume_data.get('name', 'this professional')} and can attest to their exceptional skills in {', '.join(resume_data.get('skills', [])[:3])}."
        },
        {
            'type': 'Colleague',
            'template': f"{resume_data.get('name', 'This professional')} is an outstanding team player with strong expertise in {', '.join(resume_data.get('skills', [])[:3])}."
        },
        {
            'type': 'Client',
            'template': f"I worked with {resume_data.get('name', 'this professional')} and was impressed by their ability to deliver results in {', '.join(resume_data.get('skills', [])[:3])}."
        }
    ]
    return recommendations

def calculate_profile_completeness(resume_data: dict) -> int:
    """Calculate LinkedIn profile completeness score."""
    sections = {
        'headline': 10,
        'summary': 15,
        'experience': 25,
        'skills': 20,
        'education': 15,
        'certifications': 10,
        'recommendations': 5
    }
    
    score = 0
    for section, weight in sections.items():
        if resume_data.get(section):
            score += weight
    
    return min(score, 100)  # Cap at 100%

# --- Example usage ---
if __name__ == "__main__":
    # This part is for demonstration only — in Flask, you'd call parse_resume_with_job_matching from your route handler.
    class DummyFileStorage:
        """Simulate Flask's FileStorage for testing with local files."""
        def __init__(self, filepath):
            self.filename = filepath.split('/')[-1]
            self.filepath = filepath
            self.stream = open(filepath, 'rb')
        def read(self):
            return self.stream.read()
        def close(self):
            self.stream.close()

    # Load a local resume file for testing
    resume_file = DummyFileStorage('path_to_resume.pdf')  # Change to your file path

    job_desc = """
    We are looking for a Python developer skilled in Flask, SQL, Docker, and AWS.
    Experience with machine learning and NLP is a plus.
    """

    result = parse_resume_with_job_matching(resume_file, job_desc)
    resume_file.close()

    import pprint
    pprint.pprint(result)
