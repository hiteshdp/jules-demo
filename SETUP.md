# 🚀 Hair Loss Diagnosis & Treatment Platform - Setup Guide

This guide provides comprehensive setup instructions for the Hair Loss Diagnosis & Treatment Platform, including automated setup scripts for both Unix/Linux/macOS and Windows systems.

## 📋 Prerequisites

### System Requirements
- **PHP**: 8.2 or higher
- **Composer**: Latest version
- **Node.js**: 18 or higher
- **npm**: Latest version
- **MySQL/MariaDB**: 8.0 or higher
- **Git**: For cloning the repository

### Platform-Specific Requirements

#### Windows
- Windows 10/11
- PowerShell or Command Prompt
- Git for Windows
- MySQL Workbench (optional, for database management)

#### Unix/Linux/macOS
- Bash shell
- curl (for API testing)
- lsof (for port checking)

## 🛠️ Quick Setup (Automated)

### Option 1: Complete Setup (Recommended)

#### For Unix/Linux/macOS:
```bash
# Make scripts executable
chmod +x setup-*.sh

# Run complete setup
./setup-all.sh
```

#### For Windows:
```cmd
# Run complete setup
setup-all.bat
```

### Option 2: Individual Module Setup

#### Backend Setup
```bash
# Unix/Linux/macOS
./setup-backend.sh

# Windows
setup-backend.bat
```

#### Patient Frontend Setup
```bash
# Unix/Linux/macOS
./setup-patient.sh

# Windows
setup-patient.bat
```

#### Dermatologist Frontend Setup
```bash
# Unix/Linux/macOS
./setup-dermatologist.sh

# Windows
setup-dermatologist.bat
```

#### Admin Frontend Setup
```bash
# Unix/Linux/macOS
./setup-admin.sh

# Windows
setup-admin.bat
```

## 🔧 Manual Setup (Step-by-Step)

### 1. Backend Setup (Laravel 11)

#### Install Dependencies
```bash
# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

#### Database Configuration
1. Create a MySQL database named `hair_skin_health`
2. Update `.env` file with your database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hair_skin_health
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

#### Run Migrations and Seeders
```bash
# Run database migrations
php artisan migrate

# Seed the database with sample data
php artisan db:seed

# Create storage link
php artisan storage:link

# Optimize application
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### Start Backend Server
```bash
php artisan serve --host=0.0.0.0 --port=8000
```

### 2. Patient Frontend Setup (React 19)

```bash
# Navigate to patient frontend
cd frontend/patient

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_APP_NAME=Hair Skin Health - Patient Portal
REACT_APP_VERSION=1.0.0
EOF

# Start development server
npm start
```

### 3. Dermatologist Frontend Setup (React 19)

```bash
# Navigate to dermatologist frontend
cd frontend/dermatologist

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_APP_NAME=Hair Skin Health - Dermatologist Portal
REACT_APP_VERSION=1.0.0
EOF

# Start development server on port 3001
PORT=3001 npm start
```

### 4. Admin Frontend Setup (React 19)

```bash
# Navigate to admin frontend
cd frontend/admin

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_APP_NAME=Hair Skin Health - Admin Panel
REACT_APP_VERSION=1.0.0
EOF

# Start development server on port 3002
PORT=3002 npm start
```

## 🌐 Access URLs

After successful setup, the platform will be available at:

- **Backend API**: http://localhost:8000
- **Patient Portal**: http://localhost:3000
- **Dermatologist Portal**: http://localhost:3001
- **Admin Panel**: http://localhost:3002

## 🔐 Default Test Credentials

### Admin Account
- **Email**: admin@hairskinhealth.com
- **Password**: password
- **Access**: Full platform management

### Dermatologist Account
- **Email**: dermatologist@hairskinhealth.com
- **Password**: password
- **Access**: Patient consultations and appointments

### Patient Account
- **Email**: patient@hairskinhealth.com
- **Password**: password
- **Access**: Hair loss assessment and consultations

## 📁 Project Structure

```
hair_skin_health/
├── app/                          # Laravel backend
│   ├── Http/Controllers/Api/     # API controllers
│   ├── Models/                   # Eloquent models
│   └── ...
├── frontend/
│   ├── patient/                  # Patient React app
│   ├── dermatologist/            # Dermatologist React app
│   └── admin/                    # Admin React app
├── database/
│   ├── migrations/               # Database migrations
│   └── seeders/                  # Database seeders
├── setup-*.sh                    # Unix/Linux/macOS setup scripts
├── setup-*.bat                   # Windows setup scripts
└── README.md                     # Project documentation
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hair_skin_health
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Application
APP_NAME="Hair Skin Health"
APP_ENV=local
APP_KEY=base64:your_generated_key
APP_DEBUG=true
APP_URL=http://localhost:8000

# Services
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
ZOOM_API_KEY=your_zoom_api_key
ZOOM_API_SECRET=your_zoom_api_secret
OPENAI_API_KEY=your_openai_api_key

# Mail
MAIL_MAILER=smtp
MAIL_HOST=your_smtp_host
MAIL_PORT=587
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_APP_NAME=Hair Skin Health
REACT_APP_VERSION=1.0.0
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
- Ensure MySQL/MariaDB is running
- Check database credentials in `.env`
- Create the database manually if it doesn't exist

#### 2. Port Already in Use
- Check if ports 3000, 3001, 3002, or 8000 are already in use
- Kill existing processes or change ports in the scripts

#### 3. Node.js Dependencies Failed
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

#### 4. Composer Dependencies Failed
- Update Composer: `composer self-update`
- Clear Composer cache: `composer clear-cache`
- Run `composer install` again

### Platform-Specific Issues

#### Windows
- Ensure you're running Command Prompt or PowerShell as Administrator
- Install Visual C++ Redistributable if you encounter build errors
- Use Windows Subsystem for Linux (WSL) for better compatibility

#### macOS
- Install Xcode Command Line Tools: `xcode-select --install`
- Use Homebrew for package management: `brew install php composer node mysql`

#### Linux
- Install required packages:
  ```bash
  # Ubuntu/Debian
  sudo apt-get update
  sudo apt-get install php8.2-cli composer nodejs npm mysql-server curl
  
  # CentOS/RHEL
  sudo yum install php-cli composer nodejs npm mysql-server curl
  ```

## 🚀 Production Deployment

### Backend Deployment
1. Set `APP_ENV=production` in `.env`
2. Run `php artisan config:cache`
3. Set up web server (Apache/Nginx)
4. Configure SSL certificates
5. Set up database backups

### Frontend Deployment
1. Build production bundles: `npm run build`
2. Deploy `build/` folder to web server
3. Configure reverse proxy for API calls
4. Set up CDN for static assets

## 📞 Support

If you encounter any issues during setup:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check the logs in the terminal output
4. Ensure all ports are available
5. Verify database connectivity

## 🎯 Next Steps

After successful setup:

1. **Test the Platform**: Use the default credentials to log in to each portal
2. **Configure Services**: Set up Razorpay, Zoom, and OpenAI API keys
3. **Customize**: Modify the UI and add your branding
4. **Deploy**: Follow the production deployment guide
5. **Monitor**: Set up logging and monitoring for production use

---

**Happy Coding! 🎉**

The Hair Loss Diagnosis & Treatment Platform is now ready for development and testing.
