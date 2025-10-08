## User Prompt
When patient click on the chat button appoitments listing. That time it will redirect to chat with the dermatologist selected

## AI Response
Implemented deep-linking from the appointments list to the dedicated chat page:

- Updated `frontend/patient/src/pages/Appointments.tsx` to navigate using `useNavigate` to `/chat?appointmentId=<id>` when the Chat button is clicked.
- Enhanced `frontend/patient/src/pages/Chat.tsx` to read `appointmentId` from the query string and auto-select the corresponding appointment, then load its messages.

This creates a seamless transition from the appointments list directly into the relevant chat thread.

