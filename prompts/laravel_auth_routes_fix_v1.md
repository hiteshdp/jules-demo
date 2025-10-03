# Laravel Authentication Routes Fix - Version 1

## User Prompt
When running my React app and calling the backend Laravel, I get this error:

Request URL: http://localhost:8000/api/login
Request Method: POST
Status Code: 404 Not Found

This means the /api/login route is not found in my Laravel backend.

Please fix this by:
1. Adding the correct authentication routes in Laravel 12 so that /api/login exists and accepts POST requests.
2. Implement an AuthController with methods for login, register, and logout using Laravel Sanctum or Passport for API authentication.
3. Update routes/api.php to include the proper routes, for example:
   Route::post('/login', [AuthController::class, 'login']);
   Route::post('/register', [AuthController::class, 'register']);
   Route::post('/logout', [AuthController::class, 'logout']);
4. Ensure the controller methods return proper JSON responses with status codes, and handle validation + token creation.
5. Confirm that hitting http://localhost:8000/api/login with POST now works instead of returning 404.

## AI Response

I need to implement the missing authentication routes and controller in Laravel. The React apps are trying to call /api/login but it doesn't exist.

### Key Actions:
1. Check current routes/api.php
2. Create AuthController with login, register, logout methods
3. Add authentication routes to routes/api.php
4. Use Laravel Sanctum for API authentication
5. Ensure proper JSON responses and validation
