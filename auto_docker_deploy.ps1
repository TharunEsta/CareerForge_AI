# Automated Docker Deployment Script
# This script will handle Docker Hub login and image push automatically

Write-Host "Starting automated Docker deployment..." -ForegroundColor Green

# Wait for Docker to be ready
Write-Host "Checking Docker status..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
while ($attempt -lt $maxAttempts) {
    try {
        docker info | Out-Null
        Write-Host "Docker is ready!" -ForegroundColor Green
        break
    }
    catch {
        $attempt++
        Write-Host "Waiting for Docker... ($attempt/$maxAttempts)" -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

if ($attempt -eq $maxAttempts) {
    Write-Error "Docker is not running. Please start Docker Desktop and try again."
    exit 1
}

# Set Docker Hub credentials
$username = "Tharun725"
Write-Host "Using Docker Hub username: $username" -ForegroundColor Cyan

# Check if already logged in
Write-Host "Checking Docker Hub login status..." -ForegroundColor Yellow
try {
    docker info | Select-String "Username" | Out-Null
    Write-Host "Already logged in to Docker Hub" -ForegroundColor Green
} catch {
    Write-Host "Not logged in to Docker Hub" -ForegroundColor Yellow
    Write-Host "Please run: docker login" -ForegroundColor Red
    Write-Host "Then run this script again" -ForegroundColor Red
    exit 1
}

# Build the Docker image from Backend directory
Write-Host "Building Docker image..." -ForegroundColor Yellow
Write-Host "Image tag: $username/careerforge:latest" -ForegroundColor Cyan

try {
    docker build -t "$username/careerforge:latest" ./Backend
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Docker image built successfully!" -ForegroundColor Green
    } else {
        Write-Error "Failed to build Docker image"
        exit 1
    }
} catch {
    Write-Error "Error building Docker image: $_"
    exit 1
}

# Push the Docker image
Write-Host "Pushing Docker image to Docker Hub..." -ForegroundColor Yellow
try {
    docker push "$username/careerforge:latest"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Docker image pushed successfully!" -ForegroundColor Green
        Write-Host "Your image is now available at: https://hub.docker.com/r/$username/careerforge" -ForegroundColor Cyan
    } else {
        Write-Error "Failed to push Docker image"
        exit 1
    }
} catch {
    Write-Error "Error pushing Docker image: $_"
    exit 1
}

Write-Host "Docker deployment completed successfully!" -ForegroundColor Green 