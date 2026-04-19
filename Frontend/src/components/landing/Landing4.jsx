import { Image, StyleSheet, Text, View } from "react-native";

const Landing4 = () => (
  <View style={styles.page}>
    <View style={styles.imageWrapper}>
      <Image
        source={require("../../../assets/images/Landing4.png")}
        style={styles.image}
      />
      <Text style={styles.title}>DermaScan+</Text>
    </View>
  </View>
);
export default Landing4;
const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#05d6b2",
    paddingBottom: 200,
  },
  imageWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
    letterSpacing: 0,
    lineHeight: 22,
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: "contain",
  },
});
