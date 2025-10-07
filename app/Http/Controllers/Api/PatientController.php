<?php
// Generated via prompt: prompts/admin_patients_crud_v1.md

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

/**
 * @OA\Info(
 *     title="Hair Loss Diagnosis & Treatment Platform API",
 *     version="1.0.0",
 *     description="Complete API documentation for the Hair Loss Diagnosis & Treatment Platform"
 * )
 * 
 * @OA\Server(
 *     url="http://localhost:8000/api",
 *     description="Development server"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 * 
 * @OA\Schema(
 *     schema="Patient",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="John Doe"),
 *     @OA\Property(property="email", type="string", format="email", example="patient@example.com"),
 *     @OA\Property(property="phone_no", type="string", example="+1234567890"),
 *     @OA\Property(property="dob", type="string", format="date", example="1990-01-01"),
 *     @OA\Property(property="gender", type="string", enum={"male","female","other"}, example="male"),
 *     @OA\Property(property="is_active", type="boolean", example=true),
 *     @OA\Property(property="subscription_status", type="string", example="-"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T00:00:00Z")
 * )
 * 
 * @OA\Schema(
 *     schema="PatientCreateRequest",
 *     type="object",
 *     required={"name","email","phone_no","password"},
 *     @OA\Property(property="name", type="string", example="John Doe"),
 *     @OA\Property(property="email", type="string", format="email", example="patient@example.com"),
 *     @OA\Property(property="phone_no", type="string", example="+1234567890"),
 *     @OA\Property(property="password", type="string", format="password", example="password123"),
 *     @OA\Property(property="dob", type="string", format="date", example="1990-01-01"),
 *     @OA\Property(property="gender", type="string", enum={"male","female","other"}, example="male")
 * )
 * 
 * @OA\Schema(
 *     schema="PatientUpdateRequest",
 *     type="object",
 *     @OA\Property(property="name", type="string", example="John Doe"),
 *     @OA\Property(property="email", type="string", format="email", example="patient@example.com"),
 *     @OA\Property(property="phone_no", type="string", example="+1234567890"),
 *     @OA\Property(property="password", type="string", format="password", example="password123"),
 *     @OA\Property(property="dob", type="string", format="date", example="1990-01-01"),
 *     @OA\Property(property="gender", type="string", enum={"male","female","other"}, example="male"),
 *     @OA\Property(property="is_active", type="boolean", example=true)
 * )
 * 
 * @OA\Schema(
 *     schema="ApiError",
 *     type="object",
 *     @OA\Property(property="success", type="boolean", example=false),
 *     @OA\Property(property="message", type="string", example="Error message"),
 *     @OA\Property(property="error", type="string", example="Detailed error information")
 * )
 * 
 * @OA\Schema(
 *     schema="ValidationError",
 *     type="object",
 *     @OA\Property(property="success", type="boolean", example=false),
 *     @OA\Property(property="message", type="string", example="Validation errors"),
 *     @OA\Property(property="errors", type="object", example={"field": "The field is required."})
 * )
 * 
 * @OA\Tag(
 *     name="Patients",
 *     description="Patient management endpoints (Admin)"
 * )
 */
class PatientController extends Controller
{
    /**
     * @OA\Get(
     *     path="/admin/patients",
     *     summary="List patients",
     *     tags={"Patients"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="page", in="query", @OA\Schema(type="integer", example=1)),
     *     @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer", example=15)),
     *     @OA\Parameter(name="search", in="query", @OA\Schema(type="string", example="john")),
     *     @OA\Response(
     *         response=200,
     *         description="Patients retrieved",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Patients retrieved successfully"),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Patient")),
     *             @OA\Property(property="current_page", type="integer", example=1),
     *             @OA\Property(property="last_page", type="integer", example=5),
     *             @OA\Property(property="per_page", type="integer", example=15),
     *             @OA\Property(property="total", type="integer", example=75)
     *         )
     *     ),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/ApiError"))
     * )
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = (int)($request->query('per_page', 15));
            $query = User::where('role', 'patient')
                ->select([
                    'id',
                    'name',
                    'email',
                    'phone as phone_no',
                    'date_of_birth as dob',
                    'gender',
                    'is_active',
                    'created_at'
                ])
                ->orderBy('created_at', 'desc');

            if ($search = trim((string)$request->query('search', ''))) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            }

            $patients = $query->paginate($perPage);

            $patients->getCollection()->transform(function ($patient) {
                $patient->subscription_status = '-';
                return $patient;
            });

            return response()->json([
                'success' => true,
                'message' => 'Patients retrieved successfully',
                'data' => $patients->items(),
                'current_page' => $patients->currentPage(),
                'last_page' => $patients->lastPage(),
                'per_page' => $patients->perPage(),
                'total' => $patients->total(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve patients',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/admin/patients",
     *     summary="Create patient",
     *     tags={"Patients"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/PatientCreateRequest")),
     *     @OA\Response(response=201, description="Created", @OA\JsonContent(ref="#/components/schemas/Patient")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/ApiError"))
     * )
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $patientData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => [
                    'required',
                    'email',
                    'max:255',
                    Rule::unique('users', 'email'),
                ],
                'phone_no' => 'required|string|max:20',
                'password' => 'required|string|min:6',
                'dob' => 'nullable|date|before:today',
                'gender' => 'nullable|in:male,female,other',
            ]);

            $patientData['role'] = 'patient';
            $patientData['is_active'] = true;
            $patientData['phone'] = $patientData['phone_no'];
            $patientData['date_of_birth'] = $patientData['dob'] ?? null;
            $patientData['password'] = Hash::make($patientData['password']);

            $patient = User::create($patientData);

            return response()->json([
                'success' => true,
                'message' => 'Patient created successfully',
                'data' => [
                    'id' => $patient->id,
                    'name' => $patient->name,
                    'email' => $patient->email,
                    'phone_no' => $patient->phone,
                    'dob' => $patient->date_of_birth,
                    'gender' => $patient->gender,
                    'is_active' => $patient->is_active,
                    'subscription_status' => '-',
                    'created_at' => $patient->created_at,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create patient',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/admin/patients/{id}",
     *     summary="Get patient",
     *     tags={"Patients"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", example="1")),
     *     @OA\Response(response=200, description="OK", @OA\JsonContent(ref="#/components/schemas/Patient")),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/ApiError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/ApiError"))
     * )
     */
    public function show(string $id): JsonResponse
    {
        try {
            $patient = User::where('role', 'patient')
                ->where('id', $id)
                ->select([
                    'id',
                    'name',
                    'email',
                    'phone as phone_no',
                    'date_of_birth as dob',
                    'gender',
                    'is_active',
                    'created_at'
                ])
                ->first();

            if (!$patient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Patient not found'
                ], 404);
            }

