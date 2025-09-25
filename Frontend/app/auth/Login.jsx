import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Api from "@/services/Api.js";
import { router } from "expo-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(null), 10000);
  };
  const LoginAccount = async () => {
    if (!email || !password) {
      showError("All fields are required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Invalid email format");
      return;
    }
    try {
      const loginData = { email, password };
      const res = await Api.loginAccountAPI(loginData);
      console.log(res.data);

      //JWT TOKEN TIME
      const { token, user } = res.data;
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      if (err.response) {
        showError("Login Failed! Try Again");
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
        <Text style={styles.title}>Sign in</Text>

        <Text style={{ color: "red" }}>{error}</Text>
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

        <TouchableOpacity style={styles.button} onPress={LoginAccount}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        {/* <Text style={styles.forgotPassword}>Forgot Password?</Text> */}
        <Text
          style={styles.signUp}
          onPress={() => router.push("/auth/Register")}
        >
          Don't have an account? Sign Up
        </Text>
      </View>
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
  card: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 20,
    elevation: 5,
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
