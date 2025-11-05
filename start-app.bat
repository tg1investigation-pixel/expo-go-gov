@echo off
REM Windows Server Batch Script to Start Mobile App (Expo)
REM Compatible with Windows Server 2012 R2 and later

echo ========================================
echo Police Search Engine - Mobile App
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

REM Navigate to project directory
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

REM Start Expo
echo Starting Expo development server...
echo QR code will appear shortly
echo.
call npm start

pause

