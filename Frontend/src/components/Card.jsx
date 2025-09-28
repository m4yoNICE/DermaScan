import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Card = ({ children }) => {
  return <View style={styles.card}>{children}</View>;
};

export default Card;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 20,
    elevation: 5,
    width: "90%",
    maxWidth: 400,
  },
});
