// Generated via prompt: prompts/dermatologist_fetch_functionality_v1.md
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchDermatologists } from '../store/slices/dermatologistSlice';
import { Card, Row, Col, Typography, Button, Space, Avatar } from 'antd';
import { UserOutlined, DollarOutlined, BookOutlined } from '@ant-design/icons';
import { PageHeader, LoadingSpinner, EmptyState, StatusTag } from '../components/common';

const { Title, Text } = Typography;

const Dermatologists: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dermatologists, loading, error } = useSelector((state: RootState) => state.dermatologist);

  useEffect(() => {
    dispatch(fetchDermatologists());
  }, [dispatch]);

  // Availability fields removed from API; keep simple status via consultation_fee presence

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <EmptyState
        icon={<UserOutlined className="text-4xl text-red-400" />}
        title="Error loading dermatologists"
        description={error}
        actionText="Try Again"
        onAction={() => dispatch(fetchDermatologists())}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Available Dermatologists"
        description="Choose from our qualified dermatologists for your hair loss consultation."
      />

      {dermatologists.length === 0 ? (
        <EmptyState
          icon={<UserOutlined className="text-4xl text-gray-400" />}
          title="No dermatologists available"
          description="There are currently no dermatologists available for consultation."
        />
      ) : (
        <Row gutter={[16, 16]}>
          {dermatologists.map((dermatologist) => (
            <Col xs={24} sm={12} lg={8} key={dermatologist.id}>
              <Card
                hoverable
                className="h-full"
                actions={[
                  <Button
                    type="primary"
                    disabled={!dermatologist.is_available}
                    className="w-full"
                  >
                    {dermatologist.is_available ? 'Book Consultation' : 'Not Available'}
                  </Button>
                ]}
              >
                <div className="flex items-center mb-4">
                  <Avatar
                    size={48}
                    icon={<UserOutlined />}
                    className="bg-blue-100 text-blue-600"
                  />
                  <div className="ml-4 flex-1">
                    <Title level={4} className="!mb-1">
                      Dr. {dermatologist.user?.name || 'Unknown'}
                    </Title>
                    <Text type="secondary">{dermatologist.specialization || 'General'}</Text>
                  </div>
                </div>

                <Space direction="vertical" size="small" className="w-full">
                  <div className="flex items-center">
                    <BookOutlined className="mr-2 text-gray-400" />
                    <Text type="secondary">
                      {dermatologist.years_of_experience || 0} years experience
                    </Text>
                  </div>

                  <div className="flex items-center">
                    <DollarOutlined className="mr-2 text-gray-400" />
                    <Text type="secondary">
                      ₹{dermatologist.consultation_fee || 0} consultation fee
                    </Text>
                  </div>

                  {/* Availability schedule removed */}

                  {dermatologist.bio && (
                    <Text type="secondary" className="block mt-2">
                      {dermatologist.bio}
                    </Text>
                  )}
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Dermatologists;
