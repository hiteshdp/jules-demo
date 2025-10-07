<?php
// Generated via prompt: prompts/laravel_missing_api_routes_fix_v1.md

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * @OA\Schema(
 *     schema="Appointment",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="patient_id", type="integer", example=1),
 *     @OA\Property(property="dermatologist_id", type="integer", example=2),
 *     @OA\Property(property="scheduled_at", type="string", format="date-time", example="2024-01-15T10:00:00Z"),
 *     @OA\Property(property="status", type="string", enum={"scheduled","in_progress","completed","cancelled"}, example="scheduled"),
 *     @OA\Property(property="consultation_fee", type="number", format="float", example=100.00),
 *     @OA\Property(property="notes", type="string", example="Follow-up consultation"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T00:00:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-01T00:00:00Z")
 * )
 * 
 * @OA\Schema(
 *     schema="AppointmentCreateRequest",
 *     type="object",
 *     required={"dermatologist_id","scheduled_at"},
 *     @OA\Property(property="dermatologist_id", type="integer", example=1),
 *     @OA\Property(property="scheduled_at", type="string", format="date-time", example="2024-01-15T10:00:00Z"),
 *     @OA\Property(property="notes", type="string", example="Follow-up consultation")
 * )
 * 
 * @OA\Tag(
 *     name="Appointments",
 *     description="Appointment management endpoints"
 * )
 */
class AppointmentController extends Controller
{
    /**
     * @OA\Get(
     *     path="/patient/appointments",
     *     summary="Get patient appointments",
     *     description="Get all appointments for the authenticated patient",
     *     tags={"Appointments"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Appointments retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="appointments", type="array", @OA\Items(type="object"))
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated")
     *         )
     *     )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Get appointments for the authenticated patient
        $appointments = Appointment::where('patient_id', $user->id)
            ->with(['dermatologist'])
            ->orderBy('scheduled_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'appointments' => $appointments
            ]
        ], 200);
    }

    /**
     * @OA\Get(
     *     path="/patient/appointments/{id}",
     *     summary="Get specific appointment",
     *     description="Get a specific appointment for the authenticated patient",
     *     tags={"Appointments"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Appointment ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Appointment retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Appointment not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Appointment not found")
     *         )
     *     )
     * )
     */
    public function show(Request $request, $id): JsonResponse
    {
        $user = $request->user();

        $appointment = Appointment::where('id', $id)
            ->where('patient_id', $user->id)
            ->with(['dermatologist'])
            ->first();

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $appointment
        ], 200);
    }

    /**
     * @OA\Post(
     *     path="/patient/appointments",
     *     summary="Create new appointment",
     *     description="Create a new appointment for the authenticated patient",
     *     tags={"Appointments"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"dermatologist_id","scheduled_at","consultation_fee"},
     *             @OA\Property(property="dermatologist_id", type="integer", example=1),
     *             @OA\Property(property="scheduled_at", type="string", format="date-time", example="2024-01-15T10:00:00Z"),
     *             @OA\Property(property="consultation_fee", type="number", format="float", example=100.00),
     *             @OA\Property(property="notes", type="string", example="Follow-up consultation")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Appointment created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Appointment created successfully"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation errors",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Validation errors"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'dermatologist_id' => 'required|exists:users,id',
            'scheduled_at' => 'required|date|after:now',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Get the dermatologist to fetch consultation fee
        $dermatologist = \App\Models\Dermatologist::where('user_id', $validated['dermatologist_id'])->first();

        if (!$dermatologist) {
            return response()->json([
                'success' => false,
                'message' => 'Dermatologist not found'
            ], 404);
        }

        $appointment = Appointment::create([
            'patient_id' => $user->id,
            'dermatologist_id' => $validated['dermatologist_id'],
            'scheduled_at' => $validated['scheduled_at'],
            'notes' => $validated['notes'] ?? null,
            'consultation_fee' => $dermatologist->consultation_fee,
            'status' => 'scheduled',
        ]);

        $appointment->load(['dermatologist']);

        return response()->json([
            'success' => true,
            'message' => 'Appointment created successfully',
            'data' => $appointment
        ], 201);
    }
}
