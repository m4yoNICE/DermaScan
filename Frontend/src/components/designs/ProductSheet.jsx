import React, { useRef, useMemo, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetFooter,
} from "@gorhom/bottom-sheet";
import Api from "@/services/Api";

const ProductSheet = ({ product, isVisible, onClose, onAdd }) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["85%"], []);

  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isVisible]);

  const imageUrl = product?.productImage
    ? Api.getProductImage(product.productImage)
    : null;

  // 1. Define the Footer separately using BottomSheetFooter
  const renderFooter = useCallback(
    (props) => (
      <BottomSheetFooter {...props} bottomInset={0}>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              onAdd(product);
              onClose();
            }}
          >
            <Text style={styles.addButtonText}>Add to My Routine</Text>
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </BottomSheetFooter>
    ),
    [product, onAdd, onClose],
  );

  const renderBackdrop = (props) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      pressBehavior="close"
    />
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      footerComponent={renderFooter} // 2. Attach the footer here
      handleIndicatorStyle={{ backgroundColor: "#ccc", width: 40 }}
    >
      <View style={styles.header}>
        <Text style={styles.categoryText}>{product?.productType}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeCircle}>
          <MaterialCommunityIcons name="close" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.productImg}
            resizeMode="contain"
          />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <Text style={styles.productName}>{product?.productName}</Text>
            {product?.dermaTested && (
              <MaterialCommunityIcons
                name="shield-check"
                size={24}
                color="#00CC99"
              />
            )}
          </View>
          <Text style={styles.brandName}>
            {product?.locality || "Dermatological Grade"}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product?.description}</Text>
          <Text style={styles.sectionTitle}>Key Ingredients</Text>
          <Text style={styles.ingredients}>{product?.ingredient}</Text>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default ProductSheet;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00CC99",
    textTransform: "uppercase",
  },
  closeCircle: { backgroundColor: "#f0f0f0", borderRadius: 20, padding: 5 },
  scrollContent: {
    paddingBottom: 120, // Keep this high so content clears the footer
  },
  imageWrapper: {
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  productImg: { width: "80%", height: "100%" },
  infoSection: { padding: 20 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  productName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    flex: 1,
    marginRight: 10,
  },
  brandName: { fontSize: 16, color: "#777", marginTop: 4 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    marginBottom: 20,
  },
  ingredients: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  addButton: {
    backgroundColor: "#00CC99",
    flexDirection: "row",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  addButtonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
