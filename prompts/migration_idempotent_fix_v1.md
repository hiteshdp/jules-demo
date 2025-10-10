# Migration Idempotent Fix

## User Prompt
I'm getting this migration error:

SQLSTATE[42S21]: Column already exists: 1060 Duplicate column name 'brand'
File: 2025_10_09_083520_drop_columns_from_products_table

This means the migration is trying to add a column (`brand`) that already exists in the `products` table.  

### ✅ Task: Fix This Migration (and Similar Ones)

Please fix this migration file — and any other migrations that modify existing tables — to make them **idempotent** (safe to re-run multiple times) by adding schema existence checks.

#### Specific Requirements:

1. In the `up()` method:
   - Before adding a column, wrap each addition with a check:
     ```php
     if (!Schema::hasColumn('products', 'brand')) {
         $table->string('brand')->nullable();
     }
     ```
     Do this for all columns being added (`brand`, `dosage`, etc.).

   - Before dropping any columns, check if they exist:
     ```php
     if (Schema::hasColumn('products', 'old_column_name')) {
         $table->dropColumn('old_column_name');
     }
     ```

2. In the `down()` method:
   - Similarly, check before dropping columns:
     ```php
     if (Schema::hasColumn('products', 'brand')) {
         $table->dropColumn('brand');
     }
     ```

3. Ensure that `Schema::table('products', function (Blueprint $table) { ... })` is correctly structured — no direct `DB::statement` calls unless absolutely needed.

4. Once fixed, the following commands should run **without throwing any duplicate column or missing column errors**:

## AI Response

Fixed both migration files to make them idempotent by adding proper schema existence checks. The migrations can now be safely re-run multiple times without causing duplicate column or missing column errors.

### Files Fixed:

1. **`2025_10_09_083520_drop_columns_from_products_table.php`**
2. **`2025_10_08_064223_drop_columns_from_patient_profiles_table.php`**

### Changes Made:

#### **Up() Method (Drop Columns):**
- Added `Schema::hasColumn()` checks before dropping each column
- Only drop columns that actually exist in the table
- Collect all columns to drop in an array and drop them in a single operation
- Prevents "column doesn't exist" errors

#### **Down() Method (Add Columns):**
- Added `!Schema::hasColumn()` checks before adding each column
- Only add columns that don't already exist
- Prevents "duplicate column" errors

### Key Benefits:

- **Idempotent**: Migrations can be run multiple times safely
- **Error-Free**: No more duplicate column or missing column errors
- **Rollback Safe**: Both up() and down() methods are protected
- **Production Ready**: Safe for deployment and maintenance

### Example Pattern Used:

```php
// Up method - Drop columns safely
$columnsToDrop = [];
if (Schema::hasColumn('table_name', 'column_name')) {
    $columnsToDrop[] = 'column_name';
}
if (!empty($columnsToDrop)) {
    $table->dropColumn($columnsToDrop);
}

// Down method - Add columns safely
if (!Schema::hasColumn('table_name', 'column_name')) {
    $table->string('column_name');
}
```

The migrations are now fully idempotent and ready for production use!
