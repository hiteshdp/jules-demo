// Generated via prompt: prompts/admin_subscription_management_v1.md

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { 
  fetchSubscriptions, 
  fetchSubscriptionDetails, 
  fetchSubscriptionStatistics,
  setFilters,
  clearFilters,
  setPagination,
  clearError
} from '../store/slices/subscriptionSlice';
import { 
  Card, 
  Table, 
  Tag, 
  Avatar, 
  Typography, 
  Space, 
  Empty, 
  Row, 
  Col, 
  Statistic,
  Button,
  Input,
  Select,
  DatePicker,
  Modal,
  Descriptions,
  Timeline,
  message
} from 'antd';
import { 
  DollarOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ClockCircleOutlined,
  PauseCircleOutlined,
  UserOutlined,
  EyeOutlined,
  FilterOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { formatDateTime } from '../utils/dateUtils';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Subscriptions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    subscriptions, 
    currentSubscription, 
    statistics, 
    loading, 
    error, 
    pagination, 
    filters 
  } = useSelector((state: RootState) => state.subscription);


  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchSubscriptions(filters));
    dispatch(fetchSubscriptionStatistics());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'cancelled':
        return 'red';
      case 'expired':
        return 'default';
      case 'pending':
        return 'orange';
      case 'paused':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleOutlined />;
      case 'cancelled':
        return <CloseCircleOutlined />;
      case 'pending':
        return <ClockCircleOutlined />;
      case 'paused':
        return <PauseCircleOutlined />;
      default:
        return <DollarOutlined />;
    }
  };


  // Using standardized formatDateTime from dateUtils

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setFilters({ [key]: value }));
    dispatch(fetchSubscriptions({ ...filters, [key]: value }));
  };

  const handleSearch = (value: string) => {
    dispatch(setFilters({ patient_name: value }));
    dispatch(fetchSubscriptions({ ...filters, patient_name: value }));
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      dispatch(setFilters({ 
        date_from: dates[0].format('YYYY-MM-DD'),
        date_to: dates[1].format('YYYY-MM-DD')
      }));
      dispatch(fetchSubscriptions({ 
        ...filters, 
        date_from: dates[0].format('YYYY-MM-DD'),
        date_to: dates[1].format('YYYY-MM-DD')
      }));
    } else {
      dispatch(setFilters({ date_from: undefined, date_to: undefined }));
      dispatch(fetchSubscriptions({ ...filters, date_from: undefined, date_to: undefined }));
    }
  };

  const handleTableChange = (pagination: any) => {
    dispatch(setPagination({ 
      current: pagination.current, 
      pageSize: pagination.pageSize 
    }));
    dispatch(fetchSubscriptions({ 
      ...filters, 
      per_page: pagination.pageSize 
    }));
  };

  const handleViewDetails = async (subscription: any) => {
    setDetailsModalVisible(true);
    await dispatch(fetchSubscriptionDetails(subscription.id));
  };




  const columns: ColumnsType<any> = [
    {
      title: 'Patient',
      key: 'patient',
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
      title: 'Plan',
      dataIndex: 'plan_name',
      key: 'plan_name',
      render: (planName, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{planName}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.billing_cycle} • {formatCurrency(record.price)}
          </Text>
        </div>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'starts_at',
      key: 'starts_at',
      render: (date) => date ? formatDateTime(date) : 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Total Paid',
      key: 'total_amount_paid',
      render: (_, record) => formatCurrency(record.total_amount_paid || 0),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Button 
          type="text" 
          icon={<EyeOutlined />} 
          onClick={() => handleViewDetails(record)}
          title="View Details"
        />
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2} style={{ margin: 0 }}>
          Subscription Management
        </Title>
        <Text type="secondary">
          Track and manage all active and past subscriptions, including payment statuses and related appointments.
        </Text>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Subscriptions"
                value={statistics.total_subscriptions}
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Active Subscriptions"
                value={statistics.active_subscriptions}
                valueStyle={{ color: '#3f8600' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={statistics.total_revenue}
                precision={2}
                prefix="₹"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Monthly Revenue"
                value={statistics.monthly_revenue}
                precision={2}
                prefix="₹"
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Search
              placeholder="Search by patient name"
              onSearch={handleSearch}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Status"
              allowClear
              style={{ width: '100%' }}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
            >
              <Option value="active">Active</Option>
              <Option value="cancelled">Cancelled</Option>
              <Option value="expired">Expired</Option>
              <Option value="pending">Pending</Option>
              <Option value="paused">Paused</Option>
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker
              style={{ width: '100%' }}
              onChange={handleDateRangeChange}
            />
          </Col>
          <Col span={4}>
            <Space>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={() => dispatch(fetchSubscriptions(filters))}
              >
                Refresh
              </Button>
              <Button 
                icon={<FilterOutlined />} 
                onClick={() => {
                  dispatch(clearFilters());
                  dispatch(fetchSubscriptions({}));
                }}
              >
                Clear
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        {subscriptions.length === 0 && !loading ? (
          <Empty
            image={<DollarOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />}
            description="No subscriptions found."
          />
        ) : (
          <Table
            columns={columns}
            dataSource={subscriptions}
            loading={loading}
            rowKey="id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} subscriptions`,
            }}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
          />
        )}
      </Card>

      {/* Subscription Details Modal */}
      <Modal
        title="Subscription Details"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={800}
      >
        {currentSubscription && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Subscription ID">
                #{currentSubscription.id}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(currentSubscription.status)}>
                  {currentSubscription.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Patient Name">
                {currentSubscription.user?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Patient Email">
                {currentSubscription.user?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Plan Name">
                {currentSubscription.plan_name}
              </Descriptions.Item>
              <Descriptions.Item label="Billing Cycle">
                {currentSubscription.billing_cycle}
              </Descriptions.Item>
              <Descriptions.Item label="Price">
                {formatCurrency(currentSubscription.price)}
              </Descriptions.Item>
              <Descriptions.Item label="Start Date">
                {currentSubscription.starts_at ? formatDateTime(currentSubscription.starts_at) : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="End Date">
                {currentSubscription.ends_at ? formatDateTime(currentSubscription.ends_at) : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Next Billing Date">
                {currentSubscription.next_billing_date ? formatDateTime(currentSubscription.next_billing_date) : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Cancelled At">
                {currentSubscription.cancelled_at ? formatDateTime(currentSubscription.cancelled_at) : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Total Payments">
                {currentSubscription.total_payments || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount Paid">
                {formatCurrency(currentSubscription.total_amount_paid || 0)}
              </Descriptions.Item>
            </Descriptions>

            {currentSubscription.payments && currentSubscription.payments.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <Title level={4}>Payment History</Title>
                <Timeline>
                  {currentSubscription.payments.map((payment: any) => (
                    <Timeline.Item
                      key={payment.id}
                      color="blue"
                    >
                      <div>
                        <Text strong>{formatCurrency(payment.amount)}</Text>
                        <Tag color="blue" style={{ marginLeft: 8 }}>
                          {payment.status.toUpperCase()}
                        </Tag>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {payment.paid_at ? formatDateTime(payment.paid_at) : 'Not paid'}
                        </div>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
            )}
          </div>
        )}
      </Modal>


    </Space>
  );
};

export default Subscriptions;