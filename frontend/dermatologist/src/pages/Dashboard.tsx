import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchAppointments } from '../store/slices/appointmentSlice';
import { Card, Row, Col, Statistic, Typography, Space, Button, List, Avatar } from 'antd';
import { 
  CalendarOutlined, 
  UserOutlined,
  DollarOutlined,
  FileTextOutlined,
  MessageOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { PageHeader, LoadingSpinner, StatusTag } from '../components/common';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { appointments, loading } = useSelector((state: RootState) => state.appointment);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

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
      title: 'Today\'s Appointments',
      value: todayAppointments.length,
      icon: <CalendarOutlined className="text-blue-600" />,
      color: '#1890ff',
    },
    {
      title: 'Total Patients',
      value: new Set((Array.isArray(appointments) ? appointments : []).map(apt => apt.patient_id)).size,
      icon: <TeamOutlined className="text-green-600" />,
      color: '#52c41a',
    },
    {
      title: 'Completed Appointments',
      value: completedAppointments.length,
      icon: <FileTextOutlined className="text-purple-600" />,
      color: '#722ed1',
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, Dr. ${user?.name || 'User'}!`}
        description="Here's your practice overview for today."
      />

      {/* Stats */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
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
          <Col xs={24} sm={12} lg={8}>
            <Card 
              hoverable
              className="h-full"
              onClick={() => window.location.href = '/appointments'}
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

          <Col xs={24} sm={12} lg={8}>
            <Card 
              hoverable
              className="h-full"
              onClick={() => window.location.href = '/chat'}
            >
              <Space direction="vertical" size="middle" className="w-full">
                <div className="text-center">
                  <div className="inline-flex p-3 bg-green-50 text-green-700 rounded-lg">
                    <MessageOutlined className="text-2xl" />
                  </div>
                </div>
                <div className="text-center">
                  <Title level={4} className="!mb-2">Patient Chat</Title>
                  <Text type="secondary">
                    Communicate with your patients in real-time.
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card 
              hoverable
              className="h-full"
              onClick={() => window.location.href = '/profile'}
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

      {/* Today's Appointments */}
      {todayAppointments.length > 0 && (
        <Card title="Today's Appointments">
          <List
            dataSource={todayAppointments}
            renderItem={(appointment) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar icon={<UserOutlined />} className="bg-blue-100 text-blue-600" />
                  }
                  title={
                    <div className="flex items-center justify-between">
                      <Text strong>{appointment.patient?.name || 'Unknown Patient'}</Text>
                      <StatusTag status={appointment.status} />
                    </div>
                  }
                  description={
                    <Space direction="vertical" size="small">
                      <div className="flex items-center">
                        <CalendarOutlined className="mr-2 text-gray-400" />
                        <Text type="secondary">{new Date(appointment.scheduled_at).toLocaleTimeString()}</Text>
                      </div>
                      <div className="flex items-center">
                        <DollarOutlined className="mr-2 text-gray-400" />
                        <Text type="secondary">₹{appointment.consultation_fee}</Text>
                      </div>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <Card title="Upcoming Appointments">
          <List
            dataSource={upcomingAppointments}
            renderItem={(appointment) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar icon={<CalendarOutlined />} className="bg-green-100 text-green-600" />
                  }
                  title={
                    <div className="flex items-center justify-between">
                      <Text strong>{appointment.patient?.name || 'Unknown Patient'}</Text>
                      <StatusTag status={appointment.status} />
                    </div>
                  }
                  description={
                    <Space direction="vertical" size="small">
                      <div className="flex items-center">
                        <CalendarOutlined className="mr-2 text-gray-400" />
                        <Text type="secondary">
                          {new Date(appointment.scheduled_at).toLocaleDateString()} at{' '}
                          {new Date(appointment.scheduled_at).toLocaleTimeString()}
                        </Text>
                      </div>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}

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