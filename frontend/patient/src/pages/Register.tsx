import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';
import { register, clearError } from '../store/slices/authSlice';
import { Form, Card, Typography, Row, Col } from 'antd';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <Card className="shadow-lg">
          <div className="text-center mb-6">
            <Title level={2} className="!mb-2">
              Create your account
            </Title>
            <Text type="secondary">
              Or{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                sign in to your existing account
              </Link>
            </Text>
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

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full"
                size="large"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
