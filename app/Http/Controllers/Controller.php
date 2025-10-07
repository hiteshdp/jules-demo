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
 * 
 * @OA\Schema(
 *     schema="Patient",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="John Doe"),
 *     @OA\Property(property="email", type="string", format="email", example="john@example.com"),
 *     @OA\Property(property="phone_no", type="string", example="+1234567890"),
 *     @OA\Property(property="dob", type="string", format="date", example="1990-01-15"),
 *     @OA\Property(property="gender", type="string", enum={"male","female","other"}, example="male"),
 *     @OA\Property(property="is_active", type="boolean", example=true),
 *     @OA\Property(property="subscription_status", type="string", example="-"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-15T10:30:00Z")
 * )
 * 
 * @OA\Schema(
 *     schema="PatientCreateRequest",
 *     type="object",
 *     required={"name","email","phone_no","password"},
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="email", type="string", format="email"),
 *     @OA\Property(property="phone_no", type="string"),
 *     @OA\Property(property="password", type="string", format="password", minLength=6),
 *     @OA\Property(property="dob", type="string", format="date"),
 *     @OA\Property(property="gender", type="string", enum={"male","female","other"})
 * )
 * 
 * @OA\Schema(
 *     schema="PatientUpdateRequest",
 *     type="object",
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="email", type="string", format="email"),
 *     @OA\Property(property="phone_no", type="string"),
 *     @OA\Property(property="password", type="string", format="password", minLength=6),
 *     @OA\Property(property="dob", type="string", format="date"),
 *     @OA\Property(property="gender", type="string", enum={"male","female","other"}),
 *     @OA\Property(property="is_active", type="boolean")
 * )
 * 
 * @OA\Schema(
 *     schema="Dermatologist",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Dr. John Doe"),
 *     @OA\Property(property="email", type="string", format="email", example="john@example.com"),
 *     @OA\Property(property="phone_no", type="string", example="+1234567890"),
 *     @OA\Property(property="dob", type="string", format="date", example="1990-01-15"),
 *     @OA\Property(property="gender", type="string", enum={"male","female","other"}, example="male"),
 *     @OA\Property(property="is_active", type="boolean", example=true),
 *     @OA\Property(property="subscription_status", type="string", example="-"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-15T10:30:00Z")
 * )
 * 
 * @OA\Schema(
 *     schema="DermatologistCreateRequest",
 *     type="object",
 *     required={"name","email","phone_no","password"},
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="email", type="string", format="email"),
 *     @OA\Property(property="phone_no", type="string"),
 *     @OA\Property(property="password", type="string", format="password", minLength=6),
 *     @OA\Property(property="dob", type="string", format="date"),
 *     @OA\Property(property="gender", type="string", enum={"male","female","other"})
 * )
 * 
 * @OA\Schema(
 *     schema="DermatologistUpdateRequest",
 *     type="object",
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="email", type="string", format="email"),
 *     @OA\Property(property="phone_no", type="string"),
 *     @OA\Property(property="password", type="string", format="password", minLength=6),
 *     @OA\Property(property="dob", type="string", format="date"),
 *     @OA\Property(property="gender", type="string", enum={"male","female","other"}),
 *     @OA\Property(property="is_active", type="boolean")
 * )
 * 
 * @OA\Schema(
 *     schema="ApiError",
 *     type="object",
 *     @OA\Property(property="success", type="boolean", example=false),
 *     @OA\Property(property="message", type="string", example="Error message"),
 *     @OA\Property(property="error", type="string", example="Detailed error info")
 * )
 * 
 * @OA\Schema(
 *     schema="ValidationError",
 *     type="object",
 *     @OA\Property(property="success", type="boolean", example=false),
 *     @OA\Property(property="message", type="string", example="The given data was invalid."),
 *     @OA\Property(property="errors", type="object")
 * )
 */
class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}
