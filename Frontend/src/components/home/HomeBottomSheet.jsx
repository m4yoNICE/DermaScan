import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import JournalSection from "./JournalSection";
import ReminderSection from "./ReminderSection";

const HomeBottomSheet = ({ sheetRef, selectedDate }) => {
  const [activeTab, setActiveTab] = useState("Routine");

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={["50%", "85%"]} // Adjusted to match the taller UI in the pic
      enablePanDownToClose
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      )}
      backgroundStyle={styles.sheetBackground}
    >
      <View style={styles.content}>
        {/* Tab Headers */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab("Routine")}
            style={[styles.tab, activeTab === "Routine" && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Routine" && styles.activeTabText,
              ]}
            >
              Routine
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("Journal")}
            style={[styles.tab, activeTab === "Journal" && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Journal" && styles.activeTabText,
              ]}
            >
              Journal
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conditional Content */}
        {activeTab === "Routine" ? (
          <ReminderSection selectedDate={selectedDate} />
        ) : (
          <JournalSection selectedDate={selectedDate} />
        )}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetBackground: {
    borderRadius: 40, // Match the heavy rounding in image_4664bd.png
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 15,
    width: "50%",
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#00CC99",
  },
  tabText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#888",
  },
  activeTabText: {
    color: "#00CC99",
  },
});

export default HomeBottomSheet;
