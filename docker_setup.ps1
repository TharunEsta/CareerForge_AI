# Function to get Docker Hub credentials
function Get-DockerCredentials {
    $username = "Tharun725"  # Pre-filled username
    Write-Host "Docker Hub Username: $username"
    Write-Host ""
    Write-Host "To get your access token:"
    Write-Host "1. Go to https://hub.docker.com/settings/security"
    Write-Host "2. Click 'New Access Token'"
    Write-Host "3. Name it 'CareerForge Deployment'"
    Write-Host "4. Select scopes: Read, Write, Delete"
    Write-Host "5. Copy the generated token"
    Write-Host ""
    $token = Read-Host "Enter your Docker Hub access token" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
    $password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    return @{
        Username = $username
        Password = $password
    }
}

# Wait for Docker to be ready
Write-Host "Waiting for Docker to be ready..."
$maxAttempts = 30
$attempt = 0
while ($attempt -lt $maxAttempts) {
    try {
        docker info | Out-Null
        break
    }
    catch {
        $attempt++
        Start-Sleep -Seconds 2
    }
}

if ($attempt -eq $maxAttempts) {
    Write-Error "Docker is not running. Please start Docker Desktop and try again."
    exit 1
}

# Get credentials and login
$credentials = Get-DockerCredentials
$username = $credentials.Username
$password = $credentials.Password

Write-Host "Logging in to Docker Hub..."
echo $password | docker login --username $username --password-stdin

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to login to Docker Hub"
    exit 1
}

# Build and push the image
Write-Host "Building Docker image..."
docker build -t "$username/careerforge:latest" .

Write-Host "Pushing Docker image..."
docker push "$username/careerforge:latest"

Write-Host "Docker setup completed successfully!" 