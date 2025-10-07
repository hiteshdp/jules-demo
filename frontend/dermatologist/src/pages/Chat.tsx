import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Card, List, Avatar, Typography, Input, Button, Space, Divider } from 'antd';
import { SendOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';
import { PageHeader, LoadingSpinner } from '../components/common';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Message {
  id: number;
  content: string;
  sender: 'dermatologist' | 'patient';
  timestamp: string;
  patient_name?: string;
}

const Chat: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate loading chat messages
    setLoading(true);
    setTimeout(() => {
      const mockMessages: Message[] = [
        {
          id: 1,
          content: 'Hello Dr. Smith, I have been experiencing hair loss for the past 3 months.',
          sender: 'patient',
          timestamp: '2025-01-27T10:00:00Z',
          patient_name: 'John Doe'
        },
        {
          id: 2,
          content: 'Hello John, I understand your concern. Can you tell me more about your hair loss pattern?',
          sender: 'dermatologist',
          timestamp: '2025-01-27T10:05:00Z'
        },
        {
          id: 3,
          content: 'It started at the crown area and has been gradually spreading. I also notice more hair in my brush.',
          sender: 'patient',
          timestamp: '2025-01-27T10:10:00Z',
          patient_name: 'John Doe'
        }
      ];
      setMessages(mockMessages);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        content: newMessage,
        sender: 'dermatologist',
        timestamp: new Date().toISOString()
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Chat"
        description="Communicate with your patients in real-time."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Messages */}
        <div className="lg:col-span-2">
          <Card 
            title={
              <div className="flex items-center">
                <MessageOutlined className="mr-2" />
                <span>Chat with John Doe</span>
              </div>
            }
            className="h-96 flex flex-col"
          >
            <div className="flex-1 overflow-y-auto mb-4">
              <List
                dataSource={messages}
                renderItem={(message) => (
                  <List.Item className="!block">
                    <div className={`flex ${message.sender === 'dermatologist' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'dermatologist' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {message.sender === 'patient' && (
                          <div className="text-xs font-medium mb-1">
                            {message.patient_name}
                          </div>
                        )}
                        <div className="text-sm">{message.content}</div>
                        <div className={`text-xs mt-1 ${
                          message.sender === 'dermatologist' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </div>
            
            <Divider />
            
            <div className="flex space-x-2">
              <TextArea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                rows={2}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                Send
              </Button>
            </div>
          </Card>
        </div>

        {/* Patient Info Sidebar */}
        <div className="space-y-4">
          <Card title="Patient Information">
            <Space direction="vertical" className="w-full">
              <div className="flex items-center">
                <Avatar icon={<UserOutlined />} className="bg-green-100 text-green-600" />
                <div className="ml-3">
                  <Text strong>John Doe</Text>
                  <br />
                  <Text type="secondary" className="text-sm">Patient ID: #12345</Text>
                </div>
              </div>
              
              <Divider className="my-2" />
              
              <div>
                <Text type="secondary" className="text-xs">Last Active</Text>
                <br />
                <Text className="text-sm">2 minutes ago</Text>
              </div>
              
              <div>
                <Text type="secondary" className="text-xs">Appointment</Text>
                <br />
                <Text className="text-sm">Today, 2:00 PM</Text>
              </div>
            </Space>
          </Card>

          <Card title="Quick Actions">
            <Space direction="vertical" className="w-full">
              <Button block>View Patient History</Button>
              <Button block>Schedule Follow-up</Button>
              <Button block>Prescribe Medication</Button>
            </Space>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
