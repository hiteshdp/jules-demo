import React from 'react';
import { Empty, Button, Typography, Space } from 'antd';

const { Text } = Typography;

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = "No Data",
  description = "No information available at the moment.",
  actionText,
  onAction,
}) => {
  return (
    <Empty
      image={icon || Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <Space direction="vertical">
          <Text strong>{title}</Text>
          <Text type="secondary">{description}</Text>
        </Space>
      }
    >
      {actionText && onAction && (
        <Button type="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Empty>
  );
};

export default EmptyState;
