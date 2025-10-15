<?php

// Generated via prompt: prompts/admin_dermatologists_crud_v1.md

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

/**
 * @OA\Schema(
 *     schema="Dermatologist",
 *     type="object",
 *
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Dr. Jane Smith"),
 *     @OA\Property(property="email", type="string", format="email", example="dermatologist@example.com"),
 *     @OA\Property(property="phone_no", type="string", example="+1234567890"),
 *     @OA\Property(property="dob", type="string", format="date", example="1985-01-01"),
 *     @OA\Property(property="gender", type="string", enum={"male","female","other"}, example="female"),
 *     @OA\Property(property="is_active", type="boolean", example=true),
 *     @OA\Property(property="subscription_status", type="string", example="-"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T00:00:00Z")
 * )
 *
 * @OA\Schema(
 *     schema="DermatologistCreateRequest",
 *     type="object",
 *     required={"name","email","phone_no","password","license_number","specialization","years_of_experience","qualifications","consultation_fee"},
 *
 *     @OA\Property(property="name", type="string", example="Dr. Jane Smith"),
 *     @OA\Property(property="email", type="string", format="email", example="dermatologist@example.com"),
 *     @OA\Property(property="phone_no", type="string", example="+1234567890"),
 *     @OA\Property(property="password", type="string", format="password", example="password123"),
 *     @OA\Property(property="dob", type="string", format="date", example="1985-01-01"),
 *     @OA\Property(property="gender", type="string", enum={"male","female","other"}, example="female"),
 *     @OA\Property(property="license_number", type="string", example="DMT123456"),
 *     @OA\Property(property="specialization", type="string", example="Hair Loss Treatment"),
 *     @OA\Property(property="years_of_experience", type="integer", example=5),
 *     @OA\Property(property="qualifications", type="string", example="MD, Board Certified Dermatologist"),
 *     @OA\Property(property="consultation_fee", type="number", format="float", example=150.00),
 *     @OA\Property(property="bio", type="string", example="Experienced dermatologist specializing in hair loss treatments")
 * )
 *
 * @OA\Schema(
 *     schema="DermatologistUpdateRequest",
 *     type="object",
 *
 *     @OA\Property(property="name", type="string", example="Dr. Jane Smith"),
 *     @OA\Property(property="email", type="string", format="email", example="dermatologist@example.com"),
 *     @OA\Property(property="phone_no", type="string", example="+1234567890"),
 *     @OA\Property(property="password", type="string", format="password", example="password123"),
 *     @OA\Property(property="dob", type="string", format="date", example="1985-01-01"),
 *     @OA\Property(property="gender", type="string", enum={"male","female","other"}, example="female"),
 *     @OA\Property(property="is_active", type="boolean", example=true),
 *     @OA\Property(property="license_number", type="string", example="DMT123456"),
 *     @OA\Property(property="specialization", type="string", example="Hair Loss Treatment"),
 *     @OA\Property(property="years_of_experience", type="integer", example=5),
 *     @OA\Property(property="qualifications", type="string", example="MD, Board Certified Dermatologist"),
 *     @OA\Property(property="consultation_fee", type="number", format="float", example=150.00),
 *     @OA\Property(property="bio", type="string", example="Experienced dermatologist specializing in hair loss treatments")
 * )
 *
 * @OA\Tag(
 *     name="Dermatologists",
 *     description="Dermatologist management endpoints (Admin)"
 * )
 */
