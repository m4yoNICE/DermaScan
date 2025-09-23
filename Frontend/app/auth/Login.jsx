import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

import Api from "@/services/Api.js"
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerAccount = async (title) => {
    const controller = new AbortController();
    try{
      const registerData = { email, password };
      const res = await Api.registerAccountAPI(registerData, password);
      console.log(res.data);
    } catch(err){
    if (axios.isCancel(err)) {
      console.log('Request cancelled');
    } else {
      console.error('Actual error:', err);
    }

    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

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

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <Text style={styles.forgotPassword}>Forgot Password?</Text>
        <Text style={styles.signUp}>Don't have an account? Sign Up</Text>
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
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#96634e",
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
    backgroundColor: "#96634e",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPassword: {
    textAlign: "center",
    fontSize: 14,
    color: "#d6aa8d",
    marginBottom: 10,
  },
  signUp: {
    textAlign: "center",
    fontSize: 14,
    color: "gray",
  },
});
