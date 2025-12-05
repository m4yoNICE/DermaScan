import React from 'react'
import { Link, Routes, Route } from 'react-router-dom';
import CreateUser from './createUser';
import UpdateUser from './updateUser';
import UserPage from './UserPage';
import analytics from '../analytics';

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
            <Link 
          to ="/dashboard/create-user"
          className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
          >
            Create User
          </Link>
          <Link
          to="/"
          className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-red-500 hover:text-white transition-colors"
        >
          Logout
        </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 relative">
        

        {/* Nested Routes */}
        <Routes>
          <Route
            path=""
            element={
              <div>
                <h1 className="text-3xl font-bold mb-4">Welcome to the Admin Dashboard</h1>
                {}{analytics()}
              </div>
            }
          />
          <Route path="users" element={<UserPage />} />
          <Route path="create-user" element={<CreateUser />}></Route>
          <Route path="update-user/:id" element={<UpdateUser />}></Route>
        </Routes>
      </main>
    </div>
  )
}

export default AdminDashboard