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

    private const FILE_BLOCK_RULES = 'Respond with one or more file blocks. For each file to create or update use this exact format:'
        . "\n\nFILE: path/to/file.php\n<updated or new code here>\n\n"
        . 'Use only FILE: and the path on the first line, then the full file contents (including <?php and all code). '
        . 'No markdown code fences around the content. One FILE block per file.';

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

            $filesContent = $this->buildCodeContext();
            $issueText = "Title: {$issueTitle}\n\n{$issueBody}";
            $prompt = $this->groq->buildPrompt($issueText, self::FILE_BLOCK_RULES, $filesContent);

            $this->info('Calling Groq API to generate code...');
            $generatedCode = $this->groq->generateCode($prompt);

            $blocks = $this->groq->parseFileBlocks($generatedCode);
            if ($blocks === []) {
                $this->warn('No FILE blocks in LLM response. Nothing to apply.');
                return self::FAILURE;
            }

            $this->groq->writeFileBlocks($blocks, base_path());
            $this->info('Wrote ' . count($blocks) . ' file(s).');

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
        $base = base_path();
        $lines = ['Laravel project structure (app/):'];
        $appPath = $base . DIRECTORY_SEPARATOR . 'app';
        if (is_dir($appPath)) {
            $this->listDirRecursive($appPath, 'app', $lines, 2);
        }
        return implode("\n", $lines);
    }

    private function listDirRecursive(string $dir, string $prefix, array &$lines, int $maxDepth, int $depth = 0): void
    {
        if ($depth >= $maxDepth) {
            return;
        }
        $items = @scandir($dir);
        if (! is_array($items)) {
            return;
        }
        foreach ($items as $item) {
            if ($item === '.' || $item === '..') {
                continue;
            }
            $path = $dir . DIRECTORY_SEPARATOR . $item;
            $rel = $prefix . '/' . $item;
            if (is_dir($path)) {
                $lines[] = $rel . '/';
                $this->listDirRecursive($path, $rel, $lines, $maxDepth, $depth + 1);
            } else {
                $lines[] = $rel;
            }
        }
    }
}
