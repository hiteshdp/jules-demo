// Generated via prompt: prompts/admin_dermatologists_view_modal_v1.md
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchDermatologists, createDermatologist, updateDermatologist, deleteDermatologist } from '../store/slices/dermatologistSlice';
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
  Descriptions
} from 'antd';
import { 
  UserOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import toast from 'react-hot-toast';
import DermatologistModal from '../components/features/DermatologistModal';

const { Title, Text } = Typography;

interface Dermatologist {
  id: number;
  name: string;
  email: string;
  phone_no?: string;
  dob?: string;
  gender?: string;
  specialization?: string;
}

const Dermatologists: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dermatologists, loading } = useSelector((state: RootState) => state.dermatologist);
  const [currentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewData, setViewData] = useState<any | null>(null);

  useEffect(() => {
    dispatch(fetchDermatologists({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const filteredDermatologists = dermatologists.filter((dermatologist: any) =>
    dermatologist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dermatologist.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentEditingData = editingId ? dermatologists.find((d: any) => d.id === editingId) : null;

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
      await dispatch(deleteDermatologist(id)).unwrap();
      toast.success('Dermatologist deleted successfully');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete dermatologist');
    }
  };

  const handleView = async (id: number) => {
    setViewOpen(true);
    setViewLoading(true);
    setViewData(null);
    try {
      const { dermatologistAPI } = await import('../store/api/dermatologistAPI');
      const { data } = await dermatologistAPI.getDermatologist(id);
      if (data?.success) {
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

  const handleModalSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      if (editingId) {
        // Do not send empty password
        const payload = { ...data };
        if (!payload.password) delete payload.password;
        await dispatch(updateDermatologist({ dermatologistId: editingId, data: payload })).unwrap();
        toast.success('Dermatologist updated successfully');
      } else {
        await dispatch(createDermatologist(data)).unwrap();
        toast.success('Dermatologist created successfully');
      }
      setModalOpen(false);
      // refresh list
      dispatch(fetchDermatologists({ page: currentPage, search: searchTerm }));
    } catch (e: any) {
      const msg = e?.message || e?.error || 'Operation failed';
      toast.error(typeof msg === 'string' ? msg : 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<Dermatologist> = [
    {
      title: 'Dermatologist',
      key: 'dermatologist',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone_no',
      key: 'phone_no',
      render: (phone) => phone || 'N/A',
    },
    {
      title: 'DOB',
      dataIndex: 'dob',
      key: 'dob',
      render: (dob) => dob || '–',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => gender || '–',
    },
    {
      title: 'Specialization',
      dataIndex: 'profile',
      key: 'specialization',
      render: (profile) => (
        <Tag color="blue">
          {profile?.specialization || '–'}
        </Tag>
      ),
    },
    {
      title: 'Experience',
      dataIndex: 'profile',
      key: 'experience',
      render: (profile) => profile?.years_of_experience ? `${profile.years_of_experience} years` : '–',
    },
    {
      title: 'Consultation Fee',
      dataIndex: 'profile',
      key: 'consultation_fee',
      render: (profile) => profile?.consultation_fee ? `$${profile.consultation_fee}` : '–',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => handleView(record.id)}
            title="View"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record.id)}
            title="Edit"
          />
          <Popconfirm
            title="Delete Dermatologist"
            description="Are you sure you want to delete this dermatologist?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              title="Delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Space direction="vertical" size={4}>
          <Title level={2} style={{ margin: 0 }}>
            Dermatologists
          </Title>
          <Text type="secondary">
            Manage dermatologist accounts and profiles.
          </Text>
        </Space>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleCreate}
          size="large"
        >
          Create Dermatologist
        </Button>
      </div>

      {/* Search */}
      <Card>
        <Input
          placeholder="Search dermatologists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ maxWidth: 400 }}
        />
      </Card>

      {/* Dermatologists Table */}
      <Card>
        {filteredDermatologists.length === 0 && !loading ? (
          <Empty
            image={<UserOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />}
            description={searchTerm ? 'No dermatologists match your search criteria.' : 'No dermatologists registered yet.'}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredDermatologists}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} dermatologists`,
            }}
            scroll={{ x: 800 }}
          />
        )}
      </Card>

      <DermatologistModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={currentEditingData ? { 
          name: currentEditingData.name, 
          email: currentEditingData.email, 
          phone_no: currentEditingData.phone_no, 
          dob: currentEditingData.dob, 
          gender: currentEditingData.gender,
          // Professional fields - these will be loaded from the profile data
          license_number: currentEditingData.profile?.license_number || '',
          specialization: currentEditingData.profile?.specialization || '',
          years_of_experience: currentEditingData.profile?.years_of_experience || 0,
          qualifications: currentEditingData.profile?.qualifications || '',
          consultation_fee: currentEditingData.profile?.consultation_fee || 0,
          bio: currentEditingData.profile?.bio || ''
        } : null}
        title={editingId ? 'Edit Dermatologist' : 'Create Dermatologist'}
        submitting={submitting}
      />

      {/* View Modal */}
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
            <Card>
              <Space>
                <Avatar icon={<UserOutlined />} size={48} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{viewData.name}</div>
                  <Text type="secondary">{viewData.email}</Text>
                </div>
              </Space>
            </Card>

            <Card title="Profile">
              <Descriptions column={1} bordered size="middle">
                <Descriptions.Item label="Phone">{viewData.phone_no || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Date of Birth">{viewData.dob || '–'}</Descriptions.Item>
                <Descriptions.Item label="Gender">{viewData.gender || '–'}</Descriptions.Item>
                <Descriptions.Item label="Active">{viewData.is_active ? 'Yes' : 'No'}</Descriptions.Item>
              </Descriptions>
            </Card>

            {viewData.profile && (
              <Card title="Professional Details">
                <Descriptions column={1} bordered size="middle">
                  <Descriptions.Item label="License Number">{viewData.profile.license_number || '–'}</Descriptions.Item>
                  <Descriptions.Item label="Specialization">{viewData.profile.specialization || '–'}</Descriptions.Item>
                  <Descriptions.Item label="Experience (years)">{viewData.profile.years_of_experience ?? '–'}</Descriptions.Item>
                  <Descriptions.Item label="Qualifications">{viewData.profile.qualifications || '–'}</Descriptions.Item>
                  <Descriptions.Item label="Consultation Fee">{viewData.profile.consultation_fee ?? '–'}</Descriptions.Item>
                  <Descriptions.Item label="Bio">{viewData.profile.bio || '–'}</Descriptions.Item>
                </Descriptions>
              </Card>
            )}
          </Space>
        ) : (
          <Empty description="No details found" />
        )}
      </Modal>
    </Space>
  );
};

export default Dermatologists;