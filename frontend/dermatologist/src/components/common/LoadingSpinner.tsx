import React from 'react';
import { Spin, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingSpinnerProps {
  tip?: string;
  size?: 'small' | 'default' | 'large';
  fullscreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ tip = "Loading...", size = "large", fullscreen = false }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: size === 'small' ? 24 : size === 'large' ? 48 : 32 }} spin />;

  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <Spin indicator={antIcon} tip={tip} size={size} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <Spin indicator={antIcon} size={size} />
      {tip && <div className="ml-2 text-gray-600">{tip}</div>}
    </div>
  );
};

export default LoadingSpinner;
