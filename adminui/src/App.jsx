import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginAdmin from "./Pages/auth/LoginAdmin";
import AdminDashboard from "./Pages/home/AdminDashboard";
import UserPage from "./Pages/home/UserPage";
import ProtectedRoutes from "./services/ProtectedRoutes";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginAdmin />} />

      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard/*" element={<AdminDashboard />} />
        <Route path="/users" element={<UserPage />} />
      </Route>
    </Routes>
  );
};

export default App;
