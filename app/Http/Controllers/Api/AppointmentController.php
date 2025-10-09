<?php
// Generated via prompt: prompts/laravel_missing_api_routes_fix_v1.md

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AdminSetting;
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
     *     description="Get all appointments for the authenticated patient with filtering and export options",
     *     tags={"Appointments"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="dermatologist_name",
     *         in="query",
     *         description="Filter by dermatologist name",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="date_from",
     *         in="query",
     *         description="Filter appointments from date (YYYY-MM-DD)",
     *         required=false,
     *         @OA\Schema(type="string", format="date")
     *     ),
     *     @OA\Parameter(
     *         name="date_to",
     *         in="query",
     *         description="Filter appointments to date (YYYY-MM-DD)",
     *         required=false,
     *         @OA\Schema(type="string", format="date")
     *     ),
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         description="Filter by appointment status",
     *         required=false,
     *         @OA\Schema(type="string", enum={"scheduled", "in_progress", "completed", "cancelled"})
     *     ),
     *     @OA\Parameter(
     *         name="export",
     *         in="query",
     *         description="Export format (excel, csv)",
     *         required=false,
     *         @OA\Schema(type="string", enum={"excel", "csv"})
     *     ),
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
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Appointment::where('patient_id', $user->id)
            ->with(['dermatologist.user']);

        // Apply filters
        if ($request->has('dermatologist_name')) {
            $query->whereHas('dermatologist.user', function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->dermatologist_name . '%');
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
            ->with(['dermatologist.user'])
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

        // Determine platform commission percentage (create default if missing)
        $platformCommissionPercentage = AdminSetting::getValue('platform_commission_percentage');
        if ($platformCommissionPercentage === null) {
            AdminSetting::setValue('platform_commission_percentage', '0', 'number', 'Platform commission percentage for consultations');
            $platformCommissionPercentage = 0;
        }

        $consultationFee = (float) $dermatologist->consultation_fee;
        $platformFeeAmount = round($consultationFee * ((float)$platformCommissionPercentage / 100), 2);
        $dermatologistFeeAmount = round($consultationFee - $platformFeeAmount, 2);

        $appointment = Appointment::create([
            'patient_id' => $user->id,
            'dermatologist_id' => $validated['dermatologist_id'],
            'scheduled_at' => $validated['scheduled_at'],
            'notes' => $validated['notes'] ?? null,
            'consultation_fee' => $consultationFee,
            'platform_fee' => $platformFeeAmount,
            'dermatologist_fee' => $dermatologistFeeAmount,
            'status' => 'scheduled',
        ]);

        $appointment->load(['dermatologist.user']);

        return response()->json([
            'success' => true,
            'message' => 'Appointment created successfully',
            'data' => $appointment
        ], 201);
    }

    /**
     * Export appointments to Excel or CSV format
     */
    private function exportAppointments($appointments, $format)
    {
        $filename = 'appointments_' . date('Y-m-d_H-i-s') . '.' . $format;
        
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
                'Dermatologist Name',
                'Scheduled Date & Time',
                'Status',
                'Consultation Fee',
                'Payment Status',
                'Notes'
            ]);

            // CSV data
            foreach ($appointments as $appointment) {
                fputcsv($file, [
                    $appointment->id,
                    $appointment->dermatologist->user->name ?? 'N/A',
                    $appointment->scheduled_at->format('d M Y, h:i A'),
                    $appointment->status,
                    '₹' . number_format($appointment->consultation_fee, 2),
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
                'Dermatologist Name',
                'Scheduled Date & Time',
                'Status',
                'Consultation Fee',
                'Payment Status',
                'Notes'
            ]);

            // Excel data
            foreach ($appointments as $appointment) {
                fputcsv($file, [
                    $appointment->id,
                    $appointment->dermatologist->user->name ?? 'N/A',
                    $appointment->scheduled_at->format('d M Y, h:i A'),
                    $appointment->status,
                    '₹' . number_format($appointment->consultation_fee, 2),
                    $appointment->is_paid ? 'Paid' : 'Unpaid',
                    $appointment->notes ?? 'N/A'
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
