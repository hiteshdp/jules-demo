# Dermatologist Modal Import Fix

## User Prompt: 
Uncaught SyntaxError: The requested module 'http://localhost:3002/src/pages/Dermatologists.tsx?t=1759817839137' doesn't provide an export named: 'default'

## AI Response:
Fixed the import path issue in Dermatologists.tsx. The error was caused by importing DermatologistModal from the wrong path. The component was moved to the features directory but the import wasn't updated.

### Changes Made:
1. Updated import path in `/frontend/admin/src/pages/Dermatologists.tsx`:
   - Changed from: `import DermatologistModal from '../components/DermatologistModal';`
   - Changed to: `import DermatologistModal from '../components/features/DermatologistModal';`

### Root Cause:
The DermatologistModal component was moved to the `features` directory as part of the Ant Design conversion, but the import statement in Dermatologists.tsx wasn't updated to reflect the new location.

### Files Modified:
- `/frontend/admin/src/pages/Dermatologists.tsx` - Updated import path

This should resolve the module export error and allow the Dermatologists page to load properly.
