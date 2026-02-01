import Button from "@/components/Button";
import Card from "@/components/Card";
import { ToastMessage } from "@/components/ToastMessage";
import Api from "@/services/Api";
import { router, useLocalSearchParams, Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";

const OTP = () => {
  const { email } = useLocalSearchParams();
  console.log(email);
  const [otp, setOtp] = useState("");

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      ToastMessage("error", "Invalid Code", "Enter a 6-digit code.");
      return;
    }

    try {
      const response = await Api.checkOtpAPI({ email, otp });
      const user_id = response.data.user_id;

      ToastMessage(
        "success",
        "OTP Verified",
        "You may now reset your password.",
      );

      router.push({
        pathname: "/ResetPassword",
        params: { user_id },
      });
    } catch (error) {
      ToastMessage(
        "error",
        "Invalid OTP",
        error.response?.data?.error || "Try again.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>A code was sent to:</Text>
        <Text style={styles.email}>{email}</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter 6-digit code"
          keyboardType="numeric"
          maxLength={6}
          value={otp}
          onChangeText={(text) => {
            if (/^\d*$/.test(text)) setOtp(text);
          }}
        />

        <Text style={styles.signUp}>
          Didn't get the code?{" "}
          <Link href="/Register" style={styles.signUpLink}>
            Resend It
          </Link>
        </Text>
        <Button title="Verify" onPress={handleSubmit} />
      </Card>
    </View>
  );
};

export default OTP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00cccc",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#00cccc",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "gray",
  },
  email: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 5,
    marginBottom: 25,
    backgroundColor: "#fff",
    color: "black",
  },

  signUp: {
    textAlign: "center",
    fontSize: 14,
    color: "gray",
    marginTop: 2,
  },

  signUpLink: {
    color: "#00CC99",
    fontWeight: "700",
  },
});
