// Generated via prompt: prompts/patient_antd_common_components_v1.md
import React from 'react';
import { Button as AntButton, ButtonProps } from 'antd';

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<CustomButtonProps> = ({
  children,
  className = '',
  ...buttonProps
}) => {
  return (
    <AntButton
      className={className}
      {...buttonProps}
    >
      {children}
    </AntButton>
  );
};

export default Button;
