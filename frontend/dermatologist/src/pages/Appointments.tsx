import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';
import { fetchAppointments } from '../store/slices/appointmentSlice';
import { Card, Avatar, Typography, Button, Tabs } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, MessageOutlined, EyeOutlined } from '@ant-design/icons';
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

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Patient Appointments</h3>
              <p className="text-sm text-gray-600 mt-1">
                Manage your consultations with patients
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {Array.isArray(filteredAppointments) ? filteredAppointments.length : 0}
              </div>
              <div className="text-sm text-gray-500">appointment(s)</div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="mb-6"
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
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm hover:shadow-md"
                  bodyStyle={{ padding: '20px' }}
                >
                  <div className="flex items-center justify-between">
                    {/* Left Side - Patient Info */}
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar 
                        size={56} 
                        icon={<UserOutlined />} 
                        className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Text strong className="text-lg text-gray-900">
                            {appointment.patient?.name || 'Unknown Patient'}
                          </Text>
                          <StatusTag status={appointment.status} />
                        </div>
                        <div className="text-sm text-gray-500 mb-3">
                          Patient
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
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/chat?appointmentId=${appointment.id}`);
                        }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        size="middle"
                      >
                        <span className="font-medium">Start Chat</span>
                      </Button>
                      
                      {/* View Details Button */}
                      <Button
                        type="default"
                        icon={<EyeOutlined />}
                        onClick={() => handleAppointmentClick(appointment.id)}
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
  );
};

export default Appointments;