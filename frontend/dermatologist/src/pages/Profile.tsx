import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { Form, Card, Row, Col, Avatar, Button, Space } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { PageHeader, FormField } from '../components/common';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { fetchProfile, updateProfile, clearError } from '../store/slices/profileSlice';

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
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
        license_number: profile.dermatologistProfile?.license_number || '',
        specialization: profile.dermatologistProfile?.specialization || '',
        years_of_experience: profile.dermatologistProfile?.years_of_experience || '',
        qualifications: profile.dermatologistProfile?.qualifications || '',
        consultation_fee: profile.dermatologistProfile?.consultation_fee || '',
        bio: profile.dermatologistProfile?.bio || '',
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
      // Convert dayjs object to string for API
      const formData = {
        ...values,
        date_of_birth: values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null,
      };
      
      await dispatch(updateProfile(formData)).unwrap();
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
        license_number: profile.dermatologistProfile?.license_number || '',
        specialization: profile.dermatologistProfile?.specialization || '',
        years_of_experience: profile.dermatologistProfile?.years_of_experience || '',
        qualifications: profile.dermatologistProfile?.qualifications || '',
        consultation_fee: profile.dermatologistProfile?.consultation_fee || '',
        bio: profile.dermatologistProfile?.bio || '',
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
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <FormField
                name="name"
                label="Full Name"
                type="input"
                placeholder="Enter your full name"
                required
                disabled={!isEditing || loading}
              />
            </Col>
            <Col xs={24} sm={12}>
              <FormField
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                required
                disabled={!isEditing || loading}
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <FormField
                name="phone"
                label="Phone Number"
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

          {/* Professional Information */}
          <Card title="Professional Information" className="mb-6">
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <FormField
                  name="license_number"
                  label="License Number"
                  type="input"
                  placeholder="Enter your license number"
                  disabled={!isEditing || loading}
                />
              </Col>
              <Col xs={24} sm={12}>
                <FormField
                  name="specialization"
                  label="Specialization"
                  type="input"
                  placeholder="Enter your specialization"
                  disabled={!isEditing || loading}
                />
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <FormField
                  name="years_of_experience"
                  label="Years of Experience"
                  type="number"
                  placeholder="Enter years of experience"
                  disabled={!isEditing || loading}
                />
              </Col>
              <Col xs={24} sm={12}>
                <FormField
                  name="consultation_fee"
                  label="Consultation Fee"
                  type="number"
                  placeholder="Enter consultation fee"
                  disabled={!isEditing || loading}
                />
              </Col>
            </Row>

            <FormField
              name="qualifications"
              label="Qualifications"
              type="textarea"
              rows={2}
              placeholder="Enter your qualifications"
              disabled={!isEditing || loading}
            />

            <FormField
              name="bio"
              label="Bio"
              type="textarea"
              rows={3}
              placeholder="Enter your professional bio"
              disabled={!isEditing || loading}
            />
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