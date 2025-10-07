@echo off
REM Hair Loss Diagnosis and Treatment Platform - Admin Frontend Setup Script (Windows)

echo.
echo === Admin Frontend Setup Started ===
echo ==========================================
echo.

REM Check if we're in the project root directory
if not exist "frontend\admin" (
    echo [ERROR] frontend\admin directory not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

REM Change to admin frontend directory
cd frontend\admin

REM Check for required dependencies
echo [INFO] Checking dependencies...

REM --- Node.js Check ---
echo [INFO] Checking Node.js...
call node --version >nul 2>&1
if errorlevel 1 goto NodeError
echo [SUCCESS] Node.js is installed

REM --- npm Check ---
echo [INFO] Checking npm...
call npm --version >nul 2>&1
if errorlevel 1 goto NpmError
echo [SUCCESS] npm is installed

REM --- package.json Check ---
if not exist "package.json" (
    echo [ERROR] package.json not found in frontend\admin directory
    pause
    exit /b 1
)

REM --- Install dependencies ---
echo [INFO] Installing Node.js dependencies...
call npm install
if errorlevel 1 goto NpmInstallError
echo [SUCCESS] Node.js dependencies installed successfully

REM --- Create environment file ---
if not exist ".env" (
    echo [INFO] Creating .env file...
    (
        echo # React App Environment Variables
        echo REACT_APP_API_URL=http://localhost:8000/api
        echo REACT_APP_APP_NAME=Hair Skin Health - Admin Portal
        echo REACT_APP_VERSION=1.0.0
    ) > .env
    echo [SUCCESS] .env file created
) else (
    echo [INFO] .env file already exists, skipping
)

REM --- Check backend ---
echo [INFO] Checking if backend is running...
curl -s http://localhost:8000/api/me >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Backend is not running or not accessible at http://localhost:8000
    echo Please start the backend first by running: setup-backend.bat
    echo The frontend will still start but API calls may fail.
) else (
    echo [SUCCESS] Backend is running and accessible
)

REM --- Build test ---
echo [INFO] Building application for production check...
call npm run build
if errorlevel 1 goto BuildError
echo [SUCCESS] Application builds successfully

REM --- Completion ---
echo.
echo ==========================================
echo [SUCCESS] Admin frontend setup completed successfully!
echo ==========================================
echo.
echo [INFO] Application will be available at: http://localhost:3003
echo [INFO] Make sure the backend is running at: http://localhost:8000
echo.
echo [INFO] Default test credentials:
echo   Email: admin@hairskinhealth.com
echo   Password: password
echo.
echo Press Ctrl+C to stop the development server
echo.

REM --- Start React dev server ---
set PORT=3003
call npm start
goto End

:NodeError
echo [ERROR] Node.js is not installed. Please install Node.js 18 or higher from https://nodejs.org/
pause
exit /b 1

:NpmError
echo [ERROR] npm is not installed. Please install Node.js (which includes npm).
pause
exit /b 1

:NpmInstallError
echo [ERROR] Failed to install Node.js dependencies
pause
exit /b 1

:BuildError
echo [ERROR] Application build failed
pause
exit /b 1

:End