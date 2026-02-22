import { TouchableOpacity, StyleSheet } from "react-native";

export default function CircularButton({
  onPress,
  children,
  size = 50,
  style,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        styles.button,
        style,
      ]}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#00CC99",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
});
