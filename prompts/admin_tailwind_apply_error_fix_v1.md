# Admin Tailwind CSS @apply Error Fix

## User Prompt
I am getting this error can you please look into this ?

## AI Response
I can see the error from the image - there's a PostCSS error with Tailwind CSS where `@apply` is being used incorrectly with the `group` utility. Let me fix this issue in the `index.css` file.

### Issue Identified:
The error occurred in `/var/www/html/naiya/gitlab/laravel-hair_skin_health/frontend/admin/src/index.css:162:3` where the `@apply` directive was incorrectly used with the `group` utility:

```css
.sidebar-item {
  @apply group flex items-center px-2 py-2 text-sm font-medium rounded-md;
}
```

### Root Cause:
The `group` utility in Tailwind CSS cannot be used with `@apply` because it's a special utility that needs to be applied directly to HTML elements, not through CSS classes. The `group` utility is used for parent-child hover interactions and must be applied directly to the HTML element.

### Solution Applied:
Removed the `group` utility from the `@apply` directive:

```css
.sidebar-item {
  @apply flex items-center px-2 py-2 text-sm font-medium rounded-md;
}
```

### Usage Note:
If you need the `group` functionality for hover interactions, apply it directly to the HTML element like this:
```html
<div class="group sidebar-item">
  <!-- content -->
</div>
```

The error should now be resolved and the admin module should build successfully without PostCSS errors.
