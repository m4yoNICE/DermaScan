import React from "react";
import { StyleSheet, View } from "react-native";

const DermaAlert = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E6FAF5",
    borderWidth: 1,
    borderColor: "#00CC99",
    padding: 15,
    borderRadius: 4,
    marginVertical: 10,
  },
  text: {
    color: "#007A5E",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    textAlign: "left",
  },
});

export default DermaAlert;

export const dermaAlertTextStyle = {
  color: "#007A5E",
  fontSize: 14,
  lineHeight: 20,
  fontWeight: "500",
};
