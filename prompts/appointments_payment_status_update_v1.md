## User Prompt: In admin module , appintment section , the payment status should be a dropdown with all payment status showable and admin can change the payment status and it should reflect in the database also

## AI Response:
Implemented backend and frontend changes to allow Admin to update appointment payment status:

- Backend (Laravel): Added `updateAppointmentPaymentStatus` in `App\Http\Controllers\Api\AdminController` with validation for statuses `pending, completed, failed, refunded, cancelled`. Updates or creates a related `Payment` record and syncs `appointments.is_paid`. Added route: `PUT /api/admin/appointments/{id}/payment-status`.
- Frontend (React Admin):
  - API: added `updatePaymentStatus(id, status)` in `frontend/admin/src/store/api/appointmentAPI.ts`.
  - Redux: added `updateAppointmentPaymentStatus` thunk with optimistic UI update in `appointmentSlice`.
  - UI: Replaced Payment Status tag with `Select` dropdown in `frontend/admin/src/pages/Appointments.tsx` allowing status changes; calls thunk on change.
- Lint: fixed minor TS issues and unused imports.

This enables Admins to view and change payment status per appointment and persist it to the database.