            $patient->subscription_status = '-';

            return response()->json([
                'success' => true,
                'message' => 'Patient retrieved successfully',
                'data' => $patient
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve patient',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/admin/patients/{id}",
     *     summary="Update patient",
     *     tags={"Patients"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", example="1")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/PatientUpdateRequest")),
     *     @OA\Response(response=200, description="Updated", @OA\JsonContent(ref="#/components/schemas/Patient")),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/ApiError")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/ApiError"))
     * )
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $patient = User::where('role', 'patient')->where('id', $id)->first();
            if (!$patient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Patient not found'
                ], 404);
            }

            $updateData = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => [
                    'sometimes',
                    'required',
                    'email',
                    'max:255',
                    Rule::unique('users', 'email')->ignore($patient->id),
                ],
                'phone_no' => 'sometimes|required|string|max:20',
                'password' => 'sometimes|nullable|string|min:6',
                'dob' => 'nullable|date|before:today',
                'gender' => 'nullable|in:male,female,other',
                'is_active' => 'sometimes|boolean',
            ]);

            if (isset($updateData['phone_no'])) {
                $updateData['phone'] = $updateData['phone_no'];
                unset($updateData['phone_no']);
            }
            if (isset($updateData['dob'])) {
                $updateData['date_of_birth'] = $updateData['dob'];
                unset($updateData['dob']);
            }
            if (array_key_exists('password', $updateData)) {
                if ($updateData['password']) {
                    $updateData['password'] = Hash::make($updateData['password']);
                } else {
                    unset($updateData['password']);
                }
            }

            $patient->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Patient updated successfully',
                'data' => [
                    'id' => $patient->id,
                    'name' => $patient->name,
                    'email' => $patient->email,
                    'phone_no' => $patient->phone,
                    'dob' => $patient->date_of_birth,
                    'gender' => $patient->gender,
                    'is_active' => $patient->is_active,
                    'subscription_status' => '-',
                    'created_at' => $patient->created_at,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update patient',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/admin/patients/{id}",
     *     summary="Delete patient",
     *     tags={"Patients"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", example="1")),
     *     @OA\Response(response=200, description="Deleted", @OA\JsonContent(@OA\Property(property="success", type="boolean", example=true), @OA\Property(property="message", type="string", example="Patient deleted successfully"))),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/ApiError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/ApiError"))
     * )
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $patient = User::where('role', 'patient')->where('id', $id)->first();
            if (!$patient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Patient not found'
                ], 404);
            }

            $patient->delete();

            return response()->json([
                'success' => true,
                'message' => 'Patient deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete patient',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/patient/dermatologists",
     *     summary="Get available dermatologists",
     *     description="Get list of available dermatologists for appointment booking",
     *     tags={"Patients"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Dermatologists retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Dermatologists retrieved successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(
     *                     property="dermatologists",
     *                     type="array",
     *                     @OA\Items(
     *                         @OA\Property(property="id", type="integer", example=1),
     *                         @OA\Property(property="name", type="string", example="Dr. Jane Smith"),
     *                         @OA\Property(property="email", type="string", example="dermatologist@example.com"),
     *                         @OA\Property(property="specialization", type="string", example="Hair Loss Treatment"),
     *                         @OA\Property(property="consultation_fee", type="number", format="float", example=100.00),
     *                         @OA\Property(property="years_of_experience", type="integer", example=5),
     *                         @OA\Property(property="qualifications", type="string", example="MD, Dermatology")
     *                     )
     *                 )
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
    public function getDermatologists(Request $request): JsonResponse
    {
        try {
            $dermatologists = User::where('role', 'dermatologist')
                ->where('is_active', true)
                ->with('dermatologistProfile')
                ->get()
                ->map(function ($user) {
                    $profile = $user->dermatologistProfile;
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'specialization' => $profile ? $profile->specialization : 'General Dermatology',
                        'consultation_fee' => $profile ? $profile->consultation_fee : 0,
                        'years_of_experience' => $profile ? $profile->years_of_experience : 0,
                        'qualifications' => $profile ? $profile->qualifications : 'MD'
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'Dermatologists retrieved successfully',
                'data' => [
                    'dermatologists' => $dermatologists
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve dermatologists',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
