<<<<<<< HEAD
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'

/**
 * 
 * Commented block line cause wala nakoy maisip na design kaayo only the intellisence 
 * na nag handle sa design.. but ang logic and stuff is logically input manual og gi review sa sites
 * 
 */

const ForgetPassword = () => {

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

    // Handle forget password request
  const handleForgetPassword = async () => {
    if(!email.trim()){
      setMessage('Email is required');
      return;
    }
    setLoading(true);
    setMessage(''); 
    // Trying to send a request to the API (backend part)
    try {
      const response = await fetch('http://192.168.1.2:3000/api/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message || 'Please check your email for reset instructions.');
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again later.');
    }finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
    <View style={styles.card}>
      <Text style={styles.title}>Forgot Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.button} onPress={handleForgetPassword}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  </View>
  )
}
=======
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
>>>>>>> origin/main

export default ForgetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
<<<<<<< HEAD
    padding: 20,
    backgroundColor: "#00cccc", // main background color
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#00cccc", // matches theme
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#00cccc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
})
=======
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
>>>>>>> origin/main
