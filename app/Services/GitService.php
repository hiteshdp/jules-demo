<?php
// Generated via prompt: prompts/ai_orchestrator_command_v1.md

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Process;

class GitService
{
    private string $workingDir;

    public function __construct(?string $workingDir = null)
    {
        $this->workingDir = $workingDir ?? base_path();
    }

    /**
     * Checkout an existing branch.
     *
     * @throws \RuntimeException
     */
    public function checkout(string $branchName): void
    {
        $this->run(['git', 'checkout', $this->sanitizeBranchName($branchName)]);
    }

    /**
     * Create and checkout a new branch (from current HEAD).
     *
     * @throws \RuntimeException
     */
    public function checkoutNewBranch(string $branchName): void
    {
        $this->run(['git', 'checkout', '-b', $this->sanitizeBranchName($branchName)]);
    }

    /**
     * Stage all changes.
     *
     * @throws \RuntimeException
     */
    public function addAll(): void
    {
        $this->run(['git', 'add', '-A']);
    }

    /**
     * Commit with the given message.
     *
     * @throws \RuntimeException
     */
    public function commit(string $message): void
    {
        $this->run(['git', 'commit', '-m', $message]);
    }

    /**
     * Push branch to remote.
     *
     * @throws \RuntimeException
     */
    public function push(string $branchName, string $remote = 'origin'): void
    {
        $safeBranch = $this->sanitizeBranchName($branchName);
        $this->run(['git', 'push', '-u', $remote, $safeBranch]);
    }

    /**
     * Get current branch name.
     */
    public function getCurrentBranch(): string
    {
        $process = $this->createProcess(['git', 'rev-parse', '--abbrev-ref', 'HEAD']);
        $process->run();
        if (! $process->isSuccessful()) {
            throw new \RuntimeException('Failed to get current branch: ' . $process->getErrorOutput());
        }
        return trim($process->getOutput());
    }

    /**
     * Check if there are uncommitted changes.
     */
    public function hasChanges(): bool
    {
        $process = $this->createProcess(['git', 'status', '--porcelain']);
        $process->run();
        if (! $process->isSuccessful()) {
            return false;
        }
        return trim($process->getOutput()) !== '';
    }

    private function run(array $command): void
    {
        $process = $this->createProcess($command);
        $process->run();
        if (! $process->isSuccessful()) {
            $error = $process->getErrorOutput() ?: $process->getOutput();
            Log::error('Git command failed', ['command' => $command, 'error' => $error]);
            throw new \RuntimeException('Git command failed: ' . $error);
        }
    }

    private function createProcess(array $command): Process
    {
        $process = new Process($command, $this->workingDir);
        $process->setTimeout(120);

        return $process;
    }

    private function sanitizeBranchName(string $name): string
    {
        $name = preg_replace('/[^a-zA-Z0-9\-_\/]/', '-', $name);
        $name = preg_replace('/-+/', '-', $name);
        return trim($name, '-');
    }
}
