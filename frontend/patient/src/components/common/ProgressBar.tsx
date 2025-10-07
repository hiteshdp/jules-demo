// Generated via prompt: prompts/patient_antd_common_components_v1.md
import React from 'react';
import { Progress } from 'antd';

interface ProgressBarProps {
  current: number;
  total: number;
  showText?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  showText = true,
  className = ''
}) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Question {current} of {total}</span>
        <span>{percentage}% Complete</span>
      </div>
      <Progress
        percent={percentage}
        showInfo={showText}
        strokeColor="#1890ff"
        trailColor="#f0f0f0"
      />
    </div>
  );
};

export default ProgressBar;
