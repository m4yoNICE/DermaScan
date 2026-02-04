import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="bg-[#EFF6F8] px-8 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome back, Glaisa Mae!
        </h1>

        <div className="relative" ref={menuRef}>
          <button onClick={() => setOpen(!open)}>
            <img
              src="https://i.pravatar.cc/150?img=47"
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover border border-gray-300"
            />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border">
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
