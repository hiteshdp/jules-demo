@echo off
REM Hair Loss Diagnosis ^& Treatment Platform - Complete Setup Script (Windows)
REM This script sets up all modules: Backend, Patient Frontend, Dermatologist Frontend, and Admin Frontend

echo.
echo === Complete Platform Setup Started ===
echo ==========================================
echo.

REM Check if we're in the project root directory
if not exist "composer.json" (
    echo [ERROR] composer.json not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

if not exist "frontend" (
    echo [ERROR] frontend directory not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

REM Check for required dependencies
echo [INFO] Checking system dependencies...

REM Check PHP
php --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] PHP is not installed. Please install PHP 8.2 or higher.
    echo Download from: https://windows.php.net/download/
    pause
    exit /b 1
)

REM Check Composer
composer --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Composer is not installed. Please install Composer from https://getcomposer.org/
    pause
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18 or higher from https://nodejs.org/
    pause
    exit /b 1
)

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo [SUCCESS] All system dependencies found

echo.
echo [SETUP] Starting complete platform setup...
echo.

REM Step 1: Setup Backend
echo [SETUP] Step 1/4: Setting up Laravel Backend
echo Starting backend setup in a new window...
start "Backend Setup" cmd /k "setup-backend.bat"

REM Wait for backend to start
echo [INFO] Waiting for backend to start...
timeout /t 15 /nobreak >nul

REM Check if backend is running
:check_backend
curl -s http://localhost:8000/api/me >nul 2>&1
if errorlevel 1 (
    echo [INFO] Backend not ready yet, waiting...
    timeout /t 5 /nobreak >nul
    goto check_backend
)
echo [SUCCESS] Backend is ready!

echo.
echo [SETUP] Step 2/4: Setting up Patient Frontend
echo Starting patient frontend setup in a new window...
start "Patient Frontend" cmd /k "setup-patient.bat"

echo.
echo [SETUP] Step 3/4: Setting up Dermatologist Frontend
echo Starting dermatologist frontend setup in a new window...
start "Dermatologist Frontend" cmd /k "setup-dermatologist.bat"

echo.
echo [SETUP] Step 4/4: Setting up Admin Frontend
echo Starting admin frontend setup in a new window...
start "Admin Frontend" cmd /k "setup-admin.bat"

REM Wait a moment for all services to start
timeout /t 10 /nobreak >nul

echo.
echo ==========================================
echo [SUCCESS] All modules setup completed!
echo ==========================================
echo.
echo [INFO] Platform URLs:
echo   Backend API:        http://localhost:8000
echo   Patient Portal:     http://localhost:3000
echo   Dermatologist Portal: http://localhost:3001
echo   Admin Panel:        http://localhost:3002
echo.
echo [INFO] Default Test Credentials:
echo.
echo   Patient:
echo     Email:    patient@hairskinhealth.com
echo     Password: password
echo.
echo   Dermatologist:
echo     Email:    dermatologist@hairskinhealth.com
echo     Password: password
echo.
echo   Admin:
echo     Email:    admin@hairskinhealth.com
echo     Password: password
echo.
echo [INFO] All services are running in separate windows.
echo [INFO] You can close this window once all services are running.
echo.
echo [WARNING] Note: If any service fails to start, you can run individual setup scripts:
echo   setup-backend.bat
echo   setup-patient.bat
echo   setup-dermatologist.bat
echo   setup-admin.bat
echo.

pause