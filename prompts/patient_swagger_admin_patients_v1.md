## User Prompt: Generate swagger for the api

## AI Response:
Added OpenAPI annotations and schemas for Admin Patients CRUD.

Changes:
- Updated `app/Http/Controllers/Controller.php` with component schemas: `Patient`, `PatientCreateRequest`, `PatientUpdateRequest`, `ApiError`, `ValidationError`.
- Annotated `app/Http/Controllers/Api/PatientController.php` endpoints:
  - GET `/api/admin/patients`
  - POST `/api/admin/patients`
  - GET `/api/admin/patients/{id}`
  - PUT `/api/admin/patients/{id}`
  - DELETE `/api/admin/patients/{id}`

Swagger UI: `http://localhost:8000/api/documentation`


