import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchAppointments, fetchDermatologists, bookAppointment } from '../store/slices/appointmentSlice';
import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { Card, List, Avatar, Typography, Space, Button, Form } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import { PageHeader, LoadingSpinner, EmptyState, StatusTag, Modal, FormField } from '../components/common';
import toast from 'react-hot-toast';
import { sendChatMessage } from '../store/slices/chatSlice';

const { Text } = Typography;

const Appointments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { appointments, dermatologists, loading, error } = useSelector((state: RootState) => state.appointment);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [chatOpenForId, setChatOpenForId] = useState<number | null>(null);
  const [chatMessage, setChatMessage] = useState<string>('');
  const [bookingData, setBookingData] = useState({
    dermatologist_id: '',
    scheduled_at: '',
  });
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

  const openChat = (appointmentId: number) => {
    navigate(`/chat?appointmentId=${appointmentId}`);
  };

  const closeChat = () => {
    setChatOpenForId(null);
    setChatMessage('');
  };

  const onSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatOpenForId || !chatMessage.trim()) return;
    dispatch(sendChatMessage({ appointmentId: chatOpenForId, message: chatMessage.trim() }))
      .unwrap()
      .then(() => setChatMessage(''))
      .catch((err) => toast.error(err || 'Failed to send'));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
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
      {showBookingForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Book New Appointment
              </h3>
              <form onSubmit={handleBookingSubmit}>
                <div className="mb-4">
                  <label className="form-label">Select Dermatologist</label>
                  <div className="text-xs text-gray-500 mb-2">
                    {Array.isArray(dermatologists) ? dermatologists.length : 0} dermatologist(s) available
                  </div>
                  <select
                    value={bookingData.dermatologist_id}
                    onChange={(e) => setBookingData({ ...bookingData, dermatologist_id: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Choose a dermatologist</option>
                    {(Array.isArray(dermatologists) ? dermatologists : []).map((derm) => (
                      <option key={derm.id} value={derm.user_id}>
                        {derm.user?.name} - {derm.specialization} (₹{derm.consultation_fee})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="form-label">Select Date & Time</label>
                  <input
                    type="datetime-local"
                    value={bookingData.scheduled_at}
                    onChange={(e) => setBookingData({ ...bookingData, scheduled_at: e.target.value })}
                    className="input-field"
                    required
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Booking...' : 'Book Appointment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
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
                      <Text strong>{appointment.dermatologist?.user?.name || 'Unknown Doctor'}</Text>
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
      {chatOpenForId !== null && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto w-full max-w-xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-lg font-medium text-gray-900">Chat with Dermatologist</h3>
              <button onClick={closeChat} className="p-1 rounded hover:bg-gray-100">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
              {/* Messages rendering can be connected to store if needed */}
            </div>
            <form onSubmit={onSendMessage} className="p-4 border-t flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 input-field"
                placeholder="Type your message..."
              />
              <button type="submit" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <PaperAirplaneIcon className="h-4 w-4 mr-2" /> Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Appointments;
