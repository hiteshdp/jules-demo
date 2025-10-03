# Hair Loss Diagnosis & Treatment Platform

A comprehensive full-stack platform for hair loss diagnosis and treatment, built with Laravel 11 backend and React.js 19 frontend.

## Features

### Patient Portal
- User registration and authentication
- Comprehensive hair loss quiz with multiple question types
- Personalized recommendations based on quiz responses
- Appointment booking with dermatologists
- Product catalog with categories and filtering
- Profile management with medical history
- Real-time chat with dermatologists

### Dermatologist Portal
- Professional dashboard
- Patient appointment management
- Chat functionality with patients
- Patient history and quiz response viewing
- Prescription and notes management
- Payment history tracking

### Admin Panel
- User management (patients and dermatologists)
- Appointment oversight
- Product catalog management
- Payment and subscription management
- Analytics dashboard
- System settings configuration

## Technology Stack

### Backend
- **Laravel 11** - PHP framework
- **MySQL** - Database
- **Laravel Sanctum** - API authentication
- **Razorpay** - Payment gateway integration
- **Zoom SDK** - Video consultation integration

### Frontend
- **React 19** - Frontend framework
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **React Router v6** - Routing
- **Headless UI** - Accessible components

## Installation

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hair_skin_health
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Environment configuration**
   ```bash
   cp env.example .env
   php artisan key:generate
   ```

4. **Database setup**
   ```bash
   # Update .env with your database credentials
   php artisan migrate
   php artisan db:seed
   ```

5. **Start the server**
   ```bash
   php artisan serve
   ```

### Frontend Setup

1. **Navigate to patient app**
   ```bash
   cd frontend/patient
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

3. **Access the application**
   - Patient Portal: http://localhost:3000
   - API: http://localhost:8000

## Environment Variables

### Backend (.env)
```env
APP_NAME="Hair Skin Health"
APP_ENV=local
APP_KEY=your-app-key
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hair_skin_health
DB_USERNAME=root
DB_PASSWORD=your-password

# Razorpay Configuration
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Zoom SDK Configuration
ZOOM_API_KEY=your-zoom-api-key
ZOOM_API_SECRET=your-zoom-api-secret

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Frontend URLs
FRONTEND_PATIENT_URL=http://localhost:3000
FRONTEND_DERMATOLOGIST_URL=http://localhost:3001
FRONTEND_ADMIN_URL=http://localhost:3002
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000/api
```

## Database Schema

### Core Tables
- `users` - User accounts with role-based access
- `patient_profiles` - Patient medical history and lifestyle
- `dermatologists` - Dermatologist credentials and availability
- `hair_loss_quiz_questions` - Quiz questions and options
- `hair_loss_quiz_responses` - User quiz responses
- `products` - Product catalog
- `subscriptions` - User subscription plans
- `appointments` - Consultation appointments
- `payments` - Payment records
- `notifications` - Email notifications
- `admin_settings` - System configuration

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/me` - Get current user

### Patient Routes
- `GET /api/patient/profile` - Get patient profile
- `PUT /api/patient/profile` - Update patient profile
- `GET /api/patient/quiz/questions` - Get quiz questions
- `POST /api/patient/quiz/submit` - Submit quiz responses
- `GET /api/patient/recommendations` - Get recommendations
- `GET /api/patient/dermatologists` - Get available dermatologists
- `POST /api/patient/appointments` - Book appointment
- `GET /api/patient/appointments` - Get patient appointments
- `GET /api/patient/products` - Get products catalog

### Dermatologist Routes
- `GET /api/dermatologist/profile` - Get dermatologist profile
- `PUT /api/dermatologist/profile` - Update dermatologist profile
- `GET /api/dermatologist/appointments` - Get assigned appointments
- `GET /api/dermatologist/appointments/{id}` - Get appointment details
- `PUT /api/dermatologist/appointments/{id}/status` - Update appointment status
- `POST /api/dermatologist/appointments/{id}/messages` - Send chat message
- `GET /api/dermatologist/appointments/{id}/messages` - Get chat messages

### Admin Routes
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/patients` - Get all patients
- `GET /api/admin/dermatologists` - Get all dermatologists
- `POST /api/admin/dermatologists` - Create dermatologist
- `GET /api/admin/appointments` - Get all appointments
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{id}` - Update product
- `GET /api/admin/settings` - Get system settings
- `PUT /api/admin/settings` - Update system settings

## Development

### Running Tests
```bash
# Backend tests
php artisan test

# Frontend tests
cd frontend/patient
npm test
```

### Code Style
```bash
# Backend
./vendor/bin/pint

# Frontend
npm run lint
```

## Deployment

### Backend Deployment
1. Set up production environment variables
2. Run database migrations
3. Configure web server (Nginx/Apache)
4. Set up SSL certificates
5. Configure queue workers for background jobs

### Frontend Deployment
1. Build production assets
   ```bash
   npm run build
   ```
2. Deploy to CDN or static hosting
3. Configure environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
