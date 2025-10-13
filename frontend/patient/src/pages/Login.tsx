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
      navigate('/dashboard');
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
                DIAGNOSIS & TREATMENT PLATFORM
              </p>
            </div>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#2C5282', fontFamily: 'sans-serif' }}>
              Welcome back
            </h2>
            <p className="text-sm" style={{ color: '#718096', fontFamily: 'sans-serif' }}>
              Sign in to your account
            </p>
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
                className="text-sm text-blue-600 hover:text-blue-500"
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

          {/* Footer Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600" style={{ fontFamily: 'sans-serif' }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium"
                style={{ color: '#2C5282' }}
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
