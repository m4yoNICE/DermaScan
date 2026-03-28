import React, { useState, useCallback } from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import { useFocusEffect } from "expo-router";
import HistoryCard from "@/components/designs/cards/HistoryCard";
import Api from "@/services/Api";
import LoadingModal from "@/components/designs/feedback/LoadingModal";
import { ToastMessage } from "@/components/designs/feedback/ToastMessage";
import { useHomeData } from "@/contexts/HomeDataContext";
const History = () => {
  const { historyList, fetchAnalysisLogs, initialLoaded, dismissLoading } = useHomeData();

  useFocusEffect(
    useCallback(() => {
      fetchAnalysisLogs();
    }, []),
  );

  return (
    <View style={styles.container}>
      <LoadingModal
        visible={!initialLoaded}
        onTimeout={() => {
          dismissLoading();
          ToastMessage("error", "Request timed out", "Please try again.");
        }}
      />
      <FlatList
        data={historyList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <HistoryCard item={item} />}
        contentContainerStyle={{ paddingVertical: 10, paddingBottom: 100 }}
        ListEmptyComponent={
          !initialLoaded ? null : <Text style={styles.empty}>No history yet.</Text>
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
