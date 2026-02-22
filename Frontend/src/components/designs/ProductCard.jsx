import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";

const ProductCard = ({ product }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      {/* Match Percentage Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{product.match} matched</Text>
      </View>

      {/* Product Image Placeholder */}
      <View style={styles.imageContainer}>
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholderImage} />
        )}
      </View>

      {/* Product Info */}
      <View style={styles.info}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.brandName}>{product.brand}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    width: 140,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#eee",
    // Shadow for iOS/Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badge: {
    backgroundColor: "#32CD32",
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  imageContainer: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: "80%",
    height: "80%",
  },
  placeholderImage: {
    width: "80%",
    height: "80%",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  info: {
    alignItems: "flex-start",
  },
  productName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
    height: 36,
  },
  brandName: {
    fontSize: 11,
    color: "#888",
    marginTop: 4,
  },
});
