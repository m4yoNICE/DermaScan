import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useHomeData } from "@/contexts/HomeDataContext";
import RoutineCard from "@/components/designs/cards/RoutineCard";
import Api from "@/services/Api";
import { formatTime } from "@/utils/formatTime";
import dayjs from "dayjs";

const RoutineFeed = () => {
  const { routineProducts, reminderLogs, fetchReminderLogs } = useHomeData();

  const today = dayjs().format("YYYY-MM-DD");
  const todayLogs = reminderLogs[today] ?? [];

  const now = dayjs();
  const isAM = now.hour() < 12;

  const morning = routineProducts.filter((p) =>
    p.schedule?.toLowerCase().includes("morning"),
  );
  const night = routineProducts.filter((p) =>
    p.schedule?.toLowerCase().includes("night"),
  );

  const currentProducts = isAM ? morning : night;
  const currentSchedule = isAM ? "Morning" : "Night";
  const currentTime = isAM
    ? (morning[0]?.timeRoutine ?? "07:00:00")
    : (night[0]?.timeRoutine ?? "21:00:00");
  const isDone = isAM
    ? todayLogs.includes("Morning")
    : todayLogs.includes("Night");

  const handleMarkDone = async () => {
    try {
      console.log("Marking done:", currentSchedule);
      const res = await Api.completeScheduleAPI({ schedule: currentSchedule });
      console.log("completeSchedule response:", res.data);
      await fetchReminderLogs();
      console.log("reminderLogs after fetch:", reminderLogs);
    } catch (err) {
      console.error("Complete schedule error:", err);
    }
  };

  if (!routineProducts?.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          No routine yet. Complete a scan first.
        </Text>
      </View>
    );
  }

  if (!currentProducts.length) return null;

  return (
    <RoutineCard
      schedule={currentSchedule}
      time={formatTime(currentTime)}
      products={currentProducts}
      isDone={isDone}
      onMarkDone={handleMarkDone}
    />
  );
};

const styles = StyleSheet.create({
  empty: { paddingVertical: 20, alignItems: "center" },
  emptyText: { color: "#999", fontSize: 14 },
});

export default RoutineFeed;
