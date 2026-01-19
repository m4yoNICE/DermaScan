import { Link, vuseNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { useContext } from "react";

const SideBar = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AdminContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
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
          to="/dashboard/create-user"
          className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
        >
          Create User
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-red-500 hover:text-white transition-colors"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default SideBar;
