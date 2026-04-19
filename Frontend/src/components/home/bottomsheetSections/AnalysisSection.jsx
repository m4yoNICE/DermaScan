import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { useHomeData } from "@/contexts/HomeDataContext";
import { formatConditionName } from "@/utils/formatConditionName";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

const AnalysisSection = ({ selectedDate, tabs }) => {
  const { analysisLogs } = useHomeData();
  const entries = analysisLogs[selectedDate] ?? [];

  return (
    <BottomSheetFlatList
      data={entries}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={<View style={styles.header}>{tabs}</View>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image
            source={{ uri: item.photoUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.info}>
            <Text style={styles.condition}>
              {formatConditionName(item.condition, item.status)}
            </Text>
            <Text style={styles.confidence}>
              {(item.confidenceScores * 100).toFixed(2)}% confidence
            </Text>
          </View>
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No scans on this date.</Text>
        </View>
      }
      contentContainerStyle={styles.list}
    />
  );
};

export default AnalysisSection;

const styles = StyleSheet.create({
  header: {
    paddingTop: 10,
    marginBottom: 15,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  emptyText: { color: "#999", fontSize: 14 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f0f0f0",
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