// Generated via prompt: prompts/patient_antd_common_components_v1.md
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
    <div className="mb-6">
      <div className="flex justify-between items-start">
        <div>
          <Title level={2} className="!mb-2">
            {title}
          </Title>
          {description && (
            <Text type="secondary" className="text-sm">
              {description}
            </Text>
          )}
        </div>
        {extra && <div>{extra}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
