import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';
import { fetchAppointments, fetchDermatologists, createAppointmentPayment, verifyAppointmentPayment } from '../store/slices/appointmentSlice';
import { Card, Avatar, Typography, Button, Form } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, PlusOutlined, MessageOutlined, EyeOutlined, CreditCardOutlined } from '@ant-design/icons';
import { PageHeader, LoadingSpinner, EmptyState, StatusTag, Modal, FormField } from '../components/common';
import toast from 'react-hot-toast';

const { Text } = Typography;

const Appointments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { appointments, dermatologists, loading, error } = useSelector((state: RootState) => state.appointment);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchDermatologists());
  }, [dispatch]);

  // Debug: Log dermatologists data
  useEffect(() => {
    console.log('Dermatologists data:', dermatologists);
  }, [dermatologists]);

  const handleBookingSubmit = (values: any) => {
    // Create payment order first
    dispatch(createAppointmentPayment({
      dermatologist_id: parseInt(values.dermatologist_id),
      scheduled_at: values.scheduled_at,
    }))
      .unwrap()
      .then((paymentData) => {
        console.log('Payment data received:', paymentData);
        // Initialize Razorpay payment
        const options = {
          key: paymentData.key,
          amount: paymentData.amount,
          currency: paymentData.currency,
          name: 'Hair & Skin Health',
          description: 'Appointment Booking Payment',
          order_id: paymentData.order_id,
          handler: async (response: any) => {
            // Verify payment on backend
            dispatch(verifyAppointmentPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              payment_id: paymentData.payment_id,
            }))
              .unwrap()
              .then(() => {
                setShowBookingForm(false);
                form.resetFields();
                toast.success('Payment successful! Appointmachhaent booked.');
                dispatch(fetchAppointments());
              })
              .catch((error) => {
                toast.error(error || 'Payment verification failed');
              });
          },
          prefill: {
            name: 'Patient',
            email: 'patient@example.com',
            contact: '9999999999'
          },
          notes: {
            address: 'Hair & Skin Health Platform'
          },
          theme: {
            color: '#3399cc'
          }
        };

        // Check if Razorpay is loaded
        if (typeof window !== 'undefined' && window.Razorpay) {
          console.log('Razorpay loaded, opening payment modal...');
          const razorpay = new window.Razorpay(options);
          razorpay.on('payment.failed', () => {
            toast.error('Payment failed. Please try again.');
          });
          razorpay.open();
        } else {
          console.error('Razorpay not loaded');
          toast.error('Payment gateway not loaded. Please refresh the page and try again.');
        }
      })
      .catch((error) => {
        toast.error(error || 'Failed to create payment order');
      });
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

      <Modal
        title="Book New Appointment"
        open={showBookingForm}
        onCancel={() => setShowBookingForm(false)}
        onOk={() => form.submit()}
        okText="Proceed to Payment"
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
              label: `${derm.name || 'Unknown'} - ${derm.specialization || 'General'} (₹${derm.consultation_fee || 0})`,
              value: derm.id
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Your Appointments</h3>
              <p className="text-sm text-gray-600 mt-1">
                Manage your consultations with dermatologists
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {Array.isArray(appointments) ? appointments.length : 0}
              </div>
              <div className="text-sm text-gray-500">appointment(s)</div>
            </div>
          </div>
        </div>
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <Text type="danger" className="font-medium">Error: {error}</Text>
                  <Button
                    type="link"
                    onClick={() => {
                      dispatch(fetchAppointments());
                      dispatch(fetchDermatologists());
                    }}
                    className="p-0 h-auto text-red-600 hover:text-red-800"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
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
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm hover:shadow-md"
                bodyStyle={{ padding: '20px' }}
              >
                <div className="flex items-center justify-between">
                  {/* Left Side - Doctor Info */}
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar 
                      size={56} 
                      icon={<UserOutlined />} 
                      className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Text strong className="text-lg text-gray-900">
                          {appointment.dermatologist?.user?.name || 'Unknown Doctor'}
                        </Text>
                        <StatusTag status={appointment.status} />
                      </div>
                      <div className="text-sm text-gray-500 mb-3">
                        Dermatologist
                      </div>
                      
                      {/* Appointment Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <CalendarOutlined className="text-blue-500 text-lg flex-shrink-0" />
                          <div>
                            <Text className="text-sm font-medium text-gray-900">
                              {new Date(appointment.scheduled_at).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Text>
                            <Text className="text-sm text-gray-500">
                              {new Date(appointment.scheduled_at).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Text>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                          <ClockCircleOutlined className="text-green-500 text-lg flex-shrink-0" />
                          <div>
                            <Text className="text-sm font-medium text-gray-900">
                              Consultation Fee
                            </Text>
                            <Text className="text-lg font-bold text-green-600">
                              ₹{appointment.consultation_fee}
                            </Text>
                            {appointment.is_paid && (
                              <div className="flex items-center space-x-1 mt-1">
                                <CreditCardOutlined className="text-green-600 text-xs" />
                                <Text className="text-xs text-green-600 font-medium">Paid</Text>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                          <Text className="text-sm text-gray-700">
                            <strong>Notes:</strong> {appointment.notes}
                          </Text>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side - Actions */}
                  <div className="flex flex-col space-y-3 ml-4 min-w-[140px]">
                    {/* Chat Button */}
                    <Button
                      type="primary"
                      icon={<MessageOutlined />}
                      onClick={() => navigate(`/chat?appointmentId=${appointment.id}`)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      size="middle"
                    >
                      <span className="font-medium">Start Chat</span>
                    </Button>
                    
                    {/* View Details Button */}
                    <Button
                      type="default"
                      icon={<EyeOutlined />}
                      className="bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 text-gray-700 hover:text-gray-900"
                      size="middle"
                    >
                      <span className="font-medium">View Details</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Appointments;
