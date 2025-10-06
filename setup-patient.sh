#!/bin/bash

# Hair Loss Diagnosis & Treatment Platform - Patient Frontend Setup Script
# This script sets up the React 19 patient frontend application

set -e  # Exit on any critical error

echo "🚀 Setting up Hair Loss Diagnosis & Treatment Platform - Patient Frontend"
echo "========================================================================="

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

# --- Root check
if [ ! -d "frontend/patient" ]; then
    print_error "frontend/patient directory not found. Please run this script from the project root directory."
    exit 1
fi

# Change directory
cd frontend/patient

# --- Dependencies
print_status "Checking dependencies..."

# Node.js check
if ! command -v node &>/dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | sed 's/v//')
NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 18 ]; then
    print_error "Node.js version $NODE_VERSION is too old. Please install Node.js 18 or higher."
    exit 1
fi
print_success "Node.js $NODE_VERSION found"

# npm check
if ! command -v npm &>/dev/null; then
    print_error "npm is not installed. Please install Node.js (which includes npm)."
    exit 1
fi
NPM_VERSION=$(npm --version)
print_success "npm $NPM_VERSION found"

# package.json check
if [ ! -f "package.json" ]; then
    print_error "package.json not found in frontend/patient directory"
    exit 1
fi

# --- Install dependencies
print_status "Installing Node.js dependencies..."
if npm install; then
    print_success "Node.js dependencies installed successfully"
else
    print_error "Failed to install Node.js dependencies"
    exit 1
fi

# --- Environment file
if [ ! -f ".env" ]; then
    print_status "Creating .env file..."
    cat > .env << EOF
# React App Environment Variables
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_APP_NAME=Hair Skin Health - Patient Portal
REACT_APP_VERSION=1.0.0
EOF
    print_success ".env file created"
else
    print_status ".env file already exists, skipping"
fi

# --- Backend check
print_status "Checking if backend is running..."
if curl -s http://localhost:8001/api/me >/dev/null 2>&1; then
    print_success "Backend is running and accessible"
else
    print_warning "Backend is not running or not accessible at http://localhost:8000"
    print_warning "Please start the backend first by running: ./setup-backend.sh"
    print_warning "The frontend will still start but API calls may fail."
fi

# --- Build test
print_status "Building application for production check..."
if npm run build; then
    print_success "Application builds successfully"
else
    print_error "Application build failed"
    exit 1
fi

# --- Completion
echo ""
echo "========================================================================="
print_success "Patient frontend setup completed successfully!"
echo "========================================================================="
echo ""
print_status "Application will be available at: http://localhost:3000"
print_status "Make sure the backend is running at: http://localhost:8000"
echo ""
print_status "Default test credentials:"
echo "  Email: patient@hairskinhealth.com"
echo "  Password: password"
echo ""
print_warning "Press Ctrl+C to stop the development server"
echo ""

# --- Start React dev server
npm start
