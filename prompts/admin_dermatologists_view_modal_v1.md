## User Prompt: Update the existing API `/admin/dermatologists/{id}` to fetch full details from both the `users` table and the related `dermatologist` table, and add a “View” button in the admin UI to display these details in a styled card modal — similar to the Patient View modal feature.

## AI Response: Updated backend `DermatologistController@show` to return combined data: base user fields plus related dermatologist profile (queried by `user_id`). On the frontend, enhanced `frontend/admin/src/pages/Dermatologists.tsx` by adding a View icon button that opens an Ant Design Modal showing profile details using `Descriptions` and cards, mirroring the patient modal UX. Also updated the file header comment to reference this prompt.

