import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import Api from "@/services/Api";

const Results = () => {
  const { data } = useLocalSearchParams();
  const response = JSON.parse(data);

  console.log(response);

  const result = response.data;
  const conditionId = result.condition_id;

  const [conditionName, setConditionName] = useState("Loading...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConditionName(conditionId);
  }, []);

  const fetchConditionName = async (id) => {
    try {
      const res = await Api.getConditionById(id);
      console.log(res);
      // SAFE ACCESS
      const name = res?.data?.data?.condition;
      setConditionName(name);
    } catch (err) {
      console.log("Error fetching condition name:", err);
      setConditionName("Unknown Condition");
    } finally {
      setLoading(false);
    }
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
      <View style={styles.card}>
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
      </View>
    </View>
  );
};

export default Results;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  label: { fontSize: 16, marginTop: 8, fontWeight: "600", color: "#555" },
  value: { fontSize: 16, fontWeight: "400", color: "#000" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
