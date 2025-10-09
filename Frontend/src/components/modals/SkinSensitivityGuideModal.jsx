import * as React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import Dialog from "react-native-dialog";

const SkinSensitivityGuideModal = ({ visible, onClose }) => {
  return (
    <View>
      <Dialog.Container visible={visible} onBackdropPress={onClose}>
        <Dialog.Title style={styles.title}>Guide</Dialog.Title>

        <Dialog.Description style={styles.description}>
          You can identify sensitive skin by observing recurring symptoms like
          redness, stinging, burning, or itching after exposure to specific
          products, ingredients, or environmental factors like pollution or
          extreme temperatures.
        </Dialog.Description>

        <Dialog.Button label="Close" onPress={onClose} />
      </Dialog.Container>
    </View>
  );
};

export default SkinSensitivityGuideModal;

const styles = StyleSheet.create({
  title: {
    fontWeight: "700",
    color: "#00CC99",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "justify",
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10, // if not supported, use marginRight below
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  listContainer: {
    alignSelf: "flex-start",
    marginVertical: 8,
  },
  iftext: {
    fontSize: 13,
    color: "#444",
    marginBottom: 6,
    lineHeight: 18,
  },
  bold: {
    fontWeight: "bold",
    color: "#222",
  },
});
