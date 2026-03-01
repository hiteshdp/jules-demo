<?php
// Generated via prompt: prompts/hair_skin_health_setup_v1.md

namespace Database\Seeders;

use App\Models\AdminSetting;
use Illuminate\Database\Seeder;

class AdminSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'platform_commission_percentage',
                'value' => '15',
                'type' => 'number',
                'description' => 'Platform commission percentage for consultations',
            ],
            [
                'key' => 'smtp_host',
                'value' => 'smtp.gmail.com',
                'type' => 'string',
                'description' => 'SMTP host for email notifications',
            ],
            [
                'key' => 'smtp_port',
                'value' => '587',
                'type' => 'number',
                'description' => 'SMTP port for email notifications',
            ],
            [
                'key' => 'smtp_username',
                'value' => '',
                'type' => 'string',
                'description' => 'SMTP username for email notifications',
            ],
            [
                'key' => 'smtp_password',
                'value' => '',
                'type' => 'string',
                'description' => 'SMTP password for email notifications',
            ],
            [
                'key' => 'smtp_encryption',
                'value' => 'tls',
                'type' => 'string',
                'description' => 'SMTP encryption type',
            ],
            [
                'key' => 'email_from_address',
                'value' => 'noreply@hairskinhealth.com',
                'type' => 'string',
                'description' => 'Default from email address',
            ],
            [
                'key' => 'email_from_name',
                'value' => 'Hair Skin Health',
                'type' => 'string',
                'description' => 'Default from name for emails',
            ],
            [
                'key' => 'razorpay_key_id',
                'value' => '',
                'type' => 'string',
                'description' => 'Razorpay API Key ID',
            ],
            [
                'key' => 'razorpay_key_secret',
                'value' => '',
                'type' => 'string',
                'description' => 'Razorpay API Key Secret',
            ],
            [
                'key' => 'zoom_api_key',
                'value' => '',
                'type' => 'string',
                'description' => 'Zoom API Key for video consultations',
            ],
            [
                'key' => 'zoom_api_secret',
                'value' => '',
                'type' => 'string',
                'description' => 'Zoom API Secret for video consultations',
            ],
            [
                'key' => 'openai_api_key',
                'value' => '',
                'type' => 'string',
                'description' => 'OpenAI API Key for AI recommendations',
            ],
            [
                'key' => 'appointment_reminder_hours',
                'value' => '24',
                'type' => 'number',
                'description' => 'Hours before appointment to send reminder',
            ],
            [
                'key' => 'max_file_upload_size',
                'value' => '10485760',
                'type' => 'number',
                'description' => 'Maximum file upload size in bytes (10MB)',
            ],
        ];

        foreach ($settings as $setting) {
            AdminSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
