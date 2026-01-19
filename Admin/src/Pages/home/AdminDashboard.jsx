import React from "react";
import { Routes, Route } from "react-router-dom";
import CreateUser from "./createUser";
import UpdateUser from "./updateUser";
import UserPage from "./UserPage";
import analytics from "../analytics";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <sidebar />

      <main className="flex-1 p-6 relative">
        {/* Nested Routes */}
        <Routes>
          <Route
            path=""
            element={
              <div>
                <h1 className="text-3xl font-bold mb-4">
                  Welcome to the Admin Dashboard
                </h1>
                {}
                {analytics()}
              </div>
            }
          />
          <Route path="users" element={<UserPage />} />
          <Route path="create-user" element={<CreateUser />}></Route>
          <Route path="update-user/:id" element={<UpdateUser />}></Route>
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
