// Generated via prompt: prompts/antd_admin_remaining_pages_v1.md
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchAppointments } from '../store/slices/appointmentSlice';
import { Card, Table, Tag, Avatar, Typography, Space, Empty, Spin } from 'antd';
import { CalendarOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface Appointment {
  id: number;
  patient?: {
    name: string;
    email: string;
  };
  dermatologist?: {
    user?: {
      name: string;
    };
    specialization: string;
  };
  scheduled_at: string;
  status: string;
  consultation_fee: number;
  is_paid: boolean;
}

const Appointments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { appointments, loading } = useSelector((state: RootState) => state.appointment);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'blue';
      case 'in_progress':
        return 'orange';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const columns: ColumnsType<Appointment> = [
    {
      title: 'Patient',
      key: 'patient',
      render: (_, record) => (
        <Space>
          <Avatar icon={<TeamOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.patient?.name}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.patient?.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Dermatologist',
      key: 'dermatologist',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.dermatologist?.user?.name}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.dermatologist?.specialization}
          </Text>
        </div>
      ),
    },
    {
      title: 'Scheduled',
      dataIndex: 'scheduled_at',
      key: 'scheduled_at',
      render: (dateTime) => formatDateTime(dateTime),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Fee',
      dataIndex: 'consultation_fee',
      key: 'consultation_fee',
      render: (fee) => `₹${fee}`,
    },
    {
      title: 'Payment',
      key: 'payment',
      render: (_, record) => (
        <Tag color={record.is_paid ? 'green' : 'red'}>
          {record.is_paid ? 'Paid' : 'Pending'}
        </Tag>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2} style={{ margin: 0 }}>
          Appointments
        </Title>
        <Text type="secondary">
          Monitor all appointments and consultations across the platform.
        </Text>
      </div>

      <Card>
        {appointments.length === 0 && !loading ? (
          <Empty
            image={<CalendarOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />}
            description="No appointments have been scheduled yet."
          />
        ) : (
          <Table
            columns={columns}
            dataSource={appointments}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} appointments`,
            }}
            scroll={{ x: 800 }}
          />
        )}
      </Card>
    </Space>
  );
};

export default Appointments;
