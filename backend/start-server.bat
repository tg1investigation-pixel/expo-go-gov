@echo off
REM Windows Server Batch Script to Start Backend Server
REM Compatible with Windows Server 2012 R2 and later

echo ========================================
echo Police Search Engine - Backend Server
echo Windows Server Compatible
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Display Node.js version
echo Node.js Version:
node --version
echo.

REM Check if npm is installed
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)

REM Navigate to backend directory
cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
)

REM Check if .env file exists
if not exist ".env" (
    echo WARNING: .env file not found. Creating default .env file...
    (
        echo DB_HOST=localhost
        echo DB_USER=AH
        echo DB_PASSWORD=12Secure
        echo DB_PORT=3306
        echo DB_NAME=investigation_db
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo PORT=3000
    ) > .env
    echo .env file created. Please review and update if needed.
    echo.
)

REM Set environment variable to skip platform check for Windows Server 2012 R2
set NODE_SKIP_PLATFORM_CHECK=1

REM Start the server
echo Starting backend server...
echo Server will run on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
node server.js

pause

