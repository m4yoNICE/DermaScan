import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Redirect, router } from "expo-router";

const index = () => {
  return <Redirect href="/auth/Login" />;
};

export default index;

const styles = StyleSheet.create({});
