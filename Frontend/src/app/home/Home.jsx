import React, { useContext, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { DrawerContext } from "./_layout";

const sampleEvents = [
  { id: "1", title: "Wash Face", date: "2024-05-23 14:00" },
  { id: "2", title: "Apply Toner with Niacin...", date: "2024-04-13 10:00" },
  { id: "3", title: "Hyaluronic Acid Moist...", date: "2024-06-03 19:00" },
];

const Home = () => {
  const { setOpen } = useContext(DrawerContext);
  const [selected, setSelected] = useState("");

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setOpen(true)}>
          <Ionicons name="menu" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>September</Text>
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-back" size={24} color="white" />
          <Ionicons name="chevron-forward" size={24} color="white" />
        </View>
      </View>

      {/* Real Calendar with dates */}
      <Calendar
        onDayPress={(day) => {
          setSelected(day.dateString);
          console.log("selected day", day);
        }}
        markedDates={{
          [selected]: { selected: true, selectedColor: "teal" },
        }}
        theme={{
          selectedDayBackgroundColor: "teal",
          todayTextColor: "red",
          arrowColor: "teal",
        }}
      />

      {/* Event list */}
      <FlatList
        data={sampleEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDate}>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topBar: {
    backgroundColor: "teal",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topBarTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  arrowContainer: {
    flexDirection: "row",
    gap: 8,
  },
  eventCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: "gray",
  },
});
