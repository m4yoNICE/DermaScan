// components/HamburgerButton.jsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const HamburgerButton = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        // For now, just log or navigate to a Drawer/Settings screen
        console.log("Hamburger pressed");
        // router.push("/settings"); // example
      }}
    >
      <Text style={styles.icon}>☰</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1000,
    padding: 8,
  },
  icon: {
    fontSize: 28,
    color: "black",
  },
});

export default HamburgerButton;
