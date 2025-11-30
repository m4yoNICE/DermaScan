import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginAdmin from './pages/auth/LoginAdmin.jsx';
import AdminDashboard from './pages/home/AdminDashboard.jsx';
import UsersPage from './pages/home/UserPage.jsx';
import Analytics from './pages/analytics';
import CreateUser from './pages/home/createUser.jsx';
import UpdateUser from './pages/home/updateUser.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginAdmin />} />
      <Route path="/dashboard/*" element={<AdminDashboard />} /> {/* Nested SPA */}

      <Route path="/users" element={<UsersPage />} />
      <Route path="/create-user" element={< CreateUser />} />
      <Route path="/update-user" element={< UpdateUser />} />
      <Route path="/dashboard/analytics" element={< Analytics />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
