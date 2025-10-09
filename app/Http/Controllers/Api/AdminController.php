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
     * Get all appointments
     */
    public function getAppointments(Request $request)
    {
        $appointments = Appointment::with(['patient', 'dermatologist.user', 'chatMessages'])
            ->orderBy('scheduled_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $appointments
        ]);
    }

    /**
     * Get appointment chat transcript
     */
    public function getAppointmentChat(Request $request, $id)
    {
        $appointment = Appointment::with(['patient', 'dermatologist.user', 'chatMessages.sender'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $appointment
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
            'brand' => 'required|string',
            'ingredients' => 'required|string',
            'usage_instructions' => 'required|string',
            'price' => 'required|numeric|min:0',
            'requires_prescription' => 'boolean',
            'stock_quantity' => 'required|integer|min:0',
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
            'brand' => 'sometimes|string',
            'ingredients' => 'sometimes|string',
            'usage_instructions' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'requires_prescription' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean',
            'stock_quantity' => 'sometimes|integer|min:0',
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

        return response()->json([
            'success' => true,
            'data' => $settings
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
