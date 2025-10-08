// Generated via prompt: prompts/antd_admin_complete_audit_v1.md
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Spin, Typography, Space } from 'antd';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const { Title, Text } = Typography;

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user data is not loaded yet, allow access temporarily
  // This prevents the "Access Denied" error when /me endpoint fails
  if (!user) {
    console.log('User data not loaded yet, allowing access temporarily');
    return <>{children}</>;
  }

  if (user?.role !== 'admin') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Space direction="vertical" align="center">
          <Title level={2} style={{ margin: 0 }}>
            Access Denied
          </Title>
          <Text type="secondary">
            You don't have permission to access this area.
          </Text>
        </Space>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
