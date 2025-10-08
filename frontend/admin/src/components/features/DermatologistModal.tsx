// Generated via prompt: prompts/antd_admin_complete_audit_v1.md
import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, DatePicker, Select, Space, InputNumber } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface DermatologistForm {
  name: string;
  email: string;
  phone_no: string;
  password?: string;
  dob?: string;
  gender?: string;
  // Professional fields
  license_number: string;
  specialization: string;
  years_of_experience: number;
  qualifications: string;
  consultation_fee: number;
  bio?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DermatologistForm) => Promise<void> | void;
  initialData?: Partial<DermatologistForm> | null;
  title?: string;
  submitting?: boolean;
}

const DermatologistModal: React.FC<Props> = ({ open, onClose, onSubmit, initialData, title = 'Create Dermatologist', submitting }) => {
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
          rules={[{ required: true, message: 'Please enter dermatologist name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter dermatologist email' },
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
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item name="gender" label="Gender">
          <Select>
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        {/* Professional Information Section */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
          <h4 style={{ marginBottom: 16, color: '#1890ff' }}>Professional Information</h4>
          
          <Form.Item
            name="license_number"
            label="License Number"
            rules={[{ required: true, message: 'Please enter license number' }]}
          >
            <Input placeholder="e.g., DMT123456" />
          </Form.Item>

          <Form.Item
            name="specialization"
            label="Specialization"
            rules={[{ required: true, message: 'Please enter specialization' }]}
          >
            <Input placeholder="e.g., Hair Loss Treatment" />
          </Form.Item>

          <Form.Item
            name="years_of_experience"
            label="Years of Experience"
            rules={[{ required: true, message: 'Please enter years of experience' }]}
          >
            <InputNumber 
              min={0} 
              max={50} 
              style={{ width: '100%' }} 
              placeholder="Enter years of experience"
            />
          </Form.Item>

          <Form.Item
            name="qualifications"
            label="Qualifications"
            rules={[{ required: true, message: 'Please enter qualifications' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="e.g., MD, Board Certified Dermatologist"
            />
          </Form.Item>

          <Form.Item
            name="consultation_fee"
            label="Consultation Fee"
            rules={[{ required: true, message: 'Please enter consultation fee' }]}
          >
            <InputNumber 
              min={0} 
              step={0.01}
              style={{ width: '100%' }} 
              placeholder="Enter consultation fee"
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '') as any}
            />
          </Form.Item>

          <Form.Item
            name="bio"
            label="Bio"
          >
            <TextArea 
              rows={4} 
              placeholder="Brief description about the dermatologist"
            />
          </Form.Item>
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

export default DermatologistModal;