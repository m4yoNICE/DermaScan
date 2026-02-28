import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import Api from "@/services/Api";

const { width } = Dimensions.get("window");

const HistoryCard = ({ date, conditions, products }) => {
  return (
    <View style={styles.card}>
      <View style={styles.topSection}>
        {/* User Skin Snapshot */}
        <Image
          source={{ uri: Api.getSkinImage(products[0]?.analysisImage) }} // Logic for scan image
          style={styles.skinSnapshot}
        />

        <View style={styles.headerText}>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.conditionText}>{conditions}</Text>
        </View>
      </View>

      <View style={styles.productSection}>
        <Text style={styles.label}>Selected Product</Text>

        <View style={styles.productList}>
          {products.map((product, index) => (
            <View key={index} style={styles.productItem}>
              <Text style={styles.productType}>{product.productType}</Text>
              <Image
                source={{ uri: Api.getProductImage(product.productImage) }}
                style={styles.productImage}
                resizeMode="contain"
              />
              <Text style={styles.productName} numberOfLines={2}>
                {product.productName}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default HistoryCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
    alignSelf: "center",
    marginBottom: 20,
    // Elevation/Shadow
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  skinSnapshot: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f0f0f0",
  },
  headerText: {
    marginLeft: 15,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e7d64", // Using your primary dark green
  },
  conditionText: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
    marginTop: 2,
  },
  productSection: {
    marginTop: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  productList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  productItem: {
    alignItems: "center",
    width: 80,
  },
  productType: {
    fontSize: 11,
    color: "#666",
    marginBottom: 5,
  },
  productImage: {
    width: 40,
    height: 60,
    marginBottom: 5,
  },
  productName: {
    fontSize: 9,
    textAlign: "center",
    color: "#444",
    lineHeight: 11,
  },
});
