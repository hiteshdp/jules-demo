import React, { useEffect, useState, useCallback } from 'react';
import {
    Card,
    Table,
    Tag,
    Avatar,
    Typography,
    Space,
    Select,
    DatePicker,
    Row,
    Col
} from 'antd';
import {
    UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import toast from 'react-hot-toast';
import { appointmentsAPI } from '../store/api/appointmentsApi';
import { Appointment } from '../types/appointment';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Appointments: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({
        status: '',
        dermatologist_id: undefined,
        patient_id: undefined,
        date_from: '',
        date_to: '',
    });

    const [dermatologists, setDermatologists] = useState<{ id: number; name: string; }[]>([]);
    const [patients, setPatients] = useState<{ id: number; name: string; }[]>([]);

    const fetchAppointments = useCallback(async (page: number, currentFilters: typeof filters) => {
        setLoading(true);
        try {
            const { data } = await appointmentsAPI.getAppointments({ page, ...currentFilters });
            setAppointments(data.data.data);
            setTotal(data.data.total);
            setCurrentPage(data.data.current_page);
        } catch (error) {
            toast.error('An error occurred while fetching appointments');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchFilterData = useCallback(async () => {
        try {
            const [dermatologistsRes, patientsRes] = await Promise.all([
                appointmentsAPI.getDermatologistsForFilter(),
                appointmentsAPI.getPatientsForFilter()
            ]);
            setDermatologists(dermatologistsRes.data.data);
            setPatients(patientsRes.data.data);
        } catch (error) {
            toast.error('Failed to fetch filter data');
        }
    }, []);

    useEffect(() => {
        fetchAppointments(currentPage, filters);
    }, [currentPage, filters, fetchAppointments]);

    useEffect(() => {
        fetchFilterData();
    }, [fetchFilterData]);

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleDateChange = (_: any, dateStrings: [string, string]) => {
        setFilters(prev => ({ ...prev, date_from: dateStrings[0], date_to: dateStrings[1] }));
    };

    const columns: ColumnsType<Appointment> = [
        {
            title: 'Patient',
            dataIndex: ['patient', 'name'],
            key: 'patient',
            render: (_, record) => (
                <Space>
                    <Avatar icon={<UserOutlined />} />
                    <div>
                        <div style={{ fontWeight: 500 }}>{record.patient?.name}</div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {record.patient?.email}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Dermatologist',
            dataIndex: ['dermatologist', 'user', 'name'],
            key: 'dermatologist',
            render: (_, record) => (
                <Space>
                    <Avatar icon={<UserOutlined />} />
                    <div>
                        <div style={{ fontWeight: 500 }}>{record.dermatologist?.name}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Scheduled At',
            dataIndex: 'scheduled_at',
            key: 'scheduled_at',
            render: (text) => dayjs(text).format('DD/MM/YYYY hh:mm A'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                if (status === 'completed') color = 'green';
                if (status === 'scheduled') color = 'blue';
                if (status === 'cancelled') color = 'red';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Fee',
            dataIndex: 'consultation_fee',
            key: 'fee',
            render: (fee) => `₹${fee}`,
        },
        {
            title: 'Payment',
            dataIndex: 'is_paid',
            key: 'payment',
            render: (is_paid) => (
                <Tag color={is_paid ? 'green' : 'orange'}>{is_paid ? 'Paid' : 'Unpaid'}</Tag>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Space direction="vertical" size={4}>
                    <Title level={2} style={{ margin: 0 }}>Appointments</Title>
                    <Text type="secondary">View and manage all appointments.</Text>
                </Space>
            </div>

            <Card>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Filter by Status"
                            style={{ width: '100%' }}
                            onChange={(value) => handleFilterChange('status', value)}
                            allowClear
                        >
                            <Option value="scheduled">Scheduled</Option>
                            <Option value="in_progress">In Progress</Option>
                            <Option value="completed">Completed</Option>
                            <Option value="cancelled">Cancelled</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Filter by Dermatologist"
                            style={{ width: '100%' }}
                            onChange={(value) => handleFilterChange('dermatologist_id', value)}
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                              (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {dermatologists.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>)}
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Filter by Patient"
                            style={{ width: '100%' }}
                            onChange={(value) => handleFilterChange('patient_id', value)}
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                              (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {patients.map(p => <Option key={p.id} value={p.id}>{p.name}</Option>)}
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <RangePicker style={{ width: '100%' }} onChange={handleDateChange} />
                    </Col>
                </Row>
            </Card>

            <Card>
                <Table
                    columns={columns}
                    dataSource={appointments}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        current: currentPage,
                        pageSize: 15,
                        total,
                        onChange: (page) => setCurrentPage(page),
                    }}
                    scroll={{ x: 800 }}
                />
            </Card>
        </Space>
    );
};

export default Appointments;