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
 * @OA\Tag(
 *     name="Dermatologist Authentication",
 *     description="Dermatologist authentication endpoints"
 * )
 */
class DermatologistAuthController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/dermatologist/me",
     *     summary="Get authenticated dermatologist details",
     *     tags={"Dermatologist Authentication"},
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Dermatologist details retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Dermatologist details retrieved successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="user", ref="#/components/schemas/User"),
     *                 @OA\Property(property="dermatologist_profile", ref="#/components/schemas/DermatologistProfile")
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
