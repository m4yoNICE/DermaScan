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
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <AntDesign name="close" size={22} color="#444" />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Title */}
            <Text style={styles.title}>Camera</Text>

            {/* Instructions */}
            <Text style={styles.text}>
              To help us analyze your skin, please follow these simple steps:
            </Text>

            <Text style={styles.text}>
              1. <Text style={styles.bold}>Clean, Clear & Steady:</Text> Make
              sure your face is clean and there’s no makeup on.
            </Text>

            <Text style={styles.text}>
              2. <Text style={styles.bold}>Good Lighting:</Text> Stand in
              natural light or use a well-lit space. Avoid shadows and harsh
              light.
            </Text>

            <Text style={styles.text}>
              3. <Text style={styles.bold}>Close-up Shot:</Text> Take a close-up
              picture of your face, ensuring we can clearly see your skin
              texture and any areas of concern.
            </Text>

            <Text style={styles.text}>
              4. <Text style={styles.bold}>Stay Still:</Text> Hold your phone
              steady for a clear, focused image.
            </Text>

            {/* Agree Button */}
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
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  box: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    paddingTop: 30,
    maxHeight: "90%",
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111",
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
    lineHeight: 22,
  },
  bold: {
    fontWeight: "700",
  },
  warningBox: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#ffe5e5",
    borderWidth: 1,
    borderColor: "#ff9999",
    borderRadius: 6,
  },
  warningText: {
    color: "#a10000",
    fontSize: 14,
    lineHeight: 20,
  },
  agreeButton: {
    backgroundColor: "#1e7d64",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 10,
  },
  agreeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
