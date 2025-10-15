<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function register(array $data): array
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone' => $data['phone'] ?? null,
            'date_of_birth' => $data['date_of_birth'] ?? null,
            'gender' => $data['gender'] ?? null,
            'role' => $data['role'],
        ]);

        if ($user->role === 'patient') {
            $user->patientProfile()->create([
                'allergies' => $data['allergies'] ?? null,
                'current_medications' => $data['current_medications'] ?? null,
                'smoking' => $data['smoking'] ?? false,
                'alcohol_consumption' => $data['alcohol_consumption'] ?? false,
            ]);
        } elseif ($user->role === 'dermatologist') {
            $user->dermatologistProfile()->create([
                'license_number' => 'DR'.uniqid(),
                'specialization' => 'General Dermatology',
                'years_of_experience' => 0,
                'qualifications' => 'MD',
                'consultation_fee' => 0,
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function login(array $credentials): array
    {
        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        $user = Auth::user();
        $token = $user->createToken('auth-token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function logout(): void
    {
        Auth::user()->currentAccessToken()->delete();
    }

    public function forgotPassword(string $email): string
    {
        $user = User::where('email', $email)->firstOrFail();

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            ['token' => $token, 'created_at' => now()]
        );

        $resetUrl = config('app.frontend_url', 'http://localhost:3000').'/reset-password?token='.$token.'&email='.urlencode($email);

        try {
            Mail::send('emails.password-reset', [
                'user' => $user,
                'resetUrl' => $resetUrl,
            ], function ($message) use ($user) {
                $message->to($user->email, $user->name)
                    ->subject('Password Reset - Hair & Skin Health');
            });
        } catch (\Exception $e) {
            \Log::error('Failed to send password reset email: '.$e->getMessage());
        }

        return $token;
    }

    public function resetPassword(string $email, string $token, string $password): void
    {
        $passwordReset = DB::table('password_reset_tokens')
            ->where('email', $email)
            ->where('token', $token)
            ->first();

        if (! $passwordReset || now()->diffInHours($passwordReset->created_at) > 24) {
            throw new \Exception('Invalid or expired token.');
        }

        $user = User::where('email', $email)->firstOrFail();
        $user->update(['password' => Hash::make($password)]);

        DB::table('password_reset_tokens')->where('email', $email)->delete();
    }
}
