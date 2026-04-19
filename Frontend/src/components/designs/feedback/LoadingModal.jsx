import {
  StyleSheet,
  Text,
  View,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";

const LoadingModal = ({ visible, onTimeout }) => {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!visible) {
      setTimedOut(false);
      return;
    }

    const timer = setTimeout(() => {
      setTimedOut(true);
      onTimeout?.();
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [visible]);

  const handleDismiss = () => {
    onTimeout?.();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.loadingCard}>
          {timedOut ? (
            <>
              <Text style={styles.errorText}>
                Request timed out.{"\n"}Please try again.
              </Text>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={handleDismiss}
                activeOpacity={0.7}
              >
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </>
          ) : (
            <ActivityIndicator size="large" color="#00CC99" />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingCard: {
    minWidth: 160,
    paddingVertical: 30,
    paddingHorizontal: 30,
    borderRadius: 15,
    backgroundColor: "white",
    alignItems: "center",
    elevation: 6,
  },
  errorText: {
    color: "#e53e3e",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 12,
  },
  closeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#00CC99",
    borderRadius: 8,
  },
  closeBtnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
