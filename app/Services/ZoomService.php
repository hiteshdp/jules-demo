<?php
// Generated via prompt: prompts/zoom_video_call_integration_v1.md

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class ZoomService
{
    protected Client $client;
    protected string $token;

    public function __construct()
    {
        $this->client = new Client(['base_uri' => env('ZOOM_API_BASE', 'https://api.zoom.us/v2')]);
        $this->token  = $this->getAccessToken();
    }

    protected function getAccessToken(): string
    {
        try {
            $res = (new Client())->post('https://zoom.us/oauth/token', [
                'headers' => [
                    'Authorization' => 'Basic ' . base64_encode(env('ZOOM_CLIENT_ID') . ':' . env('ZOOM_CLIENT_SECRET')),
                ],
                'form_params' => [
                    'grant_type' => 'account_credentials',
                    'account_id' => env('ZOOM_ACCOUNT_ID'),
                ],
                'http_errors' => true,
            ]);

            $data = json_decode($res->getBody(), true);
            
            if (!isset($data['access_token'])) {
                Log::error('Zoom OAuth failed: ' . json_encode($data));
                throw new \Exception('Failed to get Zoom access token');
            }
            
            return $data['access_token'];
        } catch (\Exception $e) {
            Log::error('Zoom OAuth error: ' . $e->getMessage());
            throw new \Exception('Failed to authenticate with Zoom: ' . $e->getMessage());
        }
    }

    public function createMeeting(string $topic, string $startIso, int $duration = 30): array
    {
        try {
            $res = $this->client->post('users/me/meetings', [
                'headers' => ['Authorization' => 'Bearer ' . $this->token],
                'json' => [
                    'topic'      => $topic,
                    'type'       => 2, // scheduled
                    'start_time' => $startIso, // ISO8601, e.g. 2025-10-08T10:30:00Z
                    'duration'   => $duration,
                    'settings'   => [
                        'join_before_host' => true,
                        'waiting_room'     => false,
                        'approval_type'    => 0,
                    ],
                ],
            ]);

            $data = json_decode($res->getBody(), true);
            
            if (!isset($data['id'])) {
                Log::error('Zoom meeting creation failed: ' . json_encode($data));
                throw new \Exception('Failed to create Zoom meeting');
            }
            
            return $data;
        } catch (\Exception $e) {
            Log::error('Zoom meeting creation error: ' . $e->getMessage());
            throw new \Exception('Failed to create Zoom meeting: ' . $e->getMessage());
        }
    }
}
