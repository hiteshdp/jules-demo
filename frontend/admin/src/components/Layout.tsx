// Generated via prompt: prompts/antd_admin_full_conversion_v1.md
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Layout as AntLayout, Spin } from 'antd';
import Sidebar from './Sidebar';
import Header from './Header';

const { Content } = AntLayout;

const Layout = () => {
  const { loading } = useSelector((state: RootState) => state.auth);

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

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <AntLayout>
        <Header />
        <Content style={{ padding: '24px' }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
