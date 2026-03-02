<?php
// Generated via prompt: prompts/ai_orchestrator_command_v1.md

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GitHubService
{
    private string $token;

    private string $owner;

    private string $repo;

    private string $baseUrl;

    public function __construct()
    {
        $this->token = (string) config('services.github.token');
        $this->owner = (string) config('services.github.owner');
        $this->repo = (string) config('services.github.repo');
        $this->baseUrl = "https://api.github.com/repos/{$this->owner}/{$this->repo}";
    }

    /**
     * Fetch open issues that have the given label.
     *
     * @return array<int, array<string, mixed>>
     *
     * @throws \RuntimeException
     */
    public function getOpenIssuesWithLabel(string $label): array
    {
        $this->ensureConfigured();

        $url = "{$this->baseUrl}/issues";
        $response = Http::withToken($this->token)
            ->accept('application/vnd.github+json')
            ->get($url, [
                'state' => 'open',
                'labels' => $label,
                'per_page' => 30,
            ]);

        if (! $response->successful()) {
            Log::error('GitHub API error fetching issues', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new \RuntimeException(
                'Failed to fetch GitHub issues: ' . $response->body()
            );
        }

        $data = $response->json();
        if (! is_array($data)) {
            return [];
        }

        return $data;
    }

    /**
     * Create a pull request.
     *
     * @return array<string, mixed>
     *
     * @throws \RuntimeException
     */
    public function createPullRequest(string $head, string $base, string $title, string $body = ''): array
    {
        $this->ensureConfigured();

        $url = "{$this->baseUrl}/pulls";
        $response = Http::withToken($this->token)
            ->accept('application/vnd.github+json')
            ->post($url, [
                'title' => $title,
                'head' => $head,
                'base' => $base,
                'body' => $body,
            ]);

        if (! $response->successful()) {
            Log::error('GitHub API error creating PR', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new \RuntimeException(
                'Failed to create pull request: ' . $response->body()
            );
        }

        $data = $response->json();
        if (! is_array($data)) {
            throw new \RuntimeException('Invalid response from GitHub API when creating PR.');
        }

        return $data;
    }

    private function ensureConfigured(): void
    {
        if ($this->token === '' || $this->owner === '' || $this->repo === '') {
            throw new \RuntimeException(
                'GitHub is not configured. Set GITHUB_TOKEN, GITHUB_REPO_OWNER, and GITHUB_REPO_NAME in .env.'
            );
        }
    }
}
