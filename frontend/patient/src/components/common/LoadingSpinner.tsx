// Generated via prompt: prompts/patient_antd_common_components_v1.md
import React from 'react';
import { Spin } from 'antd';

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'default', 
  tip = 'Loading...', 
  className = 'flex items-center justify-center h-64' 
}) => {
  return (
    <div className={className}>
      <Spin size={size} tip={tip} />
    </div>
  );
};

export default LoadingSpinner;
