import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';
import { fetchAppointments } from '../store/slices/appointmentSlice';
import { Card, List, Avatar, Typography, Space, Tabs } from 'antd';
import { CalendarOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';
import { PageHeader, LoadingSpinner, EmptyState, StatusTag } from '../components/common';

const { Text } = Typography;

const Appointments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { appointments, loading } = useSelector((state: RootState) => state.appointment);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const filteredAppointments = (Array.isArray(appointments) ? appointments : []).filter(appointment => {
    switch (activeTab) {
      case 'today':
        return new Date(appointment.scheduled_at).toDateString() === new Date().toDateString();
      case 'upcoming':
        return new Date(appointment.scheduled_at) > new Date();
      case 'completed':
        return appointment.status === 'completed';
      case 'cancelled':
        return appointment.status === 'cancelled';
      default:
        return true;
    }
  });

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const handleAppointmentClick = (appointmentId: number) => {
    navigate(`/appointments/${appointmentId}`);
  };

  const tabItems = [
    { key: 'all', label: 'All Appointments' },
    { key: 'today', label: 'Today' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Manage your patient appointments and consultations."
      />

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="mb-4"
        />

        {loading ? (
          <LoadingSpinner />
        ) : filteredAppointments.length === 0 ? (
          <EmptyState
            icon={<CalendarOutlined className="text-4xl text-gray-400" />}
            title="No appointments found"
            description={
              activeTab === 'all' 
                ? 'You don\'t have any appointments yet.'
                : `No ${activeTab} appointments found.`
            }
          />
        ) : (
          <List
            dataSource={filteredAppointments}
            renderItem={(appointment) => (
              <List.Item
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleAppointmentClick(appointment.id)}
              >
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
                        <Text type="secondary">{formatDateTime(appointment.scheduled_at)}</Text>
                      </div>
                      <div className="flex items-center">
                        <DollarOutlined className="mr-2 text-gray-400" />
                        <Text type="secondary">₹{appointment.consultation_fee}</Text>
                        {appointment.is_paid && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Paid
                          </span>
                        )}
                      </div>
                      {appointment.notes && (
                        <Text type="secondary" className="block">
                          {appointment.notes}
                        </Text>
                      )}
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default Appointments;