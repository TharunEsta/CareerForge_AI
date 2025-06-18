# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "Please run this script as Administrator!"
    exit
}

# Function to check if Docker is installed
function Test-DockerInstalled {
    try {
        $null = Get-Command docker -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

# Check if Docker is already installed
if (Test-DockerInstalled) {
    Write-Host "Docker is already installed. Starting Docker Desktop..."
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    exit
}

# Enable WSL 2
Write-Host "Enabling WSL 2..."
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Download and install WSL 2 Linux kernel update
$wslUpdateUrl = "https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi"
$wslUpdatePath = "$env:TEMP\wsl_update.msi"
Write-Host "Downloading WSL 2 Linux kernel update..."
Invoke-WebRequest -Uri $wslUpdateUrl -OutFile $wslUpdatePath
Write-Host "Installing WSL 2 Linux kernel update..."
Start-Process -FilePath "msiexec.exe" -ArgumentList "/i $wslUpdatePath /quiet /norestart" -Wait

# Set WSL 2 as default
Write-Host "Setting WSL 2 as default..."
wsl --set-default-version 2

# Download Docker Desktop Installer
$dockerInstallerUrl = "https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe"
$installerPath = "$env:TEMP\DockerDesktopInstaller.exe"
Write-Host "Downloading Docker Desktop..."
Invoke-WebRequest -Uri $dockerInstallerUrl -OutFile $installerPath

# Install Docker Desktop
Write-Host "Installing Docker Desktop..."
Start-Process -FilePath $installerPath -ArgumentList "install --quiet" -Wait

# Start Docker Desktop
Write-Host "Starting Docker Desktop..."
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

Write-Host "Installation completed. Please wait for Docker Desktop to start..."
Write-Host "Once Docker Desktop is running, run the docker_setup.ps1 script to configure Docker Hub access." 