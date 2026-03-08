import React from "react";
import { StyleSheet, Text, View } from "react-native";

const RoutineCard = ({ time, task }) => {
  return (
    <View style={styles.card}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{time}</Text>
      </View>

      {/* The teal vertical accent bar */}
      <View style={styles.separator} />

      <View style={styles.taskContainer}>
        <Text style={styles.taskText}>{task}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginVertical: 8,
    // Soft shadow to match the floating look
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  timeContainer: {
    width: 90,
    alignItems: "center",
  },
  timeText: {
    fontSize: 16,
    fontWeight: "900", // Extra bold as seen in mockup
    color: "#000",
  },
  separator: {
    width: 3,
    height: "100%", // Matches the full height of the text area
    backgroundColor: "#00CC99", // Branding teal
    borderRadius: 2,
  },
  taskContainer: {
    flex: 1,
    paddingLeft: 20,
  },
  taskText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
});

export default RoutineCard;
