<?php
// Generated via prompt: prompts/dermatologist_appointment_controller_v1.md

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\User;

/**
 * @OA\Schema(
 *     schema="AppointmentStatusUpdateRequest",
 *     type="object",
 *     required={"status"},
 *     @OA\Property(property="status", type="string", enum={"scheduled","in_progress","completed","cancelled"}, example="completed"),
 *     @OA\Property(property="notes", type="string", example="Consultation completed successfully")
 * )
 * 
 * @OA\Tag(
 *     name="Dermatologist Appointments",
 *     description="Dermatologist appointment management endpoints"
 * )
 */
class DermatologistAppointmentController extends Controller
{
    /**
     * @OA\Get(
     *     path="/dermatologist/appointments",
     *     summary="Get dermatologist's appointments",
     *     tags={"Dermatologist Appointments"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         description="Filter by appointment status",
     *         required=false,
     *         @OA\Schema(type="string", enum={"scheduled", "in_progress", "completed", "cancelled"})
     *     ),
     *     @OA\Parameter(
     *         name="date",
     *         in="query",
     *         description="Filter by appointment date (YYYY-MM-DD)",
     *         required=false,
     *         @OA\Schema(type="string", format="date")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Appointments retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Appointments retrieved successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(
     *                     property="appointments",
     *                     type="array",
     *                     @OA\Items(
                         @OA\Property(property="id", type="integer", example=1),
                         @OA\Property(property="patient_id", type="integer", example=1),
                         @OA\Property(property="dermatologist_id", type="integer", example=2),
                         @OA\Property(property="scheduled_at", type="string", format="date-time", example="2024-01-15T10:00:00Z"),
                         @OA\Property(property="status", type="string", enum={"scheduled","in_progress","completed","cancelled"}, example="scheduled"),
                         @OA\Property(property="consultation_fee", type="number", format="float", example=100.00),
                         @OA\Property(property="notes", type="string", example="Follow-up consultation"),
                         @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T00:00:00Z"),
                         @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-01T00:00:00Z")
                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Unauthenticated")
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'dermatologist') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        $query = Appointment::with(['patient.user', 'dermatologist.user'])
            ->where('dermatologist_id', $user->id);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date
        if ($request->has('date')) {
            $query->whereDate('scheduled_at', $request->date);
        }

        $appointments = $query->orderBy('scheduled_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Appointments retrieved successfully',
            'data' => [
                'appointments' => $appointments
            ]
        ]);
    }

    /**
     * @OA\Get(
     *     path="/dermatologist/appointments/{id}",
     *     summary="Get specific appointment details",
     *     tags={"Dermatologist Appointments"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Appointment ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Appointment details retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Appointment details retrieved successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="appointment", type="object",
                     @OA\Property(property="id", type="integer", example=1),
                     @OA\Property(property="patient_id", type="integer", example=1),
                     @OA\Property(property="dermatologist_id", type="integer", example=2),
                     @OA\Property(property="scheduled_at", type="string", format="date-time", example="2024-01-15T10:00:00Z"),
                     @OA\Property(property="status", type="string", enum={"scheduled","in_progress","completed","cancelled"}, example="scheduled"),
                     @OA\Property(property="consultation_fee", type="number", format="float", example=100.00),
                     @OA\Property(property="notes", type="string", example="Follow-up consultation"),
                     @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T00:00:00Z"),
                     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-01T00:00:00Z"))
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Appointment not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Appointment not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Unauthenticated")
     *         )
     *     )
     * )
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'dermatologist') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        $appointment = Appointment::with(['patient.user', 'dermatologist.user'])
            ->where('id', $id)
            ->where('dermatologist_id', $user->id)
            ->first();

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Appointment details retrieved successfully',
            'data' => [
                'appointment' => $appointment
            ]
        ]);
    }

    /**
     * @OA\Put(
     *     path="/dermatologist/appointments/{id}/status",
     *     summary="Update appointment status",
     *     tags={"Dermatologist Appointments"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Appointment ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", enum={"scheduled", "in_progress", "completed", "cancelled"}),
     *             @OA\Property(property="notes", type="string", description="Optional consultation notes")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Appointment status updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Appointment status updated successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="appointment", type="object",
                     @OA\Property(property="id", type="integer", example=1),
                     @OA\Property(property="patient_id", type="integer", example=1),
                     @OA\Property(property="dermatologist_id", type="integer", example=2),
                     @OA\Property(property="scheduled_at", type="string", format="date-time", example="2024-01-15T10:00:00Z"),
                     @OA\Property(property="status", type="string", enum={"scheduled","in_progress","completed","cancelled"}, example="scheduled"),
                     @OA\Property(property="consultation_fee", type="number", format="float", example=100.00),
                     @OA\Property(property="notes", type="string", example="Follow-up consultation"),
                     @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T00:00:00Z"),
                     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-01T00:00:00Z"))
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Appointment not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Appointment not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Unauthenticated")
     *         )
     *     )
     * )
     */
    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'dermatologist') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        $request->validate([
            'status' => 'required|in:scheduled,in_progress,completed,cancelled',
            'notes' => 'nullable|string|max:1000'
        ]);

        $appointment = Appointment::where('id', $id)
            ->where('dermatologist_id', $user->id)
            ->first();

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found'
            ], 404);
        }

        $appointment->update([
            'status' => $request->status,
            'notes' => $request->notes ?? $appointment->notes
        ]);

        $appointment->load(['patient.user', 'dermatologist.user']);

        return response()->json([
            'success' => true,
            'message' => 'Appointment status updated successfully',
            'data' => [
                'appointment' => $appointment
            ]
        ]);
    }
}
