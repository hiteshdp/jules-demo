import React from 'react';
import { Card as AntdCard, CardProps as AntdCardProps, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface CardProps extends AntdCardProps {
  loading?: boolean;
}

const Card: React.FC<CardProps> = ({ loading = false, children, ...rest }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <AntdCard {...rest}>
      <Spin spinning={loading} indicator={antIcon}>
        {children}
      </Spin>
    </AntdCard>
  );
};

export default Card;
