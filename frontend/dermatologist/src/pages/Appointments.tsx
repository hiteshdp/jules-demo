import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';
import { fetchAppointments } from '../store/slices/appointmentSlice';
import { Card, Avatar, Typography, Button, Tabs, Input, DatePicker, Select, Space, Row, Col, Modal, Form } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, MessageOutlined, EyeOutlined, SearchOutlined, DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import { PageHeader, LoadingSpinner, EmptyState, StatusTag } from '../components/common';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

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
        case 'cancelled':
          if (appointment.status !== 'cancelled') return false;
          break;
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

  const handleAppointmentClick = (appointmentId: number) => {
    navigate(`/appointments/${appointmentId}`);
  };

  const tabItems = [
    { key: 'all', label: 'All Appointments' },
    { key: 'today', label: 'Today' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
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

      {/* Filter Modal */}
      <Modal
        title="Filter Appointments"
        open={showFilters}
        onCancel={() => setShowFilters(false)}
        footer={null}
        width={600}
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="patient_name"
                label="Patient Name"
              >
                <Input
                  placeholder="Search by patient name"
                  prefix={<SearchOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
              >
                <Select placeholder="Select status" allowClear>
                  <Select.Option value="scheduled">Scheduled</Select.Option>
                  <Select.Option value="in_progress">In Progress</Select.Option>
                  <Select.Option value="completed">Completed</Select.Option>
                  <Select.Option value="cancelled">Cancelled</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date_from"
                label="From Date"
              >
                <DatePicker
                  placeholder="Select start date"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="date_to"
                label="To Date"
              >
                <DatePicker
                  placeholder="Select end date"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <div className="flex justify-end space-x-2">
            <Button onClick={handleClearFilters}>
              Clear Filters
            </Button>
            <Button type="primary" htmlType="submit">
              Apply Filters
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Patient Appointments</h3>
              <p className="text-sm text-gray-600 mt-1">
                Manage your consultations with patients
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
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
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm hover:shadow-md"
                  bodyStyle={{ padding: '20px' }}
                >
                  <div className="flex items-center justify-between">
                    {/* Left Side - Patient Info */}
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar 
                        size={56} 
                        icon={<UserOutlined />} 
                        className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Text strong className="text-lg text-gray-900">
                            {appointment.patient?.name || 'Unknown Patient'}
                          </Text>
                          <StatusTag status={appointment.status} />
                        </div>
                        <div className="text-sm text-gray-500 mb-3">
                          Patient
                        </div>
                        
                        {/* Appointment Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <CalendarOutlined className="text-blue-500 text-lg flex-shrink-0" />
                            <div>
                              <Text className="text-sm font-medium text-gray-900">
                                {(appointment as any).formatted_date_time || new Date(appointment.scheduled_at).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </Text>
                              <Text className="text-sm text-gray-500">
                                {(appointment as any).formatted_date_time ? '' : new Date(appointment.scheduled_at).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </Text>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                            <ClockCircleOutlined className="text-green-500 text-lg flex-shrink-0" />
                            <div>
                              <Text className="text-sm font-medium text-gray-900">
                                Consultation Fee
                              </Text>
                              <Text className="text-lg font-bold text-green-600">
                                ₹{appointment.consultation_fee ? Number(appointment.consultation_fee).toFixed(2) : '0.00'}
                              </Text>
                            </div>
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                            <Text className="text-sm text-gray-700">
                              <strong>Notes:</strong> {appointment.notes}
                            </Text>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex flex-col space-y-3 ml-4 min-w-[140px]">
                      {/* Chat Button */}
                      <Button
                        type="primary"
                        icon={<MessageOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/chat?appointmentId=${appointment.id}`);
                        }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        size="middle"
                      >
                        <span className="font-medium">Start Chat</span>
                      </Button>
                      
                      {/* View Details Button */}
                      <Button
                        type="default"
                        icon={<EyeOutlined />}
                        onClick={() => handleAppointmentClick(appointment.id)}
                        className="bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 text-gray-700 hover:text-gray-900"
                        size="middle"
                      >
                        <span className="font-medium">View Details</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;