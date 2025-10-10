# Dermatologist Seeder Idempotent Fix

## User Prompt
I'm getting this Laravel seeder error during `php artisan db:seed`:

SQLSTATE[23000]: Integrity constraint violation: 1062 Duplicate entry 'dermatologist@hairskinhealth.com' for key 'users_email_unique'

It occurs in `Database\Seeders\DermatologistSeeder` when inserting sample dermatologist users.  
I need you to fix it properly so the seeder becomes **idempotent** and can be safely re-run multiple times without causing duplicate email or unique key violations.

### ✅ Requirements

1. **Update the `DermatologistSeeder`** to use `updateOrCreate()` or `firstOrCreate()` instead of a plain insert.

   Example:
   ```php
   \App\Models\User::updateOrCreate(
       ['email' => 'dermatologist@hairskinhealth.com'],
       [
           'name' => 'Dr. Sarah Johnson',
           'password' => bcrypt('password'),
           'phone' => '+91 98765 43210',
           'date_of_birth' => '1985-06-15',
           'gender' => 'female',
           'role' => 'dermatologist',
           'is_active' => true,
       ]
   );
   ```

## AI Response

Fixed the `DermatologistSeeder` to make it idempotent by replacing all `User::create()` and `dermatologistProfile()->create()` calls with `updateOrCreate()` methods.

### Changes Made:

1. **User Creation**: Replaced `User::create()` with `User::updateOrCreate()` using email as the unique identifier
2. **Profile Creation**: Replaced `dermatologistProfile()->create()` with `dermatologistProfile()->updateOrCreate()` using user_id as the unique identifier
3. **Added Missing Field**: Added `is_active => true` to user creation data
4. **Maintained Data Integrity**: All existing data fields preserved with proper relationships

### Key Benefits:

- **Idempotent**: Can be run multiple times without errors
- **Safe Updates**: Existing records are updated with new data if they exist
- **No Duplicates**: Prevents unique constraint violations
- **Maintains Relationships**: Properly handles the User-Dermatologist relationship

The seeder can now be safely re-run multiple times without causing duplicate entry errors.
