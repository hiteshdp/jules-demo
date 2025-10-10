import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { updateAppointmentStatus } from '../store/slices/appointmentSlice';
import { 
  CalendarOutlined, 
  UserOutlined, 
  DollarOutlined, 
  ClockCircleOutlined,
  MessageOutlined,
  EditOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { Card, Row, Col, Typography, Space, Button, Input, Descriptions, message } from 'antd';
import { PageHeader, StatusTag } from '../components/common';

const { Text } = Typography;
const { TextArea } = Input;

const AppointmentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { appointments } = useSelector((state: RootState) => state.appointment);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Find the appointment by ID
  const appointment = (Array.isArray(appointments) ? appointments : []).find(apt => apt.id === parseInt(id || '0'));

  useEffect(() => {
    if (appointment) {
      setNotes(appointment.notes || '');
    }
  }, [appointment]);

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

  const handleSaveNotes = async () => {
    if (!appointment) return;
    
    setIsSavingNotes(true);
    try {
      await dispatch(updateAppointmentStatus({
        appointmentId: appointment.id,
        status: appointment.status,
        notes: notes
      }));
      setIsEditingNotes(false);
      message.success('Notes saved successfully');
    } catch (error) {
      message.error('Failed to save notes');
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!appointment) return;
    
    try {
      await dispatch(updateAppointmentStatus({
        appointmentId: appointment.id,
        status: newStatus,
        notes: notes
      }));
      message.success('Status updated successfully');
    } catch (error) {
      message.error('Failed to update status');
    }
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
                icon={isEditingNotes ? <SaveOutlined /> : <EditOutlined />}
                onClick={isEditingNotes ? handleSaveNotes : () => setIsEditingNotes(true)}
                loading={isSavingNotes}
                type={isEditingNotes ? 'primary' : 'default'}
              >
                {isEditingNotes ? 'Save Notes' : 'Edit Notes'}
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
                    onClick={handleSaveNotes}
                    loading={isSavingNotes}
                    icon={<SaveOutlined />}
                  >
                    Save Notes
                  </Button>
                </Space>
              </Space>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg">
                <Text className="whitespace-pre-wrap text-gray-700">
                  {notes || 'No notes available for this appointment. Click "Edit Notes" to add consultation notes.'}
                </Text>
              </div>
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
                  onClick={() => navigate(`/chat?appointmentId=${appointment.id}`)}
                >
                  Start Chat
                </Button>
              </Space>
            </Card>

            <Card title="Update Status">
              <Space direction="vertical" className="w-full">
                {['scheduled', 'in_progress', 'completed'].map((status) => (
                  <Button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    className={`w-full text-left ${
                      appointment.status === status
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'text-gray-700 hover:bg-gray-100 border-gray-300'
                    }`}
                    type={appointment.status === status ? 'primary' : 'default'}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                  </Button>
                ))}
              </Space>
            </Card>

            {/* Patient Information */}
            <Card title="Patient Details">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Name">
                  <Text strong>{appointment.patient?.name || 'N/A'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <Text>{appointment.patient?.email || 'N/A'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  <Text>{appointment.patient?.phone || 'N/A'}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default AppointmentDetail;