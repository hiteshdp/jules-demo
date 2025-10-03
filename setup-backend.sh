#!/bin/bash

# Hair Loss Diagnosis & Treatment Platform - Backend Setup Script
# This script sets up the Laravel 11 backend with all dependencies and configurations

set -e  # Exit on any error

echo "🚀 Setting up Hair Loss Diagnosis & Treatment Platform - Backend"
echo "================================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the project root directory
if [ ! -f "composer.json" ]; then
    print_error "composer.json not found. Please run this script from the project root directory."
    exit 1
fi

# Check for required dependencies
print_status "Checking dependencies..."

# Check PHP
if ! command -v php &> /dev/null; then
    print_error "PHP is not installed. Please install PHP 8.2 or higher."
    exit 1
fi

PHP_VERSION=$(php -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;")
print_success "PHP $PHP_VERSION found"

# Check Composer
if ! command -v composer &> /dev/null; then
    print_error "Composer is not installed. Please install Composer from https://getcomposer.org/"
    exit 1
fi

COMPOSER_VERSION=$(composer --version | grep -oP '\d+\.\d+\.\d+')
print_success "Composer $COMPOSER_VERSION found"

# Check MySQL/MariaDB
if ! command -v mysql &> /dev/null; then
    print_warning "MySQL client not found. Please ensure MySQL/MariaDB is installed and running."
    print_warning "You can install MySQL with: sudo apt-get install mysql-client (Ubuntu/Debian)"
    print_warning "Or: brew install mysql (macOS)"
fi

# Install PHP dependencies
print_status "Installing PHP dependencies with Composer..."
composer install --no-interaction --prefer-dist --optimize-autoloader

if [ $? -eq 0 ]; then
    print_success "PHP dependencies installed successfully"
else
    print_error "Failed to install PHP dependencies"
    exit 1
fi

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file from .env.example..."
    cp env.example .env
    print_success ".env file created"
else
    print_warning ".env file already exists, skipping creation"
fi

# Generate application key
print_status "Generating application key..."
php artisan key:generate --force

if [ $? -eq 0 ]; then
    print_success "Application key generated"
else
    print_error "Failed to generate application key"
    exit 1
fi

# Check database connection
print_status "Testing database connection..."
php artisan migrate:status &> /dev/null

if [ $? -eq 0 ]; then
    print_success "Database connection successful"
else
    print_warning "Database connection failed. Please check your .env file database settings:"
    print_warning "DB_CONNECTION=mysql"
    print_warning "DB_HOST=127.0.0.1"
    print_warning "DB_PORT=3306"
    print_warning "DB_DATABASE=hair_skin_health"
    print_warning "DB_USERNAME=your_username"
    print_warning "DB_PASSWORD=your_password"
    print_warning ""
    print_warning "Make sure to create the database 'hair_skin_health' before running migrations."
    print_warning "You can create it with: mysql -u root -p -e 'CREATE DATABASE hair_skin_health;'"
    exit 1
fi

# Run database migrations
print_status "Running database migrations..."
php artisan migrate --force

if [ $? -eq 0 ]; then
    print_success "Database migrations completed"
else
    print_error "Failed to run database migrations"
    exit 1
fi

# Seed the database
print_status "Seeding database with sample data..."
php artisan db:seed --force

if [ $? -eq 0 ]; then
    print_success "Database seeded successfully"
else
    print_error "Failed to seed database"
    exit 1
fi

# Create storage link
print_status "Creating storage link..."
php artisan storage:link --force

# Clear and cache configuration
print_status "Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

print_success "Application optimized"

# Display setup completion
echo ""
echo "================================================================"
print_success "Backend setup completed successfully!"
echo "================================================================"
echo ""
print_status "Default admin credentials:"
echo "  Email: admin@hairskinhealth.com"
echo "  Password: password"
echo ""
print_status "Default dermatologist credentials:"
echo "  Email: dermatologist@hairskinhealth.com"
echo "  Password: password"
echo ""
print_status "Default patient credentials:"
echo "  Email: patient@hairskinhealth.com"
echo "  Password: password"
echo ""
print_status "Starting Laravel development server..."
echo "Backend will be available at: http://localhost:8000"
echo "API endpoints will be available at: http://localhost:8000/api"
echo ""
print_warning "Press Ctrl+C to stop the server"
echo ""

# Start the Laravel development server
php artisan serve --host=0.0.0.0 --port=8000
