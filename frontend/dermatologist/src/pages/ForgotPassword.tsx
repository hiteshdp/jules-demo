import React, { useState } from 'react';
import { Form, message } from 'antd';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, FormField } from '../components/common';
import authAPI from '../store/api/authAPI';

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
      const response = await authAPI.forgotPassword(values);
      const data = response.data;

      if (data.success) {
        message.success('Password reset link sent successfully. Please check your email.');
        // In development, show the token for testing
        if (data.data?.token) {
          message.info(`Development Mode: Token is ${data.data.token}`);
        }
      } else {
        message.error(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error: any) {
      if (error.response?.status === 422) {
        const errorMessage = error.response?.data?.errors?.email?.[0] || 
                           error.response?.data?.message || 
                           'Please enter a valid email address.';
        message.error(errorMessage);
      } else if (error.response?.status === 404) {
        message.error('Email not found. Please check your email address.');
      } else {
        message.error(error.response?.data?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: ResetPasswordForm) => {
    setLoading(true);
    try {
      // Get email and token from URL parameters
      const email = searchParams.get('email');
      const token = searchParams.get('token');
      
      // Add email and token to the request
      const requestData = {
        ...values,
        email: email,
        token: token
      };
      
      const response = await authAPI.resetPassword(requestData);
      const data = response.data;

      if (data.success) {
        message.success('Password reset successfully. You can now login with your new password.');
        navigate('/login');
      } else {
        message.error(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        message.error('Invalid or expired token. Please request a new password reset.');
      } else if (error.response?.status === 422) {
        const errorMessage = error.response?.data?.errors?.password?.[0] || 
                           error.response?.data?.message || 
                           'Please check your password and try again.';
        message.error(errorMessage);
      } else {
        message.error(error.response?.data?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
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
                DERMATOLOGIST PORTAL
              </p>
            </div>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#2C5282', fontFamily: 'sans-serif' }}>
              {step === 'forgot' ? 'Forgot Password' : 'Reset Password'}
            </h2>
            <p className="text-sm" style={{ color: '#718096', fontFamily: 'sans-serif' }}>
              {step === 'forgot' 
                ? 'Enter your registered email address and we\'ll send you a reset link.'
                : 'Enter your new password below.'
              }
            </p>
          </div>
          
          {step === 'forgot' ? (
            <Form
              form={form}
              name="forgot-password"
              onFinish={handleForgotPassword}
              layout="vertical"
              size="large"
            >
              <FormField
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email address"
                required
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              />

              <Form.Item>
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
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Form
              form={resetForm}
              name="reset-password"
              onFinish={handleResetPassword}
              layout="vertical"
              size="large"
              initialValues={{
                email: searchParams.get('email') || '',
                token: searchParams.get('token') || ''
              }}
            >
              <FormField
                name="password"
                label="New Password"
                type="password"
                placeholder="Enter your new password"
                required
                rules={[
                  { required: true, message: 'Please input your new password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
              />

              <FormField
                name="password_confirmation"
                label="Confirm New Password"
                type="password"
                placeholder="Confirm your new password"
                required
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
              />

              <Form.Item>
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
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </Form.Item>
            </Form>
          )}

          {/* Footer Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600" style={{ fontFamily: 'sans-serif' }}>
              Remember your password?{' '}
              <Link
                to="/login"
                className="font-medium"
                style={{ color: '#2C5282' }}
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
