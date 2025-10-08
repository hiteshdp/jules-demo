<?php
// Generated via prompt: prompts/dermatologist_auth_controller_v1.md

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

/**
 * @OA\Schema(
 *     schema="DermatologistProfile",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="user_id", type="integer", example=1),
 *     @OA\Property(property="license_number", type="string", example="DR123456"),
 *     @OA\Property(property="specialization", type="string", example="Hair Loss Treatment"),
 *     @OA\Property(property="years_of_experience", type="integer", example=5),
 *     @OA\Property(property="qualifications", type="string", example="MD, Dermatology"),
 *     @OA\Property(property="consultation_fee", type="number", format="float", example=100.00),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T00:00:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-01T00:00:00Z")
 * )
 * 
 * @OA\Tag(
 *     name="Dermatologist Authentication",
 *     description="Dermatologist authentication endpoints"
 * )
 */
class DermatologistAuthController extends Controller
{
    /**
     * @OA\Get(
     *     path="/dermatologist/me",
     *     summary="Get authenticated dermatologist details",
     *     tags={"Dermatologist Authentication"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Dermatologist details retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Dermatologist details retrieved successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="user", type="object",
                     @OA\Property(property="id", type="integer", example=1),
                     @OA\Property(property="name", type="string", example="Dr. Jane Smith"),
                     @OA\Property(property="email", type="string", format="email", example="dermatologist@example.com"),
                     @OA\Property(property="phone", type="string", example="+1234567890"),
                     @OA\Property(property="date_of_birth", type="string", format="date", example="1985-01-01"),
                     @OA\Property(property="gender", type="string", enum={"male","female","other"}, example="female"),
                     @OA\Property(property="role", type="string", example="dermatologist"),
                     @OA\Property(property="is_active", type="boolean", example=true),
                     @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T00:00:00Z"),
                     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-01T00:00:00Z")),
     *                 @OA\Property(property="dermatologist_profile", type="object",
                     @OA\Property(property="id", type="integer", example=1),
                     @OA\Property(property="user_id", type="integer", example=1),
                     @OA\Property(property="license_number", type="string", example="DR123456"),
                     @OA\Property(property="specialization", type="string", example="Hair Loss Treatment"),
                     @OA\Property(property="years_of_experience", type="integer", example=5),
                     @OA\Property(property="qualifications", type="string", example="MD, Dermatology"),
                     @OA\Property(property="consultation_fee", type="number", format="float", example=100.00),
                     @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T00:00:00Z"),
                     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-01T00:00:00Z"))
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
    public function me(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'dermatologist') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        $dermatologistProfile = $user->dermatologistProfile;

        return response()->json([
            'success' => true,
            'message' => 'Dermatologist details retrieved successfully',
            'data' => [
                'user' => $user,
                'dermatologist_profile' => $dermatologistProfile
            ]
        ]);
    }
}
