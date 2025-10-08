# Appointment Chat Feature

## User Prompt
In appointments listing screen give chat option where patient can chat with the dermatologist. Do the needful for frontend and backend api as well.

## AI Response

### Backend
- Added `AppointmentChatController` with two endpoints:
  - `GET /api/patient/appointments/{id}/chat` → list messages for patient's appointment
  - `POST /api/patient/appointments/{id}/chat` → send a message
- Enforced ownership: appointment must belong to authenticated patient.
- Validated payload and returned messages with `sender` relation.
- Updated `routes/api.php` to register chat routes.

### Frontend
- Added `chatAPI` with `getMessages` and `sendMessage` methods.
- Created `chatSlice` with thunks `fetchChatMessages` and `sendChatMessage` and state per appointment id.
- Updated `store` to include `chat` reducer.
- Enhanced `Appointments.tsx`:
  - Added Chat button for each appointment
  - Implemented chat modal with input and send action
  - Hooked up to Redux thunks for fetching and sending

### Notes
- Messages list UI is scaffolded with a container; next iteration can render live messages from `chat.messagesByAppointmentId[appointmentId]`.
- All files reference this prompt in a header comment where added.


