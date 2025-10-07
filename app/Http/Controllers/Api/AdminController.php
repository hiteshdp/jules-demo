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
 */
class AdminController extends Controller
{
    /**
     * Get dashboard statistics
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
            'available_days' => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            'start_time' => '09:00',
            'end_time' => '17:00',
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
     * Get admin settings
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
     * Update admin settings
     */
    public function updateSettings(Request $request)
    {
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
    }
}
