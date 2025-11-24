import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginAdmin from './pages/LoginAdmin';
import AdminDashboard from './pages/AdminDashboard';
import UsersPage from './pages/UserPage';
import analytics from './pages/analytics';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginAdmin />} />
      <Route path="/dashboard/*" element={<AdminDashboard />} /> {/* Nested SPA */}
      <Route path="/users" element={<UsersPage />} />
      <Route path="/dashboard/analytics" element={analytics()} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
