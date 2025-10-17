import React, { useEffect, useState, useCallback } from 'react';
import {
    Card,
    Table,
    Tag,
    Avatar,
    Typography,
    Space,
    Empty,
    Button,
    Input,
    Spin,
    Popconfirm,
    Modal,
    Descriptions,
} from 'antd';
import {
    UserOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import toast from 'react-hot-toast';
import { dermatologistAPI, DermatologistPayload } from '../store/api/dermatologistAPI';
import { Dermatologist } from '../types/dermatologist';
import dayjs from 'dayjs';
import DermatologistModal from '../components/DermatologistModal';

const { Title, Text } = Typography;

const Dermatologists: React.FC = () => {
    const [dermatologists, setDermatologists] = useState<Dermatologist[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [viewLoading, setViewLoading] = useState(false);
    const [viewData, setViewData] = useState<Dermatologist | null>(null);

    const fetchDermatologists = useCallback(async (page: number, search: string) => {
        setLoading(true);
        try {
            const { data } = await dermatologistAPI.getDermatologists({ page, search });
            if (data.success) {
                setDermatologists(data.data);
                setTotal(data.total);
            } else {
                toast.error(data.message || 'Failed to fetch dermatologists');
            }
        } catch (error) {
            toast.error('An error occurred while fetching dermatologists');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDermatologists(currentPage, searchTerm);
    }, [currentPage, searchTerm, fetchDermatologists]);

    const currentEditingData = editingId ? dermatologists.find((d) => d.id === editingId) : null;

    const handleCreate = () => {
        setEditingId(null);
        setModalOpen(true);
    };

    const handleEdit = (id: number) => {
        setEditingId(id);
        setModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await dermatologistAPI.deleteDermatologist(id);
            toast.success('Dermatologist deleted successfully');
            fetchDermatologists(currentPage, searchTerm);
        } catch (e: any) {
            toast.error(e?.response?.data?.message || 'Failed to delete dermatologist');
        }
    };

    const handleView = async (id: number) => {
        setViewOpen(true);
        setViewLoading(true);
        try {
            const { data } = await dermatologistAPI.getDermatologist(id);
            if (data.success) {
                setViewData(data.data);
            } else {
                toast.error('Failed to load dermatologist details');
            }
        } catch (e: any) {
            toast.error(e?.response?.data?.message || 'Failed to load dermatologist details');
        } finally {
            setViewLoading(false);
        }
    };

    const handleModalSubmit = async (formData: DermatologistPayload) => {
        setSubmitting(true);
        try {
            if (editingId) {
                await dermatologistAPI.updateDermatologist(editingId, formData);
                toast.success('Dermatologist updated successfully');
            } else {
                await dermatologistAPI.createDermatologist(formData);
                toast.success('Dermatologist created successfully');
            }
            setModalOpen(false);
            fetchDermatologists(currentPage, searchTerm);
        } catch (e: any) {
            const errorMessage = e?.response?.data?.message || 'Operation failed';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const columns: ColumnsType<Dermatologist> = [
        {
            title: 'Dermatologist',
            dataIndex: 'full_name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <Avatar icon={<UserOutlined />} />
                    <div>
                        <div style={{ fontWeight: 500 }}>{text}</div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {record.email}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            render: (phone) => phone || 'N/A',
        },
        {
            title: 'Specialization',
            dataIndex: 'specialization',
            key: 'specialization',
            render: (specialization) => specialization || 'N/A',
        },
        {
            title: 'Experience',
            dataIndex: 'experience_years',
            key: 'experience',
            render: (exp) => (exp ? `${exp} years` : 'N/A'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                if (!status) {
                    return <Tag>Unknown</Tag>;
                }
                return (
                    <Tag color={status === 'active' ? 'green' : 'red'}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Tag>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(record.id)} title="View" />
                    <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record.id)} title="Edit" />
                    <Popconfirm
                        title="Delete Dermatologist"
                        description="Are you sure you want to delete this dermatologist?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} title="Delete" />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Space direction="vertical" size={4}>
                    <Title level={2} style={{ margin: 0 }}>Dermatologists</Title>
                    <Text type="secondary">Manage dermatologist accounts and profiles.</Text>
                </Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} size="large">
                    Create Dermatologist
                </Button>
            </div>

            <Card>
                <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    prefix={<SearchOutlined />}
                    style={{ maxWidth: 400 }}
                />
            </Card>

            <Card>
                <Table
                    columns={columns}
                    dataSource={dermatologists}
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

            <DermatologistModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={currentEditingData}
                title={editingId ? 'Edit Dermatologist' : 'Create Dermatologist'}
                submitting={submitting}
            />

            <Modal
                title="Dermatologist Details"
                open={viewOpen}
                onCancel={() => setViewOpen(false)}
                footer={null}
                width={600}
            >
                {viewLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                        <Spin />
                    </div>
                ) : viewData ? (
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="Full Name">{viewData.full_name}</Descriptions.Item>
                            <Descriptions.Item label="Email">{viewData.email}</Descriptions.Item>
                            <Descriptions.Item label="Phone">{viewData.phone || 'N/A'}</Descriptions.Item>
                            <Descriptions.Item label="Specialization">{viewData.specialization}</Descriptions.Item>
                            <Descriptions.Item label="Experience">{viewData.experience_years} years</Descriptions.Item>
                            <Descriptions.Item label="Clinic Name">{viewData.clinic_name || 'N/A'}</Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag color={viewData.status === 'active' ? 'green' : 'red'}>
                                    {viewData.status.charAt(0).toUpperCase() + viewData.status.slice(1)}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Joined On">
                                {dayjs(viewData.created_at).format('DD/MM/YYYY')}
                            </Descriptions.Item>
                        </Descriptions>
                    </Space>
                ) : (
                    <Empty description="No details found" />
                )}
            </Modal>
        </Space>
    );
};

export default Dermatologists;