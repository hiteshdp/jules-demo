import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Card, Row, Col, Typography, Button, Space, Alert } from 'antd';
import { BulbOutlined, ShoppingCartOutlined, CalendarOutlined } from '@ant-design/icons';
import { PageHeader, LoadingSpinner, EmptyState, StatusTag } from '../components/common';

interface Recommendation {
  type: string;
  title: string;
  description: string;
  product_id?: number;
  priority: string;
}

const { Title, Text } = Typography;

const Recommendations: React.FC = () => {
  const { isSubmitted } = useSelector((state: RootState) => state.quiz);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get recommendations
    const fetchRecommendations = async () => {
      try {
        // In a real app, this would be an API call
        const mockRecommendations: Recommendation[] = [
          {
            type: 'product',
            title: 'Gentle Shampoo for Hair Loss',
            description: 'Based on your quiz responses, we recommend a gentle, sulfate-free shampoo.',
            product_id: 1,
            priority: 'high'
          },
          {
            type: 'lifestyle',
            title: 'Improve Sleep Pattern',
            description: 'Getting 7-8 hours of quality sleep can help reduce hair loss.',
            priority: 'medium'
          },
          {
            type: 'consultation',
            title: 'Book Consultation',
            description: 'Consider booking a consultation with our dermatologist for personalized treatment.',
            priority: 'high'
          }
        ];
        
        setTimeout(() => {
          setRecommendations(mockRecommendations);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <ShoppingCartOutlined className="text-2xl" />;
      case 'consultation':
        return <CalendarOutlined className="text-2xl" />;
      default:
        return <BulbOutlined className="text-2xl" />;
    }
  };

  const getButtonType = (type: string) => {
    switch (type) {
      case 'product':
        return 'primary';
      case 'consultation':
        return 'default';
      case 'lifestyle':
        return 'dashed';
      default:
        return 'default';
    }
  };

  if (!isSubmitted) {
    return (
      <EmptyState
        icon={<BulbOutlined className="text-4xl text-gray-400" />}
        title="No recommendations yet"
        description="Complete the hair loss quiz to get personalized recommendations."
        actionText="Take Quiz"
        onAction={() => window.location.href = '/quiz'}
      />
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Personalized Recommendations"
        description="Based on your quiz responses, here are our recommendations for your hair health journey."
      />

      <Row gutter={[16, 16]}>
        {(Array.isArray(recommendations) ? recommendations : []).map((recommendation, index) => (
          <Col xs={24} lg={12} key={index}>
            <Card
              hoverable
              className="h-full"
              actions={[
                <Button
                  type={getButtonType(recommendation.type)}
                  className="w-full"
                >
                  {recommendation.type === 'product' && 'View Product'}
                  {recommendation.type === 'consultation' && 'Book Consultation'}
                  {recommendation.type === 'lifestyle' && 'Learn More'}
                </Button>
              ]}
            >
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-50 text-blue-600">
                    {getTypeIcon(recommendation.type)}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <Title level={4} className="!mb-0">
                      {recommendation.title}
                    </Title>
                    <StatusTag status={recommendation.priority} />
                  </div>
                </div>
              </div>
              
              <Text type="secondary">
                {recommendation.description}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Additional Resources */}
      <Alert
        message="Additional Resources"
        description="For more personalized advice, consider booking a consultation with one of our dermatologists."
        type="info"
        showIcon
        action={
          <Space>
            <Button
              type="link"
              onClick={() => window.location.href = '/appointments'}
            >
              Book Appointment
            </Button>
            <Button
              type="link"
              onClick={() => window.location.href = '/products'}
            >
              Browse Products
            </Button>
          </Space>
        }
      />
    </div>
  );
};

export default Recommendations;
