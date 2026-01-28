import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginAdmin from "./pages/auth/LoginAdmin.jsx";
import AdminDashboard from "./pages/home/AdminDashboard.jsx";
import UsersPage from "./pages/home/UserPage.jsx";
import Analytics from "./pages/admin/Analytics.jsx";
import CreateUser from "./pages/home/createUser.jsx";
import UpdateUser from "./pages/home/updateUser.jsx";
import Main from "./pages/Main.jsx";
import Product from "./pages/admin/Product.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginAdmin />} />
      
      {/* Nest all authenticated routes inside Main */}
      <Route element={<Main />}>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/update-user/:id" element={<UpdateUser />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/products" element={<Product />}/>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;