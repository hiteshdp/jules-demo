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
        $this->token = $this->getAccessToken();
        // Use the standard Zoom API URL for Server-to-Server OAuth
        $this->client = new Client(['base_uri' => 'https://api.zoom.us/v2/']);
    }

    protected function getAccessToken(): string
    {
        try {
            $clientId = config('app.ZOOM_CLIENT_ID');
            $clientSecret = config('app.ZOOM_CLIENT_SECRET');
            $accountId = config('app.ZOOM_ACCOUNT_ID');

            // Remove quotes if they exist
            $accountId = trim($accountId, '"\'');

            Log::info('Zoom OAuth attempt', [
                'client_id' => $clientId,
                'account_id' => $accountId,
                'has_secret' => ! empty($clientSecret),
            ]);

            $res = (new Client)->post('https://zoom.us/oauth/token', [
                'headers' => [
                    'Authorization' => 'Basic '.base64_encode($clientId.':'.$clientSecret),
                    'Content-Type' => 'application/x-www-form-urlencoded',
                ],
                'form_params' => [
                    'grant_type' => 'account_credentials',
                    'account_id' => $accountId,
                ],
                'http_errors' => false, // Don't throw exceptions for HTTP errors
            ]);

            $statusCode = $res->getStatusCode();
            $body = $res->getBody()->getContents();

            $data = json_decode($body, true);

            Log::info('Zoom OAuth response', [
                'status_code' => $statusCode,
                'response' => $data,
            ]);

            if ($statusCode !== 200) {
                Log::error('Zoom OAuth failed', [
                    'status_code' => $statusCode,
                    'response' => $data,
                ]);
                throw new \Exception('Zoom OAuth failed: '.($data['error_description'] ?? $data['error'] ?? 'Unknown error'));
            }

            if (! isset($data['access_token'])) {
                Log::error('Zoom OAuth failed: '.json_encode($data));
                throw new \Exception('Failed to get Zoom access token: '.json_encode($data));
            }

            return $data['access_token'];
        } catch (\Exception $e) {
            Log::error('Zoom OAuth error: '.$e->getMessage());
            throw new \Exception('Failed to authenticate with Zoom: '.$e->getMessage());
        }
    }

    public function createMeeting(string $topic, string $startIso, int $duration = 30): array
    {
        try {
            Log::info('Creating Zoom meeting', [
                'topic' => $topic,
                'start_time' => $startIso,
                'duration' => $duration,
            ]);

            $res = $this->client->post('users/me/meetings', [
                'headers' => ['Authorization' => 'Bearer '.$this->token],
                'json' => [
                    'topic' => $topic,
                    'type' => 2, // scheduled
                    'start_time' => $startIso, // ISO8601, e.g. 2025-10-08T10:30:00Z
                    'duration' => $duration,
                    'settings' => [
                        'join_before_host' => true,
                        'waiting_room' => false,
                        'approval_type' => 0,
                    ],
                ],
                'http_errors' => false,
            ]);

            $statusCode = $res->getStatusCode();
            $body = $res->getBody()->getContents();
            $data = json_decode($body, true);

            Log::info('Zoom meeting creation response', [
                'status_code' => $statusCode,
                'response' => $data,
            ]);

            if ($statusCode !== 201) {
                $errorMessage = $data['message'] ?? $data['error'] ?? 'Unknown error';
                Log::error('Zoom meeting creation failed', [
                    'status_code' => $statusCode,
                    'error' => $errorMessage,
                ]);
                throw new \Exception("Failed to create Zoom meeting: {$errorMessage}");
            }

            if (! isset($data['id'])) {
                Log::error('Zoom meeting creation failed: No meeting ID returned', ['response' => $data]);
                throw new \Exception('Failed to create Zoom meeting: No meeting ID returned');
            }

            Log::info('Zoom meeting created successfully', [
                'meeting_id' => $data['id'],
                'topic' => $data['topic'],
            ]);

            return $data;
        } catch (\Exception $e) {
            Log::error('Zoom meeting creation error: '.$e->getMessage());
            throw new \Exception('Failed to create Zoom meeting: '.$e->getMessage());
        }
    }
}
