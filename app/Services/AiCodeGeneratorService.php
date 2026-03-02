<?php
// Generated via prompt: prompts/ai_orchestrator_command_v1.md

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiCodeGeneratorService
{
    private string $apiKey;

    private string $model;

    public function __construct()
    {
        $this->apiKey = (string) config('services.openai.api_key');
        $this->model = config('services.openai.chat_model', 'gpt-4o-mini');
    }

    /**
     * Call OpenAI Chat Completions and return the raw content.
     *
     * @throws \RuntimeException
     */
    public function generateCode(string $issueText, string $codeContext): string
    {
        if ($this->apiKey === '') {
            throw new \RuntimeException('OPENAI_API_KEY is not set in .env.');
        }

        $prompt = $this->buildPrompt($issueText, $codeContext);

        $response = Http::withToken($this->apiKey)
            ->timeout(120)
            ->post('https://api.openai.com/v1/chat/completions', [
                'model' => $this->model,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $this->getSystemPrompt(),
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt,
                    ],
                ],
                'temperature' => 0.2,
            ]);

        if (! $response->successful()) {
            Log::error('OpenAI API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new \RuntimeException(
                'OpenAI API request failed: ' . $response->body()
            );
        }

        $data = $response->json();
        $content = $data['choices'][0]['message']['content'] ?? null;
        if ($content === null || $content === '') {
            throw new \RuntimeException('OpenAI returned empty content.');
        }

        return $content;
    }

    /**
     * Build the user prompt from issue and code context.
     */
    public function buildPrompt(string $issueText, string $codeContext): string
    {
        return <<<PROMPT
## GitHub Issue (task)

{$issueText}

## Current code context

{$codeContext}

---

Respond with one or more file blocks. For each file to create or update use this exact format:

FILE: path/to/file.php
<updated or new code here>

Use only FILE: and the path on the first line, then the full file contents (including <?php and all code). No markdown code fences around the content. One FILE block per file.
PROMPT;
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

    private function getSystemPrompt(): string
    {
        return 'You are a coding assistant. You respond only with file blocks in the exact format requested: FILE: path/to/file then the full file content. No explanations outside the file blocks. Output valid PHP/Laravel code when the path ends in .php.';
    }
}
