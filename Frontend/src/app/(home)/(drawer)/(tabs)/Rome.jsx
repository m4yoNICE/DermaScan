import React, { useState, useRef, useCallback, useEffect } from "react";
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
  const [journals, setJournals] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const [draft, setDraft] = useState("");

  const sheetRef = useRef(null);

  const currentJournal = journals[selectedDate];

  useFocusEffect(
    useCallback(() => {
      fetchJournals();
    }, []),
  );

  useEffect(() => {
    setDraft(currentJournal?.text || "");
  }, [currentJournal?.id]);

  const fetchJournals = async () => {
    try {
      const res = await Api.getAllJournalsAPI();
      console.log("data from api: ", res.data);
      const normalized = {};
      res.data.forEach((j) => {
        normalized[j.journalDate] = {
          id: j.id,
          date: j.journalDate,
          text: j.journalText,
        };
      });
      setJournals(normalized);
      console.log();
      console.log(normalized);
    } catch (error) {
      ToastMessage("error", "Failed to load", error.message);
    }
  };

  const handleSave = async () => {
    const cleanText = draft.trim();

    try {
      if (!cleanText && currentJournal?.id) {
        await Api.deleteJournalAPI(currentJournal.id);
        ToastMessage("success", "Deleted", "");
      } else if (currentJournal?.id) {
        await Api.updateJournalAPI(currentJournal.id, {
          journalText: cleanText,
        });
        ToastMessage("success", "Updated", "");
      } else if (cleanText) {
        await Api.createJournalAPI({
          journalDate: selectedDate,
          journalText: cleanText,
        });
        ToastMessage("success", "Saved", "");
      }

      await fetchJournals();
    } catch (error) {
      ToastMessage(
        "error",
        "Action failed",
        error.response?.data?.error || error.message,
      );
    }
  };

  const buttonLabel = currentJournal?.id
    ? draft.trim()
      ? "Update"
      : "Delete"
    : "Save";

  const markedDates = {};
  Object.keys(journals).forEach((date) => {
    markedDates[date] = {
      customStyles: {
        container: {
          borderBottomWidth: 3,
          borderBottomColor: "#4F46E5",
        },
        text: {
          color: "#000",
        },
      },
    };
  });
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

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={["25%", "50%"]}
        enablePanDownToClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={1}
            appearsOnIndex={2}
          />
        )}
      >
        <BottomSheetView style={styles.sheetContent}>
          <ScrollView>
            <TextInput
              style={styles.input}
              multiline
              value={draft}
              onChangeText={setDraft}
              placeholder="How's your day..."
            />
          </ScrollView>
          <Button title={buttonLabel} onPress={handleSave} />
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
