import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, View } from "react-native";

const Landing1 = () => (
  <View style={styles.page}>
    <LinearGradient
      colors={["rgba(255,255,255,0.30)", "transparent"]}
      style={styles.topHighlight}
    />
    <View style={styles.imageWrapper}>
      <Image
        source={require("../../../assets/images/landing1.png")}
        style={styles.image}
      />
      <View style={styles.textOverlay}>
        <Text style={styles.title}>DermaScan+</Text>
        <Text style={styles.subtitle}>Let's unlock your skin story.</Text>
      </View>
    </View>
  </View>
);
export default Landing1;
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
    left: 0,
    right: 0,
    height: 250,
  },
  imageWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  image: {
    width: 400,
    height: 400,
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
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
