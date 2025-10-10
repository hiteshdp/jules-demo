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
 *     @OA\Property(property="status", type="string", enum={"scheduled","in_progress","completed"}, example="completed"),
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
     *         @OA\Schema(type="string", enum={"scheduled", "in_progress", "completed"})
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
     *                    		@OA\Property(property="id", type="integer", example=1),
     *                    		@OA\Property(property="patient_id", type="integer", example=1),
     *                    		@OA\Property(property="dermatologist_id", type="integer", example=2),
     *                    		@OA\Property(property="scheduled_at", type="string", format="date-time", example="2024-01-15T10:00:00Z"),
     *                    		@OA\Property(property="status", type="string", enum={"scheduled","in_progress","completed"}, example="scheduled"),
     *                    		@OA\Property(property="consultation_fee", type="number", format="float", example=100.00),
     *                    		@OA\Property(property="notes", type="string", example="Follow-up consultation"),
     *                    		@OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T00:00:00Z"),
     *                    		@OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-01T00:00:00Z")
     *                    )
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

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        // Check if user is a dermatologist by checking if they have a dermatologist profile
        $dermatologist = \App\Models\Dermatologist::where('user_id', $user->id)->first();
        
        if (!$dermatologist) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Dermatologist profile not found.'
            ], 403);
        }

        $query = Appointment::with(['patient', 'dermatologist'])
            ->where('dermatologist_id', $dermatologist->user_id);

        // Apply filters
        if ($request->has('patient_name')) {
            $query->whereHas('patient', function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->patient_name . '%');
            });
        }

        if ($request->has('date_from')) {
            $query->whereDate('scheduled_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('scheduled_at', '<=', $request->date_to);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $appointments = $query->orderBy('scheduled_at', 'desc')->get();

        // Add formatted date time and ensure consultation_fee is included
        $appointments->transform(function ($appointment) {
            $appointment->formatted_date_time = $appointment->scheduled_at->format('d M Y, h:i A');
            return $appointment;
        });

        // Handle export request
        if ($request->has('export')) {
            return $this->exportAppointments($appointments, $request->export);
        }

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
	*                   @OA\Property(property="id", type="integer", example=1),
	*                   @OA\Property(property="patient_id", type="integer", example=1),
     *                     @OA\Property(property="dermatologist_id", type="integer", example=2),
     *                     @OA\Property(property="scheduled_at", type="string", format="date-time", example="2024-01-15T10:00:00Z"),
     *                     @OA\Property(property="status", type="string", enum={"scheduled","in_progress","completed"}, example="scheduled"),
	*                   @OA\Property(property="consultation_fee", type="number", format="float", example=100.00),
	*                   @OA\Property(property="notes", type="string", example="Follow-up consultation"),
	*                   @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T00:00:00Z"),
	*                   @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-01T00:00:00Z"))
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

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        // Check if user is a dermatologist by checking if they have a dermatologist profile
        $dermatologist = \App\Models\Dermatologist::where('user_id', $user->id)->first();
        if (!$dermatologist) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Dermatologist profile not found.'
            ], 403);
        }

        $appointment = Appointment::with(['patient', 'dermatologist'])
            ->where('id', $id)
            ->where('dermatologist_id', $dermatologist->user_id)
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
     *             @OA\Property(property="status", type="string", enum={"scheduled", "in_progress", "completed"}),
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
	*                   	@OA\Property(property="id", type="integer", example=1),
	*                   	@OA\Property(property="patient_id", type="integer", example=1),
	*                   @OA\Property(property="dermatologist_id", type="integer", example=2),
	*                   @OA\Property(property="scheduled_at", type="string", format="date-time", example="2024-01-15T10:00:00Z"),
	*                   @OA\Property(property="status", type="string", enum={"scheduled","in_progress","completed"}, example="scheduled"),
	*                   	@OA\Property(property="consultation_fee", type="number", format="float", example=100.00),
	*                   	@OA\Property(property="notes", type="string", example="Follow-up consultation"),
	*                   	@OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T00:00:00Z"),
	*                   	@OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-01T00:00:00Z"))
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

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        // Check if user is a dermatologist by checking if they have a dermatologist profile
        $dermatologist = \App\Models\Dermatologist::where('user_id', $user->id)->first();
        if (!$dermatologist) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Dermatologist profile not found.'
            ], 403);
        }

        $request->validate([
            'status' => 'required|in:scheduled,in_progress,completed',
            'notes' => 'nullable|string|max:1000',
            'scheduled_at' => 'nullable|date|after:now'
        ]);

        $appointment = Appointment::where('id', $id)
            ->where('dermatologist_id', $dermatologist->user_id)
            ->first();

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found'
            ], 404);
        }

        $payload = [
            'status' => $request->status,
            'notes' => $request->notes ?? $appointment->notes,
        ];
        if ($request->filled('scheduled_at')) {
            $payload['scheduled_at'] = $request->scheduled_at;
        }
        $appointment->update($payload);

        $appointment->load(['patient', 'dermatologist']);

        return response()->json([
            'success' => true,
            'message' => 'Appointment status updated successfully',
            'data' => [
                'appointment' => $appointment
            ]
        ]);
    }

    /**
     * Reschedule appointment date/time (dermatologist)
     */
    public function reschedule(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        $dermatologist = \App\Models\Dermatologist::where('user_id', $user->id)->first();
        if (!$dermatologist) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Dermatologist profile not found.'
            ], 403);
        }

        $validated = $request->validate([
            'scheduled_at' => 'required|date|after:now',
        ]);

        $appointment = Appointment::where('id', $id)
            ->where('dermatologist_id', $dermatologist->id)
            ->first();

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found'
            ], 404);
        }

        // Interpret incoming datetime in app timezone (local), store accordingly
        $dt = \Carbon\Carbon::parse($validated['scheduled_at']); // respects incoming offset if present
        // Normalize to app timezone before saving (so UI formatting is consistent)
        $appointment->scheduled_at = $dt->setTimezone(config('app.timezone'));
        // keep status as is unless previously cancelled (not used)
        $appointment->save();

        $appointment->load(['patient', 'dermatologist.user']);

        return response()->json([
            'success' => true,
            'message' => 'Appointment rescheduled successfully',
            'data' => [
                'appointment' => $appointment
            ]
        ]);
    }

    /**
     * Export appointments to Excel or CSV format
     */
    private function exportAppointments($appointments, $format)
    {
        $filename = 'dermatologist_appointments_' . date('Y-m-d_H-i-s') . '.' . $format;
        
        if ($format === 'csv') {
            return $this->exportToCsv($appointments, $filename);
        } else {
            return $this->exportToExcel($appointments, $filename);
        }
    }

    /**
     * Export appointments to CSV format
     */
    private function exportToCsv($appointments, $filename)
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function() use ($appointments) {
            $file = fopen('php://output', 'w');
            
            // CSV headers
            fputcsv($file, [
                'ID',
                'Patient Name',
                'Scheduled Date & Time',
                'Status',
                'Payout Amount',
                'Payment Status',
                'Notes'
            ]);

            // CSV data
            foreach ($appointments as $appointment) {
                $payout = (float) ($appointment->dermatologist_fee ?? 0);
                fputcsv($file, [
                    $appointment->id,
                    $appointment->patient->name ?? 'N/A',
                    $appointment->scheduled_at->format('d M Y, h:i A'),
                    $appointment->status,
                    '₹' . number_format($payout, 2),
                    $appointment->is_paid ? 'Paid' : 'Unpaid',
                    $appointment->notes ?? 'N/A'
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Export appointments to Excel format
     */
    private function exportToExcel($appointments, $filename)
    {
        // Create a proper Excel-compatible CSV with UTF-8 BOM for Excel compatibility
        $headers = [
            'Content-Type' => 'application/vnd.ms-excel',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Cache-Control' => 'max-age=0',
        ];

        $callback = function() use ($appointments) {
            // Add UTF-8 BOM for Excel compatibility
            echo "\xEF\xBB\xBF";
            
            $file = fopen('php://output', 'w');
            
            // Excel headers
            fputcsv($file, [
                'ID',
                'Patient Name',
                'Scheduled Date & Time',
                'Status',
                'Payout Amount',
                'Payment Status',
                'Notes'
            ]);

            // Excel data
            foreach ($appointments as $appointment) {
                $payout = (float) ($appointment->dermatologist_fee ?? 0);
                fputcsv($file, [
                    $appointment->id,
                    $appointment->patient->name ?? 'N/A',
                    $appointment->scheduled_at->format('d M Y, h:i A'),
                    $appointment->status,
                    '₹' . number_format($payout, 2),
                    $appointment->is_paid ? 'Paid' : 'Unpaid',
                    $appointment->notes ?? 'N/A'
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
