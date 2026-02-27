import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import React, { useContext, useState, useCallback } from "react";
import { useFocusEffect, router } from "expo-router";
import { UserContext } from "src/contexts/UserContext";
import Button from "@/components/designs/Button";
import { ToastMessage } from "@/components/designs/ToastMessage";
import DateTimePicker from "@react-native-community/datetimepicker";
import Api from "@/services/Api";

const Profile = () => {
  const { user, logout } = useContext(UserContext);

  // Editable fields
  const [userData, setUserData] = useState({
    firstname: null,
    lastname: null,
    email: null,
    dob: null,
    skinType: null,
    skinSensitive: null,
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [showPicker, setShowPicker] = useState(false);

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
        "Unable to retrieve your profile data.",
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, []),
  );

  // Update User Profile
  const handleUpdate = async () => {
    if (!userData.firstname || !userData.lastname || !userData.email) {
      return ToastMessage(
        "error",
        "Missing Fields",
        "Please fill out all required fields.",
      );
    }

    if (newPassword && !currentPassword) {
      return ToastMessage(
        "error",
        "Missing Current Password",
        "Enter your current password to change it.",
      );
    }

    if (newPassword && newPassword !== confirmPassword) {
      return ToastMessage(
        "error",
        "Password Mismatch",
        "New passwords do not match.",
      );
    }

    if (dob && dob > new Date()) {
      return ToastMessage(
        "error",
        "Invalid Date",
        "Date of birth cannot be in the future.",
      );
    }

    try {
      const updateData = {
        firstname: userData.firstname,
        lastname: userData.lastname,
        birthdate: userData.dob
          ? userData.dob.toISOString().split("T")[0]
          : null,
        currentPassword: passwordData.current,
        newPassword: passwordData.new || null,
        skin_type: userData.skinType,
        skin_sensitivity: userData.skinSensitive,
      };

      await Api.editUserAPI(updateData);
      ToastMessage("success", "Profile Updated", "Changes saved.");

      ToastMessage(
        "success",
        "Profile Updated",
        "Your changes have been saved.",
      );
    } catch (error) {
      console.error("Update Error:", error);
      if (error.response) {
        ToastMessage(
          "error",
          "Server Error",
          error.response.data?.error || "Something went wrong.",
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
        "Enter your password to delete.",
      );
    }

    try {
      setShowDeleteModal(false);
      await Api.deleteUserAPI(deletePassword);
      
      ToastMessage("success", "Deleted", "Your account has been removed.");
      await logout();
    } catch (error) {
      ToastMessage("error", "Delete Failed", error.message);
    }
  };
  //SKIN RESET
  const handleResetSkinType = () => {
    Alert.alert(
      "Reset Skin Type",
      "Are you sure you want to reset your skin type data? This will remove your current skin analysis results.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await Api.resetSkinDataAPI();
              ToastMessage(
                "success",
                "Skin Data Cleared",
                "Your skin type has been reset.",
              );
              router.push("/BaumannQuestionnaire");
            } catch (error) {
              console.error("Reset error:", error);
              ToastMessage(
                "error",
                "Failed",
                "Unable to reset your skin data.",
              );
            }
          },
        },
      ],
    );
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
        value={userData.email}
        editable={false}
      />

      <Text style={styles.text}>First Name</Text>
      <TextInput
        style={styles.input}
        value={userData.firstname}
        onChangeText={(text) =>
          setUserData((prev) => ({ ...prev, firstname: text }))
        }
        placeholder="First Name"
      />

      <Text style={styles.text}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={userData.lastname}
        onChangeText={(text) =>
          setUserData((prev) => ({ ...prev, lastname: text }))
        }
        placeholder="Last Name"
      />

      <Text style={styles.text}>Date Of Birth</Text>
      <Button
        title={userData.dob ? formatDate(userData.dob) : "Select Date of Birth"}
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
          value={userData.dob || new Date()}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowPicker(false);
            if (selectedDate)
              setUserData((prev) => ({ ...prev, dob: selectedDate }));
          }}
        />
      )}

      <Text style={styles.text}>Current Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        value={passwordData.current}
        onChangeText={(text) =>
          setPasswordData((prev) => ({ ...prev, current: text }))
        }
        secureTextEntry
      />

      <Text style={styles.text}>New Password</Text>
      <TextInput
        style={styles.input}
        placeholder="New Password (optional)"
        value={passwordData.new}
        onChangeText={(text) =>
          setPasswordData((prev) => ({ ...prev, new: text }))
        }
        secureTextEntry
      />

      <Text style={styles.text}>Confirm New Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        value={passwordData.confirm}
        onChangeText={(text) =>
          setPasswordData((prev) => ({ ...prev, confirm: text }))
        }
        secureTextEntry
      />

      <Button title="Save Changes" onPress={handleUpdate} />

      <Button
        title="Reset Skin Type"
        onPress={handleResetSkinType}
        style={{
          backgroundColor: "#f9f9f9",
          borderWidth: 1,
          borderColor: "#ddd",
          marginBottom: 10,
        }}
        textStyle={{ color: "#00CC99" }}
      />
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
