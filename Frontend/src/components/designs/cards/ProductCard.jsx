import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Api from "@/services/Api";
const ProductCard = ({ item }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (item?.productImage) {
      const url = Api.getProductImage(item.productImage);
      setImageUrl(url);
    }
  }, [item]);
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.productName} numberOfLines={2}>
        {item.productName}
      </Text>
      <Text style={styles.productType}>{item.productType}</Text>
      <Text style={styles.productScore}>Score: {item.score}</Text>
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
  image: {
    width: "100%",
    height: 90,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: "#f0f0f0",
  },
  productName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
  },
  productType: { fontSize: 11, color: "#888", marginBottom: 2 },
  productScore: { fontSize: 11, color: "#00CC99", fontWeight: "600" },
});
