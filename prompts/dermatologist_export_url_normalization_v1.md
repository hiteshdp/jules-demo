## User Prompt: @http://127.0.0.1:8000/api//dermatologist/appointments?export=excel — here double // pass that why gives 404 please check

## AI Response: Fixed double slash in export URL by normalizing base URL

Change:
- In `frontend/dermatologist/src/pages/Appointments.tsx` export function, normalized `VITE_API_URL` by removing trailing slashes before concatenation and used the sanitized `API_BASE` for the request URL.

Result:
- Export URL no longer contains double slashes and avoids 404s.

