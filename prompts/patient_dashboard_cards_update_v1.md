# Patient Dashboard Cards Update

## User Prompt:
in patient module , dashboard section , 

here i need only - Total appointments and Upcoming appointments.
Move Total Appointments at first then show Upcoming Appointments

## AI Response:
Updated the patient dashboard to show only two cards:
1. **Total Appointments** (moved to first position)
2. **Upcoming Appointments** (moved to second position)

### Changes Made:
- Removed the "Quiz Completed" card from the dashboard stats
- Reordered the remaining cards with "Total Appointments" first
- Updated the grid layout from `lg={8}` to `lg={12}` to accommodate 2 cards instead of 3
- Maintained the same styling and functionality for the remaining cards

### Files Modified:
- `frontend/patient/src/pages/Dashboard.tsx` - Updated stats array and grid layout

The dashboard now displays a cleaner, more focused view with just the essential appointment information that patients need to see at a glance.
