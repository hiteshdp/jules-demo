#!/bin/bash

# Hair Loss Diagnosis & Treatment Platform - Complete Setup Script
# Sets up: Backend, Patient Frontend, Dermatologist Frontend, Admin Frontend

set -e

echo "🚀 Starting Complete Platform Setup"
echo "==================================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

print_status()  { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error()   { echo -e "${RED}[ERROR]${NC} $1"; }
print_header()  { echo -e "${PURPLE}[SETUP]${NC} $1"; }

# --- Root checks
if [ ! -f "composer.json" ]; then
    print_error "composer.json not found. Run from project root."
    exit 1
fi
if [ ! -d "frontend" ]; then
    print_error "frontend directory not found. Run from project root."
    exit 1
fi

# --- Dependencies
print_status "Checking system dependencies..."
command -v php      >/dev/null || { print_error "PHP not installed. Install PHP 8.2+"; exit 1; }
command -v composer >/dev/null || { print_error "Composer not installed. Install from https://getcomposer.org/"; exit 1; }
command -v node     >/dev/null || { print_error "Node.js not installed. Install Node.js 18+"; exit 1; }
command -v npm      >/dev/null || { print_error "npm not installed."; exit 1; }
print_success "All system dependencies found"

# --- Run module setup
run_setup() {
    local script=$1
    local module=$2
    if [ -f "$script" ]; then
        chmod +x "$script"
        print_status "Launching $module..."
        "./$script" &
    else
        print_error "Setup script $script not found"
    fi
}

# --- Wait for backend
wait_for_backend() {
    local url="http://localhost:8000/api/me"
    local attempt=1
    local max_attempts=30
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

# --- Cleanup on Ctrl+C
cleanup() {
    print_status "Stopping all background services..."
    jobs -p | xargs -r kill
    exit 0
}
trap cleanup SIGINT SIGTERM

# --- Setup flow
echo ""
print_header "Step 1/4: Setting up Laravel Backend"
run_setup "setup-backend.sh" "Backend"
wait_for_backend

echo ""
print_header "Step 2/4: Setting up Patient Frontend"
run_setup "setup-patient.sh" "Patient Frontend"

echo ""
print_header "Step 3/4: Setting up Dermatologist Frontend"
run_setup "setup-dermatologist.sh" "Dermatologist Frontend"

echo ""
print_header "Step 4/4: Setting up Admin Frontend"
run_setup "setup-admin.sh" "Admin Frontend"

sleep 10

# --- Final info
echo ""
echo "==================================================================="
print_success "All modules setup completed!"
echo "==================================================================="
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
print_status "All services are running in background."
print_status "Press Ctrl+C to stop all services."
echo ""
print_warning "Note: If any service fails, run its individual script:"
print_warning "  ./setup-backend.sh"
print_warning "  ./setup-patient.sh"
print_warning "  ./setup-dermatologist.sh"
print_warning "  ./setup-admin.sh"
echo ""

# Keep monitoring backend
while true; do
    sleep 30
    if ! curl -s http://localhost:8000/api/me >/dev/null 2>&1; then
        print_warning "Backend service appears to be down"
    fi
done
