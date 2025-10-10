// Generated via prompt: prompts/appointments_management_complete_v1.md
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { 
  fetchAppointments, 
  fetchAppointmentDetails, 
  fetchAppointmentChat,
  fetchDermatologistsForFilter,
  fetchPatientsForFilter,
  setFilters,
  clearFilters,
  // setSelectedAppointment,
  // clearSelectedAppointment,
  clearChatMessages,
  updateAppointmentPaymentStatus
} from '../store/slices/appointmentSlice';
import { 
  Card, 
  Table, 
  Tag, 
  Avatar, 
  Typography, 
  Space, 
  Empty, 
  Button, 
  Modal, 
  Drawer,
  Form,
  Select,
  DatePicker,
  Row,
  Col,
  Divider,
  Descriptions,
  Tabs,
  List,
  message
} from 'antd';
import { 
  CalendarOutlined, 
  TeamOutlined, 
  UserOutlined,
  EyeOutlined,
  MessageOutlined,
  CommentOutlined,
  VideoCameraOutlined,
  FilterOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useRef } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface Appointment {
  id: number;
  patient_id: number;
  dermatologist_id: number;
  scheduled_at: string;
  status: string;
  notes?: string;
  prescription?: string;
  zoom_link?: string;
  zoom_meeting_id?: string;
  consultation_fee: number;
  dermatologist_fee: number;
  platform_fee: number;
  is_paid: boolean;
  patient?: {
    id: number;
    name: string;
    email: string;
    age?: number;
    gender?: string;
    patientProfile?: {
      allergies?: string;
    };
  };
  dermatologist?: {
    user_id: number;
    specialization: string;
    user?: {
      id: number;
      name: string;
    };
  };
  chatMessages?: any[];
  payments?: any[];
}

