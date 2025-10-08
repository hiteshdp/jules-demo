// Generated via prompt: prompts/patient_antd_common_components_v1.md
import React from 'react';
import { Tag } from 'antd';

interface StatusTagProps {
  status: string;
  className?: string;
}

const StatusTag: React.FC<StatusTagProps> = ({ status, className }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'blue';
      case 'in_progress':
        return 'orange';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      case 'available':
        return 'green';
      case 'not available':
        return 'red';
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'default';
    }
  };

  return (
    <Tag color={getStatusColor(status)} className={className}>
      {status}
    </Tag>
  );
};

export default StatusTag;
