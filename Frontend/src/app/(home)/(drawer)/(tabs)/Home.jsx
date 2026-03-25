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
import ProductDetailSheet from "@/components/designs/ProductDetailSheet";
import { useHomeData } from "@/contexts/HomeDataContext";

const Home = () => {
  const {
    journals,
    reminderLogs,
    analysisLogs,
    fetchAll,
    initialLoaded,
    dismissLoading,
  } = useHomeData();
  const [activeTab, setActiveTab] = useState("Journals");
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [sheetData, setSheetData] = useState(null);
  const sheetRef = useRef(null);
  const productSheetRef = useRef(null);

  const today = dayjs().format("YYYY-MM-DD");
  const todayLogs = reminderLogs[today] ?? [];
  const isSheetDone = sheetData
    ? todayLogs.includes(sheetData.schedule)
    : false;

  const handleCardPress = (data) => {
    setSheetData(data);
    productSheetRef.current?.expand();
  };

  const goToPrev = () => setCurrentMonth((m) => m.subtract(1, "month"));
  const goToNext = () => setCurrentMonth((m) => m.add(1, "month"));

  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, [fetchAll]),
  );

  return (
    <View style={styles.container}>
      <LoadingModal visible={!initialLoaded} onTimeout={dismissLoading} />

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
            if (activeTab !== "Routine") {
              sheetRef.current?.expand();
            }
          }}
        />

        <RoutineFeed onCardPress={handleCardPress} />
      </ScrollView>

      <HomeBottomSheet
        sheetRef={sheetRef}
        selectedDate={selectedDate}
        calendarTab={activeTab}
      />

      <ProductDetailSheet
        sheetRef={productSheetRef}
        schedule={sheetData?.schedule}
        time={sheetData?.time}
        products={sheetData?.products ?? []}
        isDone={isSheetDone}
        onMarkDone={sheetData?.onMarkDone}
      />
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
