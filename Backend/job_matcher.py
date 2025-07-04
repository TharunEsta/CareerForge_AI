# job_matcher.py
from utils import extract_skills_from_job_description, match_skills

def extract_skills_from_text(_):
    # skills_list removed as it is unused
    pass  # Implement skill extraction logic here if needed

SKILL_KEYWORDS = [
    "python", "flask", "sql", "git", "docker", "aws",
    "react", "java", "c++", "javascript", "html", "css"
]

def match_resume_to_job(resume_skill_list, job_desc):
    job_skill_list = extract_skills_from_job_description(job_desc)
    matched, missing = match_skills(job_skill_list, resume_skill_list)
    return {
        'job_skills': job_skill_list,
        'matched_skills': matched,
        'missing_skills': missing,
    }

# Example usage
example_job_description = "We are looking for a python developer with flask, git, and aws skills."
example_resume_skills = ["python", "flask", "sql", "git"]

example_job_skills = extract_skills_from_job_description(example_job_description)
example_matched_skills, example_missing_skills = match_skills(example_job_skills, example_resume_skills)

print("Job Skills:", example_job_skills)
print("Matched Skills:", example_matched_skills)
print("Missing Skills:", example_missing_skills)
