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
        medical_history: user.patientProfile?.medical_history || '',
        allergies: user.patientProfile?.allergies || '',
        current_medications: user.patientProfile?.current_medications || '',
        lifestyle: user.patientProfile?.lifestyle || '',
        smoking: user.patientProfile?.smoking || false,
        alcohol_consumption: user.patientProfile?.alcohol_consumption || false,
        dietary_habits: user.patientProfile?.dietary_habits || '',
        stress_level: user.patientProfile?.stress_level || '',
        sleep_pattern: user.patientProfile?.sleep_pattern || '',
        hair_care_routine: user.patientProfile?.hair_care_routine || '',
        family_history: user.patientProfile?.family_history || '',
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
        medical_history: user.patientProfile?.medical_history || '',
        allergies: user.patientProfile?.allergies || '',
        current_medications: user.patientProfile?.current_medications || '',
        lifestyle: user.patientProfile?.lifestyle || '',
        smoking: user.patientProfile?.smoking || false,
        alcohol_consumption: user.patientProfile?.alcohol_consumption || false,
        dietary_habits: user.patientProfile?.dietary_habits || '',
        stress_level: user.patientProfile?.stress_level || '',
        sleep_pattern: user.patientProfile?.sleep_pattern || '',
        hair_care_routine: user.patientProfile?.hair_care_routine || '',
        family_history: user.patientProfile?.family_history || '',
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

          {/* Medical History */}
          <Card title="Medical History" className="mb-6">
            <FormField
              name="medical_history"
              label="Medical History"
              type="textarea"
              rows={3}
              placeholder="Describe any relevant medical history..."
            />
            
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
            
            <FormField
              name="family_history"
              label="Family History"
              type="textarea"
              rows={2}
              placeholder="Describe family history of hair loss or related conditions..."
            />
          </Card>

          {/* Lifestyle Information */}
          <Card title="Lifestyle Information">
            <FormField
              name="lifestyle"
              label="Lifestyle"
              type="select"
              placeholder="Select lifestyle"
              options={[
                { label: 'Sedentary', value: 'sedentary' },
                { label: 'Moderate', value: 'moderate' },
                { label: 'Active', value: 'active' },
                { label: 'Very Active', value: 'very_active' }
              ]}
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

            <FormField
              name="dietary_habits"
              label="Dietary Habits"
              type="textarea"
              rows={2}
              placeholder="Describe your dietary habits..."
            />
            
            <FormField
              name="stress_level"
              label="Stress Level"
              type="textarea"
              rows={2}
              placeholder="Describe your stress level and sources..."
            />
            
            <FormField
              name="sleep_pattern"
              label="Sleep Pattern"
              type="textarea"
              rows={2}
              placeholder="Describe your sleep pattern..."
            />
            
            <FormField
              name="hair_care_routine"
              label="Hair Care Routine"
              type="textarea"
              rows={2}
              placeholder="Describe your current hair care routine..."
            />
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
