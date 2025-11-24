import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, View } from "react-native";

const Landing3 = () => (
  <View style={styles.page}>
    <LinearGradient
      colors={["rgba(255,255,255,0.30)", "transparent"]}
      start={{ x: 1, y: 0.5 }}
      end={{ x: 0, y: 0.5 }}
      style={styles.topHighlight}
    />
    <Image
      source={require("../../../assets/images/landing3.png")}
      style={styles.image}
    />
    <View style={styles.textRight}>
      <Text style={styles.titleRight}>DermaScan+</Text>
      <Text style={styles.subtitleRight}>
        Keep logs with your skin updates here in Dermascan+
      </Text>
    </View>
  </View>
);

export default Landing3;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#05d6b2",
    paddingBottom: 180,
  },
  topHighlight: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: 150,
  },
  image: {
    width: "100%",
    height: "60%",
    resizeMode: "contain",
    marginTop: "30%",
  },
  textRight: {
    width: "100%",
    alignItems: "flex-end",
    paddingRight: 30,
  },
  titleRight: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "right",
    marginBottom: 6,
  },
  subtitleRight: {
    fontSize: 14,
    color: "white",
    textAlign: "right",
    lineHeight: 20,
    width: "80%",
  },
});
