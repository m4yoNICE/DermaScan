import React, { useState, useCallback } from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import { useFocusEffect } from "expo-router";
import HistoryCard from "@/components/designs/cards/HistoryCard";
import Api from "@/services/Api";
import LoadingModal from "@/components/designs/feedback/LoadingModal";
import { ToastMessage } from "@/components/designs/feedback/ToastMessage";
const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetch = async () => {
        try {
          setLoading(true);
          const res = await Api.getHistoryAPI();
          setHistory(res.data);
        } catch (err) {
          console.error("History fetch error:", err);
        } finally {
          setLoading(false);
        }
      };
      fetch();
    }, []),
  );

  return (
    <View style={styles.container}>
      <LoadingModal
        visible={loading}
        onTimeout={() => {
          setLoading(false);
          ToastMessage("error", "Request timed out", "Please try again.");
        }}
      />
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <HistoryCard item={item} />}
        contentContainerStyle={{ paddingVertical: 10, paddingBottom: 100 }}
        ListEmptyComponent={
          !loading && <Text style={styles.empty}>No history yet.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontSize: 16,
  },
});

export default History;
