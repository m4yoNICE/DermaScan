import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

const DirectionCameraModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <View style={styles.closeCircle}>
              <AntDesign name="close" size={18} color="#000" />
            </View>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Camera</Text>

            <Text style={styles.subtitle}>
              To help us analyze your skin, please follow these simple steps:
            </Text>

            <View style={styles.instructionContainer}>
              <Text style={styles.text}>
                <Text style={styles.bold}>1. Clean, Clear & Steady:</Text> Make
                sure your face is clean and there’s no makeup on.
              </Text>

              <Text style={styles.text}>
                <Text style={styles.bold}>2. Good Lighting:</Text> Stand in
                natural light or use a well-lit space. Avoid shadows and harsh
                light.
              </Text>

              <Text style={styles.text}>
                <Text style={styles.bold}>3. Close-up Shot:</Text> Take a
                close-up picture of your face, ensuring we can clearly see your
                skin texture and any areas of concern.
              </Text>

              <Text style={styles.text}>
                <Text style={styles.bold}>4. Stay Still:</Text> Hold your phone
                steady for a clear, focused image.
              </Text>
            </View>

            <TouchableOpacity style={styles.agreeButton} onPress={onClose}>
              <Text style={styles.agreeText}>I agree</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default DirectionCameraModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  box: {
    width: "95%", // Increased width to reach near edges
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 30,
    maxHeight: "85%",
  },
  closeBtn: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
  },
  closeCircle: {
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#777",
    lineHeight: 20,
    marginBottom: 15,
  },
  instructionContainer: {
    width: "100%",
  },
  text: {
    fontSize: 15,
    color: "#666",
    marginBottom: 10,
    lineHeight: 20,
  },
  bold: {
    fontWeight: "bold",
    color: "#444",
  },
  agreeButton: {
    backgroundColor: "#4E8474",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    alignSelf: "center",
    width: "60%",
  },
  agreeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
});
