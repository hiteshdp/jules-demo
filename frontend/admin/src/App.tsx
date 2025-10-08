import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Dermatologists from './pages/Dermatologists';
import Appointments from './pages/Appointments';
import Products from './pages/Products';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* <Route path="/login" element={ !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} /> */}
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
           </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="dermatologists" element={<Dermatologists />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="products" element={<Products />} />
            <Route path="payments" element={<Payments />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
