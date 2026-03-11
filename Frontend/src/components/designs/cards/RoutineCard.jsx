import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  LayoutAnimation,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Button from "../Button";
import Api from "@/services/Api";

const RoutineCard = ({ schedule, time, products, isDone, onMarkDone }) => {
  const [expanded, setExpanded] = useState(false);
  const isMorning = schedule === "Morning";

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.header}
        onPress={handleToggle}
        activeOpacity={0.8}
      >
        <View style={styles.left}>
          <Text style={styles.emoji}>{isMorning ? "🌅" : "🌙"}</Text>
          <View>
            <Text style={styles.title}>{schedule} Routine</Text>
            <Text style={styles.sub}>
              {products.length} product{products.length !== 1 ? "s" : ""} ·{" "}
              {time}
            </Text>
          </View>
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

      {expanded && (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
          style={styles.body}
        >
          {products.map((p, i) => (
            <View key={i} style={styles.productRow}>
              <Image
                source={{ uri: Api.getProductImage(p.productImage) }}
                style={styles.productImg}
              />
              <View>
                <Text style={styles.productName}>{p.productName}</Text>
                <Text style={styles.productType}>{p.productType}</Text>
              </View>
            </View>
          ))}
          <Button
            title={isDone ? "Already Done ✓" : "Mark as Done"}
            onPress={onMarkDone}
            disabled={isDone}
            style={{ marginTop: 8 }}
          />
        </Animated.View>
      )}
    </View>
  );
};

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
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 12 },
  emoji: { fontSize: 28 },
  title: { fontSize: 15, fontWeight: "700", color: "#1a1a1a" },
  sub: { fontSize: 12, color: "#999", marginTop: 2 },
  badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  done: { backgroundColor: "#e6faf5" },
  pending: { backgroundColor: "#fff3e0" },
  doneText: { color: "#00CC99", fontWeight: "700", fontSize: 12 },
  pendingText: { color: "#f59e0b", fontWeight: "700", fontSize: 12 },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  productImg: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  productName: { fontSize: 14, fontWeight: "600", color: "#1a1a1a" },
  productType: { fontSize: 12, color: "#999", marginTop: 2 },
});

export default RoutineCard;
