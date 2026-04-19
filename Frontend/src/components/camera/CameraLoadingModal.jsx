import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const CameraLoadingModal = ({ visible, onTimeout }) => {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!visible) {
      setTimedOut(false);
      return;
    }
    const timer = setTimeout(() => {
      setTimedOut(true);
    }, 40000);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.fullScreen}>
        {timedOut ? (
          <>
            <Text style={styles.timeoutText}>
              Request timed out.{"\n"}Please try again.
            </Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onTimeout}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </>
        ) : (
          <ActivityIndicator size="large" color="#fff" />
        )}
      </View>
    </Modal>
  );
};

export default CameraLoadingModal;

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  timeoutText: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 12,
  },
  closeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: "#00CC99",
    borderRadius: 8,
  },
  closeBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
