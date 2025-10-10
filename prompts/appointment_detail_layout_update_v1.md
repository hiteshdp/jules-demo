## User Prompt: Appointment Details layout changes

For appointments details page for both patient and Dermatologist make single section for Appointment Information and Patient/Dermatologist details remove Update Status from details it should work from appointment list and note section move on right side on above note section should show start chat button.

## AI Response:

Implemented layout changes for both Patient and Dermatologist AppointmentDetail pages:

- Merged details into a single "Appointment Information" section.
- Removed "Update Status" controls from the details page (status updates remain from the list page).
- Moved Notes into the right sidebar; added a "Start Chat" button above Notes.
- Patient Notes are read-only; Dermatologist can edit and save notes.

Files updated:
- frontend/patient/src/pages/AppointmentDetail.tsx
- frontend/dermatologist/src/pages/AppointmentDetail.tsx

This aligns the UI with the requested layout and improves clarity of actions.

