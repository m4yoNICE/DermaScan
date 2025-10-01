import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native-web";

const AuthLayout = () => {
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({});
