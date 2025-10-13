// Generated via prompt: prompts/dermatologist_chat_feature_v1.md
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchChatMessages, sendMessage, clearMessages } from '../store/slices/chatSlice';
import { fetchAppointments } from '../store/slices/appointmentSlice';
import { 
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon, 
  UserIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import ZoomMeetingButton from '../components/ZoomMeetingButton';

const Chat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { appointments } = useSelector((state: RootState) => state.appointment);
  const { messages, loading, error, sending } = useSelector((state: RootState) => state.chat);
  
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
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
      dispatch(clearMessages()); // Clear previous messages when switching appointments
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
    setIsNearBottom(distanceFromBottom < 120);
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

    dispatch(sendMessage({ 
      appointmentId: selectedAppointmentId, 
      message: newMessage.trim(),
      type: 'text'
    }))
      .unwrap()
      .then(() => {
        setNewMessage('');
      })
      .catch((err: any) => {
        toast.error(err || 'Failed to send message');
      });
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-cyan-100 text-cyan-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Patient Chat</h1>
        <p className="mt-1 text-sm text-gray-500">
          Communicate with your patients about their appointments.
        </p>
      </div>

      {/* Zoom Meeting Button - Always visible at top */}
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4">
        <ZoomMeetingButton 
          appointmentId={selectedAppointmentId || undefined}
          patientName={selectedAppointmentId ? appointments.find((a: any) => a.id === selectedAppointmentId)?.patient?.name || 'Patient' : 'Patient'}
          isPatient={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments List */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-lg rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Appointments</h3>
              
              {Array.isArray(appointments) && appointments.length > 0 ? (
                <div className="space-y-3">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      onClick={() => handleAppointmentClick(appointment.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedAppointmentId === appointment.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : isSwitchingAppointment
                          ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.patient?.name || 'Unknown Patient'}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                          <div className="text-xs text-gray-400">Click to chat</div>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <CalendarDaysIcon className="h-3 w-3 mr-1" />
                        <span>{formatDateTime(appointment.scheduled_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You don't have any patient appointments yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          <div key={selectedAppointmentId} className="bg-white shadow-lg rounded-lg h-[600px] flex flex-col border border-gray-200">
            {selectedAppointmentId ? (
              <>
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <UserIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {appointments.find((a: any) => a.id === selectedAppointmentId)?.patient?.name || 'Patient'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {appointments.find((a: any) => a.id === selectedAppointmentId)?.status || 'Appointment'}
                      </p>
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
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center text-red-600">
                      <p>Error loading messages: {error}</p>
                      <button 
                        onClick={() => selectedAppointmentId && dispatch(fetchChatMessages(selectedAppointmentId))}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : currentMessages.length === 0 ? (
                    <div className="text-center text-gray-500 h-full flex items-center justify-center">
                      <div>
                        <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">No messages yet. Start the conversation!</p>
                      </div>
                    </div>
                  ) : (
                    currentMessages.map((message: any, index: number) => {
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
                            <div className={`px-4 py-2 rounded-2xl shadow-sm ${
                              isOwnMessage
                                ? 'bg-blue-500 text-white rounded-br-md'
                                : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                            } ${isConsecutive ? (isOwnMessage ? 'rounded-tr-md' : 'rounded-tl-md') : ''}`}>
                              <p className="text-sm leading-relaxed break-words">{message.message}</p>
                            </div>
                            {showTime && (
                              <div className={`text-[10px] text-gray-500 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                                {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 p-3">
                  <div className="flex items-center space-x-2">
                    <input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message"
                      disabled={sending}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                        newMessage.trim() && !sending
                          ? 'bg-blue-500 hover:bg-blue-600 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Typing Indicator */}
                  {sending && (
                    <div className="mt-2 flex items-center space-x-2 text-gray-500">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-blue-600">Sending...</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <ChatBubbleLeftRightIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
                  <p className="text-gray-500">
                    Choose a patient appointment from the list to start chatting.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;