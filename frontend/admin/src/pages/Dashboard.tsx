// Generated via prompt: prompts/antd_admin_full_conversion_v1.md
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Spin,
  Space,
  Alert
} from 'antd';
import {
  TeamOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchDashboardData, clearError } from '../store/slices/dashboardSlice';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      // Auto-clear error after 5 seconds
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const stats = data?.stats || {
    total_patients: 0,
    total_revenue: 0,
    active_subscriptions: 0,
  };

  const monthlyRevenue = data?.monthly_revenue || [];

  const statCards = [
    {
      title: 'Total Patients',
      value: stats?.total_patients || 0,
      icon: <TeamOutlined style={{ color: '#1890ff' }} />,
      color: '#1890ff',
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats?.total_revenue || 0).toLocaleString()}`,
      icon: <DollarOutlined style={{ color: '#faad14' }} />,
      color: '#faad14',
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

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => dispatch(clearError())}
        />
      )}

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
              onClick={() => navigate('/patients')}
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
              onClick={() => navigate('/settings')}
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
