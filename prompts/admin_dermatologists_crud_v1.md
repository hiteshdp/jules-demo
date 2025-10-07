# Admin Dermatologists CRUD Module

## User Prompt
In the Admin Panel → Dermatologists section, implement a complete CRUD (Create, Read, Update, Delete) module for managing dermatologists.

## AI Response
Implemented a complete CRUD module for managing dermatologists following the same patterns as the Patients module.

### Backend Implementation:

#### 1. DermatologistController
**File**: `app/Http/Controllers/Api/DermatologistController.php`
- **index()**: List dermatologists with pagination and search
- **store()**: Create new dermatologist with password hashing
- **show()**: Get single dermatologist by ID
- **update()**: Update dermatologist with optional password update
- **destroy()**: Delete dermatologist
- **Validation**: Email uniqueness, required fields, password min 6 chars
- **Security**: Password hashing with Hash::make()

#### 2. API Routes
**File**: `routes/api.php`
- Added `Route::apiResource('dermatologists', DermatologistController::class)` under admin prefix
- Imported `DermatologistController`

#### 3. Swagger Documentation
**File**: `app/Http/Controllers/Controller.php`
- **Dermatologist**: Schema for dermatologist data
- **DermatologistCreateRequest**: Required fields including password
- **DermatologistUpdateRequest**: Optional fields including password

### Frontend Implementation:

#### 1. API Service
**File**: `frontend/admin/src/store/api/dermatologistAPI.ts`
- Axios client with token interceptor
- Methods: getDermatologists, getDermatologist, createDermatologist, updateDermatologist, deleteDermatologist
- Error handling with 401 redirect

#### 2. Redux State Management
**File**: `frontend/admin/src/store/slices/dermatologistSlice.ts`
- **Dermatologist interface**: TypeScript types
- **Async thunks**: fetchDermatologists, createDermatologist, updateDermatologist, deleteDermatologist
- **State management**: Loading, error, pagination states
- **Reducers**: Handle all CRUD operations

#### 3. Modal Component
**File**: `frontend/admin/src/components/DermatologistModal.tsx`
- **Form fields**: Name, Email, Phone, Password, DOB, Gender
- **Validation**: Required fields, password min 6 chars
- **Password handling**: Required on create, optional on edit
- **UI**: Consistent with PatientModal styling

#### 4. Main Page Component
**File**: `frontend/admin/src/pages/Dermatologists.tsx`
- **Table view**: Display dermatologists with all required fields
- **Search functionality**: Filter by name and email
- **CRUD operations**: Create, Edit, Delete buttons
- **Modal integration**: Open modal for create/edit
- **Toast notifications**: Success/error messages
- **Loading states**: Spinner during operations

### Key Features:
- **Password Security**: Hashed passwords, optional updates
- **Email Uniqueness**: Validation on create and update
- **Search & Pagination**: Full search and pagination support
- **Type Safety**: Complete TypeScript support
- **Error Handling**: Comprehensive error handling
- **UI Consistency**: Matches existing admin theme
- **Responsive Design**: Works on all screen sizes

### API Endpoints:
- `GET /api/admin/dermatologists` - List dermatologists
- `POST /api/admin/dermatologists` - Create dermatologist
- `GET /api/admin/dermatologists/{id}` - Get dermatologist
- `PUT /api/admin/dermatologists/{id}` - Update dermatologist
- `DELETE /api/admin/dermatologists/{id}` - Delete dermatologist

### Result:
- Complete CRUD functionality for dermatologists
- Consistent with Patients module patterns
- Full validation and error handling
- Professional UI/UX
- Type-safe implementation
