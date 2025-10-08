## User Prompt
I think you need to create new api endpoint and all the requried things for dermatologist

## AI Response
Added dermatologist-specific chat API endpoints and wired the dermatologist frontend to use them.

### Backend
- Updated `routes/api.php` to add:
  - `GET /api/dermatologist/appointments/{id}/chat` → fetch chat messages
  - `POST /api/dermatologist/appointments/{id}/chat` → send chat message
  These routes reuse `AppointmentChatController@index` and `store`, which already enforce that the authenticated user must belong to the appointment (either patient or dermatologist).

### Frontend (Dermatologist)
- Updated `frontend/dermatologist/src/store/api/chatAPI.ts` to call new endpoints under `/dermatologist/appointments/{id}/chat`.
- Ensured the interceptor sends the dermatologist Bearer token (`dermatologist_token`).

Result: Dermatologists can now fetch and send chat messages using their own namespaced endpoints, avoiding cross-role auth issues.

