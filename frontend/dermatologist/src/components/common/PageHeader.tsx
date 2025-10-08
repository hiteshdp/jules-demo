import React from 'react';
import { Typography, Space } from 'antd';

const { Title, Text } = Typography;

interface PageHeaderProps {
  title: string;
  description?: string;
  extra?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, extra }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Space direction="vertical" size={0}>
        <Title level={2} className="!mb-0">{title}</Title>
        {description && <Text type="secondary">{description}</Text>}
      </Space>
      {extra && <div>{extra}</div>}
    </div>
  );
};

export default PageHeader;
