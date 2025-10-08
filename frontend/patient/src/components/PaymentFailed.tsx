// Generated via prompt: prompts/razorpay_dynamic_payment_pages_v1.md

import React from 'react';
import { Card, Button, Typography, Space, Alert } from 'antd';
import { CloseCircleOutlined, ReloadOutlined, HomeOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface PaymentFailedProps {
  errorData: {
    message: string;
    error?: string;
    code?: string;
    details?: string;
  };
}

const PaymentFailed: React.FC<PaymentFailedProps> = ({ errorData }) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate('/subscription');
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="text-6xl text-red-500 mb-6">
            <CloseCircleOutlined />
          </div>
          <Title level={2} className="text-red-600 mb-4">
            Payment Failed
          </Title>
          <Text type="secondary" className="text-lg">
            We're sorry, but your payment could not be processed
          </Text>
        </div>

        {/* Error Details */}
        <Alert
          message="Payment Error"
          description={
            <div>
              <Text strong className="block mb-2">
                {errorData.message}
              </Text>
              {errorData.error && (
                <Text type="secondary" className="block text-sm">
                  Error: {errorData.error}
                </Text>
              )}
              {errorData.code && (
                <Text type="secondary" className="block text-sm">
                  Code: {errorData.code}
                </Text>
              )}
              {errorData.details && (
                <Text type="secondary" className="block text-sm">
                  Details: {errorData.details}
                </Text>
              )}
            </div>
          }
          type="error"
          showIcon
          className="mb-6"
        />

        {/* Possible Reasons */}
        <Card className="text-left mb-6" style={{ backgroundColor: '#fff2f0', border: '1px solid #ffccc7' }}>
          <Title level={4} className="text-red-700 mb-4">
            Possible Reasons:
          </Title>
          
          <ul className="text-sm space-y-2">
            <li>• Insufficient funds in your account</li>
            <li>• Incorrect card details entered</li>
            <li>• Card expired or blocked by your bank</li>
            <li>• Network connectivity issues</li>
            <li>• Bank server temporarily unavailable</li>
          </ul>
        </Card>

        {/* Action Buttons */}
        <Space size="middle">
          <Button 
            type="primary" 
            size="large"
            onClick={handleRetry}
            icon={<ReloadOutlined />}
          >
            Try Again
          </Button>
          <Button 
            size="large"
            onClick={handleGoHome}
            icon={<HomeOutlined />}
          >
            Go to Dashboard
          </Button>
        </Space>

        {/* Support Information */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <Title level={5} className="mb-2">
            Need Help?
          </Title>
          <Text type="secondary" className="block mb-2">
            If you continue to experience issues, please contact our support team:
          </Text>
          <Space>
            <Button 
              type="link" 
              icon={<PhoneOutlined />}
              href="tel:+91-1234567890"
            >
              Call Support: +91-1234567890
            </Button>
            <Button 
              type="link"
              href="mailto:support@hairhealth.com"
            >
              Email: support@hairhealth.com
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default PaymentFailed;
