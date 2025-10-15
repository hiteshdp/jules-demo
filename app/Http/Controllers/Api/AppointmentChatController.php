<?php

// Generated via prompt: prompts/appointment_chat_feature_v1.md

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\ChatMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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

        if (! $appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found or unauthorized',
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

        if (! $appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found or unauthorized',
            ], 404);
        }

        // Check if we have either message or attachment
        $hasMessage = $request->has('message') && ! empty(trim($request->input('message')));
        $hasAttachment = $request->hasFile('attachment');

        if (! $hasMessage && ! $hasAttachment) {
            return response()->json([
                'success' => false,
                'message' => 'Either message or attachment is required',
            ], 400);
        }

        // Validate the request with custom rules
        $validator = Validator::make($request->all(), [
            'message' => 'sometimes|nullable|string|max:5000',
            'type' => 'nullable|in:text,image,file,video,audio,document',
            'attachment' => 'nullable|file|max:10240|mimes:jpg,jpeg,png,gif,webp,pdf,doc,docx,txt,mp4,avi,mov,mp3,wav,ogg,zip,rar',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 400);
        }

        $validated = $validator->validated();

        $attachmentPath = null;
        $messageType = $validated['type'] ?? 'text';

        // Handle file upload
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();

            // Determine file type based on extension
            $imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
            $videoExtensions = ['mp4', 'avi', 'mov'];
            $audioExtensions = ['mp3', 'wav', 'ogg'];
            $documentExtensions = ['pdf', 'doc', 'docx', 'txt'];

            if (in_array(strtolower($extension), $imageExtensions)) {
                $messageType = 'image';
            } elseif (in_array(strtolower($extension), $videoExtensions)) {
                $messageType = 'video';
            } elseif (in_array(strtolower($extension), $audioExtensions)) {
                $messageType = 'audio';
            } elseif (in_array(strtolower($extension), $documentExtensions)) {
                $messageType = 'document';
            } else {
                $messageType = 'file';
            }

            // Store file in storage/app/public/chat-attachments
            $attachmentPath = $file->store('chat-attachments', 'public');
        }

        $message = ChatMessage::create([
            'appointment_id' => $appointment->id,
            'sender_id' => $user->id,
            'message' => $validated['message'] ?? $request->input('message', ''),
            'attachment' => $attachmentPath,
            'type' => $messageType,
            'is_read' => false,
        ]);

        $message->load('sender');

        return response()->json([
            'success' => true,
            'message' => 'Message sent',
            'data' => $message,
        ], 201);
    }

    /**
     * Download a chat attachment
     */
    public function downloadAttachment(Request $request, int $appointmentId, int $messageId): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        $user = $request->user();

        $appointment = Appointment::where('id', $appointmentId)
            ->where(function ($q) use ($user) {
                $q->where('patient_id', $user->id)
                    ->orWhere('dermatologist_id', $user->id);
            })
            ->first();

        if (! $appointment) {
            abort(404, 'Appointment not found or unauthorized');
        }

        $message = ChatMessage::where('id', $messageId)
            ->where('appointment_id', $appointment->id)
            ->first();

        if (! $message || ! $message->attachment) {
            abort(404, 'Attachment not found');
        }

        $filePath = storage_path('app/public/'.$message->attachment);

        if (! file_exists($filePath)) {
            abort(404, 'File not found');
        }

        return response()->download($filePath);
    }
}
