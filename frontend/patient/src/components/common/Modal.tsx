// Generated via prompt: prompts/patient_antd_common_components_v1.md
import React from 'react';
import { Modal as AntModal, Button, Space } from 'antd';

interface ModalProps {
  title: string;
  open: boolean;
  onCancel: () => void;
  onOk?: () => void;
  children: React.ReactNode;
  okText?: string;
  cancelText?: string;
  loading?: boolean;
  width?: number | string;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  title,
  open,
  onCancel,
  onOk,
  children,
  okText = 'OK',
  cancelText = 'Cancel',
  loading = false,
  width = 520,
  footer
}) => {
  const defaultFooter = (
    <Space>
      <Button onClick={onCancel}>
        {cancelText}
      </Button>
      {onOk && (
        <Button type="primary" onClick={onOk} loading={loading}>
          {okText}
        </Button>
      )}
    </Space>
  );

  return (
    <AntModal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      width={width}
      footer={footer !== undefined ? footer : defaultFooter}
      destroyOnClose
    >
      {children}
    </AntModal>
  );
};

export default Modal;