class DermatologistController extends Controller
{
    /**
     * @OA\Get(
     *     path="/admin/dermatologists",
     *     summary="List dermatologists",
     *     tags={"Dermatologists"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Parameter(name="page", in="query", @OA\Schema(type="integer", example=1)),
     *     @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer", example=15)),
     *     @OA\Parameter(name="search", in="query", @OA\Schema(type="string", example="john")),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Dermatologists retrieved",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Dermatologists retrieved successfully"),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Dermatologist")),
     *             @OA\Property(property="current_page", type="integer", example=1),
     *             @OA\Property(property="last_page", type="integer", example=5),
     *             @OA\Property(property="per_page", type="integer", example=15),
     *             @OA\Property(property="total", type="integer", example=75)
     *         )
     *     ),
     *
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/ApiError"))
     * )
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = (int) ($request->query('per_page', 15));
            $query = User::where('role', 'dermatologist')
                ->select([
                    'id',
                    'name',
                    'email',
                    'phone as phone_no',
                    'date_of_birth as dob',
                    'gender',
                    'is_active',
                    'created_at',
                ])
                ->orderBy('created_at', 'desc');

            if ($search = trim((string) $request->query('search', ''))) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            }

            $dermatologists = $query->paginate($perPage);

            $dermatologists->getCollection()->transform(function ($dermatologist) {
                $dermatologist->subscription_status = '-';

                // Load profile data
                $profile = \App\Models\Dermatologist::where('user_id', $dermatologist->id)
                    ->select([
                        'license_number',
                        'specialization',
                        'years_of_experience',
                        'qualifications',
                        'consultation_fee',
                        'bio',
                    ])->first();

                $dermatologist->profile = $profile;

                return $dermatologist;
            });

            return response()->json([
                'success' => true,
                'message' => 'Dermatologists retrieved successfully',
                'data' => $dermatologists->items(),
                'current_page' => $dermatologists->currentPage(),
                'last_page' => $dermatologists->lastPage(),
                'per_page' => $dermatologists->perPage(),
                'total' => $dermatologists->total(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve dermatologists',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/admin/dermatologists",
     *     summary="Create dermatologist",
     *     tags={"Dermatologists"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/DermatologistCreateRequest")),
     *
     *     @OA\Response(response=201, description="Created", @OA\JsonContent(ref="#/components/schemas/Dermatologist")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/ApiError"))
     * )
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $dermatologistData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => [
                    'required',
                    'email',
                    'max:255',
                    Rule::unique('users', 'email'),
                ],
                'phone_no' => 'nullable|string|max:20',
                'password' => 'required|string|min:6',
                'dob' => 'nullable|date|before:today',
                'gender' => 'nullable|in:male,female,other',
                // Professional fields
                'license_number' => 'required|string|max:255|unique:dermatologists,license_number',
                'specialization' => 'required|string|max:255',
                'years_of_experience' => 'required|integer|min:0|max:50',
                'qualifications' => 'required|string',
                'consultation_fee' => 'required|numeric|min:0',
                'bio' => 'nullable|string',
            ]);

            $userData = [
                'name' => $dermatologistData['name'],
                'email' => $dermatologistData['email'],
                'phone' => $dermatologistData['phone_no'] ?? null,
                'password' => Hash::make($dermatologistData['password']),
                'date_of_birth' => $dermatologistData['dob'] ?? null,
                'gender' => $dermatologistData['gender'],
                'role' => 'dermatologist',
                'is_active' => true,
            ];

            $user = User::create($userData);

            // Create dermatologist profile
            $profileData = [
                'user_id' => $user->id,
                'license_number' => $dermatologistData['license_number'],
                'specialization' => $dermatologistData['specialization'],
                'years_of_experience' => $dermatologistData['years_of_experience'],
                'qualifications' => $dermatologistData['qualifications'],
                'consultation_fee' => $dermatologistData['consultation_fee'],
                'bio' => $dermatologistData['bio'] ?? null,
            ];

            \App\Models\Dermatologist::create($profileData);

            return response()->json([
                'success' => true,
                'message' => 'Dermatologist created successfully',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone_no' => $user->phone,
                    'dob' => $user->date_of_birth,
                    'gender' => $user->gender,
                    'is_active' => $user->is_active,
                    'subscription_status' => '-',
                    'created_at' => $user->created_at,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create dermatologist',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/admin/dermatologists/{id}",
     *     summary="Get dermatologist",
     *     tags={"Dermatologists"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", example="1")),
     *
     *     @OA\Response(response=200, description="OK", @OA\JsonContent(ref="#/components/schemas/Dermatologist")),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/ApiError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/ApiError"))
     * )
     */
    public function show(string $id): JsonResponse
    {
        try {
            $user = User::where('role', 'dermatologist')
                ->where('id', $id)
                ->select([
                    'id',
                    'name',
                    'email',
                    'phone as phone_no',
                    'date_of_birth as dob',
                    'gender',
                    'is_active',
                    'created_at',
                ])
                ->first();

            if (! $user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dermatologist not found',
                ], 404);
            }

            // Load related dermatologist profile by user_id
            $profile = \App\Models\Dermatologist::where('user_id', $user->id)
                ->select([
                    'user_id',
                    'license_number',
                    'specialization',
                    'years_of_experience',
                    'qualifications',
                    'bio',
                    'consultation_fee',
                ])->first();

