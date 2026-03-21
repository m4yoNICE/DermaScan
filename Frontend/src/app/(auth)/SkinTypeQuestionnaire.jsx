import { router } from "expo-router";
import { useState, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import ZhangSlider from "@/components/designs/ZhangSlider";
import Button from "@/components/designs/Button";
import { calculateSkinType } from "@/utils/skinCalculator";
import { ToastMessage } from "@/components/designs/feedback/ToastMessage";
import Api from "@/services/Api";
import LoadingModal from "@/components/designs/feedback/LoadingModal";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const OIL_QUESTIONS = [
  "How would you describe your overall skin type?",
  "How oily does your skin feel throughout the day?",
  "After washing your face with soap, how does your skin feel within 5 seconds? (Tight and dry = 1, Very oily = 5)",
  "How much shine does your face show in photos?",
  "How oily is your T-zone (forehead and nose)?",
  "How clogged are your comedomes (whiteheads/blackheads)?",
];

const SEN_QUESTIONS = [
  "How sensitive is your skin overall?",
  "How often do you experience a burning sensation on your face?",
  "How often do you experience a tingling sensation?",
  "How often do you experience itching on your face?",
  "How often do you experience skin tightness?",
];

const SkinTypeQuestionnaire = () => {
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState(0); // 0 = oil, 1 = sensitivity
  const [questionIndex, setQuestionIndex] = useState(0);
  const [oilAnswers, setOilAnswers] = useState(Array(6).fill(3));
  const [senAnswers, setSenAnswers] = useState(Array(5).fill(3));
  const sheetRef = useRef(null);

  const questions = section === 0 ? OIL_QUESTIONS : SEN_QUESTIONS;
  const answers = section === 0 ? oilAnswers : senAnswers;
  const setAnswers = section === 0 ? setOilAnswers : setSenAnswers;
  const totalSections = 2;
  const totalQuestions = questions.length;

  const currentValue = answers[questionIndex];

  const handleSlider = (val) => {
    const updated = [...answers];
    updated[questionIndex] = val;
    setAnswers(updated);
  };

  const handleNext = async () => {
    // more questions in current section
    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex(questionIndex + 1);
      return;
    }

    // move to sensitivity section
    if (section === 0) {
      setSection(1);
      setQuestionIndex(0);
      return;
    }

    // done — calculate and submit
    try {
      setLoading(true);
      const { skinType, skinSensitivity } = calculateSkinType(
        oilAnswers,
        senAnswers,
      );

      await Api.createJournalAPI({ skinType, skinSensitivity });
      ToastMessage(
        "success",
        "Done",
        `Your skin type: ${skinType}, ${skinSensitivity}`,
      );
      router.push("/Home");
    } catch (err) {
      console.error(err);
      ToastMessage("error", "Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    } else if (section > 0) {
      setSection(section - 1);
      setQuestionIndex(OIL_QUESTIONS.length - 1);
    }
  };

  const isFirst = section === 0 && questionIndex === 0;
  const isLast = section === 1 && questionIndex === SEN_QUESTIONS.length - 1;
  const globalIndex =
    section === 0 ? questionIndex : OIL_QUESTIONS.length + questionIndex;
  const totalAll = OIL_QUESTIONS.length + SEN_QUESTIONS.length;
  const progress = (globalIndex + 1) / totalAll;

  return (
    <View style={styles.root}>
      {/* Green top — question lives here */}
      <View style={styles.top}>
        <Text style={styles.sectionLabel}>
          {section === 0 ? "Part 1: Oiliness" : "Part 2: Sensitivity"}
        </Text>
        <Text style={styles.questionText}>{questions[questionIndex]}</Text>
        {/* Progress */}
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>
        <Text style={styles.progressText}>
          {globalIndex + 1} of {totalAll}
        </Text>
      </View>

      {/* BottomSheet — slider and nav */}
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={["55%"]}
        enablePanDownToClose={false}
        enableContentPanningGesture={false}
        handleComponent={null}
        backgroundStyle={{ borderRadius: 40, backgroundColor: "#fff" }}
      >
        <BottomSheetView style={styles.sheetContent}>
          <Text style={styles.scaleHint}>1 = Not at all · 5 = Extremely</Text>

          <ZhangSlider
            label={section === 0 ? "Oiliness" : "Sensitivity"}
            value={currentValue}
            onValueChange={handleSlider}
          />

          <View style={styles.navRow}>
            {!isFirst && (
              <Button
                title="Back"
                onPress={handleBack}
                style={styles.backBtn}
                textStyle={styles.backText}
              />
            )}
            <Button
              title={isLast ? "Finish" : "Next"}
              onPress={handleNext}
              style={styles.nextBtn}
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default SkinTypeQuestionnaire;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#00CC99",
  },
  top: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 20,
    justifyContent: "center",
  },
  sectionLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  questionText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 32,
    marginBottom: 32,
  },
  progressTrack: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: 4,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    textAlign: "right",
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
    flex: 1,
    justifyContent: "space-between",
  },
  scaleHint: {
    fontSize: 13,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 8,
  },
  navRow: {
    flexDirection: "row",
    gap: 12,
  },
  backBtn: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 0,
    marginBottom: 0,
  },
  backText: {
    color: "#888",
  },
  nextBtn: {
    flex: 1,
    marginTop: 0,
    marginBottom: 0,
  },
});