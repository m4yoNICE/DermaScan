import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Api from "@/services/Api";
import { ToastMessage } from "@/components/designs/feedback/ToastMessage";
import Button from "@/components/designs/Button";
import { useHomeData } from "@/contexts/HomeDataContext";

const MOODS = [
  { value: "happy", label: "Happy", emoji: "😊" },
  { value: "neutral", label: "Neutral", emoji: "😐" },
  { value: "sad", label: "Sad", emoji: "😞" },
];

const JournalSection = ({ selectedDate, tabs }) => {
  const { journals, fetchJournals } = useHomeData();
  const [draft, setDraft] = useState("");
  const [mood, setMood] = useState(null);

  const currentJournal = journals[selectedDate];

  const normalizeMood = (m) => {
    const legacy = { "😊": "happy", "😐": "neutral", "😞": "sad" };
    return legacy[m] || m;
  };

  useEffect(() => {
    setDraft(currentJournal?.text || "");
    setMood(currentJournal?.mood ? normalizeMood(currentJournal.mood) : null);
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
    <BottomSheetScrollView contentContainerStyle={styles.container}>
      {tabs}
      <View style={styles.inner}>
        <View style={styles.moodRow}>
          {MOODS.map((m) => (
            <TouchableOpacity
              key={m.value}
              onPress={() => setMood(m.value === mood ? null : m.value)}
              style={[styles.moodBtn, mood === m.value && styles.moodActive]}
              accessibilityLabel={m.label}
              accessibilityRole="button"
            >
              <Text style={styles.moodEmoji}>{m.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.input}
          multiline
          value={draft}
          onChangeText={setDraft}
          placeholder="How's your day..."
        />
        <Button title={buttonLabel} onPress={handleSave} />
      </View>
    </BottomSheetScrollView>
  );
};

export default JournalSection;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  inner: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  input: {
    height: 150,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    textAlignVertical: "top",
    padding: 10,
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