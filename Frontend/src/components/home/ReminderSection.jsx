import React from "react";
import { StyleSheet, Text } from "react-native";
import { BottomSheetView } from "@gorhom/bottom-sheet";

const ReminderSection = ({ selectedDate }) => {
  return (
    <BottomSheetView style={styles.container}>
      <Text style={styles.placeholder}>Routine for {selectedDate}</Text>
    </BottomSheetView>
  );
};

export default ReminderSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  placeholder: {
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});
