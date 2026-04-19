import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ProductCard = ({ item, isAdded = false }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (item?.productImage) {
      setImageUrl(item.productImage);
    }
  }, [item]);

  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {isAdded && (
          <View style={styles.badge}>
            <MaterialCommunityIcons
              name="check-circle"
              size={20}
              color="#00CC99"
            />
          </View>
        )}
      </View>
      <Text style={styles.productName} numberOfLines={2}>
        {item.productName}
      </Text>
      <Text style={styles.productType}>{item.productType}</Text>
      {item.routine && (
        <View style={styles.routinePill}>
          <Text style={styles.routinePillText}>{item.routine}</Text>
        </View>
      )}
      {item.score != null && (
        <Text style={styles.productScore}>Score: {item.score}</Text>
      )}
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    width: 130,
    marginRight: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 6,
  },
  image: {
    width: "100%",
    height: 90,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "white",
    borderRadius: 10,
  },
  productName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
  },
  productType: { fontSize: 11, color: "#888", marginBottom: 2 },
  productScore: { fontSize: 11, color: "#00CC99", fontWeight: "600" },
  routinePill: {
    backgroundColor: "#e8f8f3",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginBottom: 2,
  },
  routinePillText: { fontSize: 10, color: "#00CC99", fontWeight: "600" },
});
