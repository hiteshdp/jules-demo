import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { 
  CalendarOutlined, 
  UserOutlined, 
  DollarOutlined, 
  ClockCircleOutlined,
  MessageOutlined,
  FileTextOutlined,
  EditOutlined
} from '@ant-design/icons';
import { Card, Row, Col, Typography, Space, Button, Input, Descriptions } from 'antd';
import { PageHeader, StatusTag } from '../components/common';

const { Title, Text } = Typography;
const { TextArea } = Input;

const AppointmentDetail: React.FC = () => {
  const { id } = useParams();
  const { appointments } = useSelector((state: RootState) => state.appointment);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState('Patient shows signs of early pattern hair loss. Recommended minoxidil treatment and follow-up in 3 months.');

  // Find the appointment by ID
  const appointment = (Array.isArray(appointments) ? appointments : []).find(apt => apt.id === parseInt(id || '0'));

  if (!appointment) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Appointment Not Found"
          description="The requested appointment could not be found."
        />
        <div>
          <Link to="/appointments" className="text-blue-600 hover:text-blue-700 text-sm">← Back to Appointments</Link>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointment Details"
        description={formatDateTime(appointment.scheduled_at)}
        extra={
          <Link to="/appointments">
            <Button>← Back to Appointments</Button>
          </Link>
        }
      />

      <Row gutter={[24, 24]}>
        {/* Patient Information */}
        <Col xs={24} lg={16}>
          <Card title="Patient Information" className="mb-6">
            <Descriptions column={1}>
              <Descriptions.Item label="Patient Name">
                <Space>
                  <UserOutlined />
                  <Text strong>{appointment.patient?.name || 'Unknown Patient'}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Scheduled Time">
                <Space>
                  <CalendarOutlined />
                  <Text>{formatDateTime(appointment.scheduled_at)}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Consultation Fee">
                <Space>
                  <DollarOutlined />
                  <Text strong>₹{appointment.consultation_fee}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Space>
                  <ClockCircleOutlined />
                  <StatusTag status={appointment.status} />
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Notes Section */}
          <Card 
            title="Consultation Notes"
            extra={
              <Button
                icon={<EditOutlined />}
                onClick={() => setIsEditingNotes(!isEditingNotes)}
              >
                {isEditingNotes ? 'Cancel' : 'Edit'}
              </Button>
            }
          >
            {isEditingNotes ? (
              <Space direction="vertical" className="w-full">
                <TextArea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  placeholder="Enter consultation notes..."
                />
                <Space>
                  <Button onClick={() => setIsEditingNotes(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="primary" 
                    onClick={() => setIsEditingNotes(false)}
                  >
                    Save Notes
                  </Button>
                </Space>
              </Space>
            ) : (
              <Text className="whitespace-pre-wrap">
                {notes || 'No notes available for this appointment.'}
              </Text>
            )}
          </Card>
        </Col>

        {/* Actions Sidebar */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" className="w-full" size="large">
            <Card title="Quick Actions">
              <Space direction="vertical" className="w-full">
                <Button 
                  type="primary" 
                  icon={<MessageOutlined />}
                  className="w-full"
                >
                  Start Chat
                </Button>
                <Button 
                  icon={<FileTextOutlined />}
                  className="w-full"
                >
                  View Patient History
                </Button>
                <Button 
                  icon={<CalendarOutlined />}
                  className="w-full"
                >
                  Reschedule
                </Button>
              </Space>
            </Card>

            <Card title="Update Status">
              <Space direction="vertical" className="w-full">
                {['scheduled', 'in_progress', 'completed', 'cancelled'].map((status) => (
                  <Button
                    key={status}
                    className={`w-full text-left ${
                      appointment.status === status
                        ? 'bg-blue-100 text-blue-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                  </Button>
                ))}
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default AppointmentDetail;