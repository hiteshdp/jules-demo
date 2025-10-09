import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { Form, Card, Row, Col, Switch, Button, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { PageHeader, FormField } from '../components/common';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { fetchProfile, updateProfile, clearError } from '../store/slices/profileSlice';

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector((state: RootState) => state.profile);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Fetch profile data when component mounts
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    // Update form when profile data is loaded
    if (profile) {
      form.setFieldsValue({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth ? dayjs(profile.date_of_birth) : null,
        gender: profile.gender || '',
        allergies: profile.patientProfile?.allergies || '',
        current_medications: profile.patientProfile?.current_medications || '',
        smoking: profile.patientProfile?.smoking || false,
        alcohol_consumption: profile.patientProfile?.alcohol_consumption || false,
      });
    }
  }, [profile, form]);

  useEffect(() => {
    // Show error messages
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (values: any) => {
    try {
      await dispatch(updateProfile(values)).unwrap();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (profile) {
      form.setFieldsValue({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth ? dayjs(profile.date_of_birth) : null,
        gender: profile.gender || '',
        allergies: profile.patientProfile?.allergies || '',
        current_medications: profile.patientProfile?.current_medications || '',
        smoking: profile.patientProfile?.smoking || false,
        alcohol_consumption: profile.patientProfile?.alcohol_consumption || false,
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
                  disabled={!isEditing || loading}
                />
              </Col>
              <Col xs={24} sm={12}>
                <FormField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  disabled={!isEditing || loading}
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
                  disabled={!isEditing || loading}
                />
              </Col>
              <Col xs={24} sm={12}>
                <FormField
                  name="date_of_birth"
                  label="Date of Birth"
                  type="date"
                  disabled={!isEditing || loading}
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
                  disabled={!isEditing || loading}
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
              disabled={!isEditing || loading}
            />
            
            <FormField
              name="current_medications"
              label="Current Medications"
              type="textarea"
              rows={2}
              placeholder="List current medications..."
              disabled={!isEditing || loading}
            />

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name="smoking" label="Smoking" valuePropName="checked">
                  <Switch disabled={!isEditing || loading} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="alcohol_consumption" label="Alcohol Consumption" valuePropName="checked">
                  <Switch disabled={!isEditing || loading} />
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
                <Button type="primary" htmlType="submit" loading={loading}>
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