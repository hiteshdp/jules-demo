<?php
// Generated via prompt: prompts/laravel_swagger_documentation_v1.md

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PatientProfile;
use App\Models\Dermatologist;
use App\Models\Appointment;
use App\Models\Product;
use App\Models\Subscription;
use App\Models\Payment;
use App\Models\AdminSetting;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

/**
 * @OA\Tag(
 *     name="Admin",
 *     description="Admin panel endpoints"
 * )
 * 
 * @OA\Schema(
 *     schema="DashboardStats",
 *     type="object",
 *     @OA\Property(property="total_patients", type="integer", example=150, description="Total number of patients"),
 *     @OA\Property(property="total_dermatologists", type="integer", example=25, description="Total number of dermatologists"),
 *     @OA\Property(property="total_appointments", type="integer", example=500, description="Total number of appointments"),
 *     @OA\Property(property="total_revenue", type="number", format="float", example=25000.50, description="Total revenue from completed payments"),
 *     @OA\Property(property="pending_appointments", type="integer", example=15, description="Number of scheduled appointments"),
 *     @OA\Property(property="active_subscriptions", type="integer", example=120, description="Number of active subscriptions")
 * )
 * 
 * @OA\Schema(
 *     schema="MonthlyTrend",
 *     type="object",
 *     @OA\Property(property="month", type="string", example="2024-01", description="Month in YYYY-MM format"),
 *     @OA\Property(property="count", type="integer", example=45, description="Number of appointments for the month"),
 *     @OA\Property(property="total", type="number", format="float", example=5000.00, description="Total revenue for the month")
 * )
 * 
 * @OA\Schema(
 *     schema="DashboardResponse",
 *     type="object",
 *     @OA\Property(property="success", type="boolean", example=true),
 *     @OA\Property(
 *         property="data",
 *         type="object",
 *         @OA\Property(property="stats", ref="#/components/schemas/DashboardStats"),
 *         @OA\Property(
 *             property="monthly_appointments",
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/MonthlyTrend"),
 *             description="Monthly appointment trends for the last 12 months"
 *         ),
 *         @OA\Property(
 *             property="monthly_revenue",
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/MonthlyTrend"),
 *             description="Monthly revenue trends for the last 12 months"
 *         )
 *     )
 * )
 */
