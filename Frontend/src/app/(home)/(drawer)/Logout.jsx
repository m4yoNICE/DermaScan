import { useContext, useEffect } from "react";
import { UserContext } from "src/contexts/UserContext";
import { router } from "expo-router";

const Logout = () => {
  const { logout } = useContext(UserContext);

  useEffect(() => {
    logout();
    router.replace("/");
  }, []);
  return null;
};
export default Logout;
