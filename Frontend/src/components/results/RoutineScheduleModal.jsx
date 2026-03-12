import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, Platform } from "react-native";
import Card from "../designs/cards/Card";
import Button from "../designs/Button";
import DateTimePicker from "@react-native-community/datetimepicker";
import Api from "@/services/Api";
import { ToastMessage } from "@/components/designs/feedback/ToastMessage";
import { useUserData } from "@/contexts/UserDataContext";
import dayjs from "dayjs";

const ScheduleModal = ({ visible, onDone }) => {
  const { fetchUserData } = useUserData();
  const [morningTime, setMorningTime] = useState(new Date());
  const [eveningTime, setEveningTime] = useState(new Date());
  const [showMorning, setShowMorning] = useState(false);
  const [showEvening, setShowEvening] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await Api.setUserRoutineAPI({
        morningTime: dayjs(morningTime).format("HH:mm:ss"),
        eveningTime: dayjs(eveningTime).format("HH:mm:ss"),
      });
      await fetchUserData();
      ToastMessage(
        "success",
        "Schedule Set",
        "Your routine times have been saved.",
      );
      onDone();
    } catch (err) {
      ToastMessage("error", "Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <Card>
          <Text style={styles.title}>Set Your Routine Schedule</Text>
          <Text style={styles.subtitle}>
            When would you like to be reminded for your skincare routine?
          </Text>

          <View style={styles.timeRow}>
            <Text style={styles.label}>🌅 Morning</Text>
            <Button
              title={dayjs(morningTime).format("hh:mm A")}
              onPress={() => setShowMorning(true)}
              style={styles.timeButton}
              textStyle={styles.timeButtonText}
            />
          </View>

          <View style={styles.timeRow}>
            <Text style={styles.label}>🌙 Evening</Text>
            <Button
              title={dayjs(eveningTime).format("hh:mm A")}
              onPress={() => setShowEvening(true)}
              style={styles.timeButton}
              textStyle={styles.timeButtonText}
            />
          </View>

          {showMorning && (
            <DateTimePicker
              value={morningTime}
              mode="time"
              is24Hour={false}
              onChange={(e, date) => {
                setShowMorning(false);
                if (date) setMorningTime(date);
              }}
            />
          )}

          {showEvening && (
            <DateTimePicker
              value={eveningTime}
              mode="time"
              is24Hour={false}
              onChange={(e, date) => {
                setShowEvening(false);
                if (date) setEveningTime(date);
              }}
            />
          )}

          <Button
            title={loading ? "Saving..." : "Confirm"}
            onPress={handleSave}
          />
          <Button
            title="Skip for now"
            onPress={onDone}
            style={styles.skipButton}
            textStyle={styles.skipText}
          />
        </Card>
      </View>
    </Modal>
  );
};

export default ScheduleModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#888",
    marginBottom: 20,
    lineHeight: 20,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  timeButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 0,
    marginBottom: 0,
  },
  timeButtonText: {
    color: "#333",
    fontSize: 14,
  },
  skipButton: {
    backgroundColor: "transparent",
    elevation: 0,
  },
  skipText: {
    color: "#aaa",
    fontSize: 13,
  },
});
