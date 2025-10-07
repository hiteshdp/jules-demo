# Laravel Bootstrap Cache Directory Fix

## User Prompt:
Fix the Laravel backend setup script that's failing with "bootstrap/cache directory must be present and writable" error.

## AI Response:
Fixed the setup-backend.sh script by adding the necessary directory creation and permission setup steps before running Composer. The issue was that Laravel requires the bootstrap/cache directory to exist and be writable before Composer can run the post-autoload-dump scripts.

### Changes Made:

1. **Added directory creation step** before Composer installation:
   - Creates bootstrap/cache directory
   - Creates all required storage subdirectories
   - Sets proper permissions (775) for storage and bootstrap/cache

2. **Added cache clearing step** to remove any existing cache files that might cause conflicts

3. **Improved error handling** by using `2>/dev/null || true` to prevent errors if directories don't exist

### Key Fixes:
- `mkdir -p bootstrap/cache` - Creates the required directory
- `chmod -R 775 bootstrap/cache` - Sets proper permissions
- `rm -rf bootstrap/cache/*.php 2>/dev/null || true` - Clears existing cache safely

This ensures Laravel can properly run its package discovery and other post-install scripts without the bootstrap/cache directory error.
