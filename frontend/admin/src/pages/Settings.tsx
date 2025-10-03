import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchSettings, updateSettings } from '../store/slices/settingsSlice';
import { CogIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { settings, loading } = useSelector((state: RootState) => state.settings);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateSettings(formData)).unwrap();
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  const settingGroups = [
    {
      title: 'Platform Settings',
      settings: [
        { key: 'platform_commission_percentage', label: 'Platform Commission (%)', type: 'number' },
        { key: 'appointment_reminder_hours', label: 'Appointment Reminder (hours)', type: 'number' },
        { key: 'max_file_upload_size', label: 'Max File Upload Size (bytes)', type: 'number' },
      ]
    },
    {
      title: 'Email Settings',
      settings: [
        { key: 'smtp_host', label: 'SMTP Host', type: 'text' },
        { key: 'smtp_port', label: 'SMTP Port', type: 'number' },
        { key: 'smtp_username', label: 'SMTP Username', type: 'text' },
        { key: 'smtp_password', label: 'SMTP Password', type: 'password' },
        { key: 'smtp_encryption', label: 'SMTP Encryption', type: 'text' },
        { key: 'email_from_address', label: 'From Email Address', type: 'email' },
        { key: 'email_from_name', label: 'From Name', type: 'text' },
      ]
    },
    {
      title: 'Payment Settings',
      settings: [
        { key: 'razorpay_key_id', label: 'Razorpay Key ID', type: 'text' },
        { key: 'razorpay_key_secret', label: 'Razorpay Key Secret', type: 'password' },
      ]
    },
    {
      title: 'Integration Settings',
      settings: [
        { key: 'zoom_api_key', label: 'Zoom API Key', type: 'text' },
        { key: 'zoom_api_secret', label: 'Zoom API Secret', type: 'password' },
        { key: 'openai_api_key', label: 'OpenAI API Key', type: 'password' },
      ]
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure platform settings and integrations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {settingGroups.map((group) => (
          <div key={group.title} className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                {group.title}
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {group.settings.map((setting) => (
                  <div key={setting.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {setting.label}
                    </label>
                    {setting.type === 'password' ? (
                      <input
                        type="password"
                        value={formData[setting.key] || ''}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Enter ${setting.label.toLowerCase()}`}
                      />
                    ) : setting.type === 'number' ? (
                      <input
                        type="number"
                        value={formData[setting.key] || ''}
                        onChange={(e) => handleChange(setting.key, parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Enter ${setting.label.toLowerCase()}`}
                      />
                    ) : (
                      <input
                        type={setting.type}
                        value={formData[setting.key] || ''}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Enter ${setting.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
