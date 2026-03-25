import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import ProductCard from "../designs/cards/ProductCard";
import { useProduct } from "src/contexts/ProductContext";
import { useState } from "react";
import ProductSheet from "../designs/ProductSheet";

export const RoutineSection = ({ title, description, products }) => {
  const { product, setProduct } = useProduct();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleProductPress = (item) => {
    setSelectedProduct(item);
    setIsVisible(true);
  };

  const handleAdd = (item) => {
    if (addedIds.has(item.id)) return;
    setProduct((prev) => [...prev, item]);
  };

  const addedIds = new Set(product.map((p) => p.id));

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {description ? (
        <Text style={styles.descriptionText}>{description}</Text>
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.productScroll}
      >
        {products.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleProductPress(item)}
            activeOpacity={0.7}
          >
            <ProductCard item={item} isAdded={addedIds.has(item.id)} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ProductSheet
        product={selectedProduct}
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        onAdd={handleAdd}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: { marginBottom: 25 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#333" },
  productScroll: { paddingLeft: 5 },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 15,
  },
});
