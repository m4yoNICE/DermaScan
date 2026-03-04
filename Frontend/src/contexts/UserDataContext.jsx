import { createContext, useContext, useState, useMemo, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "@/services/Api";

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("authToken").then((token) => {
      if (token) fetchUserData();
    });
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await Api.getUserByTokenAPI();
      setUserData(res.data);
    } catch (err) {
      console.error("UserData fetch error:", err);
    }
  };

  const value = useMemo(
    () => ({
      userData,
      setUserData,
      fetchUserData,
    }),
    [userData],
  );

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);
