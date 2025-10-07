#!/bin/bash

# Hair Loss Diagnosis & Treatment Platform - Admin Frontend Setup Script
# This script sets up the React 19 admin frontend application

set -e  # Exit on any error

echo "🚀 Setting up Hair Loss Diagnosis & Treatment Platform - Admin Frontend"
echo "======================================================================="

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
if [ ! -d "frontend/admin" ]; then
    print_error "frontend/admin directory not found. Please run this script from the project root directory."
    exit 1
fi

# Change to admin frontend directory
cd frontend/admin

# Check for required dependencies
print_status "Checking dependencies..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | sed 's/v//')
NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d. -f1)
if [ "$NODE_MAJOR_VERSION" -lt 18 ]; then
    print_error "Node.js version $NODE_VERSION is too old. Please install Node.js 18 or higher."
    exit 1
fi

print_success "Node.js $NODE_VERSION found"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

NPM_VERSION=$(npm --version)
print_success "npm $NPM_VERSION found"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found in frontend/admin directory"
    exit 1
fi

# Install dependencies
print_status "Installing Node.js dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Node.js dependencies installed successfully"
else
    print_error "Failed to install Node.js dependencies"
    exit 1
fi

# Install Tailwind CSS plugins
print_status "Installing Tailwind CSS plugins..."
npm install @tailwindcss/forms @tailwindcss/typography --save-dev

if [ $? -eq 0 ]; then
    print_success "Tailwind CSS plugins installed successfully"
else
    print_error "Failed to install Tailwind CSS plugins"
    exit 1
fi

# Create Tailwind CSS configuration files
print_status "Creating Tailwind CSS configuration files..."

# Create tailwind.config.js
if [ ! -f "tailwind.config.js" ]; then
    cat > tailwind.config.js << 'EOF'
// Generated via prompt: prompts/admin_tailwind_config_v1.md

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
EOF
    print_success "tailwind.config.js created"
else
    print_warning "tailwind.config.js already exists, skipping creation"
fi

# Create postcss.config.js
if [ ! -f "postcss.config.js" ]; then
    cat > postcss.config.js << 'EOF'
// Generated via prompt: prompts/admin_tailwind_config_v1.md

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
    print_success "postcss.config.js created"
else
    print_warning "postcss.config.js already exists, skipping creation"
fi

# Update vite.config.ts to include PostCSS integration
print_status "Updating vite.config.ts for PostCSS integration..."
if grep -q "postcss" vite.config.ts; then
    print_warning "PostCSS configuration already exists in vite.config.ts"
else
    # Add PostCSS configuration to vite.config.ts
    sed -i '/plugins: \[react()\],/a\  css: {\n    postcss: '\''./postcss.config.js'\'',\n  },' vite.config.ts
    print_success "PostCSS configuration added to vite.config.ts"
fi

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file..."
    cat > .env << EOF
# Vite Environment Variables
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Hair Skin Health - Admin Panel
VITE_VERSION=1.0.0
EOF
    print_success ".env file created"
else
    print_warning ".env file already exists, skipping creation"
fi

# Check if backend is running
print_status "Checking if backend is running..."
if curl -s http://localhost:8000/api/me > /dev/null 2>&1; then
    print_success "Backend is running and accessible"
else
    print_warning "Backend is not running or not accessible at http://localhost:8000"
    print_warning "Please start the backend first by running: ./setup-backend.sh"
    print_warning "The frontend will still start but API calls may fail."
fi

# Build the application for production check
print_status "Building application for production check..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Application builds successfully"
else
    print_error "Application build failed"
    exit 1
fi

# Display setup completion
echo ""
echo "======================================================================="
print_success "Admin frontend setup completed successfully!"
echo "======================================================================="
echo ""
print_status "Application will be available at: http://localhost:3002"
print_status "Make sure the backend is running at: http://localhost:8000"
echo ""
print_status "Default test credentials:"
echo "  Email: admin@hairskinhealth.com"
echo "  Password: password"
echo ""
print_warning "Press Ctrl+C to stop the development server"
echo ""

# Start the React development server on port 3002
PORT=3002 npm start
