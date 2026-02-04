import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginAdmin from "./pages/auth/LoginAdmin.jsx";
import AdminDashboard from "./pages/home/AdminDashboard.jsx";
import UsersPage from "./pages/home/UserPage.jsx";
import Analytics from "./pages/admin/Analytics.jsx";
import CreateUser from "./pages/home/createUser.jsx";
import UpdateUser from "./pages/home/updateUser.jsx";
import Main from "./pages/Main.jsx";
import Product from "./pages/admin/Product.jsx";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginAdmin />} />

      {/* Protected routes wrapped with ProtectedRoute */}
      <Route
        element={
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/update-user/:id" element={<UpdateUser />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/products" element={<Product />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