            $dermatologist = $user;
            $dermatologist->subscription_status = '-';
            $dermatologist->profile = $profile;

            return response()->json([
                'success' => true,
                'message' => 'Dermatologist retrieved successfully',
                'data' => $dermatologist,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve dermatologist',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/admin/dermatologists/{id}",
     *     summary="Update dermatologist",
     *     tags={"Dermatologists"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", example="1")),
     *
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/DermatologistUpdateRequest")),
     *
     *     @OA\Response(response=200, description="Updated", @OA\JsonContent(ref="#/components/schemas/Dermatologist")),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/ApiError")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ValidationError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/ApiError"))
     * )
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $dermatologist = User::where('role', 'dermatologist')->where('id', $id)->first();
            if (! $dermatologist) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dermatologist not found',
                ], 404);
            }

            // Get the dermatologist profile to get the correct ID for unique validation
            $dermatologistProfile = \App\Models\Dermatologist::where('user_id', $dermatologist->id)->first();
            $dermatologistProfileId = $dermatologistProfile ? $dermatologistProfile->id : null;

            $updateData = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => [
                    'sometimes',
                    'required',
                    'email',
                    'max:255',
                    Rule::unique('users', 'email')->ignore($dermatologist->id),
                ],
                'phone_no' => 'sometimes|nullable|string|max:20',
                'password' => 'sometimes|nullable|string|min:6',
                'dob' => 'nullable|date|before:today',
                'gender' => 'nullable|in:male,female,other',
                'is_active' => 'sometimes|boolean',
                // Professional fields
                'license_number' => 'sometimes|nullable|string|max:255|unique:dermatologists,license_number,'.$dermatologistProfileId,
                'specialization' => 'sometimes|nullable|string|max:255',
                'years_of_experience' => 'sometimes|nullable|integer|min:0|max:50',
                'qualifications' => 'sometimes|nullable|string',
                'consultation_fee' => 'sometimes|nullable|numeric|min:0',
                'bio' => 'nullable|string',
            ]);

            // Separate user and profile data
            $userData = [];
            $profileData = [];

            if (isset($updateData['name'])) {
                $userData['name'] = $updateData['name'];
            }
            if (isset($updateData['email'])) {
                $userData['email'] = $updateData['email'];
            }
            if (isset($updateData['phone_no'])) {
                $userData['phone'] = $updateData['phone_no'] ?: null;
                unset($updateData['phone_no']);
            }
            if (isset($updateData['dob'])) {
                $userData['date_of_birth'] = $updateData['dob'];
                unset($updateData['dob']);
            }
            if (isset($updateData['gender'])) {
                $userData['gender'] = $updateData['gender'];
            }
            if (isset($updateData['is_active'])) {
                $userData['is_active'] = $updateData['is_active'];
            }
            if (array_key_exists('password', $updateData)) {
                if ($updateData['password']) {
                    $userData['password'] = Hash::make($updateData['password']);
                }
                unset($updateData['password']);
            }

            // Profile fields - only update if values are provided and not empty
            if (isset($updateData['license_number']) && ! empty(trim($updateData['license_number']))) {
                $profileData['license_number'] = $updateData['license_number'];
            }
            if (isset($updateData['specialization']) && ! empty(trim($updateData['specialization']))) {
                $profileData['specialization'] = $updateData['specialization'];
            }
            if (isset($updateData['years_of_experience']) && $updateData['years_of_experience'] !== null) {
                $profileData['years_of_experience'] = $updateData['years_of_experience'];
            }
            if (isset($updateData['qualifications']) && ! empty(trim($updateData['qualifications']))) {
                $profileData['qualifications'] = $updateData['qualifications'];
            }
            if (isset($updateData['consultation_fee']) && $updateData['consultation_fee'] !== null) {
                $profileData['consultation_fee'] = $updateData['consultation_fee'];
            }
            if (isset($updateData['bio'])) {
                $profileData['bio'] = $updateData['bio'];
            }

            // Update user data
            if (! empty($userData)) {
                $dermatologist->update($userData);
            }

            // Update or create profile data
            if (! empty($profileData)) {
                $profile = \App\Models\Dermatologist::where('user_id', $dermatologist->id)->first();
                if ($profile) {
                    $profile->update($profileData);
                } else {
                    $profileData['user_id'] = $dermatologist->id;
                    \App\Models\Dermatologist::create($profileData);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Dermatologist updated successfully',
                'data' => [
                    'id' => $dermatologist->id,
                    'name' => $dermatologist->name,
                    'email' => $dermatologist->email,
                    'phone_no' => $dermatologist->phone,
                    'dob' => $dermatologist->date_of_birth,
                    'gender' => $dermatologist->gender,
                    'is_active' => $dermatologist->is_active,
                    'subscription_status' => '-',
                    'created_at' => $dermatologist->created_at,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update dermatologist',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/admin/dermatologists/{id}",
     *     summary="Delete dermatologist",
     *     tags={"Dermatologists"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", example="1")),
     *
     *     @OA\Response(response=200, description="Deleted", @OA\JsonContent(@OA\Property(property="success", type="boolean", example=true), @OA\Property(property="message", type="string", example="Dermatologist deleted successfully"))),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/ApiError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/ApiError"))
     * )
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $dermatologist = User::where('role', 'dermatologist')->where('id', $id)->first();
            if (! $dermatologist) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dermatologist not found',
                ], 404);
            }

            $dermatologist->delete();

            return response()->json([
                'success' => true,
                'message' => 'Dermatologist deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete dermatologist',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/dermatologist/profile",
     *     summary="Get dermatologist profile",
     *     description="Get current authenticated dermatologist's profile information",
     *     tags={"Dermatologists"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Response(
     *         response=200,
     *         description="Dermatologist profile retrieved successfully",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Profile retrieved successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Dr. Jane Smith"),
     *                 @OA\Property(property="email", type="string", example="dermatologist@example.com"),
     *                 @OA\Property(property="phone", type="string", example="+1234567890"),
     *                 @OA\Property(property="date_of_birth", type="string", format="date", example="1985-01-01"),
     *                 @OA\Property(property="gender", type="string", example="female"),
     *                 @OA\Property(
     *                     property="dermatologistProfile",
     *                     type="object",
     *                     @OA\Property(property="license_number", type="string", example="MD123456"),
     *                     @OA\Property(property="specialization", type="string", example="Hair Loss Treatment"),
     *                     @OA\Property(property="years_of_experience", type="integer", example=5),
     *                     @OA\Property(property="qualifications", type="string", example="MD, Dermatology"),
     *                     @OA\Property(property="consultation_fee", type="number", format="float", example=100.00),
     *                     @OA\Property(property="bio", type="string", example="Experienced dermatologist specializing in hair loss treatment")
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="message", type="string", example="Unauthenticated")
     *         )
     *     )
     * )
     */
    public function getProfile(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if ($user->role !== 'dermatologist') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Dermatologist role required.',
                ], 403);
            }

            $user->load('dermatologistProfile');

            return response()->json([
                'success' => true,
                'message' => 'Profile retrieved successfully',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'date_of_birth' => $user->date_of_birth,
                    'gender' => $user->gender,
                    'dermatologistProfile' => $user->dermatologistProfile,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve profile',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/dermatologist/profile",
     *     summary="Update dermatologist profile",
     *     description="Update current authenticated dermatologist's profile information",
     *     tags={"Dermatologists"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\RequestBody(
     *         required=true,
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="name", type="string", example="Dr. Jane Smith"),
     *             @OA\Property(property="email", type="string", format="email", example="dermatologist@example.com"),
     *             @OA\Property(property="phone", type="string", example="+1234567890"),
     *             @OA\Property(property="date_of_birth", type="string", format="date", example="1985-01-01"),
     *             @OA\Property(property="gender", type="string", enum={"male","female","other"}, example="female"),
     *             @OA\Property(property="license_number", type="string", example="MD123456"),
     *             @OA\Property(property="specialization", type="string", example="Hair Loss Treatment"),
     *             @OA\Property(property="years_of_experience", type="integer", example=5),
     *             @OA\Property(property="qualifications", type="string", example="MD, Dermatology"),
     *             @OA\Property(property="consultation_fee", type="number", format="float", example=100.00),
     *             @OA\Property(property="bio", type="string", example="Experienced dermatologist specializing in hair loss treatment")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Profile updated successfully",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Profile updated successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Dr. Jane Smith"),
     *                 @OA\Property(property="email", type="string", example="dermatologist@example.com"),
     *                 @OA\Property(property="phone", type="string", example="+1234567890"),
     *                 @OA\Property(property="date_of_birth", type="string", format="date", example="1985-01-01"),
     *                 @OA\Property(property="gender", type="string", example="female"),
     *                 @OA\Property(
     *                     property="dermatologistProfile",
     *                     type="object",
     *                     @OA\Property(property="license_number", type="string", example="MD123456"),
     *                     @OA\Property(property="specialization", type="string", example="Hair Loss Treatment"),
     *                     @OA\Property(property="years_of_experience", type="integer", example=5),
     *                     @OA\Property(property="qualifications", type="string", example="MD, Dermatology"),
     *                     @OA\Property(property="consultation_fee", type="number", format="float", example=100.00),
     *                     @OA\Property(property="bio", type="string", example="Experienced dermatologist specializing in hair loss treatment")
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="message", type="string", example="Unauthenticated")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Validation errors"),
     *             @OA\Property(property="errors", type="object", example={"field": "The field is required."})
     *         )
     *     )
     * )
     */
    public function updateProfile(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if ($user->role !== 'dermatologist') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Dermatologist role required.',
                ], 403);
            }

            // Get the dermatologist profile to get the correct ID for unique validation
            $dermatologistProfile = \App\Models\Dermatologist::where('user_id', $user->id)->first();
            $dermatologistProfileId = $dermatologistProfile ? $dermatologistProfile->id : null;

            $updateData = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => [
                    'sometimes',
                    'required',
                    'email',
                    'max:255',
                    Rule::unique('users', 'email')->ignore($user->id),
                ],
                'phone' => 'sometimes|nullable|string|max:20',
                'date_of_birth' => 'nullable|date|before:today',
                'gender' => 'nullable|in:male,female,other',
                // Professional fields
                'license_number' => 'sometimes|nullable|string|max:255|unique:dermatologists,license_number,'.$dermatologistProfileId,
                'specialization' => 'sometimes|nullable|string|max:255',
                'years_of_experience' => 'sometimes|nullable|integer|min:0|max:50',
                'qualifications' => 'sometimes|nullable|string',
                'consultation_fee' => 'sometimes|nullable|numeric|min:0',
                'bio' => 'nullable|string',
            ]);

            // Separate user and profile data
            $userData = [];
            $profileData = [];

            if (isset($updateData['name'])) {
                $userData['name'] = $updateData['name'];
            }
            if (isset($updateData['email'])) {
                $userData['email'] = $updateData['email'];
            }
            if (isset($updateData['phone'])) {
                $userData['phone'] = $updateData['phone'];
            }
            if (isset($updateData['date_of_birth'])) {
                $userData['date_of_birth'] = $updateData['date_of_birth'];
            }
            if (isset($updateData['gender'])) {
                $userData['gender'] = $updateData['gender'];
            }

            // Profile fields - only update if values are provided and not empty
            if (isset($updateData['license_number']) && ! empty(trim($updateData['license_number']))) {
                $profileData['license_number'] = $updateData['license_number'];
            }
            if (isset($updateData['specialization']) && ! empty(trim($updateData['specialization']))) {
                $profileData['specialization'] = $updateData['specialization'];
            }
            if (isset($updateData['years_of_experience']) && $updateData['years_of_experience'] !== null) {
                $profileData['years_of_experience'] = $updateData['years_of_experience'];
            }
            if (isset($updateData['qualifications']) && ! empty(trim($updateData['qualifications']))) {
                $profileData['qualifications'] = $updateData['qualifications'];
            }
            if (isset($updateData['consultation_fee']) && $updateData['consultation_fee'] !== null) {
                $profileData['consultation_fee'] = $updateData['consultation_fee'];
            }
            if (isset($updateData['bio'])) {
                $profileData['bio'] = $updateData['bio'];
            }

            // Update user data
            if (! empty($userData)) {
                $user->update($userData);
            }

            // Update or create profile data
            if (! empty($profileData)) {
                $profile = \App\Models\Dermatologist::where('user_id', $user->id)->first();
                if ($profile) {
                    $profile->update($profileData);
                } else {
                    $profileData['user_id'] = $user->id;
                    \App\Models\Dermatologist::create($profileData);
                }
            }

            // Reload user with profile
            $user->load('dermatologistProfile');

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'date_of_birth' => $user->date_of_birth,
                    'gender' => $user->gender,
                    'dermatologistProfile' => $user->dermatologistProfile,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
