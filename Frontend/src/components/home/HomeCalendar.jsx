import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { getRoutineIcon } from "@/utils/checkRoutineStatus";

const TABS = ["Routine", "Analysis", "Journals"];

const HomeCalendar = ({
  activeTab,
  onTabChange,
  currentMonth,
  selectedDate,
  journals,
  reminderLogs,
  analysisLogs,
  onDayPress,
}) => {
  const dayComponent = ({ date, state }) => {
    const isSelected = date.dateString === selectedDate;

    if (activeTab === "Routine") {
      const logs = reminderLogs[date.dateString] ?? null;
      if (logs !== null) {
        return (
          <TouchableOpacity
            onPress={() => onDayPress(date.dateString)}
            style={styles.iconWrapper}
          >
            {getRoutineIcon(logs)}
            <Text style={styles.iconDayText}>{date.day}</Text>
          </TouchableOpacity>
        );
      }
    }

    if (activeTab === "Journals") {
      const hasJournal = !!journals[date.dateString];
      return (
        <TouchableOpacity
          onPress={() => onDayPress(date.dateString)}
          style={[
            styles.dayContainer,
            hasJournal && styles.journalDay,
            isSelected && styles.daySelected,
          ]}
        >
          <Text
            style={[
              styles.dayText,
              state === "disabled" && styles.dayDisabled,
              hasJournal && styles.journalDayText,
              isSelected && styles.daySelectedText,
            ]}
          >
            {date.day}
          </Text>
        </TouchableOpacity>
      );
    }

    if (activeTab === "Analysis") {
      const hasAnalysis = !!analysisLogs[date.dateString];
      return (
        <TouchableOpacity
          onPress={() => onDayPress(date.dateString)}
          style={[
            styles.dayContainer,
            hasAnalysis && styles.analysisDay,
            isSelected && styles.daySelected,
          ]}
        >
          <Text
            style={[
              styles.dayText,
              state === "disabled" && styles.dayDisabled,
              hasAnalysis && styles.analysisDayText,
              isSelected && styles.daySelectedText,
            ]}
          >
            {date.day}
          </Text>
        </TouchableOpacity>
      );
    }

    // fallback — plain day for Routine with no logs
    return (
      <TouchableOpacity
        onPress={() => onDayPress(date.dateString)}
        style={[styles.dayContainer, isSelected && styles.daySelected]}
      >
        <Text
          style={[
            styles.dayText,
            state === "disabled" && styles.dayDisabled,
            isSelected && styles.daySelectedText,
          ]}
        >
          {date.day}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <View style={styles.toggle}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => onTabChange(tab)}
          >
            <Text
              style={[styles.label, activeTab === tab && styles.activeLabel]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Calendar
        key={currentMonth.format("YYYY-MM")}
        current={currentMonth.format("YYYY-MM-DD")}
        hideArrows={true}
        hideDayNames={false}
        renderHeader={() => null}
        onDayPress={(day) => onDayPress(day.dateString)}
        dayComponent={dayComponent}
      />
    </View>
  );
};

export default HomeCalendar;

const styles = StyleSheet.create({
  toggle: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 10,
  },
  activeTab: { backgroundColor: "#00CC99" },
  label: { fontSize: 13, color: "#666", fontWeight: "500" },
  activeLabel: { color: "#fff", fontWeight: "700" },
  dayContainer: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },
  daySelected: {
    borderWidth: 2,
    borderColor: "#00CC99",
    borderRadius: 18,
  },
  dayText: { fontSize: 14, color: "#1a1a1a" },
  journalDay: { backgroundColor: "#ffa600" },
  journalDayText: { color: "#fff" },
  analysisDay: { backgroundColor: "#a855f7" },
  analysisDayText: { color: "#fff" },
  dayDisabled: { color: "#ccc" },
  daySelectedText: { color: "#00CC99", fontWeight: "700" },
  iconWrapper: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  iconDayText: {
    position: "absolute",
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },
});
