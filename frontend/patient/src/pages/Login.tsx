import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';
import { login, clearError } from '../store/slices/authSlice';
import { Form, Card, Typography } from 'antd';
import { Button, FormField } from '../components/common';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="shadow-lg">
          <div className="text-center mb-6">
            <Title level={2} className="!mb-2">
              Sign in to your account
            </Title>
            <Text type="secondary">
              Or{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                create a new account
              </Link>
            </Text>
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

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full"
                size="large"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
