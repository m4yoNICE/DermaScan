import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Api from "@/services/Api";
import Button from "@/components/designs/Button";
import Card from "@/components/designs/Card";
import { ToastMessage } from "@/components/designs/ToastMessage";
import { router, Link } from "expo-router";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

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
      console.log(email);
      const res = await Api.forgetPasswordAPI({ email });
      console.log(res);
      ToastMessage(
        "success",
        "OTP Sent",
        res.data.message || "Check your inbox.",
      );

      router.replace({
        pathname: "/OTP",
        params: { email },
      });
    } catch (err) {
      ToastMessage(
        "error",
        "Error",
        err.response?.data?.error || "Something went wrong.",
      );
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        {/* back button */}
        <View style={styles.topRow}>
          <Link href="/Login">
            <Ionicons name="chevron-back" size={24} color="#777" />
          </Link>
        </View>

        {/* lock icon */}
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="lock-reset" size={60} color="#00ccaa" />
        </View>

        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          We'll send a verification code to your email to reset your password.
        </Text>

        {/* email input with icon */}
        <View style={styles.inputContainer}>
          <Feather
            name="mail"
            size={20}
            color="#999"
            style={{ marginRight: 10 }}
          />
          <TextInput
            style={styles.input}
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#00CC99"
            style={{ marginTop: 20 }}
          />
        ) : (
          <Button
            title="Send Code"
            onPress={handleForgetPassword}
            icon={<Feather name="arrow-right-circle" size={20} color="white" />}
          />
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
    backgroundColor: "#00ccaa",
    paddingHorizontal: 20,
  },
  topRow: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 10,
    marginTop: 5,
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#00ccaa",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#555",
    marginBottom: 25,
    paddingHorizontal: 10,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 10,
    marginBottom: 25,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
});
