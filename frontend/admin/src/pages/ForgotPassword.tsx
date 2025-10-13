import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;

interface ForgotPasswordForm {
  email: string;
}

interface ResetPasswordForm {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [resetForm] = Form.useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'forgot' | 'reset'>('forgot');

  // Check if we have token and email in URL params
  React.useEffect(() => {
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');
    
    if (urlToken && urlEmail) {
      setStep('reset');
      resetForm.setFieldsValue({
        email: urlEmail,
        token: urlToken
      });
    }
  }, [searchParams, resetForm]);

  const handleForgotPassword = async (values: ForgotPasswordForm) => {
    setLoading(true);
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.success) {
        message.success(data.message);
        // In development, show the token for testing
        if (data.data?.token) {
          message.info(`Development Mode: Token is ${data.data.token}`);
        }
      } else {
        message.error(data.message);
      }
    } catch (error) {
      message.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: ResetPasswordForm) => {
    setLoading(true);
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.success) {
        message.success(data.message);
        navigate('/login');
      } else {
        message.error(data.message);
      }
    } catch (error) {
      message.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto h-12 w-12 bg-gradient-to-r from-red-500 to-purple-600 rounded-full flex items-center justify-center"
          >
            <LockOutlined className="h-6 w-6 text-white" />
          </motion.div>
          <Title level={2} className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 'forgot' ? 'Forgot Password?' : 'Reset Password'}
          </Title>
          <Paragraph className="mt-2 text-center text-sm text-gray-600">
            {step === 'forgot' 
              ? 'Enter your email address and we\'ll send you a link to reset your password.'
              : 'Enter your new password below.'
            }
          </Paragraph>
        </div>

        <Card className="shadow-xl border-0">
          {step === 'forgot' ? (
            <Form
              form={form}
              name="forgot-password"
              onFinish={handleForgotPassword}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Enter your email address"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full h-12 bg-gradient-to-r from-red-500 to-purple-600 border-0 rounded-lg font-semibold text-lg hover:from-red-600 hover:to-purple-700"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </Form.Item>

              <div className="text-center">
                <Text className="text-gray-600">
                  Remember your password?{' '}
                  <Link 
                    to="/login" 
                    className="text-red-600 hover:text-red-500 font-medium"
                  >
                    Sign in
                  </Link>
                </Text>
              </div>
            </Form>
          ) : (
            <Form
              form={resetForm}
              name="reset-password"
              onFinish={handleResetPassword}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Enter your email address"
                  className="rounded-lg"
                  disabled
                />
              </Form.Item>

              <Form.Item
                name="token"
                label="Reset Token"
                rules={[
                  { required: true, message: 'Please input the reset token!' }
                ]}
              >
                <Input
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Enter the reset token from your email"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="New Password"
                rules={[
                  { required: true, message: 'Please input your new password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Enter your new password"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="password_confirmation"
                label="Confirm New Password"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Confirm your new password"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full h-12 bg-gradient-to-r from-red-500 to-purple-600 border-0 rounded-lg font-semibold text-lg hover:from-red-600 hover:to-purple-700"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </Form.Item>

              <div className="text-center">
                <Text className="text-gray-600">
                  Remember your password?{' '}
                  <Link 
                    to="/login" 
                    className="text-red-600 hover:text-red-500 font-medium"
                  >
                    Sign in
                  </Link>
                </Text>
              </div>
            </Form>
          )}
        </Card>

        <div className="text-center">
          <Text className="text-gray-500 text-sm">
            Need help? Contact our{' '}
            <Link to="/contact" className="text-red-600 hover:text-red-500">
              support team
            </Link>
          </Text>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
