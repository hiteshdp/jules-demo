@echo off
REM Hair Loss Diagnosis and Treatment Platform - Backend Setup Script (Windows)

echo.
echo === Backend Setup Started ===
echo ================================
echo.

REM Check if we're in the project root directory
if not exist "composer.json" (
    echo [ERROR] composer.json not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

echo [DEBUG] Starting dependency checks...
echo.

REM --- PHP CHECK ---
echo [INFO] Checking PHP installation...
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] PHP is not installed. Please install PHP 8.2 or higher.
    pause
    exit /b 1
) else (
    echo [SUCCESS] PHP found and working
)
echo [DEBUG] PHP check completed, errorlevel=%errorlevel%

REM --- COMPOSER CHECK ---
echo [INFO] Checking Composer installation...
call composer.bat --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Composer is not installed or not accessible. Please install from https://getcomposer.org/
    pause
    exit /b 1
) else (
    echo [SUCCESS] Composer found and working
)
echo [DEBUG] Composer check completed, errorlevel=%errorlevel%

REM --- MYSQL CHECK ---
echo [INFO] Checking MySQL/MariaDB client...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] MySQL client not found. Please ensure MySQL/MariaDB is installed and running.
    echo Continuing with setup...
) else (
    echo [SUCCESS] MySQL client found
)
echo [DEBUG] MySQL check completed, errorlevel=%errorlevel%

REM --- CREATE LARAVEL DIRECTORIES ---
echo [INFO] Creating required Laravel directories...
if not exist "bootstrap" mkdir bootstrap
if not exist "bootstrap\cache" mkdir bootstrap\cache
if not exist "storage" mkdir storage
if not exist "storage\app" mkdir storage\app
if not exist "storage\framework" mkdir storage\framework
if not exist "storage\framework\cache" mkdir storage\framework\cache
if not exist "storage\framework\sessions" mkdir storage\framework\sessions
if not exist "storage\framework\views" mkdir storage\framework\views
if not exist "storage\logs" mkdir storage\logs
echo [SUCCESS] Laravel directories created

REM --- INSTALL DEPENDENCIES ---
echo [INFO] Installing PHP dependencies with Composer...
call composer.bat install --no-interaction --prefer-dist --optimize-autoloader
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install PHP dependencies
    pause
    exit /b 1
) else (
    echo [SUCCESS] PHP dependencies installed successfully
)
echo [DEBUG] Composer install completed, errorlevel=%errorlevel%

REM --- ENV FILE ---
if not exist ".env" (
    echo [INFO] Creating .env file from .env.example...
    copy .env.example .env >nul
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to copy .env.example to .env
        pause
        exit /b 1
    ) else (
        echo [SUCCESS] .env file created
    )
) else (
    echo [INFO] .env file already exists, skipping
)

REM --- APP KEY ---
echo [INFO] Generating application key...
php artisan key:generate --force
if %errorlevel% neq 0 (
    echo [ERROR] Failed to generate application key
    pause
    exit /b 1
) else (
    echo [SUCCESS] Application key generated
)

REM --- DATABASE MIGRATIONS ---
echo [INFO] Running database migrations...
php artisan migrate --force
if %errorlevel% neq 0 (
    echo [ERROR] Failed to run migrations
    pause
    exit /b 1
) else (
    echo [SUCCESS] Database migrations completed
)

REM --- SEED DATABASE ---
echo [INFO] Seeding database...
php artisan db:seed --force
if %errorlevel% neq 0 (
    echo [WARNING] Database seeding failed
) else (
    echo [SUCCESS] Database seeded successfully
)

REM --- STORAGE LINK ---
echo [INFO] Creating storage link...
php artisan storage:link --force

REM --- OPTIMIZE ---
echo [INFO] Optimizing application...
php artisan config:cache
php artisan route:cache
php artisan view:cache
echo [SUCCESS] Application optimized

REM --- COMPLETION ---
echo.
echo ================================
echo [SUCCESS] Backend setup completed successfully!
echo ================================
echo.
echo Backend available at: http://localhost:8000
echo API endpoints at: http://localhost:8000/api
echo Press Ctrl+C to stop the server
echo.

php artisan serve --host=0.0.0.0 --port=8000
