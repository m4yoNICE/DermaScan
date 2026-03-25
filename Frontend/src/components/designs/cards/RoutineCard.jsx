import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

const RoutineCard = ({
  schedule,
  time,
  products,
  isDone,
  isActive,
  onPress,
}) => {
  const isMorning = schedule === "Morning";

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.row}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.emoji}>{isMorning ? "🌅" : "🌙"}</Text>
        <View style={styles.info}>
          <Text style={styles.title}>{schedule} Routine</Text>
          <Text style={styles.sub}>
            {products.length} product{products.length !== 1 ? "s" : ""} · {time}
          </Text>
        </View>
        <View style={[styles.badge, isDone ? styles.done : styles.pending]}>
          <Text
            style={[
              styles.badgeText,
              isDone ? styles.doneText : styles.pendingText,
            ]}
          >
            {isDone ? "Done" : "Pending"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default RoutineCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  emoji: { fontSize: 28 },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: "700", color: "#1a1a1a" },
  sub: { fontSize: 12, color: "#999", marginTop: 2 },
  badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  done: { backgroundColor: "#e6faf5" },
  pending: { backgroundColor: "#fff3e0" },
  doneText: { color: "#00CC99", fontWeight: "700", fontSize: 12 },
  pendingText: { color: "#f59e0b", fontWeight: "700", fontSize: 12 },
});
