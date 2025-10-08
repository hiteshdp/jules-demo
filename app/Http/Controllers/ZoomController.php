<?php
// Generated via prompt: prompts/zoom_video_call_integration_v1.md

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ZoomService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ZoomController extends Controller
{
    public function create(Request $req, ZoomService $zoom)
    {
        try {
            $user = Auth::user();
            
            // Validate required fields
            $req->validate([
                'topic' => 'required|string|max:255',
                'start_time' => 'required|date',
                'duration' => 'integer|min:1|max:480', // max 8 hours
            ]);

            $meeting = $zoom->createMeeting(
                $req->input('topic', 'Consultation'),
                $req->input('start_time', now()->addMinutes(5)->toIso8601String()),
                (int)$req->input('duration', 30)
            );

            // Log meeting creation for audit
            Log::info('Zoom meeting created', [
                'user_id' => $user->id,
                'meeting_id' => $meeting['id'],
                'topic' => $req->input('topic'),
            ]);

            // Return only what the frontend needs
            return response()->json([
                'success' => true,
                'message' => 'Zoom meeting created successfully',
                'data' => [
                    'id'        => $meeting['id'],
                    'join_url'  => $meeting['join_url'],
                    'start_url' => $meeting['start_url'],
                    'password'  => $meeting['password'] ?? null,
                    'topic'     => $meeting['topic'],
                    'start_time' => $meeting['start_time'],
                    'duration'  => $meeting['duration'],
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
}
