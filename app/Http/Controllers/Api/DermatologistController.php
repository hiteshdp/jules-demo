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
 * @OA\Tag(
 *     name="Dermatologists",
 *     description="Dermatologist management endpoints (Admin)"
 * )
 */
class DermatologistController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/admin/dermatologists",
     *     summary="List dermatologists",
     *     tags={"Dermatologists"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="page", in="query", @OA\Schema(type="integer", example=1)),
     *     @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer", example=15)),
     *     @OA\Parameter(name="search", in="query", @OA\Schema(type="string", example="john")),
     *     @OA\Response(
     *         response=200,
     *         description="Dermatologists retrieved",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Dermatologists retrieved successfully"),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Dermatologist")),
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
            $query = User::where('role', 'dermatologist')
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

            $dermatologists = $query->paginate($perPage);

            $dermatologists->getCollection()->transform(function ($dermatologist) {
                $dermatologist->subscription_status = '-';
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
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/admin/dermatologists",
     *     summary="Create dermatologist",
     *     tags={"Dermatologists"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/DermatologistCreateRequest")),
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
                'phone_no' => 'required|string|max:20',
                'password' => 'required|string|min:6',
                'dob' => 'nullable|date|before:today',
                'gender' => 'nullable|in:male,female,other',
            ]);

            $dermatologistData['role'] = 'dermatologist';
            $dermatologistData['is_active'] = true;
            $dermatologistData['phone'] = $dermatologistData['phone_no'];
            $dermatologistData['date_of_birth'] = $dermatologistData['dob'] ?? null;
            $dermatologistData['password'] = Hash::make($dermatologistData['password']);

            $dermatologist = User::create($dermatologistData);

            return response()->json([
                'success' => true,
                'message' => 'Dermatologist created successfully',
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
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create dermatologist',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/admin/dermatologists/{id}",
     *     summary="Get dermatologist",
     *     tags={"Dermatologists"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", example="1")),
     *     @OA\Response(response=200, description="OK", @OA\JsonContent(ref="#/components/schemas/Dermatologist")),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/ApiError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/ApiError"))
     * )
     */
    public function show(string $id): JsonResponse
    {
        try {
            $dermatologist = User::where('role', 'dermatologist')
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

            if (!$dermatologist) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dermatologist not found'
                ], 404);
            }

            $dermatologist->subscription_status = '-';

            return response()->json([
                'success' => true,
                'message' => 'Dermatologist retrieved successfully',
                'data' => $dermatologist
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve dermatologist',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/admin/dermatologists/{id}",
     *     summary="Update dermatologist",
     *     tags={"Dermatologists"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", example="1")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/DermatologistUpdateRequest")),
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
            if (!$dermatologist) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dermatologist not found'
                ], 404);
            }

            $updateData = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => [
                    'sometimes',
                    'required',
                    'email',
                    'max:255',
                    Rule::unique('users', 'email')->ignore($dermatologist->id),
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

            $dermatologist->update($updateData);

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
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update dermatologist',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/admin/dermatologists/{id}",
     *     summary="Delete dermatologist",
     *     tags={"Dermatologists"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", example="1")),
     *     @OA\Response(response=200, description="Deleted", @OA\JsonContent(@OA\Property(property="success", type="boolean", example=true), @OA\Property(property="message", type="string", example="Dermatologist deleted successfully"))),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/ApiError")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/ApiError"))
     * )
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $dermatologist = User::where('role', 'dermatologist')->where('id', $id)->first();
            if (!$dermatologist) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dermatologist not found'
                ], 404);
            }

            $dermatologist->delete();

            return response()->json([
                'success' => true,
                'message' => 'Dermatologist deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete dermatologist',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
