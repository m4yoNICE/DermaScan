import { createContext, useContext, useState, useMemo, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "@/services/Api";

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [userRoutine, setUserRoutine] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("authToken").then((token) => {
      if (token) fetchUserData();
    });
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await Api.getUserByTokenAPI();
      setUserData(res.data.user);
      setUserRoutine(res.data.routine ?? null);
    } catch (err) {
      console.error("UserData fetch error:", err);
    }
  };

  const value = useMemo(
    () => ({
      userData,
      setUserData,
      userRoutine,
      setUserRoutine,
      fetchUserData,
    }),
    [userData, userRoutine],
  );

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);
