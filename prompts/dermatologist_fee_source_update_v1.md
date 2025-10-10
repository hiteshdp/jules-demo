## User Prompt: dermatologist side price should be take from appointment table field shuold be dermatologist_fee from everywhere on appointment list details and export too

## AI Response: Implemented consistent use of `dermatologist_fee` across dermatologist UI and export

Changes made:

- Frontend (Dermatologist):
  - Updated `frontend/dermatologist/src/pages/AppointmentDetail.tsx` to display payout strictly from `appointment.dermatologist_fee`.
  - Updated `frontend/dermatologist/src/pages/Appointments.tsx` list to compute and display payout using `appointment.dermatologist_fee` only.

- Backend (Laravel):
  - Updated `app/Http/Controllers/Api/DermatologistAppointmentController.php` export (CSV/Excel) to use `dermatologist_fee` without fallback or percentage calculation.

Notes:
- This ensures dermatologist-facing price is always sourced from the `appointments.dermatologist_fee` column, including list, detail, and export flows.

