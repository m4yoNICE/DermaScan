import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Api from "@/services/Api";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { ToastMessage } from "@/components/ToastMessage";
import { router } from "expo-router";
const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgetPassword = async () => {
    if (!email.trim()) {
      ToastMessage("error", "Missing Input", "Email is required.");
      return;
    }
    setLoading(true);
    try {
      const res = await Api.forgetPasswordAPI({ email });
      ToastMessage(
        "success",
        "OTP Sent",
        res.data.message || "Check your inbox."
      );
      router.replace({
        pathname: "/OTP",
        params: { email },
      });
    } catch (err) {
      console.log(err);

      ToastMessage(
        "error",
        "Error",
        err.response?.data?.error || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>Forgot Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#00CC99"
            style={{ marginTop: 15 }}
          />
        ) : (
          <Button title="Submit" onPress={handleForgetPassword} />
        )}
      </Card>
    </View>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00cccc",
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#00cccc",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
});
