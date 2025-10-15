import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useRef } from "react";

const DirectionCameraModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <ScrollView>
            <Text style={styles.modalTitle}>Camera Instructions</Text>
            <Text style={styles.instruction}>
              1. <Text style={styles.bold}>Clean, Clear & Steady:</Text> No
              makeup, fresh skin.
            </Text>
            <Text style={styles.instruction}>
              2. <Text style={styles.bold}>Good Lighting:</Text> Use natural or
              well-lit space.
            </Text>
            <Text style={styles.instruction}>
              3. <Text style={styles.bold}>Focus:</Text> Keep your face in
              frame.
            </Text>
            <Text style={styles.instruction}>
              4. <Text style={styles.bold}>Close-up:</Text> Ensure skin details
              are visible.
            </Text>
            <Text style={styles.instruction}>
              5. <Text style={styles.bold}>Stay Still:</Text> Hold steady for
              clarity.
            </Text>

            <TouchableOpacity style={styles.agreeButton} onPress={onClose}>
              <Text style={styles.agreeText}>I Agree</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default DirectionCameraModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "teal",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  instruction: { fontSize: 16, marginBottom: 10, color: "white" },
  bold: { fontWeight: "bold", color: "white" },
  agreeButton: {
    marginTop: 20,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  agreeText: { color: "teal", fontWeight: "bold", fontSize: 16 },
});
