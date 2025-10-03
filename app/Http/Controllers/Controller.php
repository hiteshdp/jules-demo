<?php
// Generated via prompt: prompts/laravel_swagger_documentation_v1.md

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * @OA\Info(
 *     title="Hair Skin Health API",
 *     version="1.0.0",
 *     description="API documentation for Hair Loss Diagnosis & Treatment Platform",
 *     @OA\Contact(
 *         email="support@hairskinhealth.com"
 *     ),
 *     @OA\License(
 *         name="MIT",
 *         url="https://opensource.org/licenses/MIT"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="http://localhost:8000/api",
 *     description="Development Server"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Enter JWT token"
 * )
 * 
 * @OA\Tag(
 *     name="Authentication",
 *     description="User authentication endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Patients",
 *     description="Patient-specific endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Dermatologists",
 *     description="Dermatologist-specific endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Admin",
 *     description="Admin panel endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Appointments",
 *     description="Appointment management endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Quiz",
 *     description="Hair loss quiz endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Products",
 *     description="Product catalog endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Payments",
 *     description="Payment processing endpoints"
 * )
 */
class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}