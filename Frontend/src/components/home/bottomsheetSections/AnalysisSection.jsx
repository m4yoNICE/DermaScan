import React from "react";
import { StyleSheet, View, FlatList, Text, Image } from "react-native";
import { useHomeData } from "@/contexts/HomeDataContext";
import Api from "@/services/Api";

const AnalysisSection = ({ selectedDate }) => {
  const { analysisLogs } = useHomeData();
  const entries = analysisLogs[selectedDate] ?? [];

  if (!entries.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No scans on this date.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image
            source={{ uri: Api.getSkinImage(item.photoUrl) }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.info}>
            <Text style={styles.condition}>{item.condition}</Text>
            <Text style={styles.confidence}>
              {(item.confidenceScores * 100).toFixed(2)}% confidence
            </Text>
          </View>
        </View>
      )}
      contentContainerStyle={styles.list}
    />
  );
};

export default AnalysisSection;

const styles = StyleSheet.create({
  list: { paddingBottom: 20 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#999", fontSize: 14 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  info: {
    flex: 1,
    paddingLeft: 12,
  },
  condition: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    textTransform: "capitalize",
  },
  confidence: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
});
