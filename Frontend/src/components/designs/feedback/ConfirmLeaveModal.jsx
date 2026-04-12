import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ConfirmLeaveModal = ({
  visible,
  title = "Finish your skin profile?",
  message = "Your answers help us personalize product recommendations. If you leave now, your progress won't be saved.",
  continueLabel = "Continue",
  onContinue,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={onContinue}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <View style={styles.iconRow}>
            <MaterialCommunityIcons
              name="information-outline"
              size={28}
              color="#00CC99"
            />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{message}</Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={onContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryText}>{continueLabel}</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
export default ConfirmLeaveModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  iconRow: { alignItems: "center", marginBottom: 12 },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 10,
  },
  body: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 22,
  },
  actions: { gap: 10 },
  primaryBtn: {
    backgroundColor: "#00CC99",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  secondaryBtn: { paddingVertical: 12, alignItems: "center" },
  secondaryText: { color: "#888", fontSize: 15, fontWeight: "600" },
});
