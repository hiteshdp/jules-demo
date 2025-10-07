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
 *     schema="User",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="John Doe"),
 *     @OA\Property(property="email", type="string", format="email", example="john@example.com"),
 *     @OA\Property(property="role", type="string", enum={"patient", "dermatologist", "admin"}, example="patient"),
 *     @OA\Property(property="phone", type="string", example="+1234567890"),
 *     @OA\Property(property="date_of_birth", type="string", format="date", example="1990-01-01"),
 *     @OA\Property(property="gender", type="string", enum={"male", "female", "other"}, example="male"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="Appointment",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="patient_id", type="integer", example=1),
 *     @OA\Property(property="dermatologist_id", type="integer", example=1),
 *     @OA\Property(property="scheduled_at", type="string", format="date-time", example="2024-01-15T10:00:00Z"),
 *     @OA\Property(property="status", type="string", enum={"scheduled", "in_progress", "completed", "cancelled"}, example="scheduled"),
 *     @OA\Property(property="notes", type="string", example="Patient consultation notes"),
 *     @OA\Property(property="prescription", type="string", example="Prescription details"),
 *     @OA\Property(property="zoom_link", type="string", example="https://zoom.us/j/123456789"),
 *     @OA\Property(property="consultation_fee", type="number", format="float", example=1500.00),
 *     @OA\Property(property="is_paid", type="boolean", example=false),
 *     @OA\Property(property="patient", ref="#/components/schemas/User"),
 *     @OA\Property(property="dermatologist", ref="#/components/schemas/User"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="DermatologistProfile",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="user_id", type="integer", example=1),
 *     @OA\Property(property="license_number", type="string", example="DR123456"),
 *     @OA\Property(property="specialization", type="string", example="Hair Loss & Scalp Disorders"),
 *     @OA\Property(property="years_of_experience", type="integer", example=8),
 *     @OA\Property(property="qualifications", type="string", example="MD Dermatology, Fellowship in Trichology"),
 *     @OA\Property(property="bio", type="string", example="Specialized in hair loss treatment"),
 *     @OA\Property(property="consultation_fee", type="number", format="float", example=1500.00),
 *     @OA\Property(property="available_days", type="array", @OA\Items(type="string"), example={"monday", "tuesday", "wednesday"}),
 *     @OA\Property(property="start_time", type="string", format="time", example="09:00:00"),
 *     @OA\Property(property="end_time", type="string", format="time", example="17:00:00"),
 *     @OA\Property(property="timezone", type="string", example="Asia/Kolkata"),
 *     @OA\Property(property="is_available", type="boolean", example=true),
 *     @OA\Property(property="max_patients_per_day", type="integer", example=15),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */
class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}