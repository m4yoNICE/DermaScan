import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { router } from "expo-router";
import { setLogoutCallback } from "src/utils/logoutReference";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("authToken");
        const storedUser = await AsyncStorage.getItem("user");

        if (storedToken) {
          const decoded = jwtDecode(storedToken);
          const now = Date.now() / 1000;
          if (decoded.exp && decoded.exp < now) {
            // if expired, clear storage
            await AsyncStorage.removeItem("authToken");
            await AsyncStorage.removeItem("user");
          } else if (storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (err) {
        console.log("Auth load error:", err);
      }
      setLoading(false);
    };
    loadData();
  }, []);
  //save login result
  const login = async (data) => {
    console.log("UserContext login called with:", data);
    const { token, user } = data;
    console.log("Setting token:", token);
    console.log("Setting user:", user);
    setToken(token);
    setUser(user);
    await AsyncStorage.setItem("authToken", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));
    console.log("Login complete - token set");
  };
  //clear everything here
  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("user");
    router.push("/");
  };
  useEffect(() => {
    setLogoutCallback(logout);
  }, []);
  const value = useMemo(
    () => ({ user, token, loading, login, logout }),
    [user, token, loading],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
