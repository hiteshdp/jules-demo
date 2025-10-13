import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';
import { register, clearError } from '../store/slices/authSlice';
import { Form, Card, Typography, Row, Col, Switch } from 'antd';
import { Button, FormField } from '../components/common';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;

const Register = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = (values: any) => {
    dispatch(register({ ...values, role: 'patient' }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F8F8' }}>
      <div className="w-full max-w-md px-4">
        <div 
          className="bg-white rounded-lg shadow-lg p-8"
          style={{ 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px'
          }}
        >
          {/* Branding Section */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'sans-serif' }}>
                HAIR HEALTH
              </h1>
              <p className="text-sm text-gray-600 uppercase tracking-wide" style={{ fontFamily: 'sans-serif' }}>
                DIAGNOSIS & TREATMENT PLATFORM
              </p>
            </div>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#2C5282', fontFamily: 'sans-serif' }}>
              Create your account
            </h2>
            <p className="text-sm" style={{ color: '#718096', fontFamily: 'sans-serif' }}>
              Join our platform to get started
            </p>
          </div>
          
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
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
                  name="phone"
                  label="Phone Number"
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

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <FormField
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </Col>
              <Col xs={24} sm={12}>
                <FormField
                  name="password_confirmation"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  dependencies={['password']}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('The two passwords do not match!'));
                      },
                    }),
                  ]}
                />
              </Col>
            </Row>

            {/* Medical Information Section */}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
              <Title level={4} style={{ marginBottom: 16, color: '#1890ff' }}>
                Medical Information (Optional)
              </Title>
              
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <FormField
                    name="allergies"
                    label="Allergies"
                    type="textarea"
                    placeholder="List any allergies..."
                    rows={2}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <FormField
                    name="current_medications"
                    label="Current Medications"
                    type="textarea"
                    placeholder="List current medications..."
                    rows={2}
                  />
                </Col>
              </Row>

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
            </div>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full"
                size="large"
                style={{ 
                  backgroundColor: '#2C5282',
                  borderColor: '#2C5282',
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </Form.Item>
          </Form>

          {/* Footer Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600" style={{ fontFamily: 'sans-serif' }}>
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium"
                style={{ color: '#2C5282' }}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
