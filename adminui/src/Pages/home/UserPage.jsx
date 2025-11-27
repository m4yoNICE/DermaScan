import React, { useEffect, useState } from "react";
import API from "../../services/Api";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if(!token) {
      return;
    }

    // Temporary mock user data
    const fetchUsers = async () => {
      try {
        
        const res = await API.fetchSkinUsersAPI();
        console.log("API response:", res);
        setUsers(response.data || response);

        console.log("Fetched users:", res.data || res);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      fetchUsers();
    }
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {users.length === 0 ? (
        <p className="text-gray-500">Loading users...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-shadow"
        >
          {/* Profile picture */}
          <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-gray-200">
            <img
              src={user.profile_image}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* User info */}
          <div className="text-center">
            <h2 className="font-semibold text-lg text-gray-800">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-3 mt-4">
            <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
              View
            </button>
            <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
      )}
    </div>
  )
}

export default UserPage