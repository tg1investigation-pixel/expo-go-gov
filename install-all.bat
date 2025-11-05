@echo off
REM Complete Installation Script for Windows Server
REM Installs all dependencies and sets up the project

echo ========================================
echo Police Search Engine - Complete Setup
echo Windows Server Installation
echo ========================================
echo.

REM Check Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Set environment variable to skip platform check for Windows Server 2012 R2
set NODE_SKIP_PLATFORM_CHECK=1

echo [1/4] Installing backend dependencies...
cd /d "%~dp0backend"
if not exist "node_modules" (
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Backend installation failed
        pause
        exit /b 1
    )
) else (
    echo Backend dependencies already installed.
)
echo.

echo [2/4] Installing mobile app dependencies...
cd /d "%~dp0"
if not exist "node_modules" (
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Mobile app installation failed
        pause
        exit /b 1
    )
) else (
    echo Mobile app dependencies already installed.
)
echo.

echo [3/4] Checking configuration files...
cd /d "%~dp0backend"
if not exist ".env" (
    echo Creating .env file...
    (
        echo DB_HOST=localhost
        echo DB_USER=AH
        echo DB_PASSWORD=12Secure
        echo DB_PORT=3306
        echo DB_NAME=investigation_db
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo PORT=3000
    ) > .env
    echo .env file created.
) else (
    echo .env file already exists.
)
echo.

echo [4/4] Setup complete!
echo.
echo Next steps:
echo   1. Start backend: cd backend ^&^& start-server.bat
echo   2. Start mobile app: start-app.bat
echo   3. See WINDOWS_SERVER_SETUP.md for detailed instructions
echo.
pause

