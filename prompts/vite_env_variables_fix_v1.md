# Vite Environment Variables Fix - Version 1

## User Prompt
At runtime I get this error:

authAPI.ts:3 Uncaught ReferenceError: process is not defined

This happens because my code is using process.env (like process.env.REACT_APP_API_URL), but I am using Vite + React 19, and process.env is not available in the browser.

Please fix this by:
1. Updating all environment variable references to use Vite's syntax import.meta.env.VITE_* instead of process.env.
2. Update my .env file to use VITE_ prefixes (e.g., VITE_API_URL=http://localhost:8000/api).
3. Ensure that authAPI.ts and any other files using process.env are updated to use import.meta.env.
4. After the changes, confirm that the application runs without the "process is not defined" error.

## AI Response

I need to fix the environment variable usage to work with Vite instead of Create React App. Vite uses `import.meta.env.VITE_*` instead of `process.env.REACT_APP_*`.

### Key Actions:
1. Find all files using process.env
2. Update to import.meta.env.VITE_*
3. Update .env files with VITE_ prefixes
4. Ensure all apps work with Vite environment variables
