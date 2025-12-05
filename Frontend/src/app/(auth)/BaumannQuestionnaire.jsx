import { ToastMessage } from "@/components/ToastMessage";
import Api from "@/services/Api";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

// Pagers (you will create these next)
import Aging from "@/components/modals/Braumman/Aging";
import Hydration from "@/components/modals/Braumman/Hydration";
import Pigmentation from "@/components/modals/Braumman/Pigmentation";
import Sensitivity from "@/components/modals/Braumman/Sensitivity";

const BaumannQuestionnaire = () => {
  const [oil, setOil] = useState(null);
  const [sensitive, setSensitive] = useState(null);
  const [pigment, setPigment] = useState(null);
  const [aging, setAging] = useState(null);

  const [index, setIndex] = useState(0); // which section we are on

  const sections = [
    { Component: Hydration, setter: setOil },
    { Component: Sensitivity, setter: setSensitive },
    { Component: Pigmentation, setter: setPigment },
    { Component: Aging, setter: setAging },
  ];

  const handleSectionDone = (value) => {
    if (!value) {
      ToastMessage("error", "Incomplete", "Please answer the question.");
      return;
    }

    // Save section result
    sections[index].setter(value);

    // Move to next section or finish
    if (index < sections.length - 1) {
      setIndex(index + 1);
    } else {
      finishAll();
    }
  };

  const finishAll = async () => {
    if (!oil || !sensitive || !pigment || !aging) {
      ToastMessage("error", "Incomplete", "Please complete all sections.");
      return;
    }

    try {
      const skinData = {
        skin_type: oil,
        skin_sensitivity: sensitive,
        pigmentation: pigment,
        aging,
      };

      await Api.updateSkinDataAPI(skinData);

      const code = [oil, sensitive, pigment, aging]
        .map((v) => v.charAt(0).toUpperCase())
        .join("");

      ToastMessage(
        "success",
        "Profile Completed",
        "Your Baumann Skin Code is: " + code
      );

      router.push("/Home");
    } catch (err) {
      console.error(err);
      ToastMessage("error", "Error", "Something went wrong. Please try again.");
    }
  };

  const CurrentPager = sections[index].Component;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Let's Know About You!</Text>
      <Text style={styles.subtitle}>
        Answer these questions to properly curate your skin type.
      </Text>

      {/* current section pager */}
      <CurrentPager onDone={handleSectionDone} style={{ flex: 1 }} />

      {/* Progress indicator */}
      {/* <View style={styles.stepRow}>
        {sections.map((_, i) => (
          <View
            key={i}
            style={[styles.stepDot, index === i && styles.stepActive]}
          />
        ))}
      </View> */}

      {/* Optional Back button
      {index > 0 && (
        <Button
          title="Back"
          onPress={() => setIndex(index - 1)}
          style={{ marginTop: 10 }}
        />
      )} */}
    </View>
  );
};

export default BaumannQuestionnaire;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#00CC99",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  stepRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  stepActive: {
    backgroundColor: "#00CC99",
  },
});
