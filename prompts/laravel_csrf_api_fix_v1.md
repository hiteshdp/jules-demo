# Laravel CSRF API Fix - Version 1

## User Prompt
When sending a POST request to /api/login I get:

"CSRF token mismatch."

This should not happen for API authentication routes.  

Please fix this by:
1. Ensuring that /api/login and other API routes are defined inside routes/api.php and use the "api" middleware group, not "web".
2. Removing CSRF protection from API routes by excluding them from VerifyCsrfToken middleware.
   - Update App\Http\Middleware\VerifyCsrfToken.php to add an $except array for /api/* routes if necessary.
3. Confirm that API authentication uses token-based methods (Laravel Sanctum, Passport, or JWT) instead of CSRF cookies.
4. After this fix, sending a POST to /api/login should return the correct JSON response instead of "CSRF token mismatch".

## AI Response

I need to fix the CSRF token mismatch issue for API routes. This happens when API routes are incorrectly protected by CSRF middleware.

### Key Actions:
1. Check current routes/api.php configuration
2. Create/update VerifyCsrfToken middleware to exclude API routes
3. Ensure API routes use proper middleware groups
4. Verify Sanctum token-based authentication works
