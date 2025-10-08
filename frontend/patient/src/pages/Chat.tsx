// Generated via prompt: prompts/chat_page_implementation_v1.md
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchChatMessages, sendChatMessage, clearMessages } from '../store/slices/chatSlice';
import { fetchAppointments } from '../store/slices/appointmentSlice';
import { useLocation } from 'react-router-dom';
import { Card, Typography, Avatar, Button, Input, Space, Row, Col, Alert, Tag } from 'antd';
import { MessageOutlined, UserOutlined, CalendarOutlined, SendOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import ZoomMeetingButton from '../components/ZoomMeetingButton';

const Chat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { appointments } = useSelector((state: RootState) => state.appointment);
  const { messages, loading, error } = useSelector((state: RootState) => state.chat);
  
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  // Read appointmentId from query string and preselect
  const queryAppointmentId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('appointmentId');
    return id ? parseInt(id, 10) : null;
  }, [location.search]);

  useEffect(() => {
    if (queryAppointmentId && queryAppointmentId !== selectedAppointmentId) {
      setSelectedAppointmentId(queryAppointmentId);
    }
  }, [queryAppointmentId, selectedAppointmentId]);

  useEffect(() => {
    if (selectedAppointmentId) {
      dispatch(clearMessages()); // Clear previous messages
      dispatch(fetchChatMessages(selectedAppointmentId));
    }
  }, [selectedAppointmentId, dispatch]);

  // Polling: refetch messages every 5s
  useEffect(() => {
    if (!selectedAppointmentId) return;
    const interval = setInterval(() => {
      dispatch(fetchChatMessages(selectedAppointmentId));
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedAppointmentId, dispatch]);

  // Track whether user is near bottom
  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distanceFromBottom < 120;
    setIsNearBottom(nearBottom);
  };

  // Filter messages for the selected appointment
  const currentMessages = selectedAppointmentId ? messages.filter(m => m.appointment_id === selectedAppointmentId) : [];

  // Auto-scroll only if near bottom
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    if (isNearBottom) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [currentMessages, selectedAppointmentId, isNearBottom]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointmentId || !newMessage.trim()) return;

    const messageToSend = newMessage.trim();
    setNewMessage(''); // Clear input immediately for better UX

    dispatch(sendChatMessage({ 
      appointmentId: selectedAppointmentId, 
      message: messageToSend 
    }))
      .unwrap()
      .then(() => {
        // Message sent successfully
      })
      .catch((err) => {
        toast.error(err || 'Failed to send message');
        // Restore message on error
        setNewMessage(messageToSend);
      });
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <Typography.Title level={2} className="!mb-1">
          Chat with Dermatologists
        </Typography.Title>
        <Typography.Text type="secondary">
          Communicate with your dermatologists about your appointments.
        </Typography.Text>
      </div>

	  {/* Zoom Meeting Button - Always visible at top */}
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4">
        <ZoomMeetingButton 
          appointmentId={selectedAppointmentId}
          dermatologistName={selectedAppointmentId ? appointments.find(a => a.id === selectedAppointmentId)?.dermatologist?.user?.name : 'Dermatologist'}
          isPatient={true}
        />
      </div>

      <Row gutter={[24, 24]}>
        {/* Appointments List */}
        <Col xs={24} lg={8}>
          <Card 
            title="Your Appointments"
            className="h-fit"
            bodyStyle={{ padding: '24px' }}
          >
            {Array.isArray(appointments) && appointments.length > 0 ? (
              <Space direction="vertical" size="small" className="w-full">
                {appointments.map((appointment) => (
                  <Card
                    key={appointment.id}
                    size="small"
                    hoverable
                    onClick={() => setSelectedAppointmentId(appointment.id)}
                    className={`cursor-pointer transition-colors ${
                      selectedAppointmentId === appointment.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    bodyStyle={{ padding: '12px' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Typography.Text strong className="text-sm">
                        {appointment.dermatologist?.user?.name || 'Unknown Doctor'}
                      </Typography.Text>
                      <Tag color={appointment.status === 'scheduled' ? 'blue' : appointment.status === 'completed' ? 'green' : 'default'}>
                        {appointment.status}
                      </Tag>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <CalendarOutlined className="mr-1" />
                      <span>{formatDateTime(appointment.scheduled_at)}</span>
                    </div>
                  </Card>
                ))}
              </Space>
            ) : (
              <div className="text-center py-8">
                <MessageOutlined className="text-4xl text-gray-400 mb-4" />
                <Typography.Title level={4} className="!mb-2">No appointments found</Typography.Title>
                <Typography.Text type="secondary">
                  Book an appointment to start chatting with dermatologists.
                </Typography.Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Chat Area */}
        <Col xs={24} lg={16}>
          <Card 
            className="h-[600px] flex flex-col"
            bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            {selectedAppointmentId ? (
              <>
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center">
                    <Avatar 
                      size={40} 
                      icon={<UserOutlined />} 
                      className="bg-blue-500 mr-3"
                    />
                    <div className="flex-1">
                      <Typography.Title level={4} className="!mb-0">
                        {appointments.find(a => a.id === selectedAppointmentId)?.dermatologist?.user?.name || 'Dermatologist'}
                      </Typography.Title>
                      <Typography.Text type="secondary" className="text-sm">
                        {appointments.find(a => a.id === selectedAppointmentId)?.status || 'Appointment'}
                      </Typography.Text>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <Typography.Text type="secondary" className="text-xs">Online</Typography.Text>
                    </div>
                  </div>
                </div>


                {/* Messages Area */}
                <div
                  ref={messagesContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 custom-scrollbar"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                >
                  {error ? (
                    <div className="text-center">
                      <Alert
                        message="Error loading messages"
                        description={error}
                        type="error"
                        showIcon
                        action={
                          <Button 
                            size="small" 
                            onClick={() => selectedAppointmentId && dispatch(fetchChatMessages(selectedAppointmentId))}
                          >
                            Try Again
                          </Button>
                        }
                      />
                    </div>
                  ) : currentMessages.length === 0 ? (
                    <div className="h-full flex items-center justify-center" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-4">
                          <div className="relative">
                            <div className="w-12 h-8 bg-gray-300 rounded-lg transform rotate-12"></div>
                            <div className="w-12 h-8 bg-gray-300 rounded-lg transform -rotate-12 absolute top-0 left-2"></div>
                          </div>
                        </div>
                        <Typography.Text className="text-gray-500 text-sm">
                          No messages yet. Start the conversation!
                        </Typography.Text>
                      </div>
                    </div>
                  ) : (
                    currentMessages.map((message, index) => {
                      const isOwnMessage = message.sender_id === user?.id;
                      const prevMessage = index > 0 ? currentMessages[index - 1] : null;
                      const isConsecutive = prevMessage && prevMessage.sender_id === message.sender_id;
                      const showTime = !isConsecutive || index === currentMessages.length - 1;
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-1' : 'mt-3'}`}
                        >
                          <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                            <div className={`px-3 py-2 rounded-2xl transition-all duration-200 hover:shadow-md ${
                              isOwnMessage
                                ? 'bg-blue-500 text-white rounded-br-md shadow-sm'
                                : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md shadow-sm'
                            } ${isConsecutive ? (isOwnMessage ? 'rounded-tr-md' : 'rounded-tl-md') : ''}`}
                            style={{
                              boxShadow: isOwnMessage 
                                ? '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)' 
                                : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.12)'
                            }}>
                              <Typography.Text className={`text-sm leading-relaxed break-words ${isOwnMessage ? 'text-white' : 'text-gray-900'}`}>
                                {message.message}
                              </Typography.Text>
                            </div>
                            {showTime && (
                              <div className={`flex items-center mt-1 space-x-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                                <Typography.Text className={`text-[10px] text-gray-500 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                                  {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography.Text>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input - WhatsApp Style with Ant Design */}
                <div className="bg-white border-t border-gray-200 p-3">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message"
                      disabled={loading}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      style={{
                        borderRadius: '20px',
                        border: '1px solid #d9d9d9',
                        backgroundColor: '#f5f5f5',
                        fontSize: '14px',
                        padding: '8px 16px',
                        height: '40px',
                        transition: 'all 0.2s ease',
                        boxShadow: 'none',
                        flex: 1
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#1890ff';
                        e.target.style.backgroundColor = '#ffffff';
                        e.target.style.boxShadow = '0 0 0 2px rgba(24, 144, 255, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d9d9d9';
                        e.target.style.backgroundColor = '#f5f5f5';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || loading}
                      style={{
                        borderRadius: '50%',
                        height: '40px',
                        width: '40px',
                        minWidth: '40px',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: newMessage.trim() ? '#3B82F6' : '#d9d9d9',
                        borderColor: newMessage.trim() ? '#3B82F6' : '#d9d9d9',
                        transition: 'all 0.2s ease',
                        boxShadow: 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (newMessage.trim()) {
                          e.currentTarget.style.backgroundColor = '#128C7E';
                          e.currentTarget.style.borderColor = '#128C7E';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (newMessage.trim()) {
                          e.currentTarget.style.backgroundColor = '#3B82F6';
                          e.currentTarget.style.borderColor = '#3B82F6';
                          e.currentTarget.style.transform = 'scale(1)';
                        }
                      }}
                    />
                  </div>
                  
                  {/* Typing Indicator */}
                  {loading && (
                    <div className="mt-2 flex items-center space-x-2 text-gray-500">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-green-600">Sending...</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <MessageOutlined className="text-6xl text-gray-400 mb-4" />
                  <Typography.Title level={3} className="!mb-2">Select an Appointment</Typography.Title>
                  <Typography.Text type="secondary">
                    Choose an appointment from the list to start chatting with your dermatologist.
                  </Typography.Text>
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Chat;
