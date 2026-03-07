import React, { useState, useRef } from "react";
import { StyleSheet, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import HomeBottomSheet from "@/components/home/HomeBottomSheet";

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const sheetRef = useRef(null);

  const markedDates = {};
  if (selectedDate) {
    markedDates[selectedDate] = {
      customStyles: {
        container: {
          backgroundColor: "#00CC99",
          borderRadius: 16,
        },
        text: {
          color: "#FFFFFF",
        },
      },
    };
  }

  return (
    <View style={styles.container}>
      <Calendar
        markingType="custom"
        current={selectedDate}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          sheetRef.current?.expand();
        }}
        markedDates={markedDates}
        renderArrow={(direction) =>
          direction === "left" ? (
            <AntDesign name="left" size={24} />
          ) : (
            <AntDesign name="right" size={24} />
          )
        }
      />

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
});
