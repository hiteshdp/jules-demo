// Generated via prompt: prompts/antd_admin_remaining_pages_v1.md
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchPayments } from '../store/slices/paymentSlice';
import { Card, Table, Tag, Avatar, Typography, Space, Empty, Row, Col, Statistic } from 'antd';
import { 
  DollarOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ClockCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface Payment {
  id: number;
  user?: {
    name: string;
    email: string;
  };
  type: string;
  amount: number;
  status: string;
  razorpay_payment_id?: string;
  created_at: string;
}

const Payments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { payments, loading } = useSelector((state: RootState) => state.payment);

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'pending':
        return 'orange';
      case 'failed':
        return 'red';
      case 'refunded':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined />;
      case 'pending':
        return <ClockCircleOutlined />;
      case 'failed':
        return <CloseCircleOutlined />;
      default:
        return <DollarOutlined />;
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const totalRevenue = payments
    .filter((payment: Payment) => payment.status === 'completed')
    .reduce((sum: number, payment: Payment) => sum + payment.amount, 0);

  const pendingPayments = payments.filter((payment: Payment) => payment.status === 'pending').length;

  const columns: ColumnsType<Payment> = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.user?.name}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.user?.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `₹${amount}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Payment ID',
      dataIndex: 'razorpay_payment_id',
      key: 'razorpay_payment_id',
      render: (id) => id || 'N/A',
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (dateTime) => formatDateTime(dateTime),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2} style={{ margin: 0 }}>
          Payments
        </Title>
        <Text type="secondary">
          Monitor all payments and transactions across the platform.
        </Text>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={`₹${totalRevenue.toLocaleString()}`}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Pending Payments"
              value={pendingPayments}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Payments"
              value={payments.length}
              prefix={<CheckCircleOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Payments List */}
      <Card>
        {payments.length === 0 && !loading ? (
          <Empty
            image={<DollarOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />}
            description="No payments have been processed yet."
          />
        ) : (
          <Table
            columns={columns}
            dataSource={payments}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} payments`,
            }}
            scroll={{ x: 800 }}
          />
        )}
      </Card>
    </Space>
  );
};

export default Payments;
