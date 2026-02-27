import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useProduct } from "src/contexts/ProductContext";

const RoutineCheckout = () => {
  const { product } = useProduct();

  return (
    <View style={styles.container}>
      {product.map((item, index) => (
        <Text key={index}>{item.productName}</Text>
      ))}
    </View>
  );
};

export default RoutineCheckout;

const styles = StyleSheet.create({
  container: { padding: 20 },
});
