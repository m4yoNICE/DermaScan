import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Api from "@/services/Api";

const HistoryCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Image
          source={{ uri: Api.getSkinImage(item.photoUrl) }}
          style={styles.avatar}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.dateText}>{item.createdAt}</Text>
          <Text style={styles.concernsText}>
            {item.condition ?? "Unknown"}
          </Text>
        </View>
      </View>

      <Text style={styles.selectedProductTitle}>Selected Product</Text>

      <View style={styles.productRow}>
        {item.products.map((product, index) => (
          <View key={index} style={styles.productColumn}>
            <Text style={styles.categoryLabel}>{product.productType}</Text>
            <Image
              source={{ uri: Api.getProductImage(product.productImage) }}
              style={styles.productImage}
            />
            <Text style={styles.productName} numberOfLines={3}>
              {product.productName}
            </Text>
          </View>
        ))}
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
    marginHorizontal: 20,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#eee",
  },
  titleContainer: {
    marginLeft: 15,
    flex: 1,
  },
  dateText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#4A7c6d",
  },
  concernsText: {
    fontSize: 13,
    color: "#8e8e93",
    fontStyle: "italic",
    marginTop: 2,
  },
  selectedProductTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  productRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  productColumn: {
    alignItems: "center",
    width: 90,
    marginRight: 15,
  },
  categoryLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  productImage: {
    width: 45,
    height: 70,
    resizeMode: "contain",
    marginBottom: 8,
  },
  productName: {
    fontSize: 9,
    textAlign: "center",
    color: "#444",
    lineHeight: 12,
  },
});

