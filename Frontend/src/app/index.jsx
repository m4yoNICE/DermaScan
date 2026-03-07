import { Redirect } from "expo-router";
import { useContext, useEffect } from "react";
import { UserContext } from "src/contexts/UserContext";
import LoadingModal from "@/components/designs/LoadingModal";

const Index = () => {
  const { token, loading } = useContext(UserContext);

  if (loading) return <LoadingModal />;

  if (token) {
    return <Redirect href="/Home" />;
  } else {
    return <Redirect href="/LandingPage" />;
  }
};
export default Index;
