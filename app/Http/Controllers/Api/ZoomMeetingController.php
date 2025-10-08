<?php
// Generated via prompt: prompts/zoom_meeting_database_v1.md

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ZoomMeeting;
use App\Models\Appointment;
use App\Services\ZoomService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ZoomMeetingController extends Controller
{
    protected $zoomService;

    public function __construct(ZoomService $zoomService)
    {
        $this->zoomService = $zoomService;
    }

    public function create(Request $request)
    {
        try {
            $user = Auth::user();
            
            $request->validate([
                'appointment_id' => 'required|exists:appointments,id',
                'topic' => 'required|string|max:255',
                'start_time' => 'required|date',
                'duration' => 'integer|min:1|max:480',
            ]);

            // Get appointment details
            $appointment = Appointment::with(['patient', 'dermatologist'])->findOrFail($request->appointment_id);
            
            // Check if user has permission to create meeting for this appointment
            if ($user->role === 'dermatologist' && $appointment->dermatologist_id !== $user->id) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            // Create Zoom meeting
            $meeting = $this->zoomService->createMeeting(
                $request->topic,
                $request->start_time,
                $request->duration
            );

            // Store in database
            $zoomMeeting = ZoomMeeting::create([
                'meeting_id' => $meeting['id'],
                'topic' => $meeting['topic'],
                'join_url' => $meeting['join_url'],
                'start_url' => $meeting['start_url'],
                'password' => $meeting['password'] ?? null,
                'start_time' => $meeting['start_time'],
                'duration' => $meeting['duration'],
                'appointment_id' => $request->appointment_id,
                'dermatologist_id' => $appointment->dermatologist_id,
                'patient_id' => $appointment->patient_id,
                'status' => 'created'
            ]);

            Log::info('Zoom meeting created and stored', [
                'meeting_id' => $meeting['id'],
                'appointment_id' => $request->appointment_id,
                'user_id' => $user->id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Zoom meeting created successfully',
                'data' => [
                    'id' => $zoomMeeting->id,
                    'meeting_id' => $meeting['id'],
                    'join_url' => $meeting['join_url'],
                    'start_url' => $meeting['start_url'],
                    'password' => $meeting['password'] ?? null,
                    'topic' => $meeting['topic'],
                    'start_time' => $meeting['start_time'],
                    'duration' => $meeting['duration'],
                    'status' => 'created'
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Zoom meeting creation failed', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create Zoom meeting: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function start(Request $request, $id)
    {
        try {
            $user = Auth::user();
            $zoomMeeting = ZoomMeeting::findOrFail($id);

            // Only dermatologist can start the meeting
            if ($user->role !== 'dermatologist' || $zoomMeeting->dermatologist_id !== $user->id) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $zoomMeeting->update([
                'status' => 'started',
                'started_at' => now()
            ]);

            Log::info('Zoom meeting started', [
                'meeting_id' => $zoomMeeting->meeting_id,
                'user_id' => $user->id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Meeting started successfully',
                'data' => [
                    'status' => 'started',
                    'started_at' => $zoomMeeting->started_at,
                    'join_url' => $zoomMeeting->join_url,
                    'password' => $zoomMeeting->password
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to start meeting', [
                'meeting_id' => $id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to start meeting: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function end(Request $request, $id)
    {
        try {
            $user = Auth::user();
            $zoomMeeting = ZoomMeeting::findOrFail($id);

            // Only dermatologist can end the meeting
            if ($user->role !== 'dermatologist' || $zoomMeeting->dermatologist_id !== $user->id) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $zoomMeeting->update([
                'status' => 'ended',
                'ended_at' => now()
            ]);

            Log::info('Zoom meeting ended', [
                'meeting_id' => $zoomMeeting->meeting_id,
                'user_id' => $user->id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Meeting ended successfully',
                'data' => [
                    'status' => 'ended',
                    'ended_at' => $zoomMeeting->ended_at
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to end meeting', [
                'meeting_id' => $id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to end meeting: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getStatus(Request $request, $appointmentId)
    {
        try {
            $user = Auth::user();
            
            $zoomMeeting = ZoomMeeting::where('appointment_id', $appointmentId)
                ->where(function($query) use ($user) {
                    if ($user->role === 'dermatologist') {
                        $query->where('dermatologist_id', $user->id);
                    } elseif ($user->role === 'patient') {
                        $query->where('patient_id', $user->id);
                    }
                })
                ->latest()
                ->first();

            if (!$zoomMeeting) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'status' => 'not_created',
                        'meeting' => null
                    ]
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'status' => $zoomMeeting->status,
                    'meeting' => [
                        'id' => $zoomMeeting->id,
                        'meeting_id' => $zoomMeeting->meeting_id,
                        'topic' => $zoomMeeting->topic,
                        'join_url' => $zoomMeeting->join_url,
                        'start_url' => $zoomMeeting->start_url,
                        'password' => $zoomMeeting->password,
                        'start_time' => $zoomMeeting->start_time,
                        'duration' => $zoomMeeting->duration,
                        'started_at' => $zoomMeeting->started_at,
                        'ended_at' => $zoomMeeting->ended_at
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get meeting status', [
                'appointment_id' => $appointmentId,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get meeting status: ' . $e->getMessage(),
            ], 500);
        }
    }
}
