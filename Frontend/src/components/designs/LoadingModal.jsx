import { StyleSheet, View, Modal, ActivityIndicator } from "react-native";
import React from "react";

const LoadingModal = ({ visible }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#00CC99" />
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
});
