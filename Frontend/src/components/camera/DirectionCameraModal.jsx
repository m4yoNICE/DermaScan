import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image, 
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
            {/* Added the reference image here */}
            <Image 
              source={require('../../../assets/images/face.png')} 
              style={styles.referenceImage}
              resizeMode="cover"
            />

            <Text style={styles.title}>Camera Guide</Text>

            <Text style={styles.subtitle}>
              To help us analyze your skin, please follow these simple steps:
            </Text>

            <View style={styles.instructionContainer}>
              <Text style={styles.text}>
                <Text style={styles.bold}>Clean & Bare:</Text> No makeup, just fresh skin.
              </Text>

              <Text style={styles.text}>
                <Text style={styles.bold}>Good Lighting:</Text> Natural or soft lighting, no harsh shadows.
              </Text>

              <Text style={styles.text}>
                <Text style={styles.bold}>Focus on Your Face:</Text> Keep your face in frame, no distractions.
              </Text>

              <Text style={styles.text}>
                <Text style={styles.bold}>Close-Up:</Text> Make sure we can clearly see your skin.
              </Text>

              <Text style={styles.text}>
                <Text style={styles.bold}>Stay Still:</Text> Hold your phone steady for a sharp shot.
              </Text>
            </View>

            <TouchableOpacity style={styles.agreeButton} onPress={onClose}>
              <Text style={styles.agreeText}>I understand</Text>
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
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  box: {
    width: "90%", 
    backgroundColor: "white",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 25,
    maxHeight: "85%",
    overflow: "hidden", 
  },
  referenceImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 15,
  },
  instructionContainer: {
    width: "100%",
  },
  text: {
    fontSize: 14,
    color: "#444",
    marginBottom: 12,
    lineHeight: 20,
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },
  agreeButton: {
    backgroundColor: "#4E8474",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    width: "100%", 
  },
  agreeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});