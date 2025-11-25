import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import LoginAdmin from "../auth/LoginAdmin";
import UserPage from "./UserPage";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <div className="font-bold text-xl mb-6 border-b pb-2">Admin Panel</div>
        <nav className="space-y-4">
          <Link
            to="/dashboard"
            className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/dashboard/users"
            className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
          >
            Users
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 relative">
        {/* Logout button */}
        <Link
          to="/"
          className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </Link>

        {/* Nested Routes */}
        <Routes>
          <Route
            path=""
            element={
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome to Admin Dashboard
                </h1>
                <p className="text-gray-500 mt-2">
                  This is your main dashboard.
                </p>
              </div>
            }
          />
          <Route path="users" element={<UserPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
