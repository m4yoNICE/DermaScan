import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons as Icon } from "@expo/vector-icons";

const Accordion = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.header, expanded && styles.headerExpanded]}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={[styles.title, expanded && styles.titleExpanded]}>
          {title}
        </Text>
        <Icon
          name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={30}
          color={expanded ? "#00C49A" : "#333"}
        />
      </TouchableOpacity>

      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
  },
  headerExpanded: {
    borderTopWidth: 4,
    borderTopColor: "#00C49A",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333333",
  },
  titleExpanded: {
    color: "#00C49A",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default Accordion;
