import { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, Keyboard } from "react-native";
import { router, Link } from "expo-router";
import BottomSheet, {
  BottomSheetView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { Feather, Ionicons } from "@expo/vector-icons";
import Button from "@/components/designs/Button";
import { ToastMessage } from "@/components/designs/feedback/ToastMessage";
import LoadingModal from "@/components/designs/feedback/LoadingModal";
import Api from "@/services/Api";
import Landing4 from "@/components/landing/Landing4";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sheetRef = useRef(null);
  const snapPoints = ["55%", "90%"];

  useEffect(() => {
    const keyboardHide = Keyboard.addListener("keyboardDidHide", () => {
      sheetRef.current?.snapToIndex(0);
    });
    return () => {
      keyboardHide.remove();
    };
  }, []);

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(null), 7000);
  };

  const handleForgetPassword = async () => {
    if (!email.trim()) {
      return showError("Email is required.");
    }
    setLoading(true);
    try {
      const res = await Api.forgetPasswordAPI({ email: email.trim() });
      ToastMessage(
        "success",
        "OTP Sent",
        res.data.message || "Check your inbox.",
      );

      router.replace({
        pathname: "/OTP",
        params: { email: email.trim() },
      });
    } catch (err) {
      showError(err.response?.data?.error || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <LoadingModal
        visible={loading}
        onTimeout={() => {
          setLoading(false);
          ToastMessage("error", "Request timed out", "Please try again.");
        }}
      />

      <View style={styles.backgroundWrapper}>
        <View style={styles.landingScale}>
          <Landing4 />
        </View>
      </View>

      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        handleComponent={null}
        enableContentPanningGesture={false}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        animateOnMount={false}
        backgroundStyle={{
          backgroundColor: "white",
          borderRadius: 40,
        }}
      >
        <BottomSheetView style={styles.sheetContent}>
          {/* BACK BUTTON */}
          <View style={styles.backRow}>
            <Link href="/Login">
              <Ionicons name="chevron-back" size={26} color="#666" />
            </Link>
          </View>

          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            We'll send a 6-digit verification code to your email.
          </Text>

          {error && (
            <View style={styles.errorBox}>
              <Ionicons
                name="warning-outline"
                color="#cc0000"
                size={18}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Feather
              name="mail"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <BottomSheetTextInput
              style={styles.input}
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Button
            title="Send Code"
            onPress={handleForgetPassword}
            style={styles.submitBtn}
            icon={<Feather name="arrow-right-circle" size={20} color="white" />}
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#05d6b2",
  },
  landingScale: {
    transform: [{ scale: 0.9 }],
  },
  backgroundWrapper: {
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  sheetContent: {
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 50,
  },
  backRow: {
    width: "100%",
    marginBottom: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 5,
    color: "#00CC99",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#868585ff",
    marginBottom: 20,
  },
  errorBox: {
    flexDirection: "row",
    backgroundColor: "#ffe6e6",
    borderColor: "#ff9999",
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
    borderWidth: 1,
    alignItems: "center",
  },
  errorText: {
    color: "#cc0000",
    fontSize: 14,
    flex: 1,
    paddingRight: 5,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    marginBottom: 25,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  submitBtn: {
    width: "100%",
    height: 55,
    backgroundColor: "#00CC99",
    borderRadius: 12,
    marginBottom: 15,
  },
});
