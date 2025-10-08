#!/bin/bash

# Hair Loss Diagnosis & Treatment Platform - Backend Setup Script
# Laravel backend setup with dependencies, migrations, seed, and server start

set -e  # Exit on any *critical* error

echo "🚀 Setting up Hair Loss Diagnosis & Treatment Platform - Backend"
echo "================================================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status()  { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error()   { echo -e "${RED}[ERROR]${NC} $1"; }
print_debug()   { echo -e "[DEBUG] $1"; }

# --- Root check
if [ ! -f "composer.json" ]; then
    print_error "composer.json not found. Please run this script from the project root directory."
    exit 1
fi

print_debug "Starting dependency checks..."

# --- PHP check
print_status "Checking PHP installation..."
if ! command -v php &>/dev/null; then
    print_error "PHP not installed. Please install PHP 8.2 or higher."
    exit 1
fi
PHP_VERSION=$(php -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;")
print_success "PHP $PHP_VERSION found"
print_debug "PHP check completed"

# --- Composer check
print_status "Checking Composer installation..."
if ! command -v composer &>/dev/null; then
    print_error "Composer not installed. Please install from https://getcomposer.org/"
    exit 1
fi
COMPOSER_VERSION=$(composer --version | grep -oP '\d+\.\d+\.\d+')
print_success "Composer $COMPOSER_VERSION found"
print_debug "Composer check completed"

# --- MySQL check
print_status "Checking MySQL/MariaDB client..."
if ! command -v mysql &>/dev/null; then
    print_warning "MySQL client not found. Please ensure MySQL/MariaDB is installed and running."
    print_warning "Continuing with setup..."
else
    MYSQL_VERSION=$(mysql --version)
    print_success "MySQL client found: $MYSQL_VERSION"
fi
print_debug "MySQL check completed"

# --- Laravel directories
print_status "Creating required Laravel directories..."
mkdir -p bootstrap/cache \
         storage/app \
         storage/framework/cache \
         storage/framework/sessions \
         storage/framework/views \
         storage/logs
print_success "Laravel directories created"


# --- .env file
if [ ! -f ".env" ]; then
    print_status "Creating .env file from .env.example..."
    cp .env.example .env
    print_success ".env file created"
else
    print_status ".env file already exists, skipping"
fi

# --- Composer install
print_status "Installing PHP dependencies with Composer..."
composer install --no-interaction --prefer-dist --optimize-autoloader
print_success "PHP dependencies installed successfully"
print_debug "Composer install completed"


# --- App key
print_status "Generating application key..."
if php artisan key:generate --force; then
    print_success "Application key generated"
else
    print_error "Failed to generate application key"
    exit 1
fi

# --- Migrations
print_status "Running database migrations..."
if php artisan migrate --force; then
    print_success "Database migrations completed"
else
    print_error "Failed to run migrations"
    exit 1
fi

# --- Seed
print_status "Seeding database..."
if php artisan db:seed --force; then
    print_success "Database seeded successfully"
else
    print_warning "Database seeding failed (non-critical)"
fi

# --- Storage link
print_status "Creating storage link..."
php artisan storage:link --force || true

# --- Optimize
print_status "Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
print_success "Application optimized"

# --- Completion
echo ""
echo "================================================================"
print_success "Backend setup completed successfully!"
echo "================================================================"
echo ""
print_status "Backend available at: http://localhost:8000"
print_status "API endpoints at: http://localhost:8000/api"
echo ""
print_warning "Press Ctrl+C to stop the server"
echo ""

# Start Laravel server
php artisan serve --host=0.0.0.0 --port=8000
