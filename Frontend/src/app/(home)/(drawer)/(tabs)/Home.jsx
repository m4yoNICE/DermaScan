import React, { useMemo, useState, useRef, useCallback } from "react";
import { ScrollView, StyleSheet, View, TextInput } from "react-native";
import { useFocusEffect } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import Api from "@/services/Api";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { ToastMessage } from "@/components/ToastMessage";
import Button from "@/components/Button";

const Home = () => {
  const [currentJournalId, setCurrentJournalId] = useState(null);
  const [selected, setSelected] = useState(dayjs().format("YYYY-MM-DD"));
  const [text, setText] = useState("");
  const [journals, setJournals] = useState([]);
  const sheetRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      getAllJournal();
    }, []),
  );

  const snapPoints = useMemo(() => ["25%", "50%"], []);
  const handleOpenJournal = () => sheetRef.current?.expand();
  const handleCloseJournal = () => sheetRef.current?.close();

  // ------------------------------
  // Fetch all journals
  // ------------------------------
  const getAllJournal = async () => {
    try {
      const res = await Api.getAllJournalsAPI();
      setJournals(res.data);

      const match = res.data.find((j) => j.journal_date === selected);
      setText(match?.journal_text || "");
      setCurrentJournalId(match?.id || null);
    } catch (error) {
      console.log(error);
      ToastMessage(
        "error",
        "Unexpected Error",
        error.message || "Unknown error",
      );
    }
  };

  // ------------------------------
  // Load single date journal
  // ------------------------------
  const getSingleJournalByDate = (targetDate) => {
    const journal = journals.find((j) => j.journal_date === targetDate);
    setText(journal?.journal_text || "");
    setCurrentJournalId(journal?.id || null);
  };

  // ------------------------------
  // Backdrop para sa bottomsheetss
  // ------------------------------
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={1}
        appearsOnIndex={2}
      />
    ),
    [],
  );

  // ------------------------------
  // Create / Update / Delete
  // ------------------------------
  const handleJournalAction = async () => {
    try {
      const cleanText = text.trim();

      // Delete
      if (!cleanText) {
        if (currentJournalId) {
          console.log("journal is being deleted");

          await Api.deleteJournalAPI(currentJournalId);
          ToastMessage("success", "Deleted", "Journal deleted.");
        }
        setText("");

        setCurrentJournalId(null);
        await getAllJournal();
        return;
      }

      // Update
      if (currentJournalId) {
        console.log("journal is being updated");
        await Api.updateJournalAPI(currentJournalId, {
          journal_text: cleanText,
        });
        ToastMessage("success", "Updated", "Journal updated.");
      } else {
        // Create
        console.log("journal is being created");

        await Api.createJournalAPI({
          date: selected,
          journal_text: cleanText,
        });

        ToastMessage("success", "Created", "Journal saved.");
      }

      await getAllJournal();
    } catch (error) {
      console.error("Action Error:", error);
      if (error.response) {
        ToastMessage(
          "error",
          "Server Error",
          error.response.data?.error || "Something went wrong.",
        );
      } else if (error.request) {
        ToastMessage("error", "Network Error", "Unable to reach the server.");
      } else {
        ToastMessage("error", "Unexpected Error", error.message);
      }
    }
  };

  // ------------------------------
  // Button Label Logic
  // ------------------------------
  const buttonLabel = useMemo(() => {
    if (currentJournalId && text.trim() === "") return "Delete";
    if (currentJournalId && text.trim() !== "") return "Update";
    return "Save";
  }, [currentJournalId, text]);

  // ------------------------------
  // Marked dates
  // ------------------------------
  const markedDates = useMemo(() => {
    const dates = {};

    journals.forEach((j) => {
      if (j.journal_date) {
        dates[j.journal_date] = {
          marked: true,
          dotColor: "#4F46E5",
        };
      }
    });

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
              multiline
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
