import React, { useEffect, useState } from "react";
import Api from "../../services/Api";
import CreateUser from "./createUser";
import UpdateUser from "./updateUser";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Temporary mock user data
    const fetchUsers = async () => {
      try {
        // Call your API function
        const res = await Api.fetchUsersAPI(); // make sure this sends the token in headers
        // Map users to your frontend format
        const mappedUsers = res.data.map((user) => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          profile_image:
            user.profile_image || "https://via.placeholder.com/150",
        }));
        setUsers(mappedUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await Api.deleteUserAPI(id); // DELETE /admin/auth/admin/users/:id
        alert("User deleted successfully"); // refresh the list
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || "Failed to delete user");
      }
    }
  };

  // if (loading) return <p>Loading users...</p>;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
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
                <h2 className="font-semibold text-lg text-gray-800">
                  {user.name}
                </h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>

              {/* Action buttons */}
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={() => navigate(`/dashboard/update-user/${user.id}`)}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPage;
