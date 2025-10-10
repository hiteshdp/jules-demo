// Generated via prompt: prompts/antd_admin_remaining_pages_v1.md
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchSettings, updateSettings } from '../store/slices/settingsSlice';
import { 
  Card, 
  Typography, 
  Space, 
  Form, 
  Input, 
  InputNumber, 
  Button, 
  Row, 
  Col, 
} from 'antd';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { settings, loading } = useSelector((state: RootState) => state.settings);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      // Normalize any accidental object-shaped values into primitives
      // const normalized: Record<string, any> = {};
      // Object.entries(settings).forEach(([key, value]) => {
      //   let v: any = value as any;
      //   if (v && typeof v === 'object') {
      //     if ('value' in v) {
      //       v = (v as any).value;
      //     } else {
      //       // Fallback: do not inject objects into inputs
      //       v = '';
      //     }
      //   }
      //   if (key === 'smtp_port') {
      //     // Ensure number input receives a number
      //     const n = Number(v);
      //     v = Number.isNaN(n) ? undefined : n;
      //   }
      //   normalized[key] = v;
      // });
      // form.setFieldsValue(normalized);
    }
  }, [settings, form]);

  const handleSubmit = async (values: any) => {
    try {
      await dispatch(updateSettings(values)).unwrap();
      toast.success('Settings updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  const settingGroups = [
    {
      title: 'Platform Settings',
      settings: [
        { key: 'platform_commission_percentage', label: 'Platform Commission (%)', type: 'number' },
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
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '400px' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2} style={{ margin: 0 }}>
          Settings
        </Title>
        <Text type="secondary">
          Configure platform settings and integrations.
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={!isEditing}
      >
        {settingGroups.map((group) => (
          <Card key={group.title} title={group.title} style={{ marginBottom: 24 }}>
            <Row gutter={[16, 16]}>
              {group.settings.map((setting) => (
                <Col xs={24} sm={12} key={setting.key}>
                  <Form.Item
                    name={setting.key}
                    label={setting.label}
                    rules={[
                      { required: isEditing && setting.type !== 'password', message: `Please enter ${setting.label.toLowerCase()}` }
                    ]}
                  >
                    {setting.type === 'password' ? (
                      <Input.Password 
                        placeholder={`Enter ${setting.label.toLowerCase()}`}
                      />
                    ) : setting.type === 'number' ? (
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder={`Enter ${setting.label.toLowerCase()}`}
                      />
                    ) : (
                      <Input
                        type={setting.type}
                        placeholder={`Enter ${setting.label.toLowerCase()}`}
                      />
                    )}
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Card>
        ))}

      </Form>

      {/* Action buttons placed OUTSIDE the disabled Form so they remain clickable */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        {!isEditing ? (
          <Button type="primary" onClick={() => setIsEditing(true)} size="large">
            Edit
          </Button>
        ) : (
          <>
            <Button onClick={() => { form.resetFields(); form.setFieldsValue(settings || {}); setIsEditing(false); }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" size="large" onClick={() => form.submit()}>
              Save Changes
            </Button>
          </>
        )}
      </div>
    </Space>
  );
};

export default Settings;
