import React from "react";
import { StyleSheet, View } from "react-native";

// different codings for different analysis results
const variants = {
  default: {
    backgroundColor: "#E6FAF5",
    borderColor: "#00CC99",
    textColor: "#007A5E",
  },
  warning: {
    backgroundColor: "#FFF8E6",
    borderColor: "#F5A623",
    textColor: "#8a6000",
  },
  danger: {
    backgroundColor: "#FDECEA",
    borderColor: "#E53935",
    textColor: "#B71C1C",
  },
};

const DermaAlert = ({ children, variant = "default" }) => {
  const v = variants[variant] ?? variants.default;
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: v.backgroundColor, borderColor: v.borderColor },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 4,
    marginVertical: 10,
  },
});

export default DermaAlert;

export const getDermaAlertTextStyle = (variant = "default") => {
  const v = variants[variant] ?? variants.default;
  return {
    color: v.textColor,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  };
};

// keep backward compat
export const dermaAlertTextStyle = {
  color: "#007A5E",
  fontSize: 14,
  lineHeight: 20,
  fontWeight: "500",
};