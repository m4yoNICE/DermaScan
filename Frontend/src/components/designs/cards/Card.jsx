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
    width: "90%",
    maxWidth: 400,
    elevation: 5,
    //ios
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
});
