import React from "react";
import { NavLink } from "react-router-dom";
import { SearchIcon, ShoppingBag, User, LayoutDashboard } from "lucide-react";

const Sidebar = () => {
  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: <SearchIcon size={20} />,
    },
    { path: "/products", label: "Products", icon: <ShoppingBag size={20} /> },
    { path: "/users", label: "Users", icon: <User size={20} /> },
  ];

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-[#00CC99] to-[#00CC99] text-white flex flex-col">
      {/* Header */}
      <div className="text-center border-b border-white/30">
        <div className="flex items-center justify-center mb-2">
          <h1 className="text-2xl font-bold">DermaScan+</h1>
        </div>
        <p className="text-sm tracking-widest font-semibold">A D M I N</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-all ${
                    isActive ? "bg-emerald-700/70" : "hover:bg-emerald-600/50"
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
