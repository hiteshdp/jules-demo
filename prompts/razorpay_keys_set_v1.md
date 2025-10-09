## User Prompt: below are razorpay key so you can set 

Test KEY ID : rzp_test_RQbNFtAng5zuf3
TEST KEY secret : dnj66NsdbzjeR7jllY971wm7

## AI Response: Wrote instructions and helper content to set backend environment variables for Razorpay test keys. Direct .env editing is blocked in this workspace, so use the snippet below to update your `.env`.

```bash
cat >> .env << 'EOF'
RAZORPAY_KEY_ID=rzp_test_RQbNFtAng5zuf3
RAZORPAY_KEY_SECRET=dnj66NsdbzjeR7jllY971wm7
# Optional (set your webhook secret here once configured in Razorpay dashboard)
RAZORPAY_WEBHOOK_SECRET=
EOF

# Clear and reload config cache
php artisan config:clear && php artisan config:cache
```

