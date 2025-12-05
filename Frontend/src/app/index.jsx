import { Redirect } from "expo-router";
import { useContext, useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import { UserContext } from "src/contexts/UserContext";
import LandingPage from "./(landing)/LandingPage";
import LoadingModal from "@/components/LoadingModal";
const index = () => {
  const { token, loading } = useContext(UserContext);

  //it will run first after rendering, meaning itll check immediately if u has token or not
  useEffect(() => {
    console.log("Index re-render - token:", !!token, "loading:", loading);
  }, [token, loading]);

  if (loading) return <LoadingModal />;

  if (token) {
    return <Redirect href="/Home" />;
  } else {
    // return <Redirect href="/Login" />;
    return <LandingPage />;
  }
};
export default index;

const styles = StyleSheet.create({});
