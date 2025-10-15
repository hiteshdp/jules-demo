<?php

namespace App\Services;

use App\Models\AdminSetting;
use App\Models\Appointment;
use App\Models\Dermatologist;
use Illuminate\Http\Request;

class AppointmentService
{
    public function getAppointments(Request $request)
    {
        $user = $request->user();

        $query = Appointment::where('patient_id', $user->id)
            ->with(['dermatologist.user']);

        if ($request->has('dermatologist_name')) {
            $query->whereHas('dermatologist.user', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->dermatologist_name . '%');
            });
        }

        if ($request->has('date_from')) {
            $query->whereDate('scheduled_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('scheduled_at', '<=', $request->date_to);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $appointments = $query->orderBy('scheduled_at', 'desc')->get();

        $appointments->transform(function ($appointment) {
            $appointment->formatted_date_time = $appointment->scheduled_at->format('d/m/Y, h:i A');
            return $appointment;
        });

        return $appointments;
    }

    public function createAppointment(array $validatedData, $user)
    {
        $dermatologist = Dermatologist::where('user_id', $validatedData['dermatologist_id'])->first();

        if (!$dermatologist) {
            return null;
        }

        $platformCommissionPercentage = AdminSetting::getValue('platform_commission_percentage', 0);

        $consultationFee = (float) $dermatologist->consultation_fee;
        $platformFeeAmount = round($consultationFee * ((float) $platformCommissionPercentage / 100), 2);
        $dermatologistFeeAmount = round($consultationFee - $platformFeeAmount, 2);

        $appointment = Appointment::create([
            'patient_id' => $user->id,
            'dermatologist_id' => $validatedData['dermatologist_id'],
            'scheduled_at' => $validatedData['scheduled_at'],
            'notes' => $validatedData['notes'] ?? null,
            'consultation_fee' => $consultationFee,
            'platform_fee' => $platformFeeAmount,
            'dermatologist_fee' => $dermatologistFeeAmount,
            'status' => 'scheduled',
        ]);

        $appointment->load(['dermatologist.user']);

        return $appointment;
    }
}
