#!/bin/bash

# Hair Loss Diagnosis & Treatment Platform - Complete Setup Script
# This script sets up all modules: Backend, Patient Frontend, Dermatologist Frontend, and Admin Frontend

set -e  # Exit on any error

echo "🚀 Setting up Hair Loss Diagnosis & Treatment Platform - Complete Setup"
echo "======================================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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

print_header() {
    echo -e "${PURPLE}[SETUP]${NC} $1"
}

# Check if we're in the project root directory
if [ ! -f "composer.json" ] || [ ! -d "frontend" ]; then
    print_error "Project structure not found. Please run this script from the project root directory."
    print_error "Expected structure:"
    print_error "  - composer.json (Laravel backend)"
    print_error "  - frontend/patient/ (Patient React app)"
    print_error "  - frontend/dermatologist/ (Dermatologist React app)"
    print_error "  - frontend/admin/ (Admin React app)"
    exit 1
fi

# Check for required dependencies
print_status "Checking system dependencies..."

# Check PHP
if ! command -v php &> /dev/null; then
    print_error "PHP is not installed. Please install PHP 8.2 or higher."
    exit 1
fi

# Check Composer
if ! command -v composer &> /dev/null; then
    print_error "Composer is not installed. Please install Composer from https://getcomposer.org/"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher from https://nodejs.org/"
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

print_success "All system dependencies found"

# Function to run setup script
run_setup() {
    local script_name=$1
    local module_name=$2
    local port=$3
    
    print_header "Setting up $module_name..."
    
    if [ -f "$script_name" ]; then
        chmod +x "$script_name"
        if [ "$module_name" = "Backend" ]; then
            # Run backend setup in background
            ./"$script_name" &
            BACKEND_PID=$!
            print_success "$module_name setup started (PID: $BACKEND_PID)"
            sleep 10  # Give backend time to start
        else
            # Run frontend setups in background
            ./"$script_name" &
            print_success "$module_name setup started"
        fi
    else
        print_error "Setup script $script_name not found"
        return 1
    fi
}

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to wait for a service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            print_success "$service_name is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_warning "$service_name may not be ready yet. You can check manually later."
    return 1
}

# Create a function to handle cleanup on exit
cleanup() {
    print_status "Cleaning up background processes..."
    jobs -p | xargs -r kill
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo ""
print_header "Starting complete platform setup..."
echo ""

# Step 1: Setup Backend
print_header "Step 1/4: Setting up Laravel Backend"
run_setup "setup-backend.sh" "Backend" "8000"

# Wait for backend to be ready
wait_for_service "http://localhost:8000/api/me" "Backend API"

echo ""
print_header "Step 2/4: Setting up Patient Frontend"
run_setup "setup-patient.sh" "Patient Frontend" "3000"

echo ""
print_header "Step 3/4: Setting up Dermatologist Frontend"
run_setup "setup-dermatologist.sh" "Dermatologist Frontend" "3001"

echo ""
print_header "Step 4/4: Setting up Admin Frontend"
run_setup "setup-admin.sh" "Admin Frontend" "3002"

# Wait a moment for all services to start
sleep 5

echo ""
echo "======================================================================="
print_success "All modules setup completed!"
echo "======================================================================="
echo ""
print_status "Platform URLs:"
echo "  🌐 Backend API:        http://localhost:8000"
echo "  👤 Patient Portal:     http://localhost:3000"
echo "  👨‍⚕️ Dermatologist Portal: http://localhost:3001"
echo "  ⚙️  Admin Panel:        http://localhost:3002"
echo ""
print_status "Default Test Credentials:"
echo ""
echo "  👤 Patient:"
echo "    Email:    patient@hairskinhealth.com"
echo "    Password: password"
echo ""
echo "  👨‍⚕️ Dermatologist:"
echo "    Email:    dermatologist@hairskinhealth.com"
echo "    Password: password"
echo ""
echo "  ⚙️  Admin:"
echo "    Email:    admin@hairskinhealth.com"
echo "    Password: password"
echo ""
print_status "All services are running in the background."
print_status "To stop all services, press Ctrl+C"
echo ""
print_warning "Note: If any service fails to start, you can run individual setup scripts:"
print_warning "  ./setup-backend.sh"
print_warning "  ./setup-patient.sh"
print_warning "  ./setup-dermatologist.sh"
print_warning "  ./setup-admin.sh"
echo ""

# Keep the script running and show status
while true; do
    echo -n "."
    sleep 10
    
    # Check if any critical service is down
    if ! check_port 8000; then
        print_warning "Backend service appears to be down"
    fi
done
