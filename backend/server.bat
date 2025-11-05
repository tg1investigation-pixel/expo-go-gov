@echo off
REM Simplified server start script with platform check bypass
set NODE_SKIP_PLATFORM_CHECK=1
cd /d "%~dp0"
node server.js

