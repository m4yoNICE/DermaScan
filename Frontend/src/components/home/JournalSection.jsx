import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet, TextInput } from "react-native";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "expo-router";
import Api from "@/services/Api";
import { ToastMessage } from "@/components/designs/ToastMessage";
import Button from "@/components/designs/Button";

const JournalSection = ({ selectedDate }) => {
  const [journals, setJournals] = useState({});
  const [draft, setDraft] = useState("");

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
      const normalized = {};
      res.data.forEach((j) => {
        normalized[j.journalDate] = {
          id: j.id,
          date: j.journalDate,
          text: j.journalText,
        };
      });
      setJournals(normalized);
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

  return (
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
  );
};

export default JournalSection;

const styles = StyleSheet.create({
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
