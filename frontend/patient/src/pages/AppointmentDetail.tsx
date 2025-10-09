import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
        {/* Appointment Information */}
        <Col xs={24} lg={16}>
          <Card title="Appointment Information" className="mb-6">
            <Descriptions column={1}>
              <Descriptions.Item label="Dermatologist">
                <Space>
                  <UserOutlined />
                  <Text strong>{appointment.dermatologist?.user?.name || 'Unknown Dermatologist'}</Text>
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

          {/* Notes Section - Read Only for Patients */}
          <Card title="Consultation Notes">
            <div className="p-4 bg-gray-50 rounded-lg">
              <Text className="whitespace-pre-wrap text-gray-700">
                {appointment.notes || 'No notes available for this appointment yet.'}
              </Text>
            </div>
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
                  onClick={() => window.location.href = `/chat?appointmentId=${appointment.id}`}
                >
                  Start Chat
                </Button>
              </Space>
            </Card>

            {/* Dermatologist Information */}
            <Card title="Dermatologist Details">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Name">
                  <Text strong>{appointment.dermatologist?.user?.name || 'N/A'}</Text>
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
              </Descriptions>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default AppointmentDetail;
