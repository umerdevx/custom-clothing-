@echo off
title AURA-WEAR Backend Server Launcher
echo =======================================================
echo     AURA-WEAR BACKEND CONTROLLER LAUNCHER
echo =======================================================
echo.

:: Check python is in path
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in system PATH.
    echo Please install Python 3.11+ and try again.
    pause
    exit /b 1
)

echo [1/3] Validating and installing package dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [WARNING] Dependency installation failed. Trying user scope...
    pip install -r requirements.txt --user
)

echo.
echo [2/3] Seeding initial database catalog & FAQs...
python -m database.seed
if %errorlevel% neq 0 (
    echo [WARNING] Database seeder failed. Startup auto-seeding will retry.
)

echo.
echo [3/3] Launching Uvicorn ASGI API server...
echo Access Swagger Docs at: http://127.0.0.1:8001/docs
echo =======================================================
uvicorn main:app --reload --host 127.0.0.1 --port 8001
if %errorlevel% neq 0 (
    echo [ERROR] Uvicorn failed to start.
    echo Make sure port 8001 is not already in use.
)

pause
