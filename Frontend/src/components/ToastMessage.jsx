import { StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export const ToastMessage = (type, message, description) => {
  Toast.show({
    type,
    text1: message,
    text2: description,
    position: "bottom",
    visibilityTime: 3000,
  });
};

const styles = StyleSheet.create({});
