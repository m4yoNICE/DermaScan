import { StyleSheet, Text, View, Modal, ActivityIndicator } from "react-native";
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

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.loadingCard}>
          {timedOut ? (
            <Text style={styles.errorText}>
              Request timed out.{"\n"}Please try again.
            </Text>
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
    width: 100,
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
  },
});
