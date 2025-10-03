# TypeScript Build Cleanup - Version 1

## User Prompt
When running `npm run build` with TypeScript and Vite, my build fails with unused variable errors like:

TS6133: 'X' is declared but its value is never read.

Examples:
- import React from 'react'; (no longer needed in React 17+ / React 19+ JSX)
- unused variables like navigate, location, appointmentsLoading, questions, UserIcon, dispatch, etc.

Please fix this by:
1. Removing unused imports and variables across the codebase so the TypeScript build passes cleanly.
2. For cases like `import React from 'react';` in React 17+ and above, remove the import entirely unless it is explicitly needed.
3. If a variable is declared but will be used later (e.g. in TODO logic), comment it out temporarily instead of deleting it.
4. Ensure after these changes `npm run build` completes successfully with 0 TypeScript errors.

## AI Response

I need to clean up unused imports and variables across all three React apps to fix TypeScript build errors. This includes removing unnecessary React imports (not needed in React 17+ with new JSX transform) and other unused variables.

### Key Actions:
1. Check all React apps for unused imports and variables
2. Remove unnecessary React imports (React 17+ JSX transform)
3. Remove or comment out unused variables
4. Ensure clean TypeScript builds
5. Focus on patient, dermatologist, and admin apps
