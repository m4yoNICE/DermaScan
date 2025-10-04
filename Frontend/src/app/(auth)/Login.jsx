import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useState } from "react";
import Api from "@/services/Api";
import { Link, router } from "expo-router";
import { UserContext } from "src/contexts/UserContext";
import Button from "src/components/Button";
import Card from "src/components/Card";
import { ToastMessage } from "@/components/ToastMessage";

const Login = () => {
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(null), 10000);
  };
  const LoginAccount = async () => {
    if (!email || !password) {
      return ToastMessage(
        "error",
        "Missing Fields",
        "Please fill out all required fields"
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return ToastMessage(
        "error",
        "Invalid Email",
        "Please enter a valid email address"
      );
    }
    try {
      const loginData = { email: email.trim(), password };
      const res = await Api.loginAccountAPI(loginData);

      //JWT TOKEN TIME
      await login(res.data);
      ToastMessage("success", "Login Successful", "Welcome back 👋");
      router.replace("/");
    } catch (err) {
      console.log("Login error:", err);

      if (err.response) {
        ToastMessage(
          "error",
          "Invalid Credentials",
          "Email or password is incorrect"
        );
      } else if (err.request) {
        ToastMessage(
          "error",
          "Network Error",
          "No response from server. Check your internet"
        );
        console.log(err.request);
      } else {
        ToastMessage("error", "Unexpected Error", err.message);
        console.log(err.message);
      }
    }
  };
  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>Sign in</Text>

        <TextInput
          style={[styles.input, { marginBottom: 20 }]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <Button title="Log In" onPress={LoginAccount} />

        {/* <Text style={styles.forgotPassword}>Forgot Password?</Text> */}

        <Text style={styles.signUp}>
          Don't have an account?{" "}
          <Link
            href="/Register"
            style={{ color: "#00CC99", fontWeight: "600" }}
          >
            Sign Up
          </Link>
        </Text>
      </Card>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#00CC99",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    fontSize: 16,
    borderRadius: 8,
    marginBottom: 15,
  },
  forgotPassword: {
    textAlign: "center",
    fontSize: 14,
    color: "#00cccc",
    marginBottom: 10,
  },
  signUp: {
    textAlign: "center",
    fontSize: 14,
    color: "gray",
  },
});
