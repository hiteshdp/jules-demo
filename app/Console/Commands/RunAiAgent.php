<?php
// Generated via prompt: prompts/ai_orchestrator_command_v1.md

namespace App\Console\Commands;

use App\Services\GitHubService;
use App\Services\GitService;
use App\Services\GroqCodeGeneratorService;
use Illuminate\Console\Command;

class RunAiAgent extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ai:run-agent
                            {--label=ai-task : GitHub issue label to pick}
                            {--base=main : Base branch for PR}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch an ai-task GitHub issue, generate code via Groq LLM, apply changes, push branch and open a PR';

    private const FILE_BLOCK_RULES = <<<'TXT'
You MUST output one or more file blocks in the EXACT following format:

FILE: path/to/file.php
<full raw file content here with NO markdown formatting>

STRICT RULES:
- Never use ```php or any markdown code fences.
- Never wrap code in backticks.
- Never prepend language tags.
- Only output raw code exactly as it will be written to disk.
- Every file must start with "FILE:" on a new line.
- Absolutely no extra text, comments, or formatting outside FILE blocks.
TXT;

    public function __construct(
        private GitHubService $github,
        private GitService $git,
        private GroqCodeGeneratorService $groq
    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $label = (string) $this->option('label');
        $baseBranch = (string) $this->option('base');

        try {
            $issue = $this->pickFirstOpenIssue($label);
            if ($issue === null) {
                $this->error("No open issues found with label: {$label}");
                return self::FAILURE;
            }

            $issueNumber = (int) ($issue['number'] ?? 0);
            $issueTitle = (string) ($issue['title'] ?? 'untitled');
            $issueBody = (string) ($issue['body'] ?? '');
            $branchName = $this->branchNameFromIssue($issueNumber, $issueTitle);

            $this->info("Using issue #{$issueNumber}: {$issueTitle}");
            $this->info("Branch: {$branchName}");

            $this->git->checkout($baseBranch);
            $this->git->checkoutNewBranch($branchName);

            $projectContext = $this->buildCodeContext();
            $issueText = "### ISSUE DETAILS\n{$issueTitle}\n\n{$issueBody}";
            $prompt = $this->groq->buildPrompt($issueText, self::FILE_BLOCK_RULES, $projectContext);
            $prompt .= "\n\nIMPORTANT:\nDo NOT use markdown formatting.\nDo NOT use backticks.\nReturn raw code only.\nOutput must strictly follow the FILE: block format.";

            $this->info('Calling Groq API to generate code...');
            $generatedCode = $this->groq->generateCode($prompt);

            $generatedCode = str_replace(
                ['```php', '```html', '```json', '```txt', '```', '``'],
                '',
                $generatedCode
            );
            $blocks = $this->groq->parseFileBlocks($generatedCode);
            if ($blocks === []) {
                $this->warn('No FILE blocks in LLM response. Nothing to apply.');
                return self::FAILURE;
            }

            $filtered = [];
            foreach ($blocks as $path => $content) {
                if (trim($content) === '') {
                    $this->warn("Skipping blank file: {$path}");
                    continue;
                }
                $filtered[$path] = $content;
            }
            if ($filtered === []) {
                $this->warn('All FILE blocks were blank. Nothing to apply.');
                return self::FAILURE;
            }

            $this->groq->writeFileBlocks($filtered, base_path());
            $this->info('Wrote ' . count($filtered) . ' file(s).');

            if (! $this->git->hasChanges()) {
                $this->warn('No git changes after writing files. Skipping commit/push.');
                return self::SUCCESS;
            }

            $this->git->addAll();
            $this->git->commit("AI: Apply changes for issue #{$issueNumber} - {$issueTitle}");
            $this->git->push($branchName);

            $prBody = "Automated PR for issue #{$issueNumber}\n\n" . $issueBody;
            $pr = $this->github->createPullRequest(
                $branchName,
                $baseBranch,
                "[AI] #{$issueNumber} {$issueTitle}",
                $prBody
            );
            $prUrl = $pr['html_url'] ?? $pr['url'] ?? 'created';
            $this->info("Pull request created: {$prUrl}");

            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error($e->getMessage());
            if ($this->output->isVerbose()) {
                $this->newLine();
                $this->line($e->getTraceAsString());
            }
            return self::FAILURE;
        }
    }

    /**
     * @return array<string, mixed>|null
     */
    private function pickFirstOpenIssue(string $label): ?array
    {
        $issues = $this->github->getOpenIssuesWithLabel($label);
        foreach ($issues as $issue) {
            if (empty($issue['pull_request'])) {
                return $issue;
            }
        }
        return null;
    }

    private function branchNameFromIssue(int $number, string $title): string
    {
        $slug = preg_replace('/[^a-z0-9]+/i', '-', $title);
        $slug = trim($slug, '-');
        $slug = substr($slug, 0, 40);
        return "ai/issue-{$number}-{$slug}";
    }

    private function buildCodeContext(): string
    {
        $files = [
            'app/Http/Controllers/UserController.php',
            'app/Models/User.php',
            'app/Http/Requests/UserStoreRequest.php',
            'app/Http/Requests/UserUpdateRequest.php',
            'resources/views/users/index.blade.php',
            'routes/web.php',
        ];

        $output = "### PROJECT CONTEXT\n";

        foreach ($files as $file) {
            $path = base_path($file);
            if (file_exists($path)) {
                $content = file_get_contents($path);
                $output .= "\nFILE: {$file}\n{$content}\n";
            }
        }

        return $output;
    }
}
