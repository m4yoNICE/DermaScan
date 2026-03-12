import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import dayjs from "dayjs";

import HomeBottomSheet from "@/components/home/HomeBottomSheet";
import HomeCalendar from "@/components/home/HomeCalendar";
import LoadingModal from "@/components/designs/feedback/LoadingModal";
import RoutineFeed from "@/components/home/routine/RoutineFeed";
import { useHomeData } from "@/contexts/HomeDataContext";

const Home = () => {
  const { journals, reminderLogs, analysisLogs, fetchAll } = useHomeData();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Journals");
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const sheetRef = useRef(null);

  const goToPrev = () => setCurrentMonth((m) => m.subtract(1, "month"));
  const goToNext = () => setCurrentMonth((m) => m.add(1, "month"));

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        setLoading(true);
        await fetchAll();
        setLoading(false);
      };
      load();
    }, []),
  );

  return (
    <View style={styles.container}>
      <LoadingModal visible={loading} />
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {currentMonth.format("MMMM YYYY")}
          </Text>
          <View style={styles.arrows}>
            <TouchableOpacity onPress={goToPrev}>
              <AntDesign name="left" size={20} color="#00CC99" />
            </TouchableOpacity>
            <TouchableOpacity onPress={goToNext}>
              <AntDesign name="right" size={20} color="#00CC99" />
            </TouchableOpacity>
          </View>
        </View>

        <HomeCalendar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          journals={journals}
          reminderLogs={reminderLogs}
          analysisLogs={analysisLogs}
          onDayPress={(dateString) => {
            setSelectedDate(dateString);
            sheetRef.current?.expand();
          }}
        />

        <RoutineFeed />
      </ScrollView>

      <HomeBottomSheet sheetRef={sheetRef} selectedDate={selectedDate} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 16, fontWeight: "bold", color: "#000" },
  arrows: { flexDirection: "row", gap: 16 },
});