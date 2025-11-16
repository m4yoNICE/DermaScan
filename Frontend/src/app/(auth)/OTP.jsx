import { StyleSheet, Text, View, TextInput } from "react-native";
import React, { useRef, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { router, useLocalSearchParams } from "expo-router";
import Api from "@/services/Api";

const OTP = () => {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const isNumber = text && !isNaN(text);

    if (isNumber) {
      const updated = [...otp];
      updated[index] = text;
      setOtp(updated);

      // Go to next box automatically
      if (index < 5) {
        inputs.current[index + 1]?.focus();
      }
      return;
    }

    // If user clears input
    if (text === "") {
      const updated = [...otp];
      updated[index] = "";
      setOtp(updated);
    }
  };

  const handleSubmit = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      alert("Please enter the full 6-digit code.");
      return;
    }
    console.log("Entered OTP:", code);
    try {
      const otpResult = await Api.checkOtpAPI({ email, otp: code });
      const user_id = response.data.user_id;
      ToastMessage(
        "success",
        "OTP Verified",
        "You may now reset your password."
      );
      router.push({
        pathname: "/ResetPassword",
        params: { user_id },
      });
    } catch (error) {
      console.log(error);
      ToastMessage(
        "error",
        "Invalid OTP",
        error.response?.data?.error || "Try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>Enter OTP</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, idx) => (
            <TextInput
              key={idx}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              ref={(ref) => (inputs.current[idx] = ref)}
              onChangeText={(text) => handleChange(text, idx)}
            />
          ))}
        </View>

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
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#00cccc",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 22,
    marginHorizontal: 5,
    color: "black",
  },
});
