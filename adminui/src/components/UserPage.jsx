import React, { useEffect, useState } from "react";

const UserPage = () => {
    const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:6969/users") // backend endpoint
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading users...</p>;
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        {users.length === 0 && <p>No users found.</p>}
        {users.map((user) => (
          <div key={user.id} className="border-b last:border-b-0 py-2">
            <p className="font-semibold">{user.name}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserPage