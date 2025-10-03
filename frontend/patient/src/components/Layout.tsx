import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { getMe } from '../store/slices/authSlice';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const dispatch = useDispatch<AppDispatch>();
  // const navigate = useNavigate(); // TODO: Will be used for navigation logic
  // const location = useLocation(); // TODO: Will be used for route-based logic
  const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Only call getMe if we have a token, are authenticated, not already loading, and haven't loaded user data yet
    const token = localStorage.getItem('token');
    if (token && isAuthenticated && !loading && !user) {
      dispatch(getMe());
    }
  }, [dispatch, isAuthenticated, loading, user]); // Include necessary dependencies but with guards

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
