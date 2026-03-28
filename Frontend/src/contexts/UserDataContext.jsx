import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { UserContext } from "./UserContext";
import Api from "@/services/Api";

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const { token } = useContext(UserContext);
  const [userData, setUserData] = useState(null);

  const [userRoutine, setUserRoutine] = useState(null);

  useEffect(() => {
    if (!token) {
      setUserData(null);
      setUserRoutine(null);
    } else {
      fetchUserData();
    }
  }, [token]);

  const fetchUserData = async () => {
    if (!token) return;
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
