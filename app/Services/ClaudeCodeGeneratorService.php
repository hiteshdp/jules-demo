<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ClaudeCodeGeneratorService
{
    private string $apiKey;

    private string $apiUrl;

    private string $model;

    private int $maxTokens;

    public function __construct()
    {
        $this->apiKey = (string) config('services.claude.api_key');
        $this->apiUrl = (string) config('services.claude.api_url');
        $this->model = (string) config('services.claude.model');
        $this->maxTokens = (int) config('services.claude.max_tokens', 8192);
    }

    /**
     * Build a prompt from issue, rules, and file contents for Claude.
     *
     * @param  array{title: string, body?: string}  $issue  Issue with 'title' and optional 'body' (or 'description')
     */
    public function buildPrompt(array $issue, string $rules, string $filesContent): string
    {
        $title = $issue['title'] ?? 'Untitled';
        $body = $issue['body'] ?? $issue['description'] ?? '';

        $sections = [
            "## GitHub Issue\n\n**Title:** {$title}\n\n{$body}",
            "## Rules / Instructions\n\n{$rules}",
            "## Relevant code / file context\n\n{$filesContent}",
        ];

        return implode("\n\n---\n\n", $sections);
    }

    /**
     * Call Claude Messages API and return the generated text.
     *
     * @throws \RuntimeException
     */
    public function generateCode(string $prompt): string
    {
        if ($this->apiKey === '') {
            throw new \RuntimeException('CLAUDE_API_KEY is not set in .env.');
        }

        $systemPrompt = 'You are a coding assistant. Respond only with file blocks in this exact format: '
            . "FILE: path/to/file.php\n<full file contents>\n\n"
            . 'One FILE block per file. No markdown fences around content. Output valid PHP/Laravel code when the path ends in .php.';

        $response = Http::withHeaders([
            'x-api-key' => $this->apiKey,
            'anthropic-version' => '2023-06-01',
            'Content-Type' => 'application/json',
        ])
            ->timeout(120)
            ->post($this->apiUrl, [
                'model' => $this->model,
                'max_tokens' => $this->maxTokens,
                'system' => $systemPrompt,
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $prompt,
                    ],
                ],
            ]);

        if (! $response->successful()) {
            Log::error('Claude API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new \RuntimeException(
                'Claude API request failed: ' . $response->body()
            );
        }

        $data = $response->json();
        if (! is_array($data)) {
            throw new \RuntimeException('Claude API returned invalid JSON.');
        }

        $content = $data['content'] ?? null;
        if (! is_array($content) || count($content) === 0) {
            throw new \RuntimeException('Claude API returned empty content.');
        }

        $firstBlock = $content[0];
        $text = $firstBlock['text'] ?? null;
        if ($text === null || $text === '') {
            throw new \RuntimeException('Claude API returned no text in content block.');
        }

        return $text;
    }

    /**
     * Parse LLM response into associative array path => content.
     *
     * @return array<string, string>
     */
    public function parseFileBlocks(string $llmResponse): array
    {
        $blocks = [];
        $pattern = '/FILE:\s*(.+?)\s*\n([\s\S]*?)(?=FILE:\s*|$)/m';

        if (preg_match_all($pattern, $llmResponse, $matches, PREG_SET_ORDER)) {
            foreach ($matches as $m) {
                $path = trim($m[1]);
                $content = trim($m[2]);
                if ($path !== '' && $content !== '') {
                    $blocks[$path] = $content;
                }
            }
        }

        return $blocks;
    }

    /**
     * Write parsed file blocks to disk (create or overwrite).
     *
     * @param  array<string, string>  $blocks
     *
     * @throws \RuntimeException
     */
    public function writeFileBlocks(array $blocks, string $basePath): void
    {
        $basePath = rtrim($basePath, DIRECTORY_SEPARATOR);

        foreach ($blocks as $relativePath => $content) {
            $relativePath = str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $relativePath);
            $fullPath = $basePath . DIRECTORY_SEPARATOR . $relativePath;
            $dir = dirname($fullPath);
            if (! is_dir($dir)) {
                if (! @mkdir($dir, 0755, true)) {
                    throw new \RuntimeException("Cannot create directory: {$dir}");
                }
            }
            if (file_put_contents($fullPath, $content) === false) {
                throw new \RuntimeException("Failed to write file: {$fullPath}");
            }
        }
    }
}
