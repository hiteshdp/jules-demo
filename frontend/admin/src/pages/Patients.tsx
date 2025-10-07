// Generated via prompt: prompts/antd_patients_dermatologists_conversion_v1.md
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchPatients, createPatient, updatePatient, deletePatient } from '../store/slices/patientSlice';
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
  Popconfirm
} from 'antd';
import { 
  TeamOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import toast from 'react-hot-toast';
import PatientModal from '../components/PatientModal';

const { Title, Text } = Typography;

interface Patient {
  id: number;
  name: string;
  email: string;
  phone_no?: string;
  dob?: string;
  gender?: string;
  subscription_status?: string;
}

const Patients: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { patients, loading } = useSelector((state: RootState) => state.patient);
  const [currentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchPatients({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const filteredPatients = patients.filter((patient: any) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentEditingData = editingId ? patients.find((p: any) => p.id === editingId) : null;

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
      await dispatch(deletePatient(id)).unwrap();
      toast.success('Patient deleted successfully');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete patient');
    }
  };

  const handleModalSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      if (editingId) {
        // Do not send empty password
        const payload = { ...data };
        if (!payload.password) delete payload.password;
        await dispatch(updatePatient({ patientId: editingId, data: payload })).unwrap();
        toast.success('Patient updated successfully');
      } else {
        await dispatch(createPatient(data)).unwrap();
        toast.success('Patient created successfully');
      }
      setModalOpen(false);
      // refresh list
      dispatch(fetchPatients({ page: currentPage, search: searchTerm }));
    } catch (e: any) {
      const msg = e?.message || e?.error || 'Operation failed';
      toast.error(typeof msg === 'string' ? msg : 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<Patient> = [
    {
      title: 'Patient',
      key: 'patient',
      render: (_, record) => (
        <Space>
          <Avatar icon={<TeamOutlined />} />
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
      title: 'Subscription',
      dataIndex: 'subscription_status',
      key: 'subscription_status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status || '–'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record.id)}
            title="Edit"
          />
          <Popconfirm
            title="Delete Patient"
            description="Are you sure you want to delete this patient?"
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
            Patients
          </Title>
          <Text type="secondary">
            Manage patient accounts and profiles.
          </Text>
        </Space>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleCreate}
          size="large"
        >
          Create Patient
        </Button>
      </div>

      {/* Search */}
      <Card>
        <Input
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ maxWidth: 400 }}
        />
      </Card>

      {/* Patients Table */}
      <Card>
        {filteredPatients.length === 0 && !loading ? (
          <Empty
            image={<TeamOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />}
            description={searchTerm ? 'No patients match your search criteria.' : 'No patients registered yet.'}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredPatients}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} patients`,
            }}
            scroll={{ x: 800 }}
          />
        )}
      </Card>

      <PatientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={currentEditingData ? { 
          name: currentEditingData.name, 
          email: currentEditingData.email, 
          phone_no: currentEditingData.phone_no, 
          dob: currentEditingData.dob, 
          gender: currentEditingData.gender 
        } : null}
        title={editingId ? 'Edit Patient' : 'Create Patient'}
        submitting={submitting}
      />
    </Space>
  );
};

export default Patients;
