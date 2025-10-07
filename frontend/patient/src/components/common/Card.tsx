// Generated via prompt: prompts/patient_antd_common_components_v1.md
import React from 'react';
import { Card as AntCard, CardProps } from 'antd';

interface CustomCardProps extends CardProps {
  title?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

const Card: React.FC<CustomCardProps> = ({
  title,
  extra,
  children,
  className = '',
  loading = false,
  ...cardProps
}) => {
  return (
    <AntCard
      title={title}
      extra={extra}
      loading={loading}
      className={`shadow-sm ${className}`}
      {...cardProps}
    >
      {children}
    </AntCard>
  );
};

export default Card;
