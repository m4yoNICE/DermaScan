import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import Card from "@/components/designs/Card";
import { useAnalysis } from "src/contexts/AnalysisContext";

const Results = () => {
  const { analysis } = useAnalysis();
  console.log("Results Page: ", analysis);

  if (!analysis) {
    return (
      <View style={styles.centered}>
        <Text>No analysis data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imgWrapper}>
        <Image
          source={{ uri: analysis.image_url }}
          style={{ width: 200, height: 200 }}
        />
      </View>
      <Card>
        <Text style={styles.title}>Skin Analysis Result</Text>
        <Text style={styles.value}>
          The system has detected signs of
          <Text style={styles.label}> {analysis.condition_name} </Text>
          with a confidence level of
          <Text style={styles.label}>
            {" "}
            {(Number(analysis.confidenceScores) * 100).toFixed(2)}%{" "}
          </Text>
        </Text>
      </Card>
    </View>
  );
};

export default Results;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center" },
  imgWrapper: { alignItems: "center", marginBottom: 20 },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#00CC99",
  },
  label: { fontSize: 20, marginTop: 8, fontWeight: "600", color: "#555" },
  value: { fontSize: 20, fontWeight: "400", color: "#000" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
