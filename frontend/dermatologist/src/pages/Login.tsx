import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';
import { login, clearError } from '../store/slices/authSlice';
import { Form } from 'antd';
import { Button, FormField } from '../components/common';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = (values: { email: string; password: string }) => {
    dispatch(login(values));
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
              Welcome back
            </h2>
            <p className="text-sm" style={{ color: '#718096', fontFamily: 'sans-serif' }}>
              Sign in to your account
            </p>
          </div>

          {/* Go to Home Link */}
          <div className="text-center mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
              style={{ fontFamily: 'sans-serif' }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go to Home
            </Link>
          </div>
          
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
          >
            <FormField
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              required
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            />
            
            <FormField
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              required
              rules={[
                { required: true, message: 'Please input your password!' }
              ]}
            />

            <div className="text-right mb-4">
              <Link
                to="/forgot-password"
                className="text-sm text-green-600 hover:text-green-500"
              >
                Forgot your password?
              </Link>
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
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </Form.Item>
          </Form>

          
        </div>
      </div>
    </div>
  );
};

export default Login;
