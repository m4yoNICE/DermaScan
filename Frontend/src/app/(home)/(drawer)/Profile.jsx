import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { UserContext } from "src/contexts/UserContext";
import Button from "src/components/Button";
import { ToastMessage } from "@/components/ToastMessage";
import Api from "@/services/Api";
import Logout from "./Logout";

const Profile = () => {
  const { user, logout } = useContext(UserContext);

  // Editable fields
  const [firstname, setFirstname] = useState(user?.firstname || "");
  const [lastname, setLastname] = useState(user?.lastname || "");
  const [email, setEmail] = useState(user?.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch latest user data
  const fetchUserData = async () => {
    try {
      const res = await Api.getUserbyTokenAPI();
      console.log("Fetched user data:", res.data);

      // fill in inputs with backend data
      setFirstname(res.data.first_name || "");
      setLastname(res.data.last_name || "");
      setEmail(res.data.email || "");
    } catch (error) {
      console.error("Fetch user error:", error);
      ToastMessage(
        "error",
        "Fetch Failed",
        "Unable to retrieve your profile data."
      );
    }
  };
  // Sync when context updates or refresh n shi
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  // Update User Profile
  const handleUpdate = async () => {
    // Validation
    if (!firstname || !lastname || !email) {
      return ToastMessage(
        "error",
        "Missing Fields",
        "Please fill out all required fields."
      );
    }
    if (!currentPassword) {
      return ToastMessage(
        "error",
        "Missing Password",
        "Please enter your current password to confirm changes."
      );
    }
    if (newPassword && newPassword !== confirmPassword) {
      return ToastMessage(
        "error",
        "Password Mismatch",
        "New passwords do not match."
      );
    }
    try {
      const updateData = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        currentPassword: currentPassword,
        newPassword: newPassword || null,
      };
      const response = await Api.editUserAPI(updateData);
      console.log("Profile updated:", response.data);
      ToastMessage(
        "success",
        "Profile Updated",
        "Your changes have been saved."
      );
    } catch (error) {
      console.error("Update Error:", error);

      if (error.response) {
        ToastMessage(
          "error",
          "Server Error",
          error.response.data?.error || "Something went wrong."
        );
      } else if (error.request) {
        ToastMessage("error", "Network Error", "Unable to reach the server.");
      } else {
        ToastMessage("error", "Unexpected Error", error.message);
      }
    }
  };

  // Delete User Account
  const handleDelete = async () => {
    Alert.alert(
      "Confirm Account Deletion",
      "Are you absolutely sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            console.log("Account deletion cancelled.");
          },
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await Api.deleteUserAPI();
              console.log("Account deleted:", response.data);

              ToastMessage(
                "success",
                "Account Deleted",
                "Your account has been permanently removed."
              );
              await logout();
              router.replace("/");
            } catch (error) {
              console.error("Delete Error:", error);

              if (error.response) {
                ToastMessage(
                  "error",
                  "Delete Failed",
                  error.response.data?.error || "Server error occurred."
                );
              } else if (error.request) {
                ToastMessage(
                  "error",
                  "Network Error",
                  "Could not connect to server."
                );
              } else {
                ToastMessage("error", "Unexpected Error", error.message);
              }
            }
          },
        },
      ]
    );
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        alignItems: "center",
        paddingVertical: 30,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstname}
        onChangeText={(text) => setFirstname(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastname}
        onChangeText={(text) => setLastname(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Current Password"
        value={currentPassword}
        onChangeText={(text) => setCurrentPassword(text)}
        secureTextEntry={true}
      />

      <TextInput
        style={styles.input}
        placeholder="New Password (optional)"
        value={newPassword}
        onChangeText={(text) => setNewPassword(text)}
        secureTextEntry={true}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry={true}
      />

      <Button title="Save Changes" onPress={handleUpdate} />

      <Button
        title="Delete Account"
        onPress={handleDelete}
        style={{ backgroundColor: "red" }}
      />
    </ScrollView>
  );
};

export default Profile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#00CC99",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    width: "100%",
  },
});
