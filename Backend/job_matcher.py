# job_matcher.py

def extract_skills_from_text(_):
    # skills_list removed as it is unused
    pass  # Implement skill extraction logic here if needed

SKILL_KEYWORDS = [
    "python", "flask", "sql", "git", "docker", "aws",
    "react", "java", "c++", "javascript", "html", "css"
]

def extract_skills_from_text(text):
    text = text.lower()
    found_skills = [skill for skill in SKILL_KEYWORDS if skill in text]
    return found_skills

def match_skills(resume_skills, job_skills):
    matched_skills = [skill for skill in resume_skills if skill in job_skills]
    missing_skills = [skill for skill in job_skills if skill not in resume_skills]
    return matched_skills, missing_skills

def match_resume_to_job(resume_skills, job_description):
    job_skills = extract_skills_from_text(job_description)
    matched_skills = [skill for skill in resume_skills if skill in job_skills]
    missing_skills = [skill for skill in job_skills if skill not in resume_skills]

    return {
        'job_skills': job_skills,
        'matched_skills': matched_skills,
        'missing_skills': missing_skills,
    }

# Example: predefined skills list (you can expand or load from a file)
SKILL_KEYWORDS = ["python", "java", "sql", "flask", "docker", "git", "aws", "react"]

def extract_skills_from_text(text):
    text_lower = text.lower()
    found_skills = [skill for skill in SKILL_KEYWORDS if skill in text_lower]
    return found_skills

# Matching function
def match_skills(resume_skills, job_skills):
    matched = [skill for skill in resume_skills if skill in job_skills]
    missing = [skill for skill in job_skills if skill not in resume_skills]
    return matched, missing


# Example usage
job_description = "We are looking for a python developer with flask, git, and aws skills."
resume_skills = ["python", "flask", "sql", "git"]

job_skills = extract_skills_from_text(job_description)
matched_skills, missing_skills = match_skills(resume_skills, job_skills)

print("Job Skills:", job_skills)
print("Matched Skills:", matched_skills)
print("Missing Skills:", missing_skills)
