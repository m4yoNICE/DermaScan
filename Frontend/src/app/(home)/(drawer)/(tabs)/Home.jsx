import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { ScrollView, StyleSheet, View, TextInput } from "react-native";
import { useFocusEffect } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import BraummanQuestionnaire from "@/components/modals/Braumman/BraummanQuestionnaire";
import Api from "@/services/Api";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { ToastMessage } from "@/components/ToastMessage";
import Button from "@/components/Button";
const Home = () => {
  //launches braummann skin type questionnaire if null
  const [showQuestModal, setShowQuestModal] = useState(false);
  const handleCheckSkinData = async () => {
    try {
      const res = await Api.getUserbyTokenAPI();
      const user = res.data;
      if (
        !user.skin_type ||
        !user.skin_sensitivity ||
        !user.pigmentation ||
        !user.aging
      ) {
        setShowQuestModal(true);
      }
    } catch (err) {
      console.error("Error checking skin data:", err);
    }
  };
  useEffect(() => {
    handleCheckSkinData();
  }, []);
  //home logic
  const [selected, setSelected] = useState(dayjs().format("YYYY-MM-DD"));
  const [text, setText] = useState("");
  const [journals, setJournals] = useState([]);
  const sheetRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      getAllJournal();
    }, [])
  );
  //note UI
  const snapPoints = useMemo(() => ["25%", "50%"], []);
  const handleOpenJournal = () => sheetRef.current?.expand();
  const handleCloseJournal = () => sheetRef.current?.close();
  const getAllJournal = async () => {
    try {
      const res = await Api.getAllJournalAPI();
      setJournals(res.data);
    } catch (error) {
      console.log(error);
      ToastMessage(
        "error",
        "Unexpected Error",
        error.message || "Unknown error"
      );
    }
  };

  const getSingleJournalByDate = (targetDate) => {
    const journal = journals.find((j) => j.journal_date === targetDate);
    setText(journal?.journal_text || "");
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={1}
        appearsOnIndex={2}
      />
    ),
    []
  );
  const handleJournalAction = async () => {
    try {
      const existing = await Api.getSingleJournalByDateAPI(selected);
      const existingJournal = existing.data;
      const journalData = { date: selected, journal_text: text.trim() };

      // Delete if no text
      if (!journalData.journal_text) {
        if (existingJournal) {
          await Api.deleteJournalAPI(existingJournal.id);
          ToastMessage("success", "Deleted", "Journal deleted successfully.");
          setText("");
          await getAllJournal();
        }
        return;
      }

      // Update if exists, create if not
      if (existingJournal) {
        await Api.updateJournalAPI(journalData);
        ToastMessage("success", "Updated", "Journal updated successfully.");
      } else {
        await Api.createJournalAPI(journalData);
        ToastMessage("success", "Created", "Journal saved successfully.");
      }

      await getAllJournal();
    } catch (error) {
      console.error("Action Error:", error);
      if (error.response) {
        ToastMessage(
          "error",
          "Server Error",
          error.response.data?.error || "Something went wrong."
        );
      } else if (error.request) {
        ToastMessage("error", "Network Error", "Unable to reach the server.");
      } else {
        ToastMessage("error", "Unexpected Error", error.message);
      }
    }
  };
  const buttonLabel = useMemo(() => {
    const existingJournal = journals.find((j) => j.journal_date === selected);

    if (existingJournal && text.trim() === "") {
      return "Delete";
    }
    if (existingJournal && text.trim() !== "") {
      return "Update";
    }
    return "Save";
  }, [journals, selected, text]);

  //display the date when theres a note occupied
  const markedDates = useMemo(() => {
    const dates = {};

    for (let i = 0; i < journals.length; i++) {
      const date = journals[i].journal_date;
      if (date) {
        dates[date] = {
          marked: true,
          dotColor: "#4F46E5",
        };
      }
    }

    if (selected) {
      dates[selected] = {
        ...(dates[selected] || {}),
        selected: true,
        selectedColor: "#00CC99",
      };
    }

    return dates;
  }, [journals, selected]);

  return (
    <View style={styles.container}>
      <BraummanQuestionnaire
        visible={showQuestModal}
        onClose={() => setShowQuestModal(false)}
      />
      <Calendar
        current={selected}
        onDayPress={(day) => {
          setSelected(day.dateString);
          getSingleJournalByDate(day.dateString);
          handleOpenJournal();
        }}
        markedDates={markedDates}
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
        backdropComponent={renderBackdrop}
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
              placeholder="How's Your Day..."
              placeholderTextColor="#999"
            />
          </ScrollView>
          <Button title={buttonLabel} onPress={handleJournalAction} />
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
