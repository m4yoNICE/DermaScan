import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDefaultAdmin = async () => {
      try {
        // Try to load from storage first
        const storedAdmin = await AsyncStorage.getItem("admin");
        const storedToken = await AsyncStorage.getItem("adminToken");

        if (storedAdmin && storedToken) {
          setAdmin(JSON.parse(storedAdmin));
          setToken(storedToken);
        } else {
          // Default admin
          const defaultAdmin = { username: "admin", role: "admin" };
          const defaultToken = "default-token";

          setAdmin(defaultAdmin);
          setToken(defaultToken);

          await AsyncStorage.setItem("admin", JSON.stringify(defaultAdmin));
          await AsyncStorage.setItem("adminToken", defaultToken);
        }
      } catch (err) {
        console.log("AdminContext error:", err);
      }
      setLoading(false);
    };

    loadDefaultAdmin();
  }, []);

  // Logout (clears default admin if needed)
  const logout = async () => {
    setAdmin(null);
    setToken(null);
    await AsyncStorage.removeItem("admin");
    await AsyncStorage.removeItem("adminToken");
    console.log("Admin logged out (default admin cleared)");
  };

  return (
    <AdminContext.Provider value={{ admin, token, loading, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

// Hook for easy use
export const useAdmin = () => useContext(AdminContext);