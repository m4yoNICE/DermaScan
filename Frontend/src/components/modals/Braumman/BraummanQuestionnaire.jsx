import { StyleSheet, Text, View, Modal, ScrollView } from "react-native";
import React, { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { ToastMessage } from "@/components/ToastMessage";
import Api from "@/services/Api";
import Hydration from "./Hydration";
import Sensitivity from "./Sensitivity";
import Pigmentation from "./Pigmentation";
import Aging from "./Aging";

const BraummanQuestionnaire = ({ visible, onClose }) => {
  const [oil, setOil] = useState(null);
  const [sensitive, setSkinSensitive] = useState(null);
  const [pigment, setPigment] = useState(null);
  const [aging, setAging] = useState(null);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState(null);

  const sections = [
    {
      Component: Hydration,
      onChange: setOil,
    },
    {
      Component: Sensitivity,
      onChange: setSkinSensitive,
    },
    {
      Component: Pigmentation,
      onChange: setPigment,
    },
    {
      Component: Aging,
      onChange: setAging,
    },
  ];
  const { Component: CurrentSection, onChange } = sections[index];

  const handleNext = () => {
    const currentValue = [oil, sensitive, pigment, aging][index];

    if (currentValue == null) {
      return showError("Please answer the current question");
    }

    if (index < sections.length - 1) {
      setIndex(index + 1);
      setError(null);
    } else {
      handleAnswer();
    }
  };

  const handleAnswer = async () => {
    if (oil == null || sensitive == null || pigment == null || aging == null) {
      return showError("Please complete all sections");
    }
    try {
      const skinData = {
        skin_type: oil,
        skin_sensitivity: sensitive,
        pigmentation: pigment,
        aging,
      };
      const res = await Api.updateSkinDataAPI(skinData);
      // Build code like DSNT
      const getInitial = (val) => val?.charAt(0)?.toUpperCase() || "";
      const code =
        getInitial(oil) +
        getInitial(sensitive) +
        getInitial(pigment) +
        getInitial(aging);
      ToastMessage(
        "success",
        "Finished Setting Up Profile",
        "Your Skin Code Is: " + code
      );
      onClose();
    } catch (err) {
      console.log("skindata error:", err);
      if (err.response) {
        showError(err.response.data.error || "Server error");
        console.error("Response data:", err.response.data);
      } else if (err.request) {
        console.error("No response received:", err.request);
        showError("No response from server. Check your internet");
      } else {
        console.error("Request setup error:", err.message);
        showError(err.message);
      }
    }
  };

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(null), 10000);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Card style={styles.card}>
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
          <ScrollView>
            <CurrentSection onChange={onChange} />
          </ScrollView>
          <Button
            title={index < sections.length - 1 ? "Next" : "Finish"}
            onPress={handleNext}
            style={styles.submitButton}
          />
        </Card>
      </View>
    </Modal>
  );
};
export default BraummanQuestionnaire;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    borderRadius: 12,
    padding: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00CC99",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 25,
  },
  section: {
    marginBottom: 20,
  },
  textWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginRight: 5,
  },
  icon: {
    marginTop: 2,
  },
  buttonRow: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  optionButton: {},
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
  },

  submitButton: {
    alignSelf: "center",
    marginTop: 15,
  },
  submitText: {
    color: "#00CC99",
    fontSize: 14,
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
