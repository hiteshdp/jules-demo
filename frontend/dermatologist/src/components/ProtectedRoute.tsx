import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { getMe } from '../store/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, user } = useSelector((state: RootState) => state.auth);
  const token = localStorage.getItem('dermatologist_token');

  // On refresh: if we have a token but no user yet, fetch current user
  useEffect(() => {
    if (token && !user && !loading) {
      dispatch(getMe());
    }
  }, [dispatch, token, user, loading]);

  // If no token, send to login immediately
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // While restoring session or loading auth, show spinner
  if (loading || (token && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
