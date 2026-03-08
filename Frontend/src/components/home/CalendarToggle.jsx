import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const TABS = ["Journals", "Routine", "Analysis"];

const CalendarToggle = ({ active, onChange }) => {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, active === tab && styles.activeTab]}
          onPress={() => onChange(tab)}
        >
          <Text style={[styles.label, active === tab && styles.activeLabel]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CalendarToggle;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "#00CC99",
  },
  label: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  activeLabel: {
    color: "#fff",
    fontWeight: "700",
  },
});
