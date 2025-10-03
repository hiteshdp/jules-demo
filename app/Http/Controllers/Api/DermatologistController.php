<?php
// Generated via prompt: prompts/hair_skin_health_setup_v1.md

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\ChatMessage;
use App\Models\Dermatologist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class DermatologistController extends Controller
{
    /**
     * Get dermatologist profile
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();
        $user->load('dermatologistProfile');

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Update dermatologist profile
     */
    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'specialization' => 'sometimes|string|max:255',
            'years_of_experience' => 'sometimes|integer|min:0',
            'qualifications' => 'sometimes|string',
            'bio' => 'nullable|string',
            'consultation_fee' => 'sometimes|numeric|min:0',
            'available_days' => 'sometimes|array',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i',
            'timezone' => 'sometimes|string',
            'is_available' => 'sometimes|boolean',
            'max_patients_per_day' => 'sometimes|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        
        // Update user data
        $user->update($request->only(['name', 'phone']));
        
        // Update dermatologist profile
        $profileData = $request->only([
            'specialization', 'years_of_experience', 'qualifications', 'bio',
            'consultation_fee', 'available_days', 'start_time', 'end_time',
            'timezone', 'is_available', 'max_patients_per_day'
        ]);
        
        $user->dermatologistProfile()->updateOrCreate(
            ['user_id' => $user->id],
            $profileData
        );

        $user->load('dermatologistProfile');

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $user
        ]);
    }

    /**
     * Get assigned appointments
     */
    public function getAppointments(Request $request)
    {
        $appointments = Appointment::with(['patient', 'chatMessages'])
            ->where('dermatologist_id', $request->user()->id)
            ->orderBy('scheduled_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $appointments
        ]);
    }

    /**
     * Get appointment details
     */
    public function getAppointment(Request $request, $id)
    {
        $appointment = Appointment::with(['patient.patientProfile', 'patient.quizResponses.question', 'chatMessages.sender'])
            ->where('dermatologist_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $appointment
        ]);
    }

    /**
     * Update appointment status
     */
    public function updateAppointmentStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:scheduled,in_progress,completed,cancelled,no_show',
            'notes' => 'nullable|string',
            'prescription' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $appointment = Appointment::where('dermatologist_id', $request->user()->id)
            ->findOrFail($id);

        $appointment->update($request->only(['status', 'notes', 'prescription']));

        return response()->json([
            'success' => true,
            'message' => 'Appointment updated successfully',
            'data' => $appointment
        ]);
    }

    /**
     * Send chat message
     */
    public function sendMessage(Request $request, $appointmentId)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string',
            'type' => 'sometimes|in:text,image,file,prescription',
            'attachment' => 'nullable|file|max:10240', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $appointment = Appointment::where('dermatologist_id', $request->user()->id)
            ->findOrFail($appointmentId);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('chat-attachments', 'public');
        }

        $message = ChatMessage::create([
            'appointment_id' => $appointmentId,
            'sender_id' => $request->user()->id,
            'message' => $request->message,
            'attachment' => $attachmentPath,
            'type' => $request->type ?? 'text',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => $message
        ]);
    }

    /**
     * Get chat messages for appointment
     */
    public function getChatMessages(Request $request, $appointmentId)
    {
        $appointment = Appointment::where('dermatologist_id', $request->user()->id)
            ->findOrFail($appointmentId);

        $messages = ChatMessage::with('sender')
            ->where('appointment_id', $appointmentId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    /**
     * Mark messages as read
     */
    public function markMessagesAsRead(Request $request, $appointmentId)
    {
        ChatMessage::where('appointment_id', $appointmentId)
            ->where('sender_id', '!=', $request->user()->id)
            ->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Messages marked as read'
        ]);
    }

    /**
     * Get payment history (read-only)
     */
    public function getPaymentHistory(Request $request)
    {
        $appointments = Appointment::with(['patient', 'payments'])
            ->where('dermatologist_id', $request->user()->id)
            ->where('is_paid', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $appointments
        ]);
    }
}
