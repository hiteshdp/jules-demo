import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { updateAppointmentStatus, rescheduleAppointment, fetchAppointment } from '../store/slices/appointmentSlice';
import { 
  CalendarOutlined, 
  UserOutlined, 
  DollarOutlined, 
  ClockCircleOutlined,
  MessageOutlined,
  EditOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { Card, Row, Col, Typography, Space, Button, Input, Descriptions, DatePicker, Modal } from 'antd';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { PageHeader, StatusTag } from '../components/common';

const { Text } = Typography;
const { TextArea } = Input;

const AppointmentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { appointments, currentAppointment } = useSelector((state: RootState) => state.appointment);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleValue, setRescheduleValue] = useState<any>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Find the appointment by ID, fallback to currentAppointment
  const listAppointment = (Array.isArray(appointments) ? appointments : []).find(apt => apt.id === parseInt(id || '0'));
  const appointment = listAppointment || currentAppointment || null;

  useEffect(() => {
    const numericId = parseInt(id || '0');
    if (!listAppointment && numericId) {
      // Ensure we have the appointment on hard refresh
      // @ts-ignore
      dispatch(fetchAppointment(numericId));
    }
  }, [dispatch, id, listAppointment]);

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
    // Normalize to show the actual DB day (no +1 due to timezone)
    let d: any;
    if (typeof dateTime === 'string') {
      if (dateTime.endsWith('Z')) {
        const z = dayjs(dateTime);
        d = z.subtract(z.utcOffset(), 'minute');
      } else {
        d = dayjs(dateTime.includes(' ') ? dateTime.replace(' ', 'T') : dateTime);
      }
    } else {
      d = dayjs(new Date(dateTime));
    }
    return d.format('DD MMM YYYY, hh:mm A');
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
      toast.success('Notes saved successfully');
    } catch (error) {
      toast.error('Failed to save notes');
    } finally {
      setIsSavingNotes(false);
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
        {/* Left: Single section with Appointment + Patient details */}
        <Col xs={24} lg={16}>
          <Card title="Appointment Information" className="mb-6">
            <Descriptions column={1}>
              <Descriptions.Item label="Patient Name">
                <Space>
                  <UserOutlined />
                  <Text strong>{appointment.patient?.name || 'Unknown Patient'}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Appointment ID">
                <Text>#{appointment.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <Text>{appointment.patient?.email || 'N/A'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                <Text>{appointment.patient?.phone || 'N/A'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Scheduled Time">
                <Space>
                  <CalendarOutlined />
                  <Text>{formatDateTime(appointment.scheduled_at)}</Text>
                </Space>
              </Descriptions.Item>
              {(() => {
                const total = Number(appointment.consultation_fee || 0);
                const sharePercent = Number((import.meta as any).env?.VITE_DERMATOLOGIST_SHARE_PERCENT || 70);
                const dermatologistPayout = (appointment as any).dermatologist_fee ?? (total * sharePercent) / 100;
                return (
                  <Descriptions.Item label="Your Payout">
                    <Space>
                      <DollarOutlined />
                      <Text strong>₹{Number(dermatologistPayout).toFixed(2)}</Text>
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
              <div className="mt-3">
                <Button block onClick={() => {
                  let seed: any;
                  if (typeof appointment.scheduled_at === 'string') {
                    const s = appointment.scheduled_at as any;
                    if (String(s).endsWith('Z')) {
                      const d = dayjs(s);
                      seed = d.subtract(d.utcOffset(), 'minute');
                    } else {
                      seed = dayjs(String(s).includes(' ') ? String(s).replace(' ', 'T') : s);
                    }
                  } else {
                    seed = dayjs(new Date(appointment.scheduled_at));
                  }
                  setRescheduleValue(seed);
                  setIsRescheduleOpen(true);
                }}>Reschedule</Button>
              </div>
            </Card>

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
          </Space>
        </Col>
      </Row>
      {/* Reschedule Modal */}
      <Modal
        title="Reschedule Appointment"
        open={isRescheduleOpen}
        onCancel={() => setIsRescheduleOpen(false)}
        onOk={async () => {
          if (!rescheduleValue) return;
          // Send as local wall time without timezone to match DB expected stored day
          const formatted = dayjs(rescheduleValue).format('YYYY-MM-DD HH:mm:ss');
          try {
            // @ts-ignore thunk type
            await (dispatch as any)(rescheduleAppointment({ appointmentId: (appointment as any).id, scheduled_at: formatted })).unwrap();
            toast.success('Rescheduled successfully');
            setIsRescheduleOpen(false);
          } catch (e) {
            toast.error('Failed to reschedule');
          }
        }}
        okText="Continue"
      >
        <DatePicker
          showTime
          style={{ width: '100%' }}
          value={rescheduleValue}
          onChange={(v) => setRescheduleValue(v)}
        />
      </Modal>
    </div>
  );
};

export default AppointmentDetail;