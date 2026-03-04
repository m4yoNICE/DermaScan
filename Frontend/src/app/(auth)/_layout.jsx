import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
const AuthLayout = () => {
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
};

export default AuthLayout;
