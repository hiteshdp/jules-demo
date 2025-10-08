import React from 'react';
import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd';

interface ButtonProps extends AntdButtonProps {
  // You can add custom props here if needed
}

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <AntdButton {...rest}>
      {children}
    </AntdButton>
  );
};

export default Button;
