# Patient Quick Actions Cleanup

## User Prompt:
in patient module , dashboard section , here i need only Take hair loss quiz and Book appointmnet only 
remove view recommandations

## AI Response:
Updated the patient dashboard Quick Actions section to show only two action cards:
1. **Take Hair Loss Quiz** (kept)
2. **Book Appointment** (kept)

### Changes Made:
- Removed the "View Recommendations" card from the Quick Actions section
- Updated the grid layout from `lg={8}` to `lg={12}` to accommodate 2 cards instead of 3
- Removed unused `BulbOutlined` import
- Removed unused `isSubmitted` variable from quiz state
- Maintained the same styling and functionality for the remaining cards

### Files Modified:
- `frontend/patient/src/pages/Dashboard.tsx` - Updated Quick Actions section and cleaned up unused imports/variables

The Quick Actions section now displays a cleaner, more focused view with just the essential actions that patients need to take.
