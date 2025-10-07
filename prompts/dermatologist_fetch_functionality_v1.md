## User Prompt: I have checked laravel side and there is no route for appointment/fetchDermatologists. I want whole functionality for that. Do the need full for laravel api and react patient

## AI Response:
Implemented complete dermatologist fetch functionality for both Laravel API and React patient frontend:

**Laravel API:**
- Added `/api/patient/dermatologists` route in `routes/api.php`
- Used existing `getDermatologists()` method in `PatientController` that fetches available dermatologists with user data
- Route is protected by `auth:sanctum` middleware

**React Patient Frontend:**
- Created `dermatologistAPI.ts` with TypeScript interfaces and API calls
- Created `dermatologistSlice.ts` Redux slice for state management
- Added dermatologist reducer to store configuration
- Created `Dermatologists.tsx` page component with:
  - Grid layout showing dermatologist cards
  - Doctor info, specialization, experience, fees
  - Availability status and working hours
  - Professional bio display
  - Book consultation buttons (disabled when unavailable)
- Added "Dermatologists" navigation link to patient sidebar
- Added route `/dermatologists` to patient app routing

**Features:**
- Fetches only available dermatologists (`is_available = true`)
- Shows real-time availability status
- Displays consultation fees, working hours, experience
- Responsive grid layout
- Loading states and error handling
- Professional UI with Heroicons

The functionality is now complete and ready for use.
