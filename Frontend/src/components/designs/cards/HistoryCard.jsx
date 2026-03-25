import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProductCard from "./ProductCard";
import Button from "../Button";
import Api from "@/services/Api";
import { useHomeData } from "@/contexts/HomeDataContext";
import { ToastMessage } from "@/components/designs/feedback/ToastMessage";

const getConditionLabel = (item) => {
  if (item.status === "success") return item.condition ?? "Unknown Condition";
  if (item.status === "flagged") return "Flagged Content";
  return "Out of Bounds";
};

const HistoryCard = ({ item }) => {
  const { fetchRoutineProducts } = useHomeData();
  const [expanded, setExpanded] = useState(false);
  const [activating, setActivating] = useState(false);

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  const handleActivate = async () => {
    try {
      setActivating(true);
      await Api.activateLoadoutAPI(item.id);
      await fetchRoutineProducts();
      ToastMessage(
        "success",
        "Loadout Activated",
        "Your routine has been updated.",
      );
    } catch (err) {
      ToastMessage("error", "Error", err.message);
    } finally {
      setActivating(false);
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.header}
        onPress={handleToggle}
        activeOpacity={0.8}
      >
        {item.photoUrl ? (
          <Image
            source={{ uri: Api.getSkinImage(item.photoUrl) }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <MaterialCommunityIcons
              name="image-off-outline"
              size={28}
              color="#ccc"
            />
          </View>
        )}
        <View style={styles.headerText}>
          <Text style={styles.condition}>{getConditionLabel(item)}</Text>
          <Text style={styles.date}>{item.createdAt}</Text>
          <View
            style={[
              styles.statusBadge,
              item.status !== "success" && styles.statusBadgeError,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                item.status !== "success" && styles.statusTextError,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>
        <View style={styles.chevron}>
          <Text style={styles.chevronText}>{expanded ? "▲" : "▼"}</Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
          style={styles.body}
        >
          <View style={styles.divider} />
          <Text style={styles.sectionLabel}>Recommended Products</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.productRow}>
              {item.products.map((product, index) => (
                <ProductCard key={index} item={product} />
              ))}
            </View>
          </ScrollView>

          {item.status === "success" && (
            <Button
              title={activating ? "Activating..." : "Use this Routine"}
              onPress={handleActivate}
              disabled={activating}
              style={{ marginHorizontal: 16, marginTop: 12, marginBottom: 4 }}
            />
          )}
        </Animated.View>
      )}
    </View>
  );
};

export default HistoryCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
  },
  avatarPlaceholder: {
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  condition: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    textTransform: "capitalize",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#e6faf5",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 2,
  },
  statusBadgeError: {
    backgroundColor: "#ffe6e6",
  },
  statusTextError: {
    color: "#ff5252",
  },
  statusText: {
    fontSize: 11,
    color: "#00CC99",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  chevron: {
    paddingLeft: 8,
  },
  chevronText: {
    fontSize: 10,
    color: "#ccc",
  },
  body: {
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 16,
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  productRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
  },
});
