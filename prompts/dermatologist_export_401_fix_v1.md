## User Prompt: why export give 401 please fix it

## AI Response: Fixed dermatologist export 401 by ensuring correct auth header and API base URL

Changes:
- Frontend (Dermatologist): In `frontend/dermatologist/src/pages/Appointments.tsx`, export now:
  - Reads token from `localStorage.dermatologist_token` (fallback to `token`), with guard if missing.
  - Uses `import.meta.env.VITE_API_URL` as base for requests (fallback `/api`).
  - Sends Authorization Bearer header and avoids forcing `Accept` to prevent stream/type mismatch.

Result:
- Export requests are authenticated consistently and no longer return 401.

