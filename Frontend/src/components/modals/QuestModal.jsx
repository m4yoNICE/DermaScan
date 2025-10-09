import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Card from "../Card";
import Button from "../Button";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import SkinTypeGuideModal from "./SkinTypeGuideModal";
import SkinSensitivityGuideModal from "./SkinSensitivityGuideModal";
import Api from "@/services/Api";
import ToastMessage from "../ToastMessage";
const QuestModal = ({ visible, onClose }) => {
  const [skinType, setSkinType] = useState(null);
  const [skinSensitive, setSkinSensitive] = useState(null);
  const [error, setError] = useState(null);

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(null), 10000);
  };
  // guide dialogs
  const [showSkinTypeGuide, setShowSkinTypeGuide] = useState(false);
  const [showSensitivityGuide, setShowSensitivityGuide] = useState(false);

  const handleAnswer = async () => {
    if (skinType == null || skinSensitive == null) {
      return showError("Please fill out all required fields");
    }
    try {
      const skin_type = skinType;
      const skin_sensitivity = skinSensitive;
      const skinData = { skin_type, skin_sensitivity };
      const res = await Api.updateSkinDataAPI(skinData);
      console.log(res);
      ToastMessage("success", "Finished Setting Up Profile", "Welcome! 👋");
      onClose();
    } catch (err) {
      console.log("skindata error:", err);

      if (err.response) {
        showError(err.response.data.error || "Server error");
      } else if (err.request) {
        showError("No response from server. Check your internet");
        console.log(err.request);
      } else {
        showError(err.message);
        console.log(err.message);
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      {/* Guide Dialogs */}
      <SkinTypeGuideModal
        visible={showSkinTypeGuide}
        onClose={() => setShowSkinTypeGuide(false)}
      />

      <SkinSensitivityGuideModal
        visible={showSensitivityGuide}
        onClose={() => setShowSensitivityGuide(false)}
      />

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
          {/* Skin Type Section */}
          <View style={styles.section}>
            <View style={styles.textWithIcon}>
              <Text style={styles.text}>What is your skin type?</Text>
              <TouchableOpacity onPress={() => setShowSkinTypeGuide(true)}>
                <EvilIcons
                  name="question"
                  size={22}
                  color="#00CC99"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              {["Oily", "Dry", "Normal", "Combination"].map((type) => {
                const isSelected = skinType === type.toLowerCase();
                return (
                  <Button
                    key={type}
                    title={type}
                    onPress={() => setSkinType(type.toLowerCase())}
                    style={{
                      width: "45%",
                      marginVertical: 5,
                      borderWidth: 1,
                      borderColor: isSelected ? "#00CC99" : "#ddd",
                      backgroundColor: isSelected ? "#00CC99" : "#f9f9f9",
                    }}
                    textStyle={{
                      fontSize: 12,
                      fontWeight: "500",
                      color: isSelected ? "#fff" : "#1a1a1a",
                    }}
                  />
                );
              })}
            </View>
          </View>

          {/* Skin Sensitivity Section */}
          <View style={styles.section}>
            <View style={styles.textWithIcon}>
              <Text style={styles.text}>Is your skin sensitive?</Text>
              <TouchableOpacity onPress={() => setShowSensitivityGuide(true)}>
                <EvilIcons
                  name="question"
                  size={22}
                  color="#00CC99"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              {[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ].map((opt) => {
                const isSelected = skinSensitive === opt.value;
                return (
                  <Button
                    key={opt.label}
                    title={opt.label}
                    onPress={() => setSkinSensitive(opt.value)}
                    style={{
                      width: "45%",
                      marginVertical: 5,
                      borderWidth: 1,
                      borderColor: isSelected ? "#00CC99" : "#ddd",
                      backgroundColor: isSelected ? "#00CC99" : "#f9f9f9",
                    }}
                    textStyle={{
                      fontSize: 16,
                      fontWeight: "500",
                      color: isSelected ? "#fff" : "#1a1a1a",
                    }}
                  />
                );
              })}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity onPress={handleAnswer} style={styles.submitButton}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </Modal>
  );
};

export default QuestModal;

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