const Appointments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    appointments, 
    loading, 
    selectedAppointment, 
    chatMessages, 
    dermatologists, 
    patients, 
    filters 
  } = useSelector((state: RootState) => state.appointment);

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found. Please log in first.');
      return;
    }
    
    // Only send non-empty filter values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );
    dispatch(fetchAppointments(cleanFilters));
    dispatch(fetchDermatologistsForFilter());
    dispatch(fetchPatientsForFilter());
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'blue';
      case 'in_progress':
        return 'orange';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      case 'no_show':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Pending Review';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'no_show':
        return 'No Show';
      default:
        return status;
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const handleViewDetails = async (appointmentId: number) => {
    try {
      await dispatch(fetchAppointmentDetails(appointmentId));
      setDetailModalVisible(true);
    } catch (error) {
      message.error('Failed to load appointment details');
    }
  };

  const handleViewChat = async (appointmentId: number) => {
    try {
      await dispatch(fetchAppointmentChat(appointmentId));
      setChatModalVisible(true);
    } catch (error) {
      message.error('Failed to load chat messages');
    }
  };

  const handleViewComments = async (appointmentId: number) => {
    try {
      await dispatch(fetchAppointmentDetails(appointmentId));
      setCommentsModalVisible(true);
    } catch (error) {
      message.error('Failed to load appointment details');
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleApplyFilters = () => {
    // Only send non-empty filter values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );
    dispatch(fetchAppointments(cleanFilters));
    setFilterDrawerVisible(false);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(fetchAppointments({}));
    setFilterDrawerVisible(false);
  };

  const handleRefresh = () => {
    // Only send non-empty filter values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );
    dispatch(fetchAppointments(cleanFilters));
  };

  const normalizeZoomUrl = (url?: string) => {
    if (!url) return '';
    // If protocol is missing, prepend https
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const zoomOpenGuardRef = useRef(false);

  const confirmOpenZoom = (url?: string) => {
    const target = normalizeZoomUrl(url || '');
    if (!target) return;
    // Guard against accidental double triggers
    if (zoomOpenGuardRef.current) return;
    zoomOpenGuardRef.current = true;
    setTimeout(() => (zoomOpenGuardRef.current = false), 500);

    const proceed = window.confirm(`Open meeting link?\n${target}`);
    if (!proceed) return;
    const win = window.open(target, '_blank', 'noopener,noreferrer');
    if (!win) {
      // If blocked, inform user rather than navigating current tab
      message.info('Popup blocked. Please allow popups for this site or Ctrl/Cmd+Click to open: ' + target);
    }
  };

  const columns: ColumnsType<Appointment> = [
    {
      title: 'Patient',
      key: 'patient',
      width: 180,
      render: (_, record) => (
        <Space>
          <Avatar icon={<TeamOutlined />} />
          <div>
            <div style={{ fontWeight: 500, fontSize: '14px' }}>{record.patient?.name}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.patient?.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Dermatologist',
      key: 'dermatologist',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: '14px' }}>{record.dermatologist?.user?.name}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.dermatologist?.specialization}
          </Text>
        </div>
      ),
    },
    {
      title: 'Appointment Date',
      dataIndex: 'scheduled_at',
      key: 'scheduled_at',
      width: 160,
      render: (dateTime) => (
        <Text style={{ fontSize: '13px' }}>{formatDateTime(dateTime)}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ fontSize: '12px' }}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Consultation Fee',
      dataIndex: 'consultation_fee',
      key: 'consultation_fee',
      width: 130,
      align: 'right',
      render: (fee) => (
        <Text strong style={{ color: '#1890ff', fontSize: '14px' }}>
          ₹{Number(fee || 0).toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'Dermatologist Payout',
      dataIndex: 'dermatologist_fee',
      key: 'dermatologist_fee',
      width: 140,
      align: 'right',
      render: (fee) => (
        <Text strong style={{ color: '#52c41a', fontSize: '14px' }}>
          ₹{Number(fee || 0).toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'Platform Commission',
      dataIndex: 'platform_fee',
      key: 'platform_fee',
      width: 140,
      align: 'right',
      render: (fee) => (
        <Text strong style={{ color: '#fa8c16', fontSize: '14px' }}>
          ₹{Number(fee || 0).toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'Payment Status',
      key: 'payment',
      width: 180,
      render: (_, record) => {
        const latestPayment = record.payments && record.payments.length > 0 
          ? record.payments[record.payments.length - 1] 
          : null;
        const paidAt = latestPayment?.paid_at;
        
        return (
          <div>
            <Select
              size="small"
              value={record.is_paid ? 'completed' : 'pending'}
              style={{ width: 120 }}
              onChange={(value) => {
                dispatch(updateAppointmentPaymentStatus({ id: record.id, status: value }));
              }}
              options={[
                { label: 'Pending', value: 'pending' },
                { label: 'Completed', value: 'completed' },
              ]}
            />
            {record.is_paid && paidAt && (
              <div style={{ marginTop: 4, fontSize: '11px', color: '#666' }}>
                Paid: {formatDateTime(paidAt)}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <Space size={2}>
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewDetails(record.id)}
            size="small"
            style={{ padding: '4px 6px' }}
            title="View Details"
          />
          <Button 
            type="link" 
            icon={<CommentOutlined />} 
            onClick={() => handleViewComments(record.id)}
            size="small"
            style={{ padding: '4px 6px' }}
            title="View Comments"
          />
          <Button 
            type="link" 
            icon={<MessageOutlined />} 
            onClick={() => handleViewChat(record.id)}
            size="small"
            style={{ padding: '4px 6px' }}
            title="View Chat"
          />
          <Button 
            type="link" 
            icon={<VideoCameraOutlined />} 
            disabled={!record.zoom_link}
            htmlType="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              confirmOpenZoom(record.zoom_link);
            }}
            size="small"
            style={{ padding: '4px 6px' }}
            title="Join Meeting"
          />
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2} style={{ margin: 0 }}>
          Appointments Management
        </Title>
        <Text type="secondary">
          Monitor and manage all patient-dermatologist appointments across the platform.
        </Text>
      </div>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Button 
              icon={<FilterOutlined />} 
              onClick={() => setFilterDrawerVisible(true)}
            >
              Filters
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </Space>
          <Text type="secondary">
            Total: {Array.isArray(appointments) ? appointments.length : 0} appointments
          </Text>
        </div>

        {(!Array.isArray(appointments) || appointments.length === 0) && !loading ? (
          <Empty
            image={<CalendarOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />}
            description="No appointments found."
          />
        ) : (
          <Table
            columns={columns}
            dataSource={Array.isArray(appointments) ? appointments : []}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} appointments`,
            }}
            scroll={{ x: 1400 }}
            size="small"
            bordered={false}
            style={{ 
              fontSize: '13px'
            }}
          />
        )}
      </Card>

      {/* Filter Drawer */}
      <Drawer
        title="Filter Appointments"
        placement="right"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
        width={400}
      >
        <Form layout="vertical">
          <Form.Item label="Status">
            <Select
              placeholder="Select status"
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              allowClear
            >
              <Option value="scheduled">Pending Review</Option>
              <Option value="in_progress">In Progress</Option>
              <Option value="completed">Completed</Option>
              <Option value="cancelled">Cancelled</Option>
              <Option value="no_show">No Show</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Dermatologist">
            <Select
              placeholder="Select dermatologist"
              value={filters.dermatologist_id}
              onChange={(value) => handleFilterChange('dermatologist_id', value)}
              allowClear
            >
              {dermatologists.map((derm: { id: number; name: string; specialization?: string }) => (
                <Option key={derm.id} value={derm.id}>
                  {derm.name} - {derm.specialization}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Patient">
            <Select
              placeholder="Select patient"
              value={filters.patient_id}
              onChange={(value) => handleFilterChange('patient_id', value)}
              allowClear
            >
              {patients.map((patient: { id: number; name: string; email: string }) => (
                <Option key={patient.id} value={patient.id}>
                  {patient.name} - {patient.email}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Date Range">
            <RangePicker
              style={{ width: '100%' }}
              value={filters.date_from && filters.date_to ? [
                dayjs(filters.date_from),
                dayjs(filters.date_to)
              ] : null}
              onChange={(dates) => {
                if (dates) {
                  handleFilterChange('date_from', dates[0]?.format('YYYY-MM-DD'));
                  handleFilterChange('date_to', dates[1]?.format('YYYY-MM-DD'));
                } else {
                  handleFilterChange('date_from', '');
                  handleFilterChange('date_to', '');
                }
              }}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleApplyFilters}>
                Apply Filters
              </Button>
              <Button onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>

      {/* Appointment Details Modal */}
      <Modal
        title="Appointment Details"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedAppointment && (
          <Tabs defaultActiveKey="overview">
            <TabPane tab="Overview" key="overview">
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Appointment ID" span={1}>
                  #{selectedAppointment.id}
                </Descriptions.Item>
                <Descriptions.Item label="Status" span={1}>
                  <Tag color={getStatusColor(selectedAppointment.status)}>
                    {getStatusText(selectedAppointment.status)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Scheduled Date" span={2}>
                  {formatDateTime(selectedAppointment.scheduled_at)}
                </Descriptions.Item>
                <Descriptions.Item label="Payment Status" span={2}>
                  <Tag color={selectedAppointment.is_paid ? 'green' : 'red'}>
                    {selectedAppointment.is_paid ? 'Paid' : 'Pending'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              <Row gutter={16}>
                <Col span={12}>
                  <Title level={4}>Patient Information</Title>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Name">
                      {selectedAppointment.patient?.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {selectedAppointment.patient?.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Age">
                      {selectedAppointment.patient?.age || 'Not specified'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Gender">
                      {selectedAppointment.patient?.gender || 'Not specified'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Allergies">
                      {selectedAppointment.patient?.patientProfile?.allergies || 'None'}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span={12}>
                  <Title level={4}>Dermatologist Information</Title>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Name">
                      {selectedAppointment.dermatologist?.user?.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Specialization">
                      {selectedAppointment.dermatologist?.specialization}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>

              <Divider />
              
              <Title level={4}>Payment Details</Title>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Consultation Fee">
                  <Text strong style={{ color: '#1890ff' }}>
                    ₹{selectedAppointment.consultation_fee}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Dermatologist Payout">
                  <Text strong style={{ color: '#52c41a' }}>
                    ₹{selectedAppointment.dermatologist_fee || 0}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Platform Commission">
                  <Text strong style={{ color: '#fa8c16' }}>
                    ₹{selectedAppointment.platform_fee || 0}
                  </Text>
                </Descriptions.Item>
              </Descriptions>

              {selectedAppointment.notes && (
                <>
                  <Divider />
                  <Title level={4}>Notes</Title>
                  <Text>{selectedAppointment.notes}</Text>
                </>
              )}

              {selectedAppointment.prescription && (
                <>
                  <Divider />
                  <Title level={4}>Prescription</Title>
                  <Text>{selectedAppointment.prescription}</Text>
                </>
              )}

              {selectedAppointment.zoom_link && (
                <>
                  <Divider />
                  <Title level={4}>Zoom Meeting</Title>
                  <Button 
                    type="primary" 
                    icon={<VideoCameraOutlined />}
                    disabled
                  >
                    Join Zoom Meeting
                  </Button>
                </>
              )}
            </TabPane>
          </Tabs>
        )}
      </Modal>

      {/* Chat Modal */}
      <Modal
        title="Appointment Chat"
        open={chatModalVisible}
        onCancel={() => {
          setChatModalVisible(false);
          dispatch(clearChatMessages());
        }}
        footer={null}
        width={600}
      >
        <List
          dataSource={chatMessages}
          renderItem={(message: any) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={message.sender?.name || 'Unknown'}
                description={message.message}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {formatDateTime(message.created_at)}
              </Text>
            </List.Item>
          )}
        />
      </Modal>

      {/* Comments Modal */}
      <Modal
        title="Appointment Comments & Notes"
        open={commentsModalVisible}
        onCancel={() => setCommentsModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedAppointment && (
          <Space direction="vertical" style={{ width: '100%' }}>
            {selectedAppointment.notes && (
              <div>
                <Title level={5}>Dermatologist Notes</Title>
                <Text>{selectedAppointment.notes}</Text>
              </div>
            )}
            
            {selectedAppointment.prescription && (
              <div>
                <Title level={5}>Prescription</Title>
                <Text>{selectedAppointment.prescription}</Text>
              </div>
            )}

            {!selectedAppointment.notes && !selectedAppointment.prescription && (
              <Empty description="No comments or notes available for this appointment." />
            )}
          </Space>
        )}
      </Modal>
    </Space>
  );
};

export default Appointments;
