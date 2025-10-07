// Generated via prompt: prompts/antd_admin_full_conversion_v1.md
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  Spin,
  Space
} from 'antd';
import {
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  // Mock data for now - no API calls to prevent loops
  const stats = {
    total_patients: 0,
    total_dermatologists: 0,
    total_appointments: 0,
    total_revenue: 0,
    pending_appointments: 0,
    active_subscriptions: 0,
  };
  const monthlyAppointments: any[] = [];
  const monthlyRevenue: any[] = [];
  const loading = false;

  const statCards = [
    {
      title: 'Total Patients',
      value: stats?.total_patients || 0,
      icon: <TeamOutlined style={{ color: '#1890ff' }} />,
      color: '#1890ff',
    },
    {
      title: 'Total Dermatologists',
      value: stats?.total_dermatologists || 0,
      icon: <UserOutlined style={{ color: '#52c41a' }} />,
      color: '#52c41a',
    },
    {
      title: 'Total Appointments',
      value: stats?.total_appointments || 0,
      icon: <CalendarOutlined style={{ color: '#722ed1' }} />,
      color: '#722ed1',
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats?.total_revenue || 0).toLocaleString()}`,
      icon: <DollarOutlined style={{ color: '#faad14' }} />,
      color: '#faad14',
    },
    {
      title: 'Pending Appointments',
      value: stats?.pending_appointments || 0,
      icon: <ClockCircleOutlined style={{ color: '#fa8c16' }} />,
      color: '#fa8c16',
    },
    {
      title: 'Active Subscriptions',
      value: stats?.active_subscriptions || 0,
      icon: <CheckCircleOutlined style={{ color: '#13c2c2' }} />,
      color: '#13c2c2',
    },
  ];

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '400px' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2} style={{ margin: 0 }}>
          Dashboard
        </Title>
        <Text type="secondary">
          Overview of your platform's performance and key metrics.
        </Text>
      </div>

      {/* Stats Grid */}
      <Row gutter={[16, 16]}>
        {statCards.map((stat) => (
          <Col xs={24} sm={12} lg={8} key={stat.title}>
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

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Monthly Appointments">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyAppointments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#1890ff" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Monthly Revenue">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                  <Bar dataKey="total" fill="#52c41a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card 
              hoverable
              style={{ textAlign: 'center' }}
              onClick={() => window.location.href = '/patients'}
            >
              <TeamOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 16 }} />
              <Title level={4}>Manage Patients</Title>
              <Text type="secondary">
                View and manage patient accounts and profiles.
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card 
              hoverable
              style={{ textAlign: 'center' }}
              onClick={() => window.location.href = '/dermatologists'}
            >
              <UserOutlined style={{ fontSize: 32, color: '#52c41a', marginBottom: 16 }} />
              <Title level={4}>Manage Dermatologists</Title>
              <Text type="secondary">
                Add and manage dermatologist accounts.
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card 
              hoverable
              style={{ textAlign: 'center' }}
              onClick={() => window.location.href = '/appointments'}
            >
              <CalendarOutlined style={{ fontSize: 32, color: '#722ed1', marginBottom: 16 }} />
              <Title level={4}>View Appointments</Title>
              <Text type="secondary">
                Monitor all appointments and consultations.
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card 
              hoverable
              style={{ textAlign: 'center' }}
              onClick={() => window.location.href = '/settings'}
            >
              <SettingOutlined style={{ fontSize: 32, color: '#8c8c8c', marginBottom: 16 }} />
              <Title level={4}>System Settings</Title>
              <Text type="secondary">
                Configure platform settings and preferences.
              </Text>
            </Card>
          </Col>
        </Row>
      </Card>
    </Space>
  );
};

export default Dashboard;
