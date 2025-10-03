# Laravel Migrations Fix - Version 1

## User Prompt
My Laravel project is failing with:

SQLSTATE[42S02]: Base table or view not found: 1146 Table 'hair_skin_health.sessions' doesn't exist

Please fix this by:

1. Generating the default Laravel migration files that are missing, including but not limited to:
   - create_users_table
   - create_password_reset_tokens_table (or password_resets)
   - create_sessions_table
   - create_failed_jobs_table
   - create_personal_access_tokens_table
   - any other default migrations that ship with a fresh Laravel 12 install

2. Each migration should follow the Laravel 12 standard schema definitions (columns, indexes, timestamps, foreign keys where needed).

3. Place these migration files in `database/migrations/` with proper timestamps so `php artisan migrate` can run successfully.

4. Do not overwrite or delete my existing migrations — only add the missing default ones.

## AI Response

I need to create the missing default Laravel migration files that are required for a fresh Laravel 12 installation. The error indicates that the sessions table doesn't exist, which means the default migrations haven't been created.

### Key Migrations to Create:
1. create_users_table - Core user authentication table
2. create_password_reset_tokens_table - Password reset functionality
3. create_sessions_table - Session storage
4. create_failed_jobs_table - Failed job tracking
5. create_personal_access_tokens_table - API token authentication
6. create_cache_table - Cache storage
7. create_jobs_table - Job queue table

### Approach:
- Use proper Laravel 12 migration syntax
- Include proper timestamps for migration ordering
- Follow Laravel 12 standard schema definitions
- Only create missing migrations, don't overwrite existing ones
