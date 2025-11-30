import React, { createContext, useState, useEffect, useContext } from "react";
import Api from "../services/Api";

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
    }
    // else {
    //   // default admin for now
    //   const defaultAdmin = { username: "admin", role: "admin" };
    //   const defaultToken = "default-token";

    //   setAdmin(defaultAdmin);
    //   setToken(defaultToken);

    //   localStorage.setItem("admin", JSON.stringify(defaultAdmin));
    //   localStorage.setItem("adminToken", defaultToken);
    // }
    setLoading(false);
  }, []);

  const login = async (data) => {
    console.log("UserContext login called with:", data);
    const { token, user } = data;
    console.log("Setting token:", token);
    console.log("Setting user:", user);
    setToken(token);
    setAdmin(user);
    localStorage.setItem("admin", JSON.stringify(user));
    localStorage.setItem("authToken", token);
    console.log("Login complete - token set");
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
