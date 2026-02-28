import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useProduct } from "@/contexts/ProductContext";
import { useAnalysis } from "@/contexts/AnalysisContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "@/components/designs/Button";
import LoadingModal from "@/components/designs/LoadingModal";
import { ToastMessage } from "@/components/designs/ToastMessage";
import Api from "@/services/Api";
import { router } from "expo-router";

const Checkout = () => {
  const { product, setProduct } = useProduct(); // Added setProduct for the "Remove" design
  const { analysis, setAnalysis, setRecommendation } = useAnalysis();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveRecommendation = async () => {
    try {
      setIsLoading(true);
      const productIds = product.map((item) => item.id);
      const saveData = { analysisId: analysis.id, productIds };
      await Api.saveRecommendationApi(saveData);
      setProduct([]);
      setRecommendation([]);
      setAnalysis(null);
      ToastMessage(
        "success",
        "Routine Saved",
        "Your recommendation has been stored.",
      );
      router.push("/Home");
    } catch (err) {
      ToastMessage("error", "Error", err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRemoveProduct = (index) => {
    const updated = [...product];
    updated.splice(index, 1);
    setProduct(updated);
  };

  return (
    <View style={styles.container}>
      <LoadingModal visible={isLoading} />

      <View style={styles.headerSection}>
        <Text style={styles.title}>My Routine</Text>
        <Text style={styles.count}>{product.length} Items Selected</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollList}
        showsVerticalScrollIndicator={false}
      >
        {product.map((item, index) => (
          <View key={index} style={styles.productRow}>
            <Image
              source={{ uri: Api.getProductImage(item.productImage) }}
              style={styles.thumbnail}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.productName}
              </Text>
              <Text style={styles.itemType}>{item.productType}</Text>
            </View>
            <TouchableOpacity
              onPress={handleRemoveProduct}
              style={styles.removeBtn}
            >
              <MaterialCommunityIcons
                name="minus-circle-outline"
                size={24}
                color="#FF5252"
              />
            </TouchableOpacity>
          </View>
        ))}

        {product.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="basket-outline"
              size={60}
              color="#ccc"
            />
            <Text style={styles.emptyText}>Your routine is empty</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Save Recommendation"
          onPress={handleSaveRecommendation}
          disabled={product.length === 0}
        />
      </View>
    </View>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: { fontSize: 28, fontWeight: "800", color: "#333" },
  count: { fontSize: 14, color: "#00CC99", fontWeight: "600", marginTop: 4 },
  scrollList: { padding: 20, paddingBottom: 100 },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    // Minimal shadow for kiosk look
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  itemDetails: { flex: 1, marginLeft: 15 },
  itemName: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
  itemType: { fontSize: 13, color: "#888", marginTop: 2 },
  removeBtn: { padding: 5 },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  emptyState: { alignItems: "center", marginTop: 60 },
  emptyText: { color: "#999", marginTop: 10, fontSize: 16 },
});
