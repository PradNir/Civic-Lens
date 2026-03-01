import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './pages/home';
import SubmitReport from './pages/SubmitReport';
import TrackReport from './pages/TrackReport';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

function ProtectedAdminRoute() {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const roles = user?.['https://civic-lens/roles'] || [];
  const hasAdminRole = Array.isArray(roles) && roles.includes('admin');
  const hasDepartmentClaim = Boolean(user?.['https://civic-lens/department']);

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" />;
  if (!hasAdminRole && !hasDepartmentClaim) return <Navigate to="/" />;
  return <Admin />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<SubmitReport />} />
        <Route path="/track" element={<TrackReport />} />
        <Route path="/admin" element={<ProtectedAdminRoute />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
