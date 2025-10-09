//reactnative
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
//auth
import { useContext } from "react";
import { UserContext } from "src/contexts/UserContext";
//user components
import Api from "src/services/Api.js";
import Button from "src/components/Button";
import Card from "src/components/Card";
import { ToastMessage } from "@/components/ToastMessage";

const Register = () => {
  const { login } = useContext(UserContext);
  //usestate
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  //dob
  const [dob, setdob] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState(null);

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(null), 10000);
  };
  // helper function
  const formatDate = (date) => {
    if (!date) return "No date selected";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const registerAccount = async () => {
    //========VALIDATIONS========================
    if (
      !email ||
      !password ||
      !confirmPassword ||
      !firstname ||
      !lastname ||
      !dob
    ) {
      ToastMessage(
        "error",
        "Missing Fields",
        "Please fill out all required fields"
      );
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      ToastMessage(
        "error",
        "Invalid Email",
        "Please enter a valid email address"
      );
      return;
    }
    if (dob > new Date()) {
      return ToastMessage(
        "error",
        "Invalid Date",
        "Date of birth cannot be in the future"
      );
    }
    if (password !== confirmPassword) {
      return ToastMessage(
        "error",
        "Password Mismatch",
        "Passwords do not match"
      );
    }
    try {
      if (password == confirmPassword) {
        const registerData = { email, firstname, dob, lastname, password };
        const res = await Api.registerAccountAPI(registerData);
        const { token, user } = res.data;
        if (token && user) {
          await login({ token, user });
          ToastMessage(
            "success",
            "Registration Successful!",
            "Welcome aboard 👋"
          );
          router.push("/");
        } else {
          ToastMessage(
            "error",
            "Missing Token",
            "Server didn't return a token."
          );
        }
      }
    } catch (err) {
      if (err.response) {
        const message =
          err.response.data?.error || "Registration failed. Try again.";
        ToastMessage("error", "Server Error", message);
        console.log(err.response);
      } else if (err.request) {
        ToastMessage(
          "error",
          "Network Error",
          "No response from server. Check your internet connection."
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
        <Link href="/Login" style={{ fontSize: 14, color: "gray" }}>
          Go back
        </Link>
        <Text style={styles.title}>Sign Up</Text>

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
          placeholder="First Name"
          value={firstname}
          onChangeText={setfirstname}
          keyboardType="default"
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastname}
          onChangeText={setlastname}
          keyboardType="default"
          autoCapitalize="words"
        />

        <Button
          title={dob ? formatDate(dob) : "Select Date of Birth"}
          onPress={() => setShowPicker(true)}
          style={{
            backgroundColor: "#f9f9f9",
            padding: 20,
            marginVertical: 3,
            elevation: 5,
            //ios
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
          }}
          textStyle={{ color: "#1a1a1a" }}
        />

        {showPicker && (
          <DateTimePicker
            value={dob || new Date()}
            mode="date"
            display="default"
            onChange={(_, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) setdob(selectedDate);
            }}
          />
        )}

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
        <Button title="Register" onPress={registerAccount} />
      </Card>
    </View>
  );
};

export default Register;

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
