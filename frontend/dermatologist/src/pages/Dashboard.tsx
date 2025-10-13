import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';
import { fetchAppointments } from '../store/slices/appointmentSlice';
import { Card, Row, Col, Statistic, Typography, Space, List, Avatar } from 'antd';
import { 
  CalendarOutlined, 
  UserOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { PageHeader, LoadingSpinner, StatusTag } from '../components/common';
import { formatDateTimeWithAmPm } from '../utils/dateUtils';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { appointments, loading, error } = useSelector((state: RootState) => state.appointment);

  useEffect(() => {
    // Only fetch appointments if user is authenticated
    if (user && user.id) {
      dispatch(fetchAppointments());
    }
  }, [dispatch, user]);

  const todayAppointments = (Array.isArray(appointments) ? appointments : []).filter(
    appointment => new Date(appointment.scheduled_at).toDateString() === new Date().toDateString()
  );

  const upcomingAppointments = (Array.isArray(appointments) ? appointments : []).filter(
    appointment => new Date(appointment.scheduled_at) > new Date()
  ).slice(0, 5);

  const completedAppointments = (Array.isArray(appointments) ? appointments : []).filter(
    appointment => appointment.status === 'completed'
  );

  const stats = [
    {
      title: 'Total Appointments',
      value: Array.isArray(appointments) ? appointments.length : 0,
      icon: <CalendarOutlined className="text-blue-600" />,
      color: '#1890ff',
    },
    {
      title: 'Upcoming Appointments',
      value: upcomingAppointments.length,
      icon: <CalendarOutlined className="text-green-600" />,
      color: '#52c41a',
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  // Show loading if user is not authenticated yet or if appointments are loading
  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => dispatch(fetchAppointments())}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name || 'User'}!`}
        description="Here's your practice overview for today."
      />

      {/* Stats */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={12} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={12}>
            <Card 
              hoverable
              className="h-full"
              onClick={() => navigate('/appointments')}
            >
              <Space direction="vertical" size="middle" className="w-full">
                <div className="text-center">
                  <div className="inline-flex p-3 bg-blue-50 text-blue-700 rounded-lg">
                    <CalendarOutlined className="text-2xl" />
                  </div>
              </div>
                <div className="text-center">
                  <Title level={4} className="!mb-2">View Appointments</Title>
                  <Text type="secondary">
                  Manage your patient appointments and consultations.
                  </Text>
              </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={12}>
            <Card 
              hoverable
              className="h-full"
              onClick={() => navigate('/profile')}
            >
              <Space direction="vertical" size="middle" className="w-full">
                <div className="text-center">
                  <div className="inline-flex p-3 bg-purple-50 text-purple-700 rounded-lg">
                    <UserOutlined className="text-2xl" />
          </div>
        </div>
                <div className="text-center">
                  <Title level={4} className="!mb-2">Manage Profile</Title>
                  <Text type="secondary">
                    Update your professional information and credentials.
                  </Text>
      </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>

      

      {(!Array.isArray(appointments) || appointments.length === 0) && !loading && (
        <Card>
        <div className="text-center py-12">
            <CalendarOutlined className="mx-auto text-4xl text-gray-400 mb-4" />
            <Title level={3} className="text-gray-900">No appointments</Title>
            <Text type="secondary">
            You don't have any appointments scheduled yet.
            </Text>
        </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;