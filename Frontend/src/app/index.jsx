import { Redirect } from "expo-router";
import { useContext, useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import { UserContext } from "src/contexts/UserContext";
import LandingPage from "./(landing)/LandingPage";
const index = () => {
  const { token, loading } = useContext(UserContext);

  useEffect(() => {
    console.log("Index re-render - token:", !!token, "loading:", loading);
  }, [token, loading]);

  if (loading) return <Text>Loading...</Text>;

  if (token) {
    return <Redirect href="/Home" />;
  } else {
    // return <Redirect href="/Login" />;
    return <LandingPage />;
  }
};
export default index;

const styles = StyleSheet.create({});
