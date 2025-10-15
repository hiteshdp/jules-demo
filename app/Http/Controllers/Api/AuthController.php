<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends BaseController
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $data = $this->authService->login($request->validated());

            return $this->sendResponse($data, 'Login successful.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->sendError('Invalid credentials.', $e->errors(), 401);
        }
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $this->authService->register($request->validated());

        return $this->sendResponse($data, 'User registered successfully.', 201);
    }

    public function logout(): JsonResponse
    {
        $this->authService->logout();

        return $this->sendResponse([], 'Logout successful.');
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user->role === 'patient') {
            $user->load('patientProfile');
        } elseif ($user->role === 'dermatologist') {
            $user->load('dermatologistProfile');
        }

        return $this->sendResponse(['user' => $user], 'User data retrieved successfully.');
    }

    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $this->authService->forgotPassword($request->validated()['email']);

        return $this->sendResponse([], 'Password reset link sent to your email.');
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        try {
            $this->authService->resetPassword(
                $request->validated()['email'],
                $request->validated()['token'],
                $request->validated()['password']
            );

            return $this->sendResponse([], 'Password reset successfully.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 400);
        }
    }
}
