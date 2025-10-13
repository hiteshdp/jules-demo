import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';
import { fetchAppointments, updateAppointmentStatus, rescheduleAppointment } from '../store/slices/appointmentSlice';
import { Avatar, Typography, Button, Tabs, Input, DatePicker, Select, Space, Drawer, Form, Modal, Tooltip, Dropdown, Tag, Divider } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, MessageOutlined, EyeOutlined, SearchOutlined, DownloadOutlined, FilterOutlined, FileTextOutlined, CreditCardOutlined } from '@ant-design/icons';
import { PageHeader, LoadingSpinner, EmptyState } from '../components/common';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { formatDateTimeWithAmPm } from '../utils/dateUtils';

const { Text } = Typography;

const Appointments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { appointments, loading } = useSelector((state: RootState) => state.appointment);
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filterForm] = Form.useForm();
  const [filters, setFilters] = useState({
    patient_name: '',
    date_from: null,
    date_to: null,
    status: ''
  });
  const [notesModal, setNotesModal] = useState({
    visible: false,
    notes: '',
    appointmentId: null as number | null
  });
  const [rescheduleModal, setRescheduleModal] = useState({
    visible: false,
    appointmentId: null as number | null,
    value: null as any
  });

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  // Apply filters to appointments
  const filteredAppointments = React.useMemo(() => {
    if (!Array.isArray(appointments)) return [];
    
    let filtered = appointments.filter(appointment => {
      // Apply tab filters
      switch (activeTab) {
        case 'today':
          if (new Date(appointment.scheduled_at).toDateString() !== new Date().toDateString()) return false;
          break;
        case 'upcoming':
          if (new Date(appointment.scheduled_at) <= new Date()) return false;
          break;
        case 'completed':
          if (appointment.status !== 'completed') return false;
          break;
        // removed cancelled tab
        default:
          break;
      }

      // Apply additional filters
      if (filters.patient_name && !appointment.patient?.name?.toLowerCase().includes(filters.patient_name.toLowerCase())) {
        return false;
      }
      if (filters.status && appointment.status !== filters.status) {
        return false;
      }
      if (filters.date_from && dayjs(filters.date_from).isValid() && dayjs(appointment.scheduled_at).isBefore(dayjs(filters.date_from))) {
        return false;
      }
      if (filters.date_to && dayjs(filters.date_to).isValid() && dayjs(appointment.scheduled_at).isAfter(dayjs(filters.date_to))) {
        return false;
      }
      return true;
    });

    return filtered;
  }, [appointments, activeTab, filters]);

  const handleFilterSubmit = (values: any) => {
    try {
      setFilters({
        patient_name: values.patient_name || '',
        date_from: values.date_from ? values.date_from.format('YYYY-MM-DD') : null,
        date_to: values.date_to ? values.date_to.format('YYYY-MM-DD') : null,
        status: values.status || ''
      });
      setShowFilters(false);
    } catch (error) {
      console.error('Error applying filters:', error);
      toast.error('Error applying filters. Please try again.');
    }
  };

  const handleClearFilters = () => {
    try {
      setFilters({
        patient_name: '',
        date_from: null,
        date_to: null,
        status: ''
      });
      filterForm.setFieldsValue({
        patient_name: '',
        date_from: null,
        date_to: null,
        status: ''
      });
      setShowFilters(false);
    } catch (error) {
      console.error('Error clearing filters:', error);
      toast.error('Error clearing filters. Please try again.');
    }
  };

  const handleExport = async (format: 'excel' | 'csv') => {
    try {
      const token = localStorage.getItem('dermatologist_token') || localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      // Apply current filters to export
      if (filters.patient_name) queryParams.append('patient_name', filters.patient_name);
      if (filters.date_from) queryParams.append('date_from', filters.date_from);
      if (filters.date_to) queryParams.append('date_to', filters.date_to);
      if (filters.status) queryParams.append('status', filters.status);
      queryParams.append('export', format);

      const response = await fetch(`/api/dermatologist/appointments?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv'
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dermatologist_appointments_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.${format === 'excel' ? 'xls' : 'csv'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success(`Appointments exported as ${format.toUpperCase()} successfully!`);
      } else {
        const errorText = await response.text();
        console.error('Export failed:', errorText);
        toast.error('Failed to export appointments');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export appointments');
    }
  };

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    try {
      await dispatch(updateAppointmentStatus({ appointmentId, status: newStatus })).unwrap();
      toast.success('Status updated');
    } catch (error: any) {
      console.error('Status update failed:', error);
      toast.error(typeof error === 'string' ? error : 'Failed to update status');
    }
  };

  const handleReschedule = async (appointmentId: number, scheduled_at: string) => {
    try {
      await dispatch(rescheduleAppointment({ appointmentId, scheduled_at })).unwrap();
      // Optimistic UI: update local list time without page refresh
      dispatch(fetchAppointments());
      toast.success('Appointment rescheduled');
    } catch (error: any) {
      console.error('Reschedule failed:', error);
      toast.error(typeof error === 'string' ? error : 'Failed to reschedule');
    }
  };

  const handleAppointmentClick = (appointmentId: number) => {
    navigate(`/appointments/${appointmentId}`);
  };

  const handleShowNotes = (appointment: any) => {
    setNotesModal({
      visible: true,
      notes: appointment.notes || 'No notes available for this appointment.',
      appointmentId: appointment.id
    });
  };

  const tabItems = [
    { key: 'all', label: 'All Appointments' },
    { key: 'today', label: 'Today' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Manage your patient appointments and consultations."
        extra={
          <Space>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowFilters(true)}
            >
              Filters
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleExport('csv')}
            >
              Export CSV
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleExport('excel')}
            >
              Export Excel
            </Button>
          </Space>
        }
      />

      {/* Filter Drawer */}
      <Drawer
        title="Filter Appointments"
        placement="right"
        open={showFilters}
        onClose={() => setShowFilters(false)}
        width={420}
      >
        <Form
          key={`filter-form-${JSON.stringify(filters)}`}
          form={filterForm}
          onFinish={handleFilterSubmit}
          layout="vertical"
          initialValues={{
            patient_name: filters.patient_name || '',
            date_from: filters.date_from ? dayjs(filters.date_from) : null,
            date_to: filters.date_to ? dayjs(filters.date_to) : null,
            status: filters.status || ''
          }}
        >
          <Form.Item name="patient_name" label="Patient Name">
            <Input placeholder="Search by patient name" prefix={<SearchOutlined />} allowClear style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select placeholder="Select status" allowClear style={{ width: '100%' }}>
              <Select.Option value="pending_review">Pending Review</Select.Option>
              <Select.Option value="confirmed">Confirmed</Select.Option>
              <Select.Option value="in_progress">In Progress</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="date_from" label="From Date">
            <DatePicker placeholder="Start date" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="date_to" label="To Date">
            <DatePicker placeholder="End date" style={{ width: '100%' }} />
          </Form.Item>
          <div className="flex items-center gap-2" style={{ marginTop: 4 }}>
            <Button onClick={handleClearFilters}>
              Clear Filters
            </Button>
            <Button type="primary" htmlType="submit">
              Apply Filters
            </Button>
          </div>
        </Form>
      </Drawer>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Patient Appointments</h3>
              <p className="text-sm text-gray-600 mt-1">
                Manage your consultations with patients
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {filteredAppointments.length}
              </div>
              <div className="text-sm text-gray-500">
                {filteredAppointments.length === (Array.isArray(appointments) ? appointments.length : 0) 
                  ? 'appointment(s)' 
                  : `of ${Array.isArray(appointments) ? appointments.length : 0} appointment(s)`}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="mb-6"
          />

          {loading ? (
            <LoadingSpinner />
          ) : filteredAppointments.length === 0 ? (
            <EmptyState
              icon={<CalendarOutlined className="text-4xl text-gray-400" />}
              title={Array.isArray(appointments) && appointments.length > 0 ? "No appointments match your filters" : "No appointments found"}
              description={
                Array.isArray(appointments) && appointments.length > 0 
                  ? "Try adjusting your filters to see more results."
                  : activeTab === 'all' 
                    ? 'You don\'t have any appointments yet.'
                    : `No ${activeTab} appointments found.`
              }
              actionText={Array.isArray(appointments) && appointments.length > 0 ? "Clear Filters" : undefined}
              onAction={Array.isArray(appointments) && appointments.length > 0 ? handleClearFilters : undefined}
            />
          ) : (
            <div className="space-y-2">
              {filteredAppointments.map((appointment, idx) => {
                const statusColor = appointment.status === 'completed' ? 'green' : appointment.status === 'in_progress' ? 'orange' : appointment.status === 'confirmed' ? 'cyan' : 'blue';
                const totalPaid = Number(appointment.consultation_fee || 0);
                const doctorSharePercent = Number((import.meta as any).env?.VITE_DERMATOLOGIST_SHARE_PERCENT || 70);
                const doctorAmount = (totalPaid * doctorSharePercent) / 100;

                return (
                  <div key={appointment.id} className="px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      {/* Left - Identity and meta */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <Avatar size={48} icon={<UserOutlined />} className="bg-blue-500/90 text-white" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Text strong className="text-base text-gray-900 truncate">
                              {appointment.patient?.name || 'Unknown Patient'}
                            </Text>
                            <Tag color={statusColor} style={{ marginInlineStart: 0 }}>
                              {appointment.status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                            </Tag>
                            {appointment.is_paid && (
                              <Tag color="success" icon={<CreditCardOutlined />}>Paid</Tag>
                            )}
                          </div>
                          <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-gray-700">
                              <CalendarOutlined className="text-blue-500" />
                              <span className="text-sm">
                                {(appointment as any).formatted_date_time || formatDateTimeWithAmPm(appointment.scheduled_at)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <ClockCircleOutlined className="text-green-500" />
                              <span className="text-sm font-semibold text-green-700">₹{doctorAmount.toFixed(2)}</span>
                              <span className="text-xs text-gray-500">your payout</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right - Actions */}
                      <div className="flex items-center gap-8 ml-4">
                        {/* Status menu */}
                        <Dropdown
                          trigger={["click"]}
                          menu={{
                            items: [
                              { key: 'pending_review', label: 'Pending Review', onClick: () => handleStatusChange(appointment.id, 'pending_review') },
                              { key: 'confirmed', label: 'Confirmed', onClick: () => handleStatusChange(appointment.id, 'confirmed') },
                              { key: 'in_progress', label: 'In Progress', onClick: () => handleStatusChange(appointment.id, 'in_progress') },
                              { key: 'completed', label: 'Completed', onClick: () => handleStatusChange(appointment.id, 'completed') },
                            ]
                          }}
                        >
                          <Button onClick={(e) => e.stopPropagation()} size="small">
                            Change Status
                          </Button>
                        </Dropdown>

                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                          // Seed with DB-local time (avoid timezone shift): treat as local by inserting 'T'
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
                          setRescheduleModal({ visible: true, appointmentId: appointment.id, value: seed });
                          }}
                        >
                          Reschedule
                        </Button>

                        <Space size="small">
                          <Tooltip title="Chat">
                            <Button
                              type="primary"
                              shape="circle"
                              icon={<MessageOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/chat?appointmentId=${appointment.id}`);
                              }}
                            />
                          </Tooltip>
                          <Tooltip title="Details">
                            <Button
                              shape="circle"
                              icon={<EyeOutlined />}
                              onClick={() => handleAppointmentClick(appointment.id)}
                            />
                          </Tooltip>
                          <Tooltip title="Notes">
                            <Button
                              shape="circle"
                              icon={<FileTextOutlined />}
                              onClick={() => handleShowNotes(appointment)}
                            />
                          </Tooltip>
                        </Space>
                      </div>
                    </div>

                    {idx < filteredAppointments.length - 1 && (
                      <Divider className="!my-3" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Notes Modal */}
      <Modal
        title="Consultation Notes"
        open={notesModal.visible}
        onCancel={() => setNotesModal({ visible: false, notes: '', appointmentId: null })}
        footer={[
          <Button key="close" onClick={() => setNotesModal({ visible: false, notes: '', appointmentId: null })}>
            Close
          </Button>
        ]}
        width={600}
      >
        <div className="p-4 bg-gray-50 rounded-lg">
          <Text className="whitespace-pre-wrap text-gray-700">
            {notesModal.notes}
          </Text>
        </div>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        title="Reschedule Appointment"
        open={rescheduleModal.visible}
        onCancel={() => setRescheduleModal({ visible: false, appointmentId: null, value: null })}
        onOk={async () => {
          if (!rescheduleModal.value || !rescheduleModal.appointmentId) return;
          // Send formatted local datetime as Y-m-d H:i:s to avoid timezone shifts
          // Send as local wall time without timezone to match DB (stores 24)
          const localString = dayjs(rescheduleModal.value as any).format('YYYY-MM-DD HH:mm:ss');
          await handleReschedule(rescheduleModal.appointmentId!, localString);
          setRescheduleModal({ visible: false, appointmentId: null, value: null });
        }}
        okText="Continue"
      >
        <DatePicker
          showTime
          style={{ width: '100%' }}
          value={rescheduleModal.value}
          onChange={(v) => setRescheduleModal({ ...rescheduleModal, value: v })}
        />
      </Modal>
    </div>
  );
};

export default Appointments;