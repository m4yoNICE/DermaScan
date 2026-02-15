import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import Card from "@/components/designs/Card";
import { useAnalysis } from "src/contexts/AnalysisContext";
import Api from "@/services/Api";

const Results = () => {
  const { analysis } = useAnalysis();
  const [imageUrl, setImageUrl] = useState(null);

  console.log("Results Page:", analysis);

  if (!analysis) {
    return (
      <View style={styles.centered}>
        <Text>No analysis data available.</Text>
      </View>
    );
  }

  useEffect(() => {
    if (analysis?.image_url) {
      const url = Api.getSkinImage(analysis.image_url);
      console.log("Constructed image URL:", url);
      setImageUrl(url);
    }
  }, [analysis]);

  return (
    <View style={styles.container}>
      <View style={styles.imgWrapper}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: 200, height: 200 }}
            onError={(e) => console.error("Image load failed:", e.nativeEvent)}
          />
        ) : (
          <Text>Loading...</Text>
        )}
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
