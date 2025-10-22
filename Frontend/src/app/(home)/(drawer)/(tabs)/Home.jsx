import React, { useEffect, useMemo, useState, useRef } from "react";
import { ScrollView, StyleSheet, View, TextInput } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import QuestModal from "@/components/modals/QuestModal";
import Api from "@/services/Api";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
const Home = () => {
  const [selected, setSelected] = useState(dayjs().format("YYYY-MM-DD"));
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [text, setText] = useState("");
  const sheetRef = useRef(null);
  const handleCheckSkinData = async () => {
    try {
      const res = await Api.getUserbyTokenAPI();
      const user = res.data;
      if (!user.skin_type || !user.skin_sensitivity) {
        setShowQuestModal(true);
      }
    } catch (err) {
      console.error("Error checking skin data:", err);
    }
  };

  useEffect(() => {
    handleCheckSkinData();
  }, []);

  const snapPoints = useMemo(() => ["25%", "50%"], []);
  const handleOpenJournal = () => sheetRef.current?.expand();
  const handleCloseJournal = () => sheetRef.current?.close();

  return (
    <View style={styles.container}>
      <QuestModal
        visible={showQuestModal}
        onClose={() => setShowQuestModal(false)}
      />
      <Calendar
        current={selected}
        onDayPress={(day) => {
          setSelected(day.dateString);
          handleOpenJournal(); // call your bottom sheet open function
        }}
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
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={(index) => {
          if (index === -1) handleCloseJournal();
        }}
      >
        <BottomSheetView style={styles.sheetContent}>
          <ScrollView>
            <TextInput
              style={styles.input}
              multiline={true}
              onChangeText={setText}
              value={text}
              placeholder="Make your story about your day..."
              placeholderTextColor="#999"
            />
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  input: {
    height: 150,
    borderColor: "gray",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    textAlignVertical: "top",
  },
  sheetContent: {
    flex: 1,
    padding: 16,
  },
});
