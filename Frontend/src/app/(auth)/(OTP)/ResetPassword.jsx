import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
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

const ResetPassword = () => {
  const { email } = useLocalSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sheetRef = useRef(null);
  const snapPoints = ["60%", "90%"];

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

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      return showError("Please fill out both password fields.");
    }

    if (password !== confirmPassword) {
      return showError("Passwords do not match.");
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return showError(
        "Needs 8+ chars, uppercase, lowercase, number, & special char.",
      );
    }

    try {
      setLoading(true);
      await Api.resetPasswordAPI({ email, newPassword: password });
      ToastMessage("success", "Password Reset", "You can now log in.");
      router.push("/Login");
    } catch (err) {
      console.log("Reset error:", err);
      showError(
        err.response?.data?.error || "Failed to reset password. Try again.",
      );
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
          <Text style={styles.title}>New Password</Text>
          <Text style={styles.subtitle}>
            Enter a secure password for {email}
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

          {/* NEW PASSWORD */}
          <View style={styles.inputGroup}>
            <Feather
              name="lock"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <BottomSheetTextInput
              style={styles.input}
              placeholder="New Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Feather
                name={showPass ? "eye-off" : "eye"}
                size={20}
                color="#999"
                style={{ paddingHorizontal: 4 }}
              />
            </TouchableOpacity>
          </View>

          {/* CONFIRM PASSWORD */}
          <View style={styles.inputGroup}>
            <Feather
              name="shield"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <BottomSheetTextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPass}
            />
          </View>

          {/* RESET BUTTON */}
          <Button
            title="Reset Password"
            onPress={handleReset}
            style={styles.loginBtn}
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default ResetPassword;

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
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  loginBtn: {
    width: "100%",
    height: 55,
    backgroundColor: "#00CC99",
    borderRadius: 12,
    marginTop: 10,
  },
});
