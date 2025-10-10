// Generated via prompt: prompts/chat_page_implementation_v1.md
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchChatMessages, sendChatMessage, clearMessages } from '../store/slices/chatSlice';
import { fetchAppointments } from '../store/slices/appointmentSlice';
import { useLocation } from 'react-router-dom';
import { Card, Typography, Avatar, Button, Input, Space, Row, Col, Alert, Tag } from 'antd';
import { MessageOutlined, UserOutlined, CalendarOutlined, SendOutlined, PaperClipOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import ZoomMeetingButton from '../components/ZoomMeetingButton';
import MessageAttachment from '../components/MessageAttachment';

const Chat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { appointments } = useSelector((state: RootState) => state.appointment);
  const { messages, loading, error } = useSelector((state: RootState) => state.chat);
  
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSwitchingAppointment, setIsSwitchingAppointment] = useState(false);
  const [isManualSelection, setIsManualSelection] = useState(false);
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
    const parsedId = id ? parseInt(id, 10) : null;
    return parsedId;
  }, [location.search]);

  // Initialize from URL on first load only
  useEffect(() => {
    // Only set from URL on initial load (when selectedAppointmentId is null)
    if (queryAppointmentId && !selectedAppointmentId && !isManualSelection) {
      setSelectedAppointmentId(queryAppointmentId);
    }
  }, [queryAppointmentId, selectedAppointmentId, isManualSelection]);

  useEffect(() => {
    if (selectedAppointmentId) {
      dispatch(clearMessages()); // Clear previous messages
      dispatch(fetchChatMessages(selectedAppointmentId))
        .catch((error) => {
          // Handle error silently to prevent chat reversion
          console.warn('Failed to fetch messages for appointment:', selectedAppointmentId, error);
        });
    }
  }, [selectedAppointmentId, dispatch]);

  // Polling: refetch messages every 5s
  useEffect(() => {
    if (!selectedAppointmentId) return;
    
    const interval = setInterval(() => {
      // Only poll if we're not currently switching appointments
      if (!isSwitchingAppointment) {
        dispatch(fetchChatMessages(selectedAppointmentId))
          .catch((error) => {
            // Handle polling errors silently
            console.warn('Polling error for appointment:', selectedAppointmentId, error);
          });
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [selectedAppointmentId, dispatch, isSwitchingAppointment]);

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

  const handleAppointmentClick = (appointmentId: number) => {
    // Don't change if already selected or currently switching
    if (selectedAppointmentId === appointmentId || isSwitchingAppointment) {
      return;
    }
    
    setIsManualSelection(true); // Mark as manual selection
    setIsSwitchingAppointment(true);
    setSelectedAppointmentId(appointmentId);
    
    // Update URL query param to keep UI in sync
    const params = new URLSearchParams(location.search);
    params.set('appointmentId', String(appointmentId));
    window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
    
    // Reset switching state after a delay
    setTimeout(() => {
      setIsSwitchingAppointment(false);
    }, 1000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointmentId || (!newMessage.trim() && !selectedFile)) return;

    const messageToSend = newMessage.trim();
    const fileToSend = selectedFile;
    
    // Clear inputs immediately for better UX
    setNewMessage('');
    setSelectedFile(null);

    dispatch(sendChatMessage({ 
      appointmentId: selectedAppointmentId, 
      message: messageToSend, // Send the actual message (empty string if no text)
      file: fileToSend || undefined
    }))
      .unwrap()
      .then(() => {
        // Message sent successfully
      })
      .catch((err) => {
        toast.error(err || 'Failed to send message');
        // Restore inputs on error
        setNewMessage(messageToSend);
        setSelectedFile(fileToSend);
      });
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
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
          appointmentId={selectedAppointmentId || undefined}
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAppointmentClick(appointment.id);
                    }}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedAppointmentId === appointment.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : isSwitchingAppointment
                        ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                    }`}
                    bodyStyle={{ padding: '12px' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Typography.Text strong className="text-sm">
                        {appointment.dermatologist?.name || 'Unknown Doctor'}
                      </Typography.Text>
                      <div className="flex items-center space-x-2">
                        <Tag color={appointment.status === 'scheduled' ? 'blue' : appointment.status === 'completed' ? 'green' : 'default'}>
                          {appointment.status}
                        </Tag>
                        <div className="text-xs text-gray-400">Click to chat</div>
                      </div>
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
            key={selectedAppointmentId}
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
                        {appointments.find(a => a.id === selectedAppointmentId)?.dermatologist?.name || 'Dermatologist'}
                      </Typography.Title>
                      <Typography.Text type="secondary" className="text-sm">
                        {appointments.find(a => a.id === selectedAppointmentId)?.status || 'Appointment'}
                      </Typography.Text>
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
                              {message.attachment && (
                                <div className="mb-2">
                                  <MessageAttachment
                                    attachment={{
                                      path: message.attachment,
                                      type: message.type,
                                      originalName: message.attachment.split('/').pop()
                                    }}
                                    messageId={message.id}
                                    appointmentId={selectedAppointmentId!}
                                    isOwnMessage={isOwnMessage}
                                  />
                                </div>
                              )}
                              {message.message && (
                                <Typography.Text className={`text-sm leading-relaxed break-words ${isOwnMessage ? 'text-white' : 'text-gray-900'}`}>
                                  {message.message}
                                </Typography.Text>
                              )}
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

                {/* Message Input - WhatsApp Style */}
                <div className="bg-white border-t border-gray-200 p-3">
                  {/* File Upload Preview */}
                  {selectedFile && (
                    <div className="mb-3 p-2 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="text-green-500">
                            {selectedFile.type.startsWith('image/') ? '🖼️' : '📎'}
                          </div>
                          <span className="text-sm text-gray-700 truncate max-w-xs">
                            {selectedFile.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({(selectedFile.size / 1024 / 1024).toFixed(1)}MB)
                          </span>
                        </div>
                        <Button
                          type="text"
                          size="small"
                          onClick={() => setSelectedFile(null)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-end space-x-2 bg-gray-100 rounded-2xl px-3 py-2">
                    {/* Attachment Button */}
                    <Button
                      type="text"
                      icon={<PaperClipOutlined />}
                      onClick={() => document.getElementById('file-input')?.click()}
                      disabled={loading}
                      className="text-gray-500 hover:text-gray-700 p-2 h-8 w-8 flex items-center justify-center"
                      style={{ border: 'none', boxShadow: 'none' }}
                    />
                    
                    {/* Hidden File Input */}
                    <input
                      id="file-input"
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Validate file size (10MB max)
                          if (file.size > 10 * 1024 * 1024) {
                            toast.error('File size must be less than 10MB');
                            return;
                          }
                          // Validate file type
                          const allowedTypes = [
                            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
                            'application/pdf', 'text/plain', 'application/msword',
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            'video/mp4', 'video/avi', 'video/mov',
                            'audio/mp3', 'audio/wav', 'audio/ogg',
                            'application/zip', 'application/x-rar-compressed'
                          ];
                          if (!allowedTypes.includes(file.type)) {
                            toast.error('File type not supported');
                            return;
                          }
                          handleFileSelect(file);
                        }
                      }}
                      accept="image/*,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,video/mp4,video/avi,video/mov,audio/mp3,audio/wav,audio/ogg,application/zip,application/x-rar-compressed"
                      style={{ display: 'none' }}
                    />
                    
                    {/* Text Input */}
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
                        border: 'none',
                        backgroundColor: 'transparent',
                        fontSize: '14px',
                        padding: '8px 12px',
                        height: '36px',
                        boxShadow: 'none',
                        flex: 1
                      }}
                      onFocus={(e) => {
                        e.target.style.outline = 'none';
                      }}
                    />
                    
                    {/* Send Button */}
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      onClick={handleSendMessage}
                      disabled={(!newMessage.trim() && !selectedFile) || loading}
                      className="h-8 w-8 p-0 flex items-center justify-center"
                      style={{
                        borderRadius: '50%',
                        backgroundColor: (newMessage.trim() || selectedFile) ? '#25D366' : '#d9d9d9',
                        borderColor: (newMessage.trim() || selectedFile) ? '#25D366' : '#d9d9d9',
                        boxShadow: 'none'
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
