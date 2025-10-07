// Generated via prompt: prompts/dermatologist_fetch_functionality_v1.md
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchDermatologists } from '../store/slices/dermatologistSlice';
import { Card, Row, Col, Typography, Button, Space, Avatar, Divider } from 'antd';
import { UserOutlined, DollarOutlined, ClockCircleOutlined, BookOutlined } from '@ant-design/icons';
import { PageHeader, LoadingSpinner, EmptyState, StatusTag } from '../components/common';

const { Title, Text } = Typography;

const Dermatologists: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dermatologists, loading, error } = useSelector((state: RootState) => state.dermatologist);

  useEffect(() => {
    dispatch(fetchDermatologists());
  }, [dispatch]);

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getAvailabilityStatus = (dermatologist: any) => {
    if (!dermatologist.is_available) return 'Not Available';
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const isAvailableToday = dermatologist.available_days?.includes(today);
    
    return isAvailableToday ? 'Available Today' : 'Available';
  };

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

                  <div className="flex items-center">
                    <ClockCircleOutlined className="mr-2 text-gray-400" />
                    <Text type="secondary">
                      {formatTime(dermatologist.start_time || '09:00')} - {formatTime(dermatologist.end_time || '17:00')}
                    </Text>
                  </div>

                  <Divider className="my-2" />

                  <div className="flex items-center justify-between">
                    <StatusTag status={getAvailabilityStatus(dermatologist)} />
                    <Text type="secondary" className="text-xs">
                      Max {dermatologist.max_patients_per_day || 0} patients/day
                    </Text>
                  </div>

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
