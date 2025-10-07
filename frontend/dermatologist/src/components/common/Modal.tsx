import React from 'react';
import { Modal as AntdModal, ModalProps as AntdModalProps, Button, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface ModalProps extends AntdModalProps {
  loading?: boolean;
  okText?: string;
  cancelText?: string;
  onOk: () => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({
  loading = false,
  okText = "OK",
  cancelText = "Cancel",
  onOk,
  onCancel,
  children,
  ...rest
}) => {
  return (
    <AntdModal
      {...rest}
      onCancel={onCancel}
      footer={
        <Space>
          <Button onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button type="primary" onClick={onOk} loading={loading}>
            {okText}
          </Button>
        </Space>
      }
    >
      {children}
    </AntdModal>
  );
};

export default Modal;
