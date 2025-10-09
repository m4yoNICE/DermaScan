import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import React, { useContext, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { UserContext } from "src/contexts/UserContext";
import Button from "src/components/Button";
import { ToastMessage } from "@/components/ToastMessage";
import DateTimePicker from "@react-native-community/datetimepicker";
import Api from "@/services/Api";

const Profile = () => {
  const { user, logout } = useContext(UserContext);

  // Editable fields
  const [firstname, setFirstname] = useState(user?.firstname || "");
  const [lastname, setLastname] = useState(user?.lastname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [dob, setDob] = useState(null);
  const [skinType, setSkinType] = useState(null);
  const [skinSensitive, setSkinSensitive] = useState(null);

  const [showPicker, setShowPicker] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  // format date helper
  const formatDate = (date) => {
    if (!date) return "No date selected";
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // fetch latest user data
  const fetchUserData = async () => {
    try {
      const res = await Api.getUserbyTokenAPI();
      setFirstname(res.data.first_name || "");
      setLastname(res.data.last_name || "");
      setEmail(res.data.email || "");
      setDob(res.data.birthdate ? new Date(res.data.birthdate) : null);
      setSkinType(res.data.skin_type || null);
      setSkinSensitive(res.data.skin_sensitivity || null);
    } catch (error) {
      console.error("Fetch user error:", error);
      ToastMessage(
        "error",
        "Fetch Failed",
        "Unable to retrieve your profile data."
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  // Update User Profile
  const handleUpdate = async () => {
    if (!firstname || !lastname || !email) {
      return ToastMessage(
        "error",
        "Missing Fields",
        "Please fill out all required fields."
      );
    }

    if (newPassword && !currentPassword) {
      return ToastMessage(
        "error",
        "Missing Current Password",
        "Enter your current password to change it."
      );
    }

    if (newPassword && newPassword !== confirmPassword) {
      return ToastMessage(
        "error",
        "Password Mismatch",
        "New passwords do not match."
      );
    }

    if (dob && dob > new Date()) {
      return ToastMessage(
        "error",
        "Invalid Date",
        "Date of birth cannot be in the future."
      );
    }

    try {
      const updateData = {
        firstname,
        lastname,
        birthdate: dob ? dob.toISOString().split("T")[0] : null,
        currentPassword,
        newPassword: newPassword || null,
        skin_type: skinType,
        skin_sensitivity: skinSensitive,
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
  const handleDelete = () => setShowDeleteModal(true);

  const confirmDelete = async () => {
    if (!deletePassword) {
      return ToastMessage(
        "error",
        "Password Required",
        "Enter your password to delete."
      );
    }

    try {
      setShowDeleteModal(false);
      await Api.deleteUserAPI();
      ToastMessage("success", "Deleted", "Your account has been removed.");
      await logout();
    } catch (error) {
      ToastMessage("error", "Delete Failed", error.message);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingVertical: 30 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Profile</Text>

      {/* ====== Basic Info ====== */}
      <Text style={styles.text}>Email</Text>
      <TextInput
        style={[styles.input, { backgroundColor: "#f0f0f0", color: "gray" }]}
        value={email}
        editable={false}
      />

      <Text style={styles.text}>First Name</Text>
      <TextInput
        style={styles.input}
        value={firstname}
        onChangeText={setFirstname}
        placeholder="First Name"
      />

      <Text style={styles.text}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={lastname}
        onChangeText={setLastname}
        placeholder="Last Name"
      />

      <Text style={styles.text}>Date Of Birth</Text>
      <Button
        title={dob ? formatDate(dob) : "Select Date of Birth"}
        onPress={() => setShowPicker(true)}
        style={{
          backgroundColor: "#f9f9f9",
          padding: 20,
          marginVertical: 3,
          borderColor: "#ddd",
          borderWidth: 1,
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
            if (selectedDate) setDob(selectedDate);
          }}
        />
      )}

      {/* ====== Copied from QuestModal: Skin Type / Sensitivity ====== */}
      <Text style={styles.text}>Skin Type</Text>
      <View style={styles.buttonRow}>
        {["Oily", "Dry", "Normal", "Combination"].map((type) => {
          const isSelected = skinType === type.toLowerCase();
          return (
            <Button
              key={type}
              title={type}
              onPress={() => setSkinType(type.toLowerCase())}
              style={{
                width: "45%",
                marginVertical: 5,
                borderWidth: 1,
                borderColor: isSelected ? "#00CC99" : "#ddd",
                backgroundColor: isSelected ? "#00CC99" : "#f9f9f9",
              }}
              textStyle={{
                fontSize: 12,
                fontWeight: "500",
                color: isSelected ? "#fff" : "#1a1a1a",
              }}
            />
          );
        })}
      </View>

      <Text style={styles.text}>Is your skin sensitive?</Text>
      <View style={styles.buttonRow}>
        {[
          { label: "Yes", value: true },
          { label: "No", value: false },
        ].map((opt) => {
          const isSelected = skinSensitive === opt.value;
          return (
            <Button
              key={opt.label}
              title={opt.label}
              onPress={() => setSkinSensitive(opt.value)}
              style={{
                width: "45%",
                marginVertical: 5,
                borderWidth: 1,
                borderColor: isSelected ? "#00CC99" : "#ddd",
                backgroundColor: isSelected ? "#00CC99" : "#f9f9f9",
              }}
              textStyle={{
                fontSize: 16,
                fontWeight: "500",
                color: isSelected ? "#fff" : "#1a1a1a",
              }}
            />
          );
        })}
      </View>
      {/* ====== End copied section ====== */}

      <Text style={styles.text}>Current Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />

      <Text style={styles.text}>New Password</Text>
      <TextInput
        style={styles.input}
        placeholder="New Password (optional)"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <Text style={styles.text}>Confirm New Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Button title="Save Changes" onPress={handleUpdate} />

      <Button
        title="Delete Account"
        onPress={handleDelete}
        style={{
          backgroundColor: "#f9f9f9",
          borderWidth: 1,
          borderColor: "#ddd",
        }}
        textStyle={{ color: "red" }}
      />

      {/* ===== Delete Confirmation Modal ===== */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text>Enter your password to confirm deletion</Text>
            <TextInput
              placeholder="Password"
              value={deletePassword}
              onChangeText={setDeletePassword}
              secureTextEntry
              style={styles.modalInput}
            />
            <Button
              title="Delete Account"
              onPress={confirmDelete}
              style={{
                backgroundColor: "#f9f9f9",
                borderWidth: 1,
                borderColor: "#ddd",
              }}
              textStyle={{ color: "red" }}
            />
            <Button title="Cancel" onPress={() => setShowDeleteModal(false)} />
          </View>
        </View>
      </Modal>
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
  text: {
    fontWeight: "700",
    fontSize: 18,
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
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginBottom: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalInput: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
  },
});
