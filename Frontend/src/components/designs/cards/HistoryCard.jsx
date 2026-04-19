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
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import ProductCard from "./ProductCard";
import Button from "../Button";
import Api from "@/services/Api";
import { useHomeData } from "@/contexts/HomeDataContext";
import { ToastMessage } from "@/components/designs/feedback/ToastMessage";
import { formatConditionName } from "@/utils/formatConditionName";

const HistoryCard = ({ item }) => {
  const { fetchRoutineProducts, deleteAnalysisLog } = useHomeData();
  const [expanded, setExpanded] = useState(false);
  const [activating, setActivating] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteAnalysisLog(item.id);
      ToastMessage("success", "Deleted", "History entry removed.");
    } catch (err) {
      ToastMessage("error", "Delete failed", err.message);
    } finally {
      setDeleting(false);
    }
  };

  const isSuccess = item.status === "success";

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.header}
        onPress={handleToggle}
        activeOpacity={0.8}
      >
        {item.photoUrl ? (
          <Image source={{ uri: item.photoUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <MaterialCommunityIcons
              name="image-off-outline"
              size={26}
              color="#bbb"
            />
          </View>
        )}
        <View style={styles.headerText}>
          <Text style={styles.condition} numberOfLines={1}>
            {formatConditionName(item.condition, item.status)}
          </Text>
          <Text style={styles.date}>{item.createdAt}</Text>
          <View
            style={[styles.statusBadge, !isSuccess && styles.statusBadgeError]}
          >
            <View
              style={[styles.badgeDot, !isSuccess && styles.badgeDotError]}
            />
            <Text
              style={[styles.statusText, !isSuccess && styles.statusTextError]}
            >
              {item.status}
            </Text>
          </View>
        </View>
        <Animated.View
          style={{ transform: [{ rotate: expanded ? "180deg" : "0deg" }] }}
        >
          <Feather name="chevron-down" size={16} color="#bbb" />
        </Animated.View>
      </TouchableOpacity>

      {expanded && (
        <Animated.View
          entering={FadeIn.duration(250)}
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

          <View style={styles.buttonRow}>
            {isSuccess && (
              <Button
                title={activating ? "Activating..." : "Use this Routine"}
                onPress={handleActivate}
                disabled={activating}
                style={styles.activateBtn}
              />
            )}
            <TouchableOpacity
              style={[styles.deleteBtn, !isSuccess && styles.deleteBtnFull]}
              onPress={handleDelete}
              disabled={deleting}
            >
              <Feather name="trash-2" size={18} color="#888" />
            </TouchableOpacity>
          </View>
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
    marginVertical: 6,
    borderWidth: 0.5,
    borderColor: "#e8e8e8",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 14,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: "#f0f0f0",
  },
  avatarPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  headerText: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  condition: {
    fontSize: 15,
    fontWeight: "400",
    color: "#1a1a1a",
  },
  date: {
    fontSize: 12,
    color: "#aaa",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#e1f5ee",
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
    marginTop: 2,
    gap: 5,
  },
  statusBadgeError: {
    backgroundColor: "#fcebeb",
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#1d9e75",
  },
  badgeDotError: {
    backgroundColor: "#e24b4a",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "400",
    color: "#0f6e56",
    textTransform: "capitalize",
  },
  statusTextError: {
    color: "#a32d2d",
  },
  body: {
    paddingBottom: 16,
  },
  divider: {
    height: 0.5,
    backgroundColor: "#ebebeb",
    marginHorizontal: 16,
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "400",
    color: "#aaa",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  productRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
  },
  buttonRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    gap: 8,
    height: 49,
  },
  activateBtn: {
    flex: 1,
    marginTop: 0,
    marginBottom: 0,
  },
  deleteBtn: {
    width: 48,
    backgroundColor: "#f5f5f5",
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBtnFull: {
    flex: 1,
  },
});
