import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useHomeData } from "@/contexts/HomeDataContext";
import RoutineCard from "@/components/designs/cards/RoutineCard";
import Api from "@/services/Api";
import { formatTime } from "@/utils/formatTime";
import dayjs from "dayjs";

const RoutineFeed = () => {
  const { routineProducts, reminderLogs, fetchReminderLogs, routineSchedule } =
    useHomeData();

  const today = dayjs().format("YYYY-MM-DD");
  const todayLogs = reminderLogs[today] ?? [];
  const now = dayjs();

  const morningTime = dayjs(
    `${today} ${routineSchedule?.morningTime ?? "07:00:00"}`,
  );
  const eveningTime = dayjs(
    `${today} ${routineSchedule?.eveningTime ?? "21:00:00"}`,
  );

  // active = which card is the "current" one the user should act on
  const isMorningActive = now.isBefore(eveningTime);

  const morning = routineProducts.filter((p) =>
    p.schedule?.toLowerCase().includes("morning"),
  );
  const night = routineProducts.filter((p) =>
    p.schedule?.toLowerCase().includes("night"),
  );

  const isMorningDone = todayLogs.includes("Morning");
  const isNightDone = todayLogs.includes("Night");

  const handleMarkDone = async (schedule) => {
    try {
      await Api.completeScheduleAPI({ schedule });
      await fetchReminderLogs();
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

  return (
    <View>
      {morning.length > 0 && (
        <RoutineCard
          schedule="Morning"
          time={formatTime(routineSchedule?.morningTime ?? "07:00:00")}
          products={morning}
          isDone={isMorningDone}
          isActive={isMorningActive}
          onMarkDone={() => handleMarkDone("Morning")}
        />
      )}
      {night.length > 0 && (
        <RoutineCard
          schedule="Night"
          time={formatTime(routineSchedule?.eveningTime ?? "21:00:00")}
          products={night}
          isDone={isNightDone}
          isActive={!isMorningActive}
          onMarkDone={() => handleMarkDone("Night")}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  empty: { paddingVertical: 20, alignItems: "center" },
  emptyText: { color: "#999", fontSize: 14 },
});

export default RoutineFeed;
