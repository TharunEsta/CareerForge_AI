import os
import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient
from main import app

client = TestClient(app)

# Helper for endpoints that require authentication
def get_auth_headers(token=None):
    if not token:
        # Login to get a token
        login_data = {
            "username": "testuser",
            "password": "mysecret123"
        }
        response = client.post("/token", data=login_data)
        token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

# /api/resume/upload endpoint
@pytest.mark.parametrize("file_content,expected_status", [
    (b"dummy resume text", 200),
    (b"", 400),
])
def test_upload(file_content, expected_status):
    files = {"file": ("resume.txt", file_content)}
    headers = get_auth_headers()
    response = client.post("/api/resume/upload", files=files, headers=headers)
    assert response.status_code == expected_status

# /api/analyze-resume endpoint
@pytest.mark.parametrize("file_content,job_desc,expected_status", [
    (b"dummy resume text", "Valid job description", 200),
    (b"", "Valid job description", 400),
    (b"dummy resume text", "", 200),  # job description is optional
])
def test_analyze_resume(file_content, job_desc, expected_status):
    files = {"file": ("resume.txt", file_content)}
    data = {"job_description": job_desc} if job_desc else {}
    headers = get_auth_headers()
    response = client.post("/api/analyze-resume", files=files, data=data, headers=headers)
    assert response.status_code == expected_status

# /match_resume endpoint
@pytest.mark.parametrize("file_content,job_desc,expected_status", [
    (b"dummy resume text", "Valid job description", 200),
    (b"", "Valid job description", 400),
    (b"dummy resume text", "", 400),
])
def test_match_resume(file_content, job_desc, expected_status):
    files = {"file": ("resume.txt", file_content)}
    data = {"job_description": job_desc}
    headers = get_auth_headers()
    response = client.post("/match_resume", files=files, data=data, headers=headers)
    assert response.status_code == expected_status

# /job_match endpoint
@pytest.mark.parametrize("file_content,expected_status", [
    (b"dummy resume text", 200),
    (b"", 400),
])
def test_job_match(file_content, expected_status):
    files = {"file": ("resume.txt", file_content)}
    headers = get_auth_headers()
    response = client.post("/job_match", files=files, headers=headers)
    assert response.status_code == expected_status

# /chat_with_resume endpoint
@pytest.mark.parametrize("prompt,resume_text,expected_status", [
    ("Tell me about my skills", "Valid resume text", 200),
    ("", "Valid resume text", 400),
    ("Tell me about my skills", "", 400),
])
def test_chat_with_resume(prompt, resume_text, expected_status):
    data = {"prompt": prompt, "resume_text": resume_text}
    headers = get_auth_headers()
    response = client.post("/chat_with_resume", data=data, headers=headers)
    assert response.status_code == expected_status

# /api/test endpoint
def test_test_endpoint():
    response = client.get("/api/test")
    assert response.status_code == 200
    assert response.json() == {"message": "Backend is working!"}

# Test authentication
def test_login():
    login_data = {
        "username": "testuser",
        "password": "mysecret123"
    }
    response = client.post("/token", data=login_data)
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

# Test signup
def test_signup():
    signup_data = {
        "email": "newuser@example.com",
        "password": "newpassword123",
        "full_name": "New User"
    }
    response = client.post("/signup", data=signup_data)
    assert response.status_code == 200
    assert response.json()["email"] == signup_data["email"]
    assert response.json()["full_name"] == signup_data["full_name"] 