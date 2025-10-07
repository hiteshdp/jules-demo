// Generated via prompt: prompts/patient_antd_common_components_v1.md
import React from 'react';
import { Empty, Button } from 'antd';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = 'No data',
  description,
  actionText,
  onAction,
  className = 'text-center py-12'
}) => {
  return (
    <div className={className}>
      <Empty
        image={icon}
        imageStyle={{ height: 60 }}
        description={
          <div>
            <div className="text-lg font-medium text-gray-900 mb-2">{title}</div>
            {description && (
              <div className="text-sm text-gray-500 mb-4">{description}</div>
            )}
            {actionText && onAction && (
              <Button type="primary" onClick={onAction}>
                {actionText}
              </Button>
            )}
          </div>
        }
      />
    </div>
  );
};

export default EmptyState;
