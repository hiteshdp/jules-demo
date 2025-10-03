@echo off
REM Hair Loss Diagnosis ^& Treatment Platform - Dermatologist Frontend Setup Script (Windows)
REM This script sets up the React 19 dermatologist frontend application

echo.
echo === Dermatologist Frontend Setup Started ===
echo ================================================
echo.

REM Check if we're in the project root directory
if not exist "frontend\dermatologist" (
    echo [ERROR] frontend\dermatologist directory not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

REM Change to dermatologist frontend directory
cd frontend\dermatologist

REM Check for required dependencies
echo [INFO] Checking dependencies...

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18 or higher from https://nodejs.org/
    pause
    exit /b 1
)
echo [SUCCESS] Node.js found

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed. Please install npm.
    pause
    exit /b 1
)
echo [SUCCESS] npm found

REM Check if package.json exists
if not exist "package.json" (
    echo [ERROR] package.json not found in frontend\dermatologist directory
    pause
    exit /b 1
)

REM Install dependencies
echo [INFO] Installing Node.js dependencies...
npm install
if errorlevel 1 (
    echo [ERROR] Failed to install Node.js dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Node.js dependencies installed successfully

REM Create environment file if it doesn't exist
if not exist ".env" (
    echo [INFO] Creating .env file...
    (
        echo # React App Environment Variables
        echo REACT_APP_API_URL=http://localhost:8000/api
        echo REACT_APP_APP_NAME=Hair Skin Health - Dermatologist Portal
        echo REACT_APP_VERSION=1.0.0
    ) > .env
    echo [SUCCESS] .env file created
) else (
    echo [WARNING] .env file already exists, skipping creation
)

REM Check if backend is running
echo [INFO] Checking if backend is running...
curl -s http://localhost:8000/api/me >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Backend is not running or not accessible at http://localhost:8000
    echo Please start the backend first by running: setup-backend.bat
    echo The frontend will still start but API calls may fail.
) else (
    echo [SUCCESS] Backend is running and accessible
)

REM Build the application for production check
echo [INFO] Building application for production check...
npm run build
if errorlevel 1 (
    echo [ERROR] Application build failed
    pause
    exit /b 1
)
echo [SUCCESS] Application builds successfully

REM Display setup completion
echo.
echo ================================================
echo [SUCCESS] Dermatologist frontend setup completed successfully!
echo ================================================
echo.
echo [INFO] Application will be available at: http://localhost:3001
echo [INFO] Make sure the backend is running at: http://localhost:8000
echo.
echo [INFO] Default test credentials:
echo   Email: dermatologist@hairskinhealth.com
echo   Password: password
echo.
echo Press Ctrl+C to stop the development server
echo.

REM Start the React development server on port 3001
set PORT=3001
npm start