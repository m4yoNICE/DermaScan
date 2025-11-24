import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, View } from "react-native";

const Landing2 = () => (
  <View style={styles.page}>
    <LinearGradient
      colors={["rgba(255,255,255,0.30)", "transparent"]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={styles.topHighlight}
    />
    <Image
      source={require("../../../assets/images/landing2.png")}
      style={styles.image}
    />
    <Text style={styles.title}>DermaScan+</Text>
    <Text style={styles.subtitle}>
      Get your skin scanned and be informed of your skin needs!
    </Text>
  </View>
);

export default Landing2;
const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#05d6b2",
    paddingBottom: 200,
  },
  topHighlight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 120, // adjust thickness
  },

  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
