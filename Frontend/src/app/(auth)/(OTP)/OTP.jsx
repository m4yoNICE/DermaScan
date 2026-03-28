import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams, Link } from "expo-router";
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

const OTP = () => {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
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

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await Api.forgetPasswordAPI({ email });
      ToastMessage(
        "success",
        "OTP Sent",
        res.data.message || "Check your inbox.",
      );
    } catch (err) {
      showError(err.response?.data?.error || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      return showError("Enter a 6-digit code.");
    }

    try {
      setLoading(true);
      const response = await Api.checkOtpAPI({ email, otp });

      // Grabbing the token you keep forgetting about
      const { token } = response.data;

      ToastMessage(
        "success",
        "OTP Verified",
        "You may now reset your password.",
      );

      router.push({
        pathname: "/ResetPassword",
        params: { email, token },
      });
    } catch (err) {
      showError(err.response?.data?.error || "Invalid OTP. Try again.");
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
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backRow}
          >
            <Ionicons name="chevron-back" size={26} color="#666" />
          </TouchableOpacity>

          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>A code was sent to: {email}</Text>

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
              name="key"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <BottomSheetTextInput
              style={[styles.input, { letterSpacing: 5, fontSize: 20 }]}
              placeholder="000000"
              keyboardType="numeric"
              maxLength={6}
              value={otp}
              onChangeText={(text) => {
                if (/^\d*$/.test(text)) setOtp(text);
              }}
            />
          </View>

          <Button
            title="Verify"
            onPress={handleSubmit}
            style={styles.submitBtn}
          />

          <Text style={styles.resendText}>
            Didn't get the code?{" "}
            <Text style={styles.resendLink} onPress={handleResend}>
              Resend It
            </Text>
          </Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default OTP;

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
    color: "black",
  },
  submitBtn: {
    width: "100%",
    height: 55,
    backgroundColor: "#00CC99",
    borderRadius: 12,
    marginBottom: 15,
  },
  resendText: {
    textAlign: "center",
    fontSize: 14,
    color: "gray",
  },
  resendLink: {
    color: "#00CC99",
    fontWeight: "700",
  },
});
