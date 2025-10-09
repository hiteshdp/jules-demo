// Generated via prompt: prompts/razorpay_dynamic_payment_pages_v1.md

import React from 'react';
import { Card, Button, Typography, Space, Tag } from 'antd';
import { CheckCircleOutlined, CalendarOutlined, CreditCardOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface PaymentSuccessProps {
  subscriptionData: {
    status: string;
    amount: number;
    payment_id: string;
    razorpay_subscription_id: string;
    starts_at: string;
    ends_at: string;
    next_billing_date: string;
  };
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ subscriptionData }) => {
  const navigate = useNavigate();

  const formatAmount = (amount: number) => {
    return `₹${(amount / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="text-6xl text-green-500 mb-6">
            <CheckCircleOutlined />
          </div>
          <Title level={2} className="text-green-600 mb-4">
            Payment Successful!
          </Title>
          <Text type="secondary" className="text-lg">
            Your subscription has been activated successfully
          </Text>
        </div>

        {/* Subscription Details */}
        <Card className="text-left mb-6" style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
          <Title level={4} className="text-green-700 mb-4">
            <CreditCardOutlined className="mr-2" />
            Subscription Details
          </Title>
          
          <Space direction="vertical" size="middle" className="w-full">
            <div className="flex justify-between items-center">
              <Text strong>Status:</Text>
              <Tag color="green" className="text-sm">
                {subscriptionData.status.toUpperCase()}
              </Tag>
            </div>
            
            <div className="flex justify-between items-center">
              <Text strong>Amount Paid:</Text>
              <Text strong className="text-green-600 text-lg">
                {formatAmount(subscriptionData.amount)}
              </Text>
            </div>
            
            <div className="flex justify-between items-center">
              <Text strong>Payment ID:</Text>
              <Text code className="text-sm">
                {subscriptionData.payment_id}
              </Text>
            </div>
            
            <div className="flex justify-between items-center">
              <Text strong>Subscription ID:</Text>
              <Text code className="text-sm">
                {subscriptionData.razorpay_subscription_id}
              </Text>
            </div>
            
            <div className="flex justify-between items-center">
              <Text strong>Subscription Start:</Text>
              <Text>
                <CalendarOutlined className="mr-1" />
                {formatDate(subscriptionData.starts_at)}
              </Text>
            </div>
            
            <div className="flex justify-between items-center">
              <Text strong>Subscription End:</Text>
              <Text>
                <CalendarOutlined className="mr-1" />
                {formatDate(subscriptionData.ends_at)}
              </Text>
            </div>
            
            <div className="flex justify-between items-center">
              <Text strong>Next Billing:</Text>
              <Text>
                <CalendarOutlined className="mr-1" />
                {formatDate(subscriptionData.next_billing_date)}
              </Text>
            </div>
          </Space>
        </Card>

        {/* Action Buttons */}
        <Space size="middle">
          <Button 
            type="primary" 
            size="large"
            onClick={() => navigate('/dashboard')}
            icon={<HomeOutlined />}
          >
            Go to Dashboard
          </Button>
          <Button 
            size="large"
            onClick={() => navigate('/subscription')}
          >
            View Subscription
          </Button>
        </Space>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <Text type="secondary" className="text-sm">
            <strong>Note:</strong> You will be automatically charged {formatAmount(subscriptionData.amount)} on {formatDate(subscriptionData.next_billing_date)} for the next billing cycle.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
