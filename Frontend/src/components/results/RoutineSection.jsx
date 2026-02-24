import { View, Text, StyleSheet, ScrollView } from "react-native";
import ProductCard from "../designs/ProductCard";

export const RoutineSection = ({ title, description, products }) => (
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
        <ProductCard key={index} item={item} />
      ))}
    </ScrollView>
  </View>
);

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
