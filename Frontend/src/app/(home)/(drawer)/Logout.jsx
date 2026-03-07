import { useEffect } from "react";
import { useUser } from "src/contexts/UserContext";

const Logout = () => {
  const { logout } = useUser();

  useEffect(() => {
    logout();
  }, []);
  return null;
};
export default Logout;
