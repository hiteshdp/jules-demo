#!/bin/bash

# Hair Loss Diagnosis & Treatment Platform - Complete Setup Script
# Sets up: Backend, Patient Frontend, Dermatologist Frontend, Admin Frontend

set -e  # Exit on any error

echo "🚀 Setting up Hair Loss Diagnosis & Treatment Platform - Complete Setup"
echo "======================================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Helpers
print_status()   { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success()  { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning()  { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error()    { echo -e "${RED}[ERROR]${NC} $1"; }
print_header()   { echo -e "${PURPLE}[SETUP]${NC} $1"; }

# Validate root
if [ ! -f "composer.json" ] || [ ! -d "frontend" ]; then
    print_error "Project structure not found. Run this script from the project root directory."
    print_error "Expected structure:"
    print_error "  - composer.json"
    print_error "  - frontend/patient/"
    print_error "  - frontend/dermatologist/"
    print_error "  - frontend/admin/"
    exit 1
fi

# Dependencies
print_status "Checking system dependencies..."
command -v php      >/dev/null || { print_error "PHP not installed. Install PHP 8.2+"; exit 1; }
command -v composer >/dev/null || { print_error "Composer not installed. Install from https://getcomposer.org/"; exit 1; }
command -v node     >/dev/null || { print_error "Node.js not installed. Install Node.js 18+"; exit 1; }
command -v npm      >/dev/null || { print_error "npm not installed."; exit 1; }
print_success "All system dependencies found"

# Functions
run_setup() {
    local script_name=$1
    local module_name=$2

    print_header "Setting up $module_name..."
    if [ -f "$script_name" ]; then
        chmod +x "$script_name"
        ./"$script_name" &
        PID=$!
        print_success "$module_name setup started (PID: $PID)"
    else
        print_error "Script $script_name not found"
        return 1
    fi
}

wait_for_backend() {
    local url=$1
    local max_attempts=60
    local attempt=1

    print_status "Waiting for Backend to be ready..."
    until curl -s "$url" >/dev/null 2>&1; do
        if [ $attempt -ge $max_attempts ]; then
            print_warning "Backend may not be ready yet. Please check manually."
            return 1
        fi
        echo "[INFO] Backend not ready yet, waiting... ($attempt/$max_attempts)"
        sleep 5
        attempt=$((attempt + 1))
    done
    print_success "Backend is ready!"
}

cleanup() {
    print_status "Cleaning up background processes..."
    jobs -p | xargs -r kill
    exit 0
}
trap cleanup SIGINT SIGTERM

echo ""
print_header "Starting complete platform setup..."
echo ""

# Step 1: Backend
print_header "Step 1/4: Laravel Backend"
run_setup "setup-backend.sh" "Backend"
wait_for_backend "http://localhost:8000/api/me"

# Step 2: Patient
print_header "Step 2/4: Patient Frontend"
run_setup "setup-patient.sh" "Patient Frontend"

# Step 3: Dermatologist
print_header "Step 3/4: Dermatologist Frontend"
run_setup "setup-dermatologist.sh" "Dermatologist Frontend"

# Step 4: Admin
print_header "Step 4/4: Admin Frontend"
run_setup "setup-admin.sh" "Admin Frontend"

sleep 5

echo ""
echo "======================================================================="
print_success "All modules setup completed!"
echo "======================================================================="
echo ""
print_status "Platform URLs:"
echo "  🌐 Backend API:          http://localhost:8000"
echo "  👤 Patient Portal:       http://localhost:3000"
echo "  👨‍⚕️ Dermatologist Portal: http://localhost:3001"
echo "  ⚙️  Admin Panel:          http://localhost:3002"
echo ""
print_status "Default Test Credentials:"
echo "  Patient:        patient@hairskinhealth.com / password"
echo "  Dermatologist:  dermatologist@hairskinhealth.com / password"
echo "  Admin:          admin@hairskinhealth.com / password"
echo ""
print_status "All services are running in the background."
print_status "To stop all services, press Ctrl+C."
echo ""
print_warning "Note: If any service fails to start, you can run individual setup scripts:"
print_warning "  ./setup-backend.sh"
print_warning "  ./setup-patient.sh"
print_warning "  ./setup-dermatologist.sh"
print_warning "  ./setup-admin.sh"
echo ""

# Keep alive monitor
while true; do
    sleep 30
    if ! curl -s http://localhost:8000/api/me >/dev/null 2>&1; then
        print_warning "Backend service appears to be down."
    fi
done
