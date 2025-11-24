import { Image, StyleSheet, Text, View } from "react-native";

const Landing4 = () => (
  <View style={styles.page}>
    <View style={styles.imageWrapper}>
      <Image
        source={require("../../../assets/images/landing1.png")}
        style={styles.image}
      />
      <View style={styles.textOverlay}>
        <Text style={styles.title}>DermaScan+</Text>
      </View>
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
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  textOverlay: {
    position: "absolute",
    bottom: 15,
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
});
