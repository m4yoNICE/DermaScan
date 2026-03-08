import React from "react";
import { StyleSheet, View, FlatList, Text } from "react-native";
import { useHomeData } from "@/contexts/HomeDataContext";
import RoutineCard from "../designs/cards/RoutineCard";

const RoutineFeed = () => {
  const { routineProducts } = useHomeData();

  if (!routineProducts?.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          No routine yet. Complete a scan first.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={routineProducts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <RoutineCard time={item.timeRoutine} task={item.productName} />
      )}
      contentContainerStyle={styles.list}
      scrollEnabled={false}
    />
  );
};

export default RoutineFeed;

const styles = StyleSheet.create({
  list: { paddingBottom: 20 },
  empty: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyText: { color: "#999", fontSize: 14 },
});
