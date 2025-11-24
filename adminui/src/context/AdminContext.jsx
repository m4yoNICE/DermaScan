import React, { createContext, useState, useEffect, useContext } from "react";

export const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    const storedToken = localStorage.getItem("adminToken");

    if (storedAdmin && storedToken) {
      setAdmin(JSON.parse(storedAdmin));
      setToken(storedToken);
    } else {
      // default admin for now
      const defaultAdmin = { username: "admin", role: "admin" };
      const defaultToken = "default-token";

      setAdmin(defaultAdmin);
      setToken(defaultToken);

      localStorage.setItem("admin", JSON.stringify(defaultAdmin));
      localStorage.setItem("adminToken", defaultToken);
    }
    setLoading(false);
  }, []);

  const login = ({ admin: newAdmin, token: newToken }) => {
    setAdmin(newAdmin);
    setToken(newToken);
    localStorage.setItem("admin", JSON.stringify(newAdmin));
    localStorage.setItem("adminToken", newToken);
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
  };

  return (
    <AdminContext.Provider value={{ admin, token, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

// hook for convenience
export const useAdmin = () => useContext(AdminContext);