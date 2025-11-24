import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const Results = () => {
  const { data } = useLocalSearchParams();
  const response = JSON.parse(data);
  const skinData = response.data; // ← Extract the array from response.data

  return (
    <View style={styles.container}>
      <FlatList
        data={skinData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Condition ID: {item.condition_id}</Text>
            <Text>
              Confidence: {(item.confidence_scores * 100).toFixed(2)}%
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default Results;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});
