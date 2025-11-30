import { StyleSheet, Text, View, ActivityIndicator, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import Api from "@/services/Api";
import Card from "@/components/Card";

const Results = () => {
  const { data } = useLocalSearchParams();
  const response = JSON.parse(data);
  // ADD THIS - Log what you're actually getting
  console.log("RAW DATA:", data);
  const result = response.data;
  const conditionId = result.condition_id;
  const imageId = result.image_id;

  //holder of data to show in UI
  const [conditionName, setConditionName] = useState(null);
  const [uri, setUri] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConditionAndImage(conditionId, imageId);
  }, []);

  const fetchConditionAndImage = async (conditionId, imageId) => {
    // Fetch condition
    try {
      const res = await Api.getConditionByIdAPI(conditionId);
      const condition = res.data.data;
      setConditionName(condition.condition);
    } catch (err) {
      console.log("Error fetching condition:", err);
      setConditionName("Unknown Condition");
    }
    // Fetch image
    try {
      const res = await Api.getImageByIdAPI(imageId);
      const filename = res.data; // It's already just the filename string
      const imageUri = Api.getImage(filename);
      setUri(imageUri);
    } catch (err) {
      console.log("📷 Error:", err.response?.status, err.response?.data);
      setUri(null);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00CC99" />
        <Text style={{ marginTop: 10 }}>Loading details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card>
        <Image source={{ uri }} style={{ width: 200, height: 200 }} />
      </Card>
      <Card>
        <Text style={styles.title}>Skin Analysis Result</Text>

        {/* DO NOT NEST TEXT WITH VARIABLES INSIDE */}
        <Text style={styles.label}>Condition:</Text>
        <Text style={styles.value}>{conditionName}</Text>

        <Text style={styles.label}>Confidence:</Text>
        <Text style={styles.value}>
          {(Number(result.confidence_scores) * 100).toFixed(2)}%
        </Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{result.status}</Text>
      </Card>
    </View>
  );
};

export default Results;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  label: { fontSize: 16, marginTop: 8, fontWeight: "600", color: "#555" },
  value: { fontSize: 16, fontWeight: "400", color: "#000" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
