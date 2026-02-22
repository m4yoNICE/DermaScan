// @/components/designs/RoutineView.js
import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import ProductCard from "../designs/ProductCard";
import { useAnalysis } from "src/contexts/AnalysisContext";
const RoutineSection = ({ title, importance, description, products }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.headerRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View
        style={[
          styles.badge,
          { backgroundColor: importance === "High" ? "#D32F2F" : "#4CAF50" },
        ]}
      >
        <Text style={styles.badgeText}>Importance: {importance}</Text>
      </View>
    </View>
    <Text style={styles.descriptionText}>{description}</Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.productScroll}
    >
      {products.map((item, index) => (
        <ProductCard key={index} product={item} />
      ))}
    </ScrollView>
  </View>
);

const RoutineView = ({ analysis }) => {
  return (
    <View style={styles.container}>
      <View style={styles.routineHeader}>
        <Text style={styles.routineTypeText}>☀️ Morning Routine</Text>
      </View>

      {/* These would eventually be mapped from your database/catalog */}
      <RoutineSection
        title="Cleanser"
        importance="High"
        description="A cleanser removes dirt, oil, and impurities from your skin. It's the first and most essential step..."
        products={[
          { name: "Glycolic Acid 7%", match: "98%", brand: "Dermorep" },
          { name: "Niacinamide", match: "88%", brand: "Dermorep" },
          { name: "AHA/BHA", match: "78%", brand: "Luxe Organix" },
        ]}
      />

      {/* Repeat for Toner, Serum, etc. */}
    </View>
  );
};

export default RoutineView;

const styles = StyleSheet.create({
  container: { paddingVertical: 10 },
  routineHeader: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  routineTypeText: { fontSize: 22, fontWeight: "700", color: "#1e7d64" },
  sectionContainer: { marginBottom: 25 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#333" },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 15,
  },
  productScroll: { paddingLeft: 5 },
});
