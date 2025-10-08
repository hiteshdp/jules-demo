<?php
// Generated via prompt: prompts/appointment_chat_feature_v1.md

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\ChatMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentChatController extends Controller
{
    /**
     * List chat messages for an appointment where the authenticated user
     * is either the patient or the dermatologist.
     */
    public function index(Request $request, int $appointmentId): JsonResponse
    {
        $user = $request->user();

        $appointment = Appointment::where('id', $appointmentId)
            ->where(function ($q) use ($user) {
                $q->where('patient_id', $user->id)
                  ->orWhere('dermatologist_id', $user->id);
            })
            ->first();

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found or unauthorized'
            ], 404);
        }

        $query = ChatMessage::with('sender')
            ->where('appointment_id', $appointment->id);

        // Support incremental fetching: only newer than a given message id
        $afterId = (int) $request->query('after_id', 0);
        if ($afterId > 0) {
            $query->where('id', '>', $afterId);
        }

        $messages = $query->orderBy('id', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $messages,
        ]);
    }

    /**
     * Send a chat message from the authenticated user (patient or dermatologist)
     * in the context of an appointment where they are a participant.
     */
    public function store(Request $request, int $appointmentId): JsonResponse
    {
        $user = $request->user();

        $appointment = Appointment::where('id', $appointmentId)
            ->where(function ($q) use ($user) {
                $q->where('patient_id', $user->id)
                  ->orWhere('dermatologist_id', $user->id);
            })
            ->first();

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found or unauthorized'
            ], 404);
        }

        $validated = $request->validate([
            'message' => 'required|string|max:5000',
            'type' => 'nullable|in:text,image,file'
        ]);

        $message = ChatMessage::create([
            'appointment_id' => $appointment->id,
            'sender_id' => $user->id,
            'message' => $validated['message'],
            'type' => $validated['type'] ?? 'text',
            'is_read' => false,
        ]);

        $message->load('sender');

        return response()->json([
            'success' => true,
            'message' => 'Message sent',
            'data' => $message,
        ], 201);
    }
}


