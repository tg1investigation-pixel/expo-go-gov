# Windows Server Service Installation Script
# Run as Administrator
# Compatible with Windows Server 2012 R2 and later

param(
    [string]$ServiceName = "PoliceSearchBackend",
    [string]$DisplayName = "Police Search Engine Backend",
    [string]$Description = "Backend API server for Police Search Engine mobile application"
)

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$nodePath = (Get-Command node).Source
$serverPath = Join-Path $scriptPath "server.js"

# Set environment variable for Windows Server 2012 R2 compatibility
$env:NODE_SKIP_PLATFORM_CHECK = "1"
[System.Environment]::SetEnvironmentVariable("NODE_SKIP_PLATFORM_CHECK", "1", "Machine")

# Check if Node.js is installed
if (-not $nodePath) {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if server.js exists
if (-not (Test-Path $serverPath)) {
    Write-Host "ERROR: server.js not found at $serverPath" -ForegroundColor Red
    exit 1
}

# Check if service already exists
$existingService = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
if ($existingService) {
    Write-Host "Service '$ServiceName' already exists. Removing..." -ForegroundColor Yellow
    Stop-Service -Name $ServiceName -ErrorAction SilentlyContinue
    sc.exe delete $ServiceName
    Start-Sleep -Seconds 2
}

Write-Host "Installing Windows Service..." -ForegroundColor Cyan
Write-Host "Service Name: $ServiceName" -ForegroundColor White
Write-Host "Display Name: $DisplayName" -ForegroundColor White
Write-Host "Node.js Path: $nodePath" -ForegroundColor White
Write-Host "Server Path: $serverPath" -ForegroundColor White
Write-Host ""

# Install using NSSM (Node Service Manager) if available, otherwise use sc.exe
$nssmPath = Join-Path $scriptPath "nssm.exe"
if (Test-Path $nssmPath) {
    Write-Host "Using NSSM to install service..." -ForegroundColor Green
    & $nssmPath install $ServiceName $nodePath "$serverPath"
    & $nssmPath set $ServiceName AppDirectory $scriptPath
    & $nssmPath set $ServiceName DisplayName $DisplayName
    & $nssmPath set $ServiceName Description $Description
    & $nssmPath set $ServiceName Start SERVICE_AUTO_START
} else {
    Write-Host "NSSM not found. Using sc.exe (requires manual configuration)..." -ForegroundColor Yellow
    $serviceCommand = "`"$nodePath`" `"$serverPath`""
    sc.exe create $ServiceName binPath= $serviceCommand DisplayName= $DisplayName start= auto
    sc.exe description $ServiceName $Description
}

Write-Host ""
Write-Host "Service installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the service:" -ForegroundColor Cyan
Write-Host "  Start-Service -Name $ServiceName" -ForegroundColor White
Write-Host ""
Write-Host "To stop the service:" -ForegroundColor Cyan
Write-Host "  Stop-Service -Name $ServiceName" -ForegroundColor White
Write-Host ""
Write-Host "To check service status:" -ForegroundColor Cyan
Write-Host "  Get-Service -Name $ServiceName" -ForegroundColor White
Write-Host ""

