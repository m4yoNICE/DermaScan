import * as React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import Dialog from "react-native-dialog";

const SkinTypeGuideDialog = ({ visible, onClose }) => {
  return (
    <View>
      <Dialog.Container visible={visible} onBackdropPress={onClose}>
        <Dialog.Title style={styles.title}>Guide</Dialog.Title>

        <Dialog.Description style={styles.description}>
          The 30-minute rule is a simple test to determine your skin type: after
          washing your face and patting it dry, wait 30 minutes and observe:
        </Dialog.Description>

        {/* Image row */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../assets/images/washingface.jpg")}
            style={styles.image}
          />
          <Image
            source={require("../../../assets/images/lettingfacedry.jpg")}
            style={styles.image}
          />
        </View>

        {/* Bullet list */}
        <View style={styles.listContainer}>
          <Text style={styles.iftext}>
            • If your face feels tight or flaky —{" "}
            <Text style={styles.bold}>Dry Skin</Text>
          </Text>
          <Text style={styles.iftext}>
            • If only your T-zone is shiny —{" "}
            <Text style={styles.bold}>Normal Skin</Text>
          </Text>
          <Text style={styles.iftext}>
            • If your whole face appears shiny or greasy —{" "}
            <Text style={styles.bold}>Oily Skin</Text>
          </Text>
        </View>

        <Dialog.Button label="Close" onPress={onClose} />
      </Dialog.Container>
    </View>
  );
};

export default SkinTypeGuideDialog;

const styles = StyleSheet.create({
  title: {
    fontWeight: "700",
    color: "#00CC99",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
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
