import { useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import PagerView from "react-native-pager-view";

import Landing1 from "@/components/landing/Landing1";
import Landing2 from "@/components/landing/Landing2";
import Landing3 from "@/components/landing/Landing3";
import Landing4 from "@/components/landing/Landing4";

import Button from "@/components/designs/Button";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";

const LandingPage = () => {
  const screenHeight = Dimensions.get("window").height;
  const pagerRef = useRef(null);
  const [page, setPage] = useState(0);

  const sheetHeight = screenHeight * 0.15;
  const dotBottomOffset = sheetHeight + 20;
  const nextPage = () => {
    if (page < 3) {
      pagerRef.current.setPage(page + 1);
    }
  };

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.fullPager}
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        <View key="1">
          <Landing1 />
        </View>
        <View key="2">
          <Landing2 />
        </View>
        <View key="3">
          <Landing3 />
        </View>
        <View key="4">
          <Landing4 />
        </View>
      </PagerView>

      <View style={[styles.dotsContainer, { bottom: dotBottomOffset }]}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.dot, page === i && styles.dotActive]} />
        ))}
      </View>

      <BottomSheet
        index={0}
        snapPoints={page === 3 ? ["35%"] : ["15%"]} // Taller for login screen
        enablePanDownToClose={false}
        handleComponent={null}
        enableContentPanningGesture={false}
        backgroundStyle={{
          backgroundColor: "white",
          borderRadius: 40,
        }}
      >
        <BottomSheetView
          style={{ minHeight: "100%", paddingTop: 20, paddingBottom: 20 }}
        >
          {page === 3 ? (
            <View style={styles.authContainer}>
              <Text style={styles.glowUpText}>Glow-up begins now.</Text>
              <Text style={styles.subText}>
                Get your skincare bases, cuts by DermaScan+!
              </Text>
              <Button
                title="Register"
                onPress={() => router.push("/Register")}
                style={styles.registerButton}
                textStyle={styles.buttonText}
              />
              <Button
                title="Login"
                onPress={() => router.push("/Login")}
                style={styles.loginButton}
                textStyle={styles.loginButtonText}
              />
            </View>
          ) : (
            <Button
              title="Next"
              onPress={nextPage}
              style={{
                width: 300,
                height: 60,
                alignSelf: "center",
                borderRadius: 15,
              }}
              textStyle={{ fontSize: 25, fontWeight: "800" }}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  container: { flex: 1 },

  fullPager: {
    flex: 1,
  },

  dotsContainer: {
    position: "absolute",
    bottom: "22%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },

  dot: {
    width: 8,
    height: 8,
    backgroundColor: "#ccc",
    borderRadius: 50,
    marginHorizontal: 4,
  },

  dotActive: {
    backgroundColor: "#00CC99",
    width: 10,
    height: 10,
  },

  nextButton: {
    backgroundColor: "#00CC99",
    alignSelf: "center",
    width: "85%",
    paddingVertical: 16,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center",
  },

  nextText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },

  authContainer: {
    paddingHorizontal: 30,
    alignItems: "center",
  },
  glowUpText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  registerButton: {
    width: "100%",
    height: 55,
    backgroundColor: "#00CC99",
    borderRadius: 12,
    marginBottom: 12,
  },
  loginButton: {
    width: "100%",
    height: 55,
    backgroundColor: "transparent",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#00CC99",
  },
  loginButtonText: {
    color: "#00CC99",
    fontSize: 18,
    fontWeight: "700",
  },
});
