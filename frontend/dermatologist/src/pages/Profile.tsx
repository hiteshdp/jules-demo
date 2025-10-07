import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Form, Card, Row, Col, Avatar, Button, Space } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { PageHeader, FormField } from '../components/common';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name || '',
        email: user.email || '',
        specialization: user.specialization || 'Dermatology',
        experience: user.experience || '5+ years',
        qualifications: user.qualifications || 'MD Dermatology',
        phone: user.phone || '+91 98765 43210',
        address: user.address || '123 Medical Center, Mumbai, India',
      });
    }
  }, [user, form]);

  const handleSubmit = () => {
    // In a real app, this would dispatch an update action
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (user) {
      form.setFieldsValue({
        name: user.name || '',
        email: user.email || '',
        specialization: user.specialization || 'Dermatology',
        experience: user.experience || '5+ years',
        qualifications: user.qualifications || 'MD Dermatology',
        phone: user.phone || '+91 98765 43210',
        address: user.address || '123 Medical Center, Mumbai, India',
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your professional information and credentials."
        extra={
          <Button
            type={isEditing ? "default" : "primary"}
            icon={<EditOutlined />}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        }
      />

      <Card>
        <div className="flex items-center space-x-4 mb-6">
          <Avatar size={64} icon={<UserOutlined />} className="bg-blue-100 text-blue-600" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Dr. {user?.name}
            </h3>
            <p className="text-sm text-gray-500">Dermatologist</p>
          </div>
        </div>

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          disabled={!isEditing}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <FormField
                name="name"
                label="Full Name"
                type="input"
                placeholder="Enter your full name"
                required
              />
            </Col>
            <Col xs={24} sm={12}>
              <FormField
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                required
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <FormField
                name="specialization"
                label="Specialization"
                type="input"
                placeholder="Enter your specialization"
              />
            </Col>
            <Col xs={24} sm={12}>
              <FormField
                name="experience"
                label="Experience"
                type="input"
                placeholder="Enter your experience"
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <FormField
                name="qualifications"
                label="Qualifications"
                type="input"
                placeholder="Enter your qualifications"
              />
            </Col>
            <Col xs={24} sm={12}>
              <FormField
                name="phone"
                label="Phone Number"
                type="input"
                placeholder="Enter your phone number"
              />
            </Col>
          </Row>

          <FormField
            name="address"
            label="Address"
            type="textarea"
            rows={3}
            placeholder="Enter your address"
          />

          {isEditing && (
            <div className="flex justify-end mt-6">
              <Space>
                <Button onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Save Changes
                </Button>
              </Space>
            </div>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default Profile;