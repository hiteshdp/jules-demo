# AI Orchestrator Command – Prompt

## User Prompt

I am building an AI-automation feature in Laravel. I already have my OpenAI API key in .env as OPENAI_API_KEY=XXXXXX.

Create all required Laravel components for an "AI Orchestrator Command" with the following requirements:

- Console command RunAiAgent: fetch GitHub issues with label ai-task, pick first open issue, create branch (Symfony Process), prepare issue + code context, call OpenAI Chat Completions (gpt-4o-mini), parse FILE blocks, overwrite/create files, commit/push, open PR via GitHub API.
- AiCodeGeneratorService: OpenAI API, prompt construction, parsing FILE blocks.
- GitService: checkout, add, commit, push.
- GitHubService: fetch issues (label filter), create pull requests.
- Env: GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME, OPENAI_API_KEY.
- Production-ready, PSR-12, no dummy code.

## AI Response

Implemented:

1. **GitHubService** (`app/Services/GitHubService.php`) – `getOpenIssuesWithLabel()`, `createPullRequest()`, config from `config/services.php` (github.token, owner, repo).
2. **GitService** (`app/Services/GitService.php`) – `checkout()`, `checkoutNewBranch()`, `addAll()`, `commit()`, `push()`, `getCurrentBranch()`, `hasChanges()` using Symfony Process, branch name sanitization.
3. **AiCodeGeneratorService** (`app/Services/AiCodeGeneratorService.php`) – `generateCode()` (OpenAI Chat Completions), `buildPrompt()`, `parseFileBlocks()` (FILE: path → content), `writeFileBlocks()` to base path.
4. **RunAiAgent** (`app/Console/Commands/RunAiAgent.php`) – `ai:run-agent` with options `--label=ai-task`, `--base=main`; orchestrates: fetch issue → checkout base → create branch → build context → call AI → parse blocks → write files → add/commit/push → create PR.
5. **Config** – `config/services.php` extended with `github` (token, owner, repo) and `openai.chat_model`.
6. **.env** – placeholders for GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME, OPENAI_CHAT_MODEL.
