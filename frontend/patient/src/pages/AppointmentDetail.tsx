import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchAppointments } from '../store/slices/appointmentSlice';
import { 
  CalendarOutlined, 
  UserOutlined, 
  DollarOutlined, 
  ClockCircleOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { Card, Row, Col, Typography, Space, Button, Descriptions } from 'antd';
import { PageHeader, StatusTag } from '../components/common';

const { Text } = Typography;

const AppointmentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { appointments } = useSelector((state: RootState) => state.appointment);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

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
        {/* Left: Single section with Appointment + Dermatologist details */}
        <Col xs={24} lg={16}>
          <Card title="Appointment Information" className="mb-6">
            <Descriptions column={1}>
              <Descriptions.Item label="Dermatologist">
                <Space>
                  <UserOutlined />
                  <Text strong>{appointment.dermatologist?.user?.name || 'Unknown Dermatologist'}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Appointment ID">
                <Text>#{appointment.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Specialization">
                <Text>{appointment.dermatologist?.specialization || 'N/A'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Experience">
                <Text>{appointment.dermatologist?.years_of_experience || 'N/A'} years</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Qualifications">
                <Text>{appointment.dermatologist?.qualifications || 'N/A'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Scheduled Time">
                <Space>
                  <CalendarOutlined />
                  <Text>{formatDateTime(appointment.scheduled_at)}</Text>
                </Space>
              </Descriptions.Item>
              {(() => {
                const total = Number(appointment.consultation_fee || 0);
                return (
                  <Descriptions.Item label="Total Fee">
                    <Space>
                      <DollarOutlined />
                      <Text strong>₹{total.toFixed(2)}</Text>
                    </Space>
                  </Descriptions.Item>
                );
              })()}
              <Descriptions.Item label="Status">
                <Space>
                  <ClockCircleOutlined />
                  <StatusTag status={appointment.status} />
                </Space>
              </Descriptions.Item>
              {(appointment as any)?.zoom_link && (
                <Descriptions.Item label="Zoom Link">
                  <a href={(appointment as any).zoom_link} target="_blank" rel="noreferrer">Join Meeting</a>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>

        {/* Right: Start Chat on top, Notes below */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" className="w-full" size="large">
            <Card>
              <Button 
                type="primary" 
                icon={<MessageOutlined />}
                className="w-full"
                onClick={() => navigate(`/chat?appointmentId=${appointment.id}`)}
              >
                Start Chat
              </Button>
            </Card>

            <Card title="Consultation Notes">
              <div className="p-4 bg-gray-50 rounded-lg">
                <Text className="whitespace-pre-wrap text-gray-700">
                  {appointment.notes || 'No notes available for this appointment yet.'}
                </Text>
              </div>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default AppointmentDetail;
