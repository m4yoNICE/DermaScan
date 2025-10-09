import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import AntDesign from "@expo/vector-icons/AntDesign";
import QuestModal from "@/components/modals/QuestModal";
import Api from "@/services/Api";
const Home = () => {
  const [selected, setSelected] = useState(dayjs().format("YYYY-MM-DD"));
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [checkSkinType, setCheckSkinType] = useState(null);
  const [checkSkinSensitive, setCheckSkinSensitive] = useState(null);
  const [showQuestModal, setShowQuestModal] = useState(false);

  //check for skintypes after registering
  const checkSkinData = async () => {
    try {
      const res = await Api.getUserbyTokenAPI();
      const user = res.data;

      setCheckSkinType(user.skin_type);
      setCheckSkinSensitive(user.skin_sensitivity);

      // If user has no skin data, show modal
      if (!user.skin_type || !user.skin_sensitivity) {
        setShowQuestModal(true);
      }
    } catch (err) {
      console.error("Error checking skin data:", err);
    }
  };
  useEffect(() => {
    checkSkinData();
  }, []);
  // Replace this later with DB data
  const events = [];

  const filteredEvents = events.filter((e) => e.date.startsWith(selected));

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  return (
    <View style={styles.container}>
      {/* Calendar */}
      <QuestModal
        visible={showQuestModal}
        onClose={() => setShowQuestModal(false)}
      />
      <Calendar
        current={dayjs().format("YYYY-MM-DD")}
        onDayPress={(day) => setSelected(day.dateString)}
        markedDates={{
          [selected]: { selected: true },
        }}
        renderArrow={(direction) =>
          direction === "left" ? (
            <AntDesign name="arrow-left" size={24} color="black" />
          ) : (
            <AntDesign name="arrow-right" size={24} color="black" />
          )
        }
      />

      {/* Event list */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "gray", marginTop: 20 }}>
            No events for this day
          </Text>
        }
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
