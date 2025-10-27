import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { Redirect, router } from "expo-router";
import { UserContext } from "src/contexts/UserContext";
const index = () => {
  const { token, loading } = useContext(UserContext);

  useEffect(() => {
    console.log("Index re-render - token:", !!token, "loading:", loading);
  }, [token, loading]);

  if (loading) return <Text>Loading...</Text>;

  if (token) {
    return <Redirect href="/Home" />;
  } else {
    return <Redirect href="/Login" />;
    // return <QuestModal />;
  }
};
export default index;

const styles = StyleSheet.create({});
