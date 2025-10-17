<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Dermatologist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class AdminDermatologistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search', '');

        $query = User::where('role', 'dermatologist')->with('dermatologistProfile');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $dermatologists = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $dermatologists->items(),
            'current_page' => $dermatologists->currentPage(),
            'last_page' => $dermatologists->lastPage(),
            'per_page' => $dermatologists->perPage(),
            'total' => $dermatologists->total(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'specialization' => 'required|string|max:255',
            'experience_years' => 'required|integer|min:0',
            'clinic_name' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $validatedData['full_name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'phone' => $validatedData['phone'],
                'role' => 'dermatologist',
            ]);

            $dermatologistProfile = new Dermatologist([
                'specialization' => $validatedData['specialization'],
                'years_of_experience' => $validatedData['experience_years'],
                'clinic_name' => $validatedData['clinic_name'],
                'status' => $validatedData['status'],
            ]);

            $user->dermatologistProfile()->save($dermatologistProfile);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Dermatologist created successfully.',
                'data' => $user->load('dermatologistProfile'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Failed to create dermatologist.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $dermatologist = User::where('role', 'dermatologist')->with('dermatologistProfile')->findOrFail($id);
        return response()->json(['success' => true, 'data' => $dermatologist]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $user = User::where('role', 'dermatologist')->findOrFail($id);

        $validatedData = $request->validate([
            'full_name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
            'phone' => 'nullable|string|max:20',
            'specialization' => 'sometimes|required|string|max:255',
            'experience_years' => 'sometimes|required|integer|min:0',
            'clinic_name' => 'nullable|string|max:255',
            'status' => 'sometimes|required|in:active,inactive',
        ]);

        DB::beginTransaction();
        try {
            $userData = [
                'name' => $validatedData['full_name'] ?? $user->name,
                'email' => $validatedData['email'] ?? $user->email,
                'phone' => $validatedData['phone'] ?? $user->phone,
            ];

            if (!empty($validatedData['password'])) {
                $userData['password'] = Hash::make($validatedData['password']);
            }

            $user->update($userData);

            $profileData = [
                'specialization' => $validatedData['specialization'] ?? $user->dermatologistProfile->specialization,
                'years_of_experience' => $validatedData['experience_years'] ?? $user->dermatologistProfile->experience_years,
                'clinic_name' => $validatedData['clinic_name'] ?? $user->dermatologistProfile->clinic_name,
                'status' => $validatedData['status'] ?? $user->dermatologistProfile->status,
            ];

            $user->dermatologistProfile()->update($profileData);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Dermatologist updated successfully.',
                'data' => $user->load('dermatologistProfile'),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Failed to update dermatologist.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $user = User::where('role', 'dermatologist')->findOrFail($id);

        DB::beginTransaction();
        try {
            $user->dermatologistProfile()->delete();
            $user->delete();

            DB::commit();

            return response()->json(['success' => true, 'message' => 'Dermatologist deleted successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Failed to delete dermatologist.', 'error' => $e->getMessage()], 500);
        }
    }
}