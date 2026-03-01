<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class GroqCodeGeneratorService
{
    private string $apiKey;

    private string $baseUrl;

    private string $model;

    private int $maxTokens;

    public function __construct()
    {
        $this->apiKey = (string) config('services.groq.api_key');
        $this->baseUrl = rtrim((string) config('services.groq.base_url'), '/');
        $this->model = (string) config('services.groq.model');
        $this->maxTokens = (int) config('services.groq.max_tokens', 8192);
    }

    /**
     * Build a combined prompt from issue text, rules, and file content.
     */
    public function buildPrompt(string $issueText, string $rules, string $filesContent): string
    {
        $sections = [
            "## GitHub Issue\n\n{$issueText}",
            "## Rules / Instructions\n\n{$rules}",
            "## Relevant code / file context\n\n{$filesContent}",
        ];

        return implode("\n\n---\n\n", $sections);
    }

    /**
     * Call Groq OpenAI-compatible /chat/completions and return the generated text.
     *
     * @throws RuntimeException
     */
    public function generateCode(string $prompt): string
    {
        if ($this->apiKey === '') {
            throw new RuntimeException('OPENAI_API_KEY is not set in .env. Use your Groq API key for the AI Orchestrator.');
        }

        $url = $this->baseUrl . '/chat/completions';
        $systemPrompt = 'You are a coding assistant. Respond only with file blocks in this exact format: '
            . "FILE: path/to/file.php\n<full file contents>\n\n"
            . 'One FILE block per file. No markdown fences around content. Output valid PHP/Laravel code when the path ends in .php.';

        $response = Http::withToken($this->apiKey)
            ->timeout(120)
            ->post($url, [
                'model' => $this->model,
                'max_tokens' => $this->maxTokens,
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.2,
            ]);

        if (! $response->successful()) {
            Log::error('Groq API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new RuntimeException(
                'Groq API request failed (HTTP ' . $response->status() . '): ' . $response->body()
            );
        }

        $data = $response->json();
        if (! is_array($data)) {
            throw new RuntimeException('Groq API returned invalid JSON.');
        }

        $content = $data['choices'][0]['message']['content'] ?? null;
        if ($content === null || $content === '') {
            throw new RuntimeException('Groq API returned empty content.');
        }

        return $content;
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
     * @throws RuntimeException
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
                    throw new RuntimeException("Cannot create directory: {$dir}");
                }
            }
            if (file_put_contents($fullPath, $content) === false) {
                throw new RuntimeException("Failed to write file: {$fullPath}");
            }
        }
    }
}
