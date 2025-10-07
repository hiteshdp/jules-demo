import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchAppointments } from '../store/slices/appointmentSlice';
import { fetchQuestions } from '../store/slices/quizSlice';
import { Card, Row, Col, Statistic, Typography, Space, Button } from 'antd';
import { 
  CalendarOutlined, 
  FileTextOutlined, 
  BulbOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons';
import { PageHeader, LoadingSpinner, StatusTag } from '../components/common';

const { Title, Text } = Typography;

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { appointments } = useSelector((state: RootState) => state.appointment);
  const { isSubmitted } = useSelector((state: RootState) => state.quiz);

  useEffect(() => {
    // Only fetch data if user is authenticated
    if (user) {
      dispatch(fetchAppointments());
      dispatch(fetchQuestions());
    }
  }, [dispatch, user]);

  const upcomingAppointments = (Array.isArray(appointments) ? appointments : []).filter(
    appointment => new Date(appointment.scheduled_at) > new Date()
  ).slice(0, 3);

  const stats = [
    {
      title: 'Upcoming Appointments',
      value: upcomingAppointments.length,
      icon: <CalendarOutlined className="text-blue-600" />,
      color: '#1890ff',
    },
    {
      title: 'Quiz Completed',
      value: isSubmitted ? 'Yes' : 'No',
      icon: <FileTextOutlined className="text-green-600" />,
      color: '#52c41a',
    },
    {
      title: 'Total Appointments',
      value: Array.isArray(appointments) ? appointments.length : 0,
      icon: <TeamOutlined className="text-purple-600" />,
      color: '#722ed1',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name || 'User'}!`}
        description="Here's what's happening with your hair health journey."
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
              onClick={() => window.location.href = '/quiz'}
            >
              <Space direction="vertical" size="middle" className="w-full">
                <div className="text-center">
                  <div className="inline-flex p-3 bg-blue-50 text-blue-700 rounded-lg">
                    <FileTextOutlined className="text-2xl" />
                  </div>
                </div>
                <div className="text-center">
                  <Title level={4} className="!mb-2">Take Hair Loss Quiz</Title>
                  <Text type="secondary">
                    Complete our comprehensive quiz to get personalized recommendations.
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card 
              hoverable
              className="h-full"
              onClick={() => window.location.href = '/recommendations'}
            >
              <Space direction="vertical" size="middle" className="w-full">
                <div className="text-center">
                  <div className="inline-flex p-3 bg-green-50 text-green-700 rounded-lg">
                    <BulbOutlined className="text-2xl" />
                  </div>
                </div>
                <div className="text-center">
                  <Title level={4} className="!mb-2">View Recommendations</Title>
                  <Text type="secondary">
                    See personalized product and lifestyle recommendations.
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card 
              hoverable
              className="h-full"
              onClick={() => window.location.href = '/appointments'}
            >
              <Space direction="vertical" size="middle" className="w-full">
                <div className="text-center">
                  <div className="inline-flex p-3 bg-purple-50 text-purple-700 rounded-lg">
                    <CalendarOutlined className="text-2xl" />
                  </div>
                </div>
                <div className="text-center">
                  <Title level={4} className="!mb-2">Book Appointment</Title>
                  <Text type="secondary">
                    Schedule a consultation with our dermatologists.
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Upcoming Appointments */}
      {Array.isArray(appointments) && upcomingAppointments.length > 0 && (
        <Card title="Upcoming Appointments">
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <CalendarOutlined className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Text strong className="block">
                      {appointment.dermatologist?.user?.name}
                    </Text>
                    <Text type="secondary" className="text-sm">
                      {new Date(appointment.scheduled_at).toLocaleDateString()} at{' '}
                      {new Date(appointment.scheduled_at).toLocaleTimeString()}
                    </Text>
                  </div>
                </div>
                <StatusTag status={appointment.status} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
