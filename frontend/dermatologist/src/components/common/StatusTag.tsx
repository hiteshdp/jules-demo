import React from 'react';
import { Tag } from 'antd';

interface StatusTagProps {
  status: string;
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const getStatusColor = (s: string) => {
    switch (s.toLowerCase()) {
      case 'scheduled':
        return 'blue';
      case 'in_progress':
        return 'processing';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'high':
        return 'red';
      case 'medium':
        return 'warning';
      case 'low':
        return 'green';
      case 'available today':
        return 'green';
      case 'available':
        return 'blue';
      case 'not available':
        return 'red';
      default:
        return 'default';
    }
  };

  const formattedStatus = status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

  return <Tag color={getStatusColor(status)}>{formattedStatus}</Tag>;
};

export default StatusTag;
