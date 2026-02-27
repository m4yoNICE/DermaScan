// @/components/designs/RoutineView.js
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useAnalysis } from "src/contexts/AnalysisContext";
import { RoutineSection } from "./RoutineSection";
import Button from "../designs/Button";
import RoutineCheckout from "./RoutineCheckout";
const RoutineView = () => {
  const { recommendation } = useAnalysis();
  const [showCheckout, setShowCheckout] = useState(false);
  const typeText = {
    Cleanser:
      "A cleanser removes dirt, oil, makeup, and impurities from your skin. It's the first and most essential step in any skincare routine, helping keep pores clear and preventing breakouts.",
    Toner:
      "A toner balances your skin's pH after cleansing and preps it to absorb the next products better. It can also hydrate, exfoliate, or soothe depending on the formula.",
    Serum:
      "A serum delivers concentrated active ingredients deep into the skin to target specific concerns like acne, dark spots, or dehydration.",
    Moisturizer:
      "A moisturizer hydrates the skin, locks in moisture, and strengthens the skin barrier to keep it soft, smooth, and protected from dryness or irritation.",
    Sunscreen:
      "Sunscreen protects your skin from UV damage, preventing premature aging, dark spots, and skin cancer. It's the most important step in your morning routine.",
  };

  const groupByType = (products) =>
    products.reduce((acc, product) => {
      const type = product.productType ?? "Other";
      if (!acc[type]) acc[type] = [];
      acc[type].push(product);
      return acc;
    }, {});

  const grouped = groupByType(recommendation);

  return (
    <View style={styles.container}>
      {Object.entries(grouped).map(([type, products]) => (
        <RoutineSection
          key={type}
          title={type}
          description={typeText[type] ?? ""}
          products={products}
        />
      ))}

      {/* put the button here */}
      <Button
        title="View My Routine"
        onPress={() => setShowCheckout(true)}
        style={{ margin: 10 }}
      />

      <RoutineCheckout
        visible={showCheckout}
        onClose={() => setShowCheckout(false)}
      />
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
});