class AdminController extends Controller
{
    /**
     * @OA\Get(
     *     path="/admin/dashboard",
     *     summary="Get dashboard statistics",
     *     description="Retrieve comprehensive dashboard statistics including patient counts, revenue, appointments, and monthly trends for the last 12 months",
     *     tags={"Admin"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Dashboard statistics retrieved successfully",
     *         @OA\JsonContent(ref="#/components/schemas/DashboardResponse")
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized - Bearer token required",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Unauthenticated")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Internal server error")
     *         )
     *     )
     * )
     */
    public function getDashboard(Request $request)
    {
        $stats = [
            'total_patients' => User::where('role', 'patient')->count(),
            'total_dermatologists' => User::where('role', 'dermatologist')->count(),
            'total_appointments' => Appointment::count(),
            'total_revenue' => Payment::where('status', 'completed')->sum('amount'),
            'pending_appointments' => Appointment::where('status', 'scheduled')->count(),
            'active_subscriptions' => Subscription::where('status', 'active')->count(),
        ];

        // Monthly appointments trend
        $monthlyAppointments = Appointment::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('COUNT(*) as count')
        )
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Monthly revenue trend
        $monthlyRevenue = Payment::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('SUM(amount) as total')
        )
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'monthly_appointments' => $monthlyAppointments,
                'monthly_revenue' => $monthlyRevenue,
            ]
        ]);
    }

    /**
     * Get all patients
     */
    public function getPatients(Request $request)
    {
        $patients = User::with('patientProfile')
            ->where('role', 'patient')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $patients
        ]);
    }

    /**
     * Get patient details
     */
    public function getPatient(Request $request, $id)
    {
        $patient = User::with(['patientProfile', 'quizResponses.question', 'appointments.dermatologist.user'])
            ->where('role', 'patient')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $patient
        ]);
    }

    /**
     * Update patient status
     */
    public function updatePatientStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $patient = User::where('role', 'patient')->findOrFail($id);
        $patient->update(['is_active' => $request->is_active]);

        return response()->json([
            'success' => true,
            'message' => 'Patient status updated successfully',
            'data' => $patient
        ]);
    }

    /**
     * Get all dermatologists
     */
    public function getDermatologists(Request $request)
    {
        $dermatologists = User::with('dermatologistProfile')
            ->where('role', 'dermatologist')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $dermatologists
        ]);
    }

    /**
     * Create dermatologist
     */
    public function createDermatologist(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'license_number' => 'required|string|unique:dermatologists',
            'specialization' => 'required|string',
            'years_of_experience' => 'required|integer|min:0',
            'qualifications' => 'required|string',
            'consultation_fee' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 'dermatologist',
            'phone' => $request->phone,
        ]);

        $user->dermatologistProfile()->create([
            'license_number' => $request->license_number,
            'specialization' => $request->specialization,
            'years_of_experience' => $request->years_of_experience,
            'qualifications' => $request->qualifications,
            'consultation_fee' => $request->consultation_fee,
            // availability fields removed from dermatologists schema
        ]);

        $user->load('dermatologistProfile');

        return response()->json([
            'success' => true,
            'message' => 'Dermatologist created successfully',
            'data' => $user
        ], 201);
    }

    /**
     * Get all appointments with filters
     */
    public function getAppointments(Request $request)
    {
        $query = Appointment::with([
            'patient',
            'dermatologist.user',
            'chatMessages',
            'payments'
        ]);

        // Apply filters
        if ($request->has('status') && $request->status !== '' && $request->status !== null) {
            $query->where('status', $request->status);
        }

        if ($request->has('dermatologist_id') && $request->dermatologist_id !== '' && $request->dermatologist_id !== null) {
            $query->where('dermatologist_id', $request->dermatologist_id);
        }

        if ($request->has('patient_id') && $request->patient_id !== '' && $request->patient_id !== null) {
            $query->where('patient_id', $request->patient_id);
        }

        if ($request->has('date_from') && $request->date_from !== '' && $request->date_from !== null) {
            $query->whereDate('scheduled_at', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to !== '' && $request->date_to !== null) {
            $query->whereDate('scheduled_at', '<=', $request->date_to);
        }

        $appointments = $query->orderBy('scheduled_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $appointments
        ]);
    }

    /**
     * Get appointment details
     */
    public function getAppointmentDetails(Request $request, $id)
    {
        $appointment = Appointment::with([
            'patient.patientProfile',
            'dermatologist.user',
            'chatMessages',
            'payments'
        ])->findOrFail($id);

        // Ensure zoom_link is absolute for frontend safety
        if (!empty($appointment->zoom_link) && !preg_match('/^https?:\/\//i', $appointment->zoom_link)) {
            $appointment->zoom_link = 'https://' . $appointment->zoom_link;
        }

        return response()->json([
            'success' => true,
            'data' => $appointment
        ]);
    }

    /**
     * Get appointment chat messages
     */
    public function getAppointmentChat(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);
        $chatMessages = $appointment->chatMessages()
            ->with('sender')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $chatMessages
        ]);
    }

    /**
     * Get dermatologists for filter dropdown
     */
    public function getDermatologistsForFilter()
    {
        $dermatologists = Dermatologist::with('user')
            ->get()
            ->map(function ($dermatologist) {
                return [
                    'id' => $dermatologist->user_id,
                    'name' => $dermatologist->user->name,
                    'specialization' => $dermatologist->specialization
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $dermatologists
        ]);
    }

    /**
     * Get patients for filter dropdown
     */
    public function getPatientsForFilter()
    {
        $patients = User::where('role', 'patient')
            ->get()
            ->map(function ($patient) {
                return [
                    'id' => $patient->id,
                    'name' => $patient->name,
                    'email' => $patient->email
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $patients
        ]);
    }


    /**
     * Update an appointment's payment status (admin only)
     */
    public function updateAppointmentPaymentStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,completed',
        ]);

        $appointment = Appointment::with('payments')->findOrFail($id);

        // Get latest payment for this appointment, if any
        $latestPayment = $appointment->payments()->latest('id')->first();

        if ($latestPayment) {
            $latestPayment->status = $request->status;
            // Mark paid_at if completed, otherwise null
            $latestPayment->paid_at = $request->status === 'completed' ? now() : null;
            $latestPayment->save();
        } else {
            // If no payment record exists yet, create a placeholder record
            $latestPayment = $appointment->payments()->create([
                'user_id' => $appointment->patient_id,
                'type' => 'consultation',
                'amount' => $appointment->consultation_fee,
                'currency' => 'INR',
                'status' => $request->status,
                'paid_at' => $request->status === 'completed' ? now() : null,
            ]);
        }

        // Sync appointment boolean flag based on status
        $appointment->is_paid = $request->status === 'completed';
        $appointment->save();

        return response()->json([
            'success' => true,
            'message' => 'Payment status updated successfully',
            'data' => [
                'appointment_id' => $appointment->id,
                'is_paid' => $appointment->is_paid,
                'payment' => $latestPayment,
            ],
        ]);
    }


    /**
     * Get all products
     */
    public function getProducts(Request $request)
    {
        $products = Product::orderBy('name')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Create product
     */
    public function createProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $product = Product::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product
        ], 201);
    }

    /**
     * Update product
     */
    public function updateProduct(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'image' => 'sometimes|string|nullable',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $product = Product::findOrFail($id);
        $product->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $product
        ]);
    }

    /**
     * Get single product
     */
    public function getProduct(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    /**
     * Delete product
     */
    public function deleteProduct(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    }

    /**
     * Get all subscriptions
     */
    public function getSubscriptions(Request $request)
    {
        $subscriptions = Subscription::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $subscriptions
        ]);
    }

    /**
     * Get all payments
     */
    public function getPayments(Request $request)
    {
        $payments = Payment::with(['user', 'payable'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $payments
        ]);
    }

    /**
     * @OA\Get(
     *     path="/admin/settings",
     *     summary="Get admin settings",
     *     tags={"Admin Settings"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Settings retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(
     *                     property="platform_commission_percentage",
     *                     type="object",
     *                     @OA\Property(property="key", type="string", example="platform_commission_percentage"),
     *                     @OA\Property(property="value", type="string", example="10"),
     *                     @OA\Property(property="type", type="string", example="number"),
     *                     @OA\Property(property="description", type="string", example="Platform commission percentage")
     *                 ),
     *                 @OA\Property(
     *                     property="smtp_host",
     *                     type="object",
     *                     @OA\Property(property="key", type="string", example="smtp_host"),
     *                     @OA\Property(property="value", type="string", example="smtp.gmail.com"),
     *                     @OA\Property(property="type", type="string", example="string"),
     *                     @OA\Property(property="description", type="string", example="SMTP server host")
     *                 ),
     *                 @OA\Property(
     *                     property="razorpay_key_id",
     *                     type="object",
     *                     @OA\Property(property="key", type="string", example="razorpay_key_id"),
     *                     @OA\Property(property="value", type="string", example="rzp_test_1234567890"),
     *                     @OA\Property(property="type", type="string", example="string"),
     *                     @OA\Property(property="description", type="string", example="Razorpay Key ID")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/ApiError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/ApiError"))
     * )
     */
    public function getSettings(Request $request)
    {
        $settings = AdminSetting::all()->keyBy('key');

        // Flatten for frontend convenience: { key: value }
        $flat = [];
        foreach ($settings as $key => $setting) {
            $val = $setting->value;
            // Cast booleans and numbers where applicable
            if ($setting->type === 'number') {
                $val = is_numeric($val) ? (0 + $val) : $val;
            } elseif ($setting->type === 'boolean') {
                $val = $val === 'true' || $val === true ? true : false;
            }
            $flat[$key] = $val;
        }

        return response()->json([
            'success' => true,
            'data' => $flat
        ]);
    }

    /**
     * @OA\Put(
     *     path="/admin/settings",
     *     summary="Update admin settings",
     *     tags={"Admin Settings"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="settings",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="key", type="string", example="platform_commission_percentage"),
     *                     @OA\Property(property="value", type="string", example="15"),
     *                     @OA\Property(property="type", type="string", example="number", enum={"string","number","boolean","json"})
     *                 ),
     *                 example={
     *                     {
     *                         "key": "platform_commission_percentage",
     *                         "value": "15",
     *                         "type": "number"
     *                     },
     *                     {
     *                         "key": "smtp_host",
     *                         "value": "smtp.gmail.com",
     *                         "type": "string"
     *                     },
     *                     {
     *                         "key": "email_notifications_enabled",
     *                         "value": "true",
     *                         "type": "boolean"
     *                     }
     *                 }
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Settings updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Settings updated successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Validation errors"),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(
     *                     property="settings",
     *                     type="array",
     *                     @OA\Items(type="string", example="The settings field is required.")
     *                 ),
     *                 @OA\Property(
     *                     property="settings.0.key",
     *                     type="array",
     *                     @OA\Items(type="string", example="The settings.0.key field is required.")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(ref="#/components/schemas/ApiError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/ApiError"))
     * )
     */
    public function updateSettings(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'settings' => 'required|array',
                'settings.*.key' => 'required|string',
                'settings.*.value' => 'required',
                'settings.*.type' => 'sometimes|string|in:string,number,boolean,json',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation errors',
                    'errors' => $validator->errors()
                ], 422);
            }

            foreach ($request->settings as $setting) {
                AdminSetting::setValue(
                    $setting['key'],
                    $setting['value'],
                    $setting['type'] ?? 'string'
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'Settings updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
