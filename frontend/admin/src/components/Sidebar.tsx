// Generated via prompt: prompts/antd_admin_full_conversion_v1.md
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  ShoppingOutlined,
  DollarOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { Title } = Typography;

const navigation = [
  { key: '/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
  { key: '/patients', label: 'Patients', icon: <TeamOutlined /> },
  { key: '/dermatologists', label: 'Dermatologists', icon: <UserOutlined /> },
  { key: '/appointments', label: 'Appointments', icon: <CalendarOutlined /> },
  { key: '/products', label: 'Products', icon: <ShoppingOutlined /> },
  { key: '/payments', label: 'Payments', icon: <DollarOutlined /> },
  { key: '/settings', label: 'Settings', icon: <SettingOutlined /> },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Sider
      width={256}
      style={{
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
      }}
    >
      <div style={{ 
        padding: '24px 16px 16px', 
        borderBottom: '1px solid #f0f0f0',
        textAlign: 'center' 
      }}>
        <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
          Admin Panel
        </Title>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={navigation}
        onClick={handleMenuClick}
        style={{
          border: 'none',
          background: '#fff',
        }}
      />
    </Sider>
  );
};

export default Sidebar;
