import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Select, InputNumber, Row, Col } from 'antd';
import { Dermatologist } from '../types/dermatologist';
import { DermatologistPayload } from '../store/api/dermatologistAPI';

const { Option } = Select;

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: DermatologistPayload) => void;
    initialData?: Dermatologist | null;
    title?: string;
    submitting?: boolean;
}

const DermatologistModal: React.FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialData,
    title = 'Create Dermatologist',
    submitting,
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.setFieldsValue({
                    ...initialData,
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, initialData, form]);

    const handleFinish = (values: any) => {
        onSubmit(values);
    };

    return (
        <Modal
            title={title}
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" loading={submitting} onClick={() => form.submit()}>
                    {submitting ? 'Saving...' : 'Save'}
                </Button>,
            ]}
            destroyOnClose
            width={720}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="full_name"
                            label="Full Name"
                            rules={[{ required: true, message: "Please enter the dermatologist's full name" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Please enter an email' },
                                { type: 'email', message: 'Please enter a valid email' },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={initialData ? [] : [{ required: true, message: 'Please enter a password' }]}
                        >
                            <Input.Password placeholder={initialData ? 'Leave blank to keep current password' : ''} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="phone" label="Phone Number">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="specialization"
                            label="Specialization"
                            rules={[{ required: true, message: 'Please enter a specialization' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="experience_years"
                            label="Years of Experience"
                            rules={[{ required: true, message: 'Please enter years of experience' }]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="clinic_name" label="Clinic Name">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true, message: 'Please select a status' }]}
                        >
                            <Select>
                                <Option value="active">Active</Option>
                                <Option value="inactive">Inactive</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default DermatologistModal;