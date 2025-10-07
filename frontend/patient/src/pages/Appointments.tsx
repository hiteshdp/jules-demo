import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchAppointments, fetchDermatologists, bookAppointment } from '../store/slices/appointmentSlice';
import { Card, List, Avatar, Typography, Space, Button, Form } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import { PageHeader, LoadingSpinner, EmptyState, StatusTag, Modal, FormField } from '../components/common';
import toast from 'react-hot-toast';

const { Text } = Typography;

const Appointments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { appointments, dermatologists, loading, error } = useSelector((state: RootState) => state.appointment);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchDermatologists());
  }, [dispatch]);

  const handleBookingSubmit = (values: any) => {
    dispatch(bookAppointment({
      dermatologist_id: parseInt(values.dermatologist_id),
      scheduled_at: values.scheduled_at,
    }))
      .unwrap()
      .then(() => {
        setShowBookingForm(false);
        form.resetFields();
        toast.success('Appointment booked successfully!');
        dispatch(fetchAppointments());
      })
      .catch((error) => {
        toast.error(error || 'Failed to book appointment');
      });
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Manage your consultations with dermatologists."
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowBookingForm(true)}
          >
            Book New Appointment
          </Button>
        }
      />

      {/* Booking Form Modal */}
      <Modal
        title="Book New Appointment"
        open={showBookingForm}
        onCancel={() => setShowBookingForm(false)}
        onOk={() => form.submit()}
        okText="Book Appointment"
        loading={loading}
        width={600}
      >
        <Form
          form={form}
          onFinish={handleBookingSubmit}
          layout="vertical"
        >
          <FormField
            name="dermatologist_id"
            label="Select Dermatologist"
            type="select"
            placeholder="Choose a dermatologist"
            required
            options={(Array.isArray(dermatologists) ? dermatologists : []).map((derm) => ({
              label: `${derm.user?.name || 'Unknown'} - ${derm.specialization || 'General'} (₹${derm.consultation_fee || 0})`,
              value: derm.user_id || derm.id
            }))}
          />
          
          <FormField
            name="scheduled_at"
            label="Select Date & Time"
            type="datetime"
            required
          />
        </Form>
      </Modal>

      {/* Appointments List */}
      <Card 
        title="Your Appointments"
        extra={
          <Text type="secondary">
            {Array.isArray(appointments) ? appointments.length : 0} appointment(s)
          </Text>
        }
      >
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <Text type="danger">Error: {error}</Text>
            <Button
              type="link"
              onClick={() => {
                dispatch(fetchAppointments());
                dispatch(fetchDermatologists());
              }}
            >
              Try Again
            </Button>
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : !Array.isArray(appointments) || appointments.length === 0 ? (
          <EmptyState
            icon={<CalendarOutlined className="text-4xl text-gray-400" />}
            title="No appointments found"
            description="Get started by booking your first appointment."
            actionText="Book Appointment"
            onAction={() => setShowBookingForm(true)}
          />
        ) : (
          <List
            dataSource={appointments}
            renderItem={(appointment) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar icon={<UserOutlined />} className="bg-blue-100 text-blue-600" />
                  }
                  title={
                    <div className="flex items-center justify-between">
                      <Text strong>{appointment.dermatologist?.name || 'Unknown Doctor'}</Text>
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
                        <ClockCircleOutlined className="mr-2 text-gray-400" />
                        <Text type="secondary">₹{appointment.consultation_fee}</Text>
                      </div>
                      {appointment.notes && (
                        <Text type="secondary">{appointment.notes}</Text>
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
