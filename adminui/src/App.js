import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginAdmin from './components/LoginAdmin';
import AdminDashboard from './components/AdminDashboard';
import UsersPage from './components/UserPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginAdmin />} />
      <Route path="/dashboard/*" element={<AdminDashboard />} /> {/* Nested SPA */}
      <Route path="/users" element={<UsersPage />} />  
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
