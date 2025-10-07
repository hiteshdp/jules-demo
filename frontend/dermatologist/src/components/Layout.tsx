import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { getMe } from '../store/slices/authSlice';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check if we have a token and need to verify authentication
    const token = localStorage.getItem('token');
    if (token && !loading && !user) {
      dispatch(getMe());
    }
  }, [dispatch, loading, user]); // Remove isAuthenticated from dependencies to avoid loops

  useEffect(() => {
    // Align with patient app: redirect to login when not authenticated
    if (!user && !loading) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
