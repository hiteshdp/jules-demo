<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Patient\StoreAppointmentRequest;
use App\Services\AppointmentService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AppointmentController extends BaseController
{
    protected $appointmentService;

    public function __construct(AppointmentService $appointmentService)
    {
        $this->appointmentService = $appointmentService;
    }

    public function index(Request $request): JsonResponse
    {
        $appointments = $this->appointmentService->getAppointments($request);
        return $this->sendResponse(['appointments' => $appointments], 'Appointments retrieved successfully.');
    }

    public function show(Request $request, $id): JsonResponse
    {
        $user = $request->user();

        $appointment = \App\Models\Appointment::where('id', $id)
            ->where('patient_id', $user->id)
            ->with(['dermatologist.user'])
            ->first();

        if (!$appointment) {
            return $this->sendError('Appointment not found.', [], 404);
        }

        return $this->sendResponse($appointment, 'Appointment retrieved successfully.');
    }

    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        $appointment = $this->appointmentService->createAppointment($request->validated(), $request->user());

        if (!$appointment) {
            return $this->sendError('Dermatologist not found.', [], 404);
        }

        return $this->sendResponse($appointment, 'Appointment created successfully.', 201);
    }
}
