import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../../services/Api"; // make sure this points to your API helper

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role_id: 2, // default to User
    birthdate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await Api.getUserById(id);
        const user = res.data.user; // <- make sure to grab `user` from backend response

        if (!user) {
          setError("User not found");
          return;
        }

        setFormData({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          password: "", // empty for security
          role_id: user.role_id ?? 2,
          birthdate: user.birthdate || "",
        });
      } catch (err) {
        console.error("Fetch user error:", err);
        setError("Failed to fetch user data");
      }
    };

    fetchUser();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ?? "",
    }));
  };

  // Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await Api.editUserAPI(id, formData);
      alert("User updated successfully!");
      navigate("/dashboard/users");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Update User</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name || ""}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        />

        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name || ""}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email || ""}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        />

        <input
          type="password"
          name="password"
          placeholder="Password (leave empty to keep same)"
          value={formData.password || ""}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        />

        <input
          type="date"
          name="birthdate"
          value={formData.birthdate || ""}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        />

        <select
          name="role_id"
          value={formData.role_id ?? 2}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        >
          <option value={1}>Admin</option>
          <option value={2}>User</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          {loading ? "Updating..." : "Update User"}
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
