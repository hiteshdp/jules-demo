# Vite TypeScript Environment Variables Fix - Version 1

## User Prompt
My Vite + React + TypeScript build is failing with:

TS2339: Property 'env' does not exist on type 'ImportMeta'.

This happens in files like appointmentAPI.ts, authAPI.ts, and quizAPI.ts where I use:

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

Please fix this by:
1. Adding proper TypeScript definitions for Vite environment variables using vite-env.d.ts.
2. Define an ImportMetaEnv interface that includes VITE_API_URL (and ensure it can be extended for other env vars).
3. Update tsconfig.json to include vite/client types and ensure vite-env.d.ts is included.
4. Ensure after these changes, the build succeeds with no TS2339 errors.

## AI Response

I need to add proper TypeScript definitions for Vite environment variables to fix the TS2339 error. This involves creating vite-env.d.ts files and updating tsconfig.json files.

### Key Actions:
1. Create vite-env.d.ts files for each React app
2. Define ImportMetaEnv interface with VITE_API_URL
3. Update tsconfig.json to include vite/client types
4. Ensure all apps have proper Vite type definitions
