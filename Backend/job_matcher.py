# job_matcher.py

def extract_skills_from_text(_):
    # skills_list removed as it is unused
    pass  # Implement skill extraction logic here if needed

SKILL_KEYWORDS = [
    "python", "flask", "sql", "git", "docker", "aws",
    "react", "java", "c++", "javascript", "html", "css"
]

def extract_skills_from_text(text):
    text_lower = text.lower()
    found_skills = [skill for skill in SKILL_KEYWORDS if skill in text_lower]
    return found_skills

def match_skills(resume_skill_list, job_skill_list):
    matched = [skill for skill in resume_skill_list if skill in job_skill_list]
    missing = [skill for skill in job_skill_list if skill not in resume_skill_list]
    return matched, missing

def match_resume_to_job(resume_skill_list, job_desc):
    job_skill_list = extract_skills_from_text(job_desc)
    matched, missing = match_skills(resume_skill_list, job_skill_list)
    return {
        'job_skills': job_skill_list,
        'matched_skills': matched,
        'missing_skills': missing,
    }

# Example usage
example_job_description = "We are looking for a python developer with flask, git, and aws skills."
example_resume_skills = ["python", "flask", "sql", "git"]

example_job_skills = extract_skills_from_text(example_job_description)
example_matched_skills, example_missing_skills = match_skills(example_resume_skills, example_job_skills)

print("Job Skills:", example_job_skills)
print("Matched Skills:", example_matched_skills)
print("Missing Skills:", example_missing_skills)
