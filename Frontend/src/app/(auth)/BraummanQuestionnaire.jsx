import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { ToastMessage } from "@/components/ToastMessage";
import Api from "@/services/Api";
import Hydration from "@/components/modals/Braumman/Hydration";
import Sensitivity from "@/components/modals/Braumman/Sensitivity";
import Pigmentation from "@/components/modals/Braumman/Pigmentation";
import Aging from "@/components/modals/Braumman/Aging";
import { router } from "expo-router";

const BraummanQuestionnaire = () => {
  const [oil, setOil] = useState(null);
  const [sensitive, setSkinSensitive] = useState(null);
  const [pigment, setPigment] = useState(null);
  const [aging, setAging] = useState(null);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState(null);

  const sections = [
    { Component: Hydration, onChange: setOil },
    { Component: Sensitivity, onChange: setSkinSensitive },
    { Component: Pigmentation, onChange: setPigment },
    { Component: Aging, onChange: setAging },
  ];

  const { Component: CurrentSection, onChange } = sections[index];

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(null), 10000);
  };

  const handleNext = () => {
    const currentValue = [oil, sensitive, pigment, aging][index];
    if (currentValue == null)
      return showError("Please answer the current question");
    if (index < sections.length - 1) setIndex(index + 1);
    else handleAnswer();
  };

  const handleAnswer = async () => {
    if (oil == null || sensitive == null || pigment == null || aging == null)
      return showError("Please complete all sections");

    try {
      const skinData = {
        skin_type: oil,
        skin_sensitivity: sensitive,
        pigmentation: pigment,
        aging,
      };
      await Api.updateSkinDataAPI(skinData);

      const code = [oil, sensitive, pigment, aging]
        .map((v) => v?.charAt(0).toUpperCase() || "")
        .join("");
      ToastMessage(
        "success",
        "Finished Setting Up Profile",
        "Your Skin Code Is: " + code
      );

      router.push("/"); // navigate to home
    } catch (err) {
      console.error(err);
      showError("Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>Let's Know About You!</Text>
        <Text style={styles.subtitle}>
          We would like you to answer these questions to properly curate your
          skin.
        </Text>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <ScrollView style={{ maxHeight: 300 }}>
          <CurrentSection onChange={onChange} />
        </ScrollView>

        <Button
          title={index < sections.length - 1 ? "Next" : "Finish"}
          onPress={handleNext}
          style={{ marginTop: 20 }}
        />
      </Card>
    </View>
  );
};

export default BraummanQuestionnaire;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#00CC99",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: "#ffe6e6",
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ff9999",
  },
  errorText: {
    color: "#cc0000",
    fontSize: 14,
    textAlign: "center",
  },
});
