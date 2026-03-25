import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

import JournalSection from "./bottomsheetSections/JournalSection";
import AnalysisSection from "./bottomsheetSections/AnalysisSection";

const HomeBottomSheet = ({ sheetRef, selectedDate, calendarTab }) => {
  const [activeTab, setActiveTab] = useState(
    calendarTab === "Analysis" ? "Analysis" : "Journal",
  );

  useEffect(() => {
    setActiveTab(calendarTab === "Analysis" ? "Analysis" : "Journal");
  }, [calendarTab]);

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={["50%", "85%"]}
      enablePanDownToClose
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={1}
          appearsOnIndex={2}
        />
      )}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={{ backgroundColor: "#ccc" }}
    >
      <BottomSheetView style={styles.content}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab("Analysis")}
            style={[styles.tab, activeTab === "Analysis" && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Analysis" && styles.activeTabText,
              ]}
            >
              Analysis
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

        <View style={styles.sectionWrapper}>
          {activeTab === "Analysis" ? (
            <AnalysisSection selectedDate={selectedDate} />
          ) : (
            <JournalSection selectedDate={selectedDate} />
          )}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default HomeBottomSheet;

const styles = StyleSheet.create({
  sheetBackground: {
    borderRadius: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
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
  sectionWrapper: {
    flex: 1,
    paddingTop: 15,
  },
});
