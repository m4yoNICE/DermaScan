import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import Api from "@/services/Api";
import { ToastMessage } from "@/components/designs/feedback/ToastMessage";
import Button from "@/components/designs/Button";
import { useHomeData } from "@/contexts/HomeDataContext";

const MOODS = ["😊", "😐", "😞"];

const JournalSection = ({ selectedDate }) => {
  const { journals, fetchJournals } = useHomeData();
  const [draft, setDraft] = useState("");
  const [mood, setMood] = useState(null);

  const currentJournal = journals[selectedDate];

  useEffect(() => {
    setDraft(currentJournal?.text || "");
    setMood(currentJournal?.mood || null);
  }, [currentJournal?.id, selectedDate]);

  const handleSave = async () => {
    const cleanText = draft.trim();
    try {
      if (!cleanText && currentJournal?.id) {
        await Api.deleteJournalAPI(currentJournal.id);
        ToastMessage("success", "Deleted", "");
      } else if (currentJournal?.id) {
        await Api.updateJournalAPI(currentJournal.id, {
          journalText: cleanText,
          mood,
        });
        ToastMessage("success", "Updated", "");
      } else if (cleanText) {
        await Api.createJournalAPI({
          journalDate: selectedDate,
          journalText: cleanText,
          mood,
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
    <View style={styles.sheetContent}>
      <View style={styles.moodRow}>
        {MOODS.map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => setMood(m === mood ? null : m)}
            style={[styles.moodBtn, mood === m && styles.moodActive]}
          >
            <Text style={styles.moodEmoji}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
    </View>
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
    padding: 10,
  },
  sheetContent: {
    flex: 1,
    padding: 16,
  },
  moodRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  moodBtn: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent",
  },
  moodActive: {
    borderColor: "#00CC99",
    backgroundColor: "#00CC9915",
  },
  moodEmoji: {
    fontSize: 24,
  },
});
