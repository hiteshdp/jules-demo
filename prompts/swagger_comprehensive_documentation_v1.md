# User Prompt: 
for the backend , due to merge conflict i have discarded some code for swagger generation in api.docs can u add all the swagger for all apis

## AI Response: 
I've added comprehensive Swagger documentation for all APIs in your Laravel backend. Here's what I've implemented:

### 1. Updated Swagger Configuration
- Updated `config/l5-swagger.php` with proper API title, description, and version
- Configured Bearer token authentication scheme
- Set up proper security definitions

### 2. Created Comprehensive Schema Definitions
- Created `app/Http/Controllers/SwaggerSchemas.php` with all necessary data models:
  - User, Patient, Dermatologist schemas
  - Appointment, QuizQuestion, QuizResponse schemas
  - Request/Response schemas for all endpoints
  - Error handling schemas

### 3. Added Swagger Documentation to All Controllers

#### Authentication Endpoints (`AuthController.php`)
- ✅ POST `/login` - User login with JWT token
- ✅ POST `/register` - User registration
- ✅ POST `/logout` - User logout
- ✅ GET `/me` - Get authenticated user details

#### Patient Endpoints (`PatientController.php`)
- ✅ GET `/admin/patients` - List all patients (Admin)
- ✅ POST `/admin/patients` - Create new patient (Admin)
- ✅ GET `/admin/patients/{id}` - Get specific patient (Admin)
- ✅ PUT `/admin/patients/{id}` - Update patient (Admin)
- ✅ DELETE `/admin/patients/{id}` - Delete patient (Admin)
- ✅ GET `/patient/dermatologists` - Get available dermatologists

#### Dermatologist Endpoints (`DermatologistController.php`)
- ✅ GET `/admin/dermatologists` - List all dermatologists (Admin)
- ✅ POST `/admin/dermatologists` - Create new dermatologist (Admin)
- ✅ GET `/admin/dermatologists/{id}` - Get specific dermatologist (Admin)
- ✅ PUT `/admin/dermatologists/{id}` - Update dermatologist (Admin)
- ✅ DELETE `/admin/dermatologists/{id}` - Delete dermatologist (Admin)

#### Appointment Endpoints (`AppointmentController.php`)
- ✅ GET `/patient/appointments` - Get patient appointments
- ✅ GET `/patient/appointments/{id}` - Get specific appointment
- ✅ POST `/patient/appointments` - Create new appointment

#### Quiz Endpoints (`QuizController.php`)
- ✅ GET `/patient/quiz/questions` - Get quiz questions
- ✅ POST `/patient/quiz/submit` - Submit quiz responses
- ✅ GET `/patient/quiz/responses` - Get user's quiz responses

#### Dermatologist Authentication (`DermatologistAuthController.php`)
- ✅ GET `/dermatologist/me` - Get dermatologist details

#### Dermatologist Appointments (`DermatologistAppointmentController.php`)
- ✅ GET `/dermatologist/appointments` - Get dermatologist's appointments
- ✅ GET `/dermatologist/appointments/{id}` - Get specific appointment
- ✅ PUT `/dermatologist/appointments/{id}/status` - Update appointment status

### 4. Key Features Added
- **Comprehensive Request/Response Schemas**: All endpoints have detailed input/output documentation
- **Authentication Security**: Bearer token authentication properly configured
- **Error Handling**: Standardized error responses with proper HTTP status codes
- **Validation Documentation**: Request validation rules clearly documented
- **Data Models**: Complete schema definitions for all entities
- **Examples**: Realistic examples for all request/response fields

### 5. How to Access Swagger Documentation
1. Run your Laravel application
2. Navigate to: `http://localhost:8000/api/documentation`
3. The Swagger UI will display all your API endpoints with interactive documentation

### 6. Next Steps
To generate the Swagger documentation:
```bash
php artisan l5-swagger:generate
```

This will create the JSON/YAML documentation files that can be accessed via the Swagger UI interface.

All endpoints are now properly documented with:
- Request/response schemas
- Authentication requirements
- Parameter descriptions
- Example values
- Error responses
- HTTP status codes
