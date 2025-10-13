// Generated via prompt: prompts/antd_admin_complete_audit_v1.md
import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, DatePicker, Select, Space, Switch } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface PatientForm {
  name: string;
  email: string;
  phone_no: string;
  password?: string;
  dob?: string;
  gender?: string;
  // Patient profile fields
  allergies?: string;
  current_medications?: string;
  smoking?: boolean;
  alcohol_consumption?: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PatientForm) => Promise<void> | void;
  initialData?: Partial<PatientForm> | null;
  title?: string;
  submitting?: boolean;
}

const PatientModal: React.FC<Props> = ({ open, onClose, onSubmit, initialData, title = 'Create Patient', submitting }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          dob: initialData.dob ? dayjs(initialData.dob) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, initialData, form]);

  const handleFinish = (values: any) => {
    onSubmit({
      ...values,
      dob: values.dob ? values.dob.format('YYYY-MM-DD') : null,
    });
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ gender: 'male' }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter patient name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter patient email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={initialData ? [] : [{ required: true, message: 'Please enter password' }]}
        >
          <Input.Password placeholder={initialData ? 'Leave blank to keep current password' : ''} />
        </Form.Item>
        <Form.Item name="phone_no" label="Phone Number">
          <Input />
        </Form.Item>
        <Form.Item name="dob" label="Date of Birth">
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item name="gender" label="Gender">
          <Select>
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        {/* Medical Information Section */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
          <h4 style={{ marginBottom: 16, color: '#1890ff' }}>Medical Information</h4>
          
          <Form.Item
            name="allergies"
            label="Allergies"
          >
            <TextArea 
              rows={2} 
              placeholder="List any allergies..."
            />
          </Form.Item>

          <Form.Item
            name="current_medications"
            label="Current Medications"
          >
            <TextArea 
              rows={2} 
              placeholder="List current medications..."
            />
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item name="smoking" label="Smoking" valuePropName="checked" style={{ flex: 1 }}>
              <Switch />
            </Form.Item>
            <Form.Item name="alcohol_consumption" label="Alcohol Consumption" valuePropName="checked" style={{ flex: 1 }}>
              <Switch />
            </Form.Item>
          </div>
        </div>

        <Form.Item>
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PatientModal;