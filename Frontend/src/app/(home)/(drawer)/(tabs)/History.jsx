import React from "react";
import { StyleSheet, FlatList, SafeAreaView, View } from "react-native";
import HistoryCard from "./HistoryCard";

const MOCK_HISTORY = [
  {
    id: "1",
    date: "Friday, 5 December 2025",
    userSkinImage: "https://via.placeholder.com/150", // replace with actual
    concerns: ["Redness", "enlarged pores"],
    products: [
      {
        category: "Sunscreen",
        name: "High Protection Perfecting UV Tint Serum Sunscreen",
        image: "https://via.placeholder.com/100",
      },
    ],
  },
  {
    id: "2",
    date: "Tuesday, 23 September 2025",
    userSkinImage: "https://via.placeholder.com/150",
    concerns: ["Redness", "fungal acne"],
    products: [
      {
        category: "Cleanser",
        name: "AHA BHA Miracle Solutions Facial Cleanser",
        image: "https://via.placeholder.com/100",
      },
      {
        category: "Toner",
        name: "7% Glycolic Acid Dermorepubliq",
        image: "https://via.placeholder.com/100",
      },
    ],
  },
];

const History = () => {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={MOCK_HISTORY}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HistoryCard item={item} />}
        contentContainerStyle={{ paddingVertical: 10, paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Kept white to let the card shadows pop
  },
});

export default History;
