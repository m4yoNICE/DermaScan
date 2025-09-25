import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Api from "src/services/Api.js";
import { router } from "expo-router";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(null), 10000);
  };

  const registerAccount = async () => {
    if (!email || !password || !confirmPassword) {
      showError("All fields are required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Invalid email format");
      return;
    }
    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }
    try {
      if (password == confirmPassword) {
        const registerData = { email, password };
        const res = await Api.registerAccountAPI(registerData);
        console.log(res.data);
        router.push("/auth/Login");
      }
    } catch (err) {
      if (err.response) {
        const message =
          err.response.data?.error || "Registration failed. Try again.";
        showError(message);
        console.log(err.response);
      } else if (err.request) {
        showError("No response from server. Check your internet");
        console.log(err.request);
      } else {
        showError("Unexpected Error Happened" + err.message);
        console.log(err.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={{ color: "red" }}>{error}</Text>

        <TextInput
          style={styles.input}
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

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.button} onPress={registerAccount}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        {/* <Text style={styles.forgotPassword}>Forgot Password?</Text> */}
        {/* <Text style={styles.signUp}>Don't have an account? Sign Up</Text> */}
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00ccaa",
  },
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 70,
    color: "#00CC99",
  },
  card: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 10,
    elevation: 2,
    width: "90%",
    maxWidth: 400,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    fontSize: 16,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#00CC99",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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
