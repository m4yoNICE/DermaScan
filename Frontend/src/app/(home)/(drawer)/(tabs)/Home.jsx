import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";

import HomeBottomSheet from "@/components/home/HomeBottomSheet";
import CalendarToggle from "@/components/home/CalendarToggle";
import LoadingModal from "@/components/designs/feedback/LoadingModal";
import RoutineFeed from "@/components/home/RoutineFeed";

import { useHomeData } from "@/contexts/HomeDataContext";
import { useFocusEffect } from "expo-router";

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

  const markedDates = {};

  if (activeTab === "Journals") {
    Object.keys(journals).forEach((date) => {
      const isSelected = date === selectedDate;
      markedDates[date] = {
        customStyles: {
          container: {
            backgroundColor: "#ffa600",
            borderRadius: 16,
            borderWidth: isSelected ? 2 : 0,
            borderColor: isSelected ? "#00CC99" : "transparent",
          },
          text: {
            color: "#fff",
            fontWeight: isSelected ? "700" : "400",
          },
        },
      };
    });
  }

  if (activeTab === "Routine") {
    Object.keys(reminderLogs).forEach((date) => {
      const isSelected = date === selectedDate;
      markedDates[date] = {
        customStyles: {
          container: {
            backgroundColor: "#3b82f6",
            borderRadius: 16,
            borderWidth: isSelected ? 2 : 0,
            borderColor: isSelected ? "#00CC99" : "transparent",
          },
          text: {
            color: "#fff",
            fontWeight: isSelected ? "700" : "400",
          },
        },
      };
    });
  }

  if (activeTab === "Analysis") {
    Object.keys(analysisLogs).forEach((date) => {
      const isSelected = date === selectedDate;
      markedDates[date] = {
        customStyles: {
          container: {
            backgroundColor: "#a855f7",
            borderRadius: 16,
            borderWidth: isSelected ? 2 : 0,
            borderColor: isSelected ? "#00CC99" : "transparent",
          },
          text: {
            color: "#fff",
            fontWeight: isSelected ? "700" : "400",
          },
        },
      };
    });
  }

  if (selectedDate && !markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      customStyles: {
        container: {
          borderWidth: 2,
          borderColor: "#00CC99",
          borderRadius: 16,
          backgroundColor: "transparent",
        },
        text: {
          color: "#00CC99",
          fontWeight: "700",
        },
      },
    };
  }

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

        <CalendarToggle active={activeTab} onChange={setActiveTab} />

        <Calendar
          key={currentMonth.format("YYYY-MM")}
          markingType="custom"
          current={currentMonth.format("YYYY-MM-DD")}
          hideArrows={true}
          hideDayNames={false}
          renderHeader={() => null}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            sheetRef.current?.expand();
          }}
          markedDates={markedDates}
        />
        <RoutineFeed />
      </ScrollView>

      <HomeBottomSheet sheetRef={sheetRef} selectedDate={selectedDate} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  arrows: {
    flexDirection: "row",
    gap: 16,
  },
});
