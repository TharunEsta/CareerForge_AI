import re
import spacy

nlp = spacy.load("en_core_web_sm")

# Extract name using SpaCy
def extract_name_from_text(text):
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ == "PERSON" and len(ent.text.split()) <= 3:
            return ent.text
    return None

# Extract email
def extract_email(text):
    match = re.search(r"[\w\.-]+@[\w\.-]+", text)
    return match.group(0) if match else None

# Extract phone number
def extract_phone_number(text):
    match = re.search(r"(\+?\d[\d\s\-\(\)]{7,}\d)", text)
    return match.group(0) if match else None

# Extract skills from predefined list
def extract_skills(text):
    skills_list = [
        "Python", "Java", "C++", "TensorFlow", "PyTorch", "React", "HTML", "CSS",
        "JavaScript", "OpenCV", "SQL", "MySQL", "Git", "LangChain", "Streamlit",
        "YOLO", "Scikit-learn", "Azure", "AWS", "NLP", "LLMs", "Prompt Engineering"
    ]
    text_lower = text.lower()
    found_skills = [skill for skill in skills_list if skill.lower() in text_lower]
    return list(set(found_skills))

# Extract degrees and colleges
def extract_education(text):
    degrees = []
    colleges = []
    lines = text.split('\n')
    for line in lines:
        lower = line.lower()
        if any(deg in lower for deg in ['bca', 'b.tech', 'mca', 'b.sc', 'msc', 'bachelor', 'master', 'phd']):
            degrees.append(line.strip())
        if any(keyword in lower for keyword in ['university', 'college', 'institute', 'school of']):
            colleges.append(line.strip())
    return list(set(degrees)), list(set(colleges))

# Extract experience entries
def extract_experience(text):
    experience = []
    lines = text.split('\n')
    for line in lines:
        if any(word in line.lower() for word in ['worked', 'experience', 'company', 'engineer', 'developer']):
            experience.append({
                "company": None,
                "designation": None,
                "duration": None,
                "details": line.strip()
            })
    return experience

# Extract projects separately
def extract_projects(text):
    projects = []
    lines = text.split('\n')
    for line in lines:
        if any(word in line.lower() for word in ['project', 'developed', 'built', 'implemented', 'designed']):
            projects.append({
                "title": None,
                "description": line.strip()
            })
    return projects

# Main parser function
def parse_resume(text):
    education = extract_education(text)
    experience = extract_experience(text)
    projects = extract_projects(text)
    skills = extract_skills(text)
    certifications = extract_certifications(text)  # NEW LINE

    return {
        'name': extract_name(text),
        'email': extract_email(text),
        'mobile_number': extract_mobile(text),
        'college_name': education.get('college_name', []),
        'degree': normalize_degrees(education.get('degree', [])),
        'skills': normalize_skills(skills),
        'experience': experience,
        'projects': projects,
        'languages': extract_languages(text),
        'total_experience': extract_total_experience(text),
        'certifications': certifications  # NEW FIELD
    }

