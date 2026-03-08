import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Card from "@/components/designs/Card";
import Button from "../designs/Button";
import Api from "@/services/Api";

const RoutineModal = ({ visible, item, onClose, onFinish }) => {
  if (!item) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <Card>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Image
              source={{ uri: Api.getProductImage(item.productImage) }}
              style={styles.image}
              resizeMode="cover"
            />

            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.productType}</Text>
            </View>

            <Text style={styles.name}>{item.productName}</Text>
            <Text style={styles.time}>{item.timeRoutine}</Text>

            <View style={styles.divider} />

            <Text style={styles.instructionLabel}>How to use</Text>
            <Text style={styles.instructions}>{item.instructions}</Text>
          </ScrollView>

          <Button title="Finished" onPress={onFinish} />
          <Button
            title="Close"
            onPress={onClose}
            style={styles.closeButton}
            textStyle={styles.closeText}
          />
        </Card>
      </View>
    </Modal>
  );
};

export default RoutineModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    marginBottom: 16,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#00CC9920",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    color: "#00CC99",
    fontWeight: "600",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  time: {
    fontSize: 13,
    color: "#888",
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 12,
  },
  instructionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  instructions: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
    marginBottom: 20,
  },
  finishButton: {
    backgroundColor: "#00CC99",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  finishText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  closeText: {
    color: "#888",
  },
});
