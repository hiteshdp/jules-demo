import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Form, Card, Row, Col, Switch, Button, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { PageHeader, FormField } from '../components/common';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth ? dayjs(user.date_of_birth) : null,
        gender: user.gender || '',
        allergies: user.patientProfile?.allergies || '',
        current_medications: user.patientProfile?.current_medications || '',
        smoking: user.patientProfile?.smoking || false,
        alcohol_consumption: user.patientProfile?.alcohol_consumption || false,
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
        phone: user.phone || '',
        date_of_birth: user.date_of_birth ? dayjs(user.date_of_birth) : null,
        gender: user.gender || '',
        allergies: user.patientProfile?.allergies || '',
        current_medications: user.patientProfile?.current_medications || '',
        smoking: user.patientProfile?.smoking || false,
        alcohol_consumption: user.patientProfile?.alcohol_consumption || false,
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal information and medical history."
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
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          disabled={!isEditing}
        >
          {/* Basic Information */}
          <Card title="Basic Information" className="mb-6">
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <FormField
                  name="name"
                  label="Full Name"
                  type="input"
                  placeholder="Enter your full name"
                />
              </Col>
              <Col xs={24} sm={12}>
                <FormField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                />
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <FormField
                  name="phone"
                  label="Phone"
                  type="input"
                  placeholder="Enter your phone number"
                />
              </Col>
              <Col xs={24} sm={12}>
                <FormField
                  name="date_of_birth"
                  label="Date of Birth"
                  type="date"
                />
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <FormField
                  name="gender"
                  label="Gender"
                  type="select"
                  placeholder="Select gender"
                  options={[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Other', value: 'other' }
                  ]}
                />
              </Col>
            </Row>
          </Card>

          {/* Medical Information */}
          <Card title="Medical Information" className="mb-6">
            <FormField
              name="allergies"
              label="Allergies"
              type="textarea"
              rows={2}
              placeholder="List any allergies..."
            />
            
            <FormField
              name="current_medications"
              label="Current Medications"
              type="textarea"
              rows={2}
              placeholder="List current medications..."
            />

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name="smoking" label="Smoking" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="alcohol_consumption" label="Alcohol Consumption" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Card>

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