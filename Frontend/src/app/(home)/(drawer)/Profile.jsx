import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState, useCallback } from "react";
import { useFocusEffect, router } from "expo-router";
import { useUser } from "@/contexts/UserContext";
import { useUserData } from "@/contexts/UserDataContext";
import { ToastMessage } from "@/components/designs/ToastMessage";
import DateTimePicker from "@react-native-community/datetimepicker";
import Logo from "@/components/designs/Logo";
import Api from "@/services/Api";

const Profile = () => {
  const { logout } = useUser();
  const {
    userData: globalUser,
    setUserData: setGlobalUser,
    fetchUserData,
  } = useUserData();

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (globalUser) {
        setUserData({
          firstname: globalUser.firstName || "",
          lastname: globalUser.lastName || "",
          email: globalUser.email || "",
          dob: globalUser.birthdate ? new Date(globalUser.birthdate) : null,
          skinType: globalUser.skinType || null,
          skinSensitive: globalUser.skinSensitivity || null,
        });
      } else {
        fetchUserData();
      }
    }, [globalUser]),
  );

  const formatDate = (date) => {
    if (!date) return "No date selected";
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleUpdate = async () => {
    if (!userData.firstname || !userData.lastname || !userData.email) {
      return ToastMessage(
        "error",
        "Missing Fields",
        "Please fill out all required fields.",
      );
    }
    if (passwordData.new && !passwordData.current) {
      return ToastMessage(
        "error",
        "Missing Current Password",
        "Enter your current password to change it.",
      );
    }
    if (passwordData.new && passwordData.new !== passwordData.confirm) {
      return ToastMessage(
        "error",
        "Password Mismatch",
        "New passwords do not match.",
      );
    }
    if (userData.dob && userData.dob > new Date()) {
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
      };
      const res = await Api.editUserAPI(updateData);
      setGlobalUser(res.data.user);
      ToastMessage(
        "success",
        "Profile Updated",
        "Your changes have been saved.",
      );
    } catch (error) {
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

  const handleDelete = () => setShowDeleteModal(true);

  const confirmDelete = async () => {
    try {
      setShowDeleteModal(false);
      await Api.deleteUserAPI();
      ToastMessage("success", "Deleted", "Your account has been removed.");
      await logout();
    } catch (error) {
      ToastMessage(
        "error",
        "Delete Failed",
        error.response?.data?.error || error.message,
      );
    }
  };

  const handleResetSkinType = () => {
    if (!userData.skinType) {
      router.push("/SkinTypeQuestionnaire");
      return;
    }
    Alert.alert(
      "Reset Skin Type",
      "Are you sure you want to reset your skin type data?",
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
      style={{ flex: 1, backgroundColor: "white" }}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* Top Section */}
      <View style={styles.topRow}>
        <View style={styles.avatarPlaceholder}>
          <Logo style={{ width: 80, height: 80 }} />
        </View>
        <View style={styles.nameContainer}>
          <TextInput
            style={styles.nameInput}
            value={userData.firstname}
            onChangeText={(text) =>
              setUserData((prev) => ({ ...prev, firstname: text }))
            }
            placeholder="First Name"
          />
          <TextInput
            style={styles.nameInput}
            value={userData.lastname}
            onChangeText={(text) =>
              setUserData((prev) => ({ ...prev, lastname: text }))
            }
            placeholder="Last Name"
          />
        </View>
        <TouchableOpacity onPress={handleUpdate}>
          <Text style={styles.saveIcon}>✓</Text>
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[
            styles.fullInput,
            { backgroundColor: "#f0f0f0", color: "gray" },
          ]}
          value={userData.email}
          editable={false}
        />

        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity
          style={styles.fullInput}
          onPress={() => setShowPicker(true)}
        >
          <Text
            style={{ fontSize: 16, color: userData.dob ? "#1a1a1a" : "#999" }}
          >
            {userData.dob ? formatDate(userData.dob) : "Select Date of Birth"}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={userData.dob || new Date()}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={(_, selectedDate) => {
              setShowPicker(false);
              if (selectedDate)
                setUserData((prev) => ({ ...prev, dob: selectedDate }));
            }}
          />
        )}

        <View style={styles.sectionDivider} />

        <Text style={styles.label}>Current Password</Text>
        <TextInput
          style={styles.fullInput}
          placeholder="Current Password"
          value={passwordData.current}
          onChangeText={(text) =>
            setPasswordData((prev) => ({ ...prev, current: text }))
          }
          secureTextEntry
        />

        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.fullInput}
          placeholder="New Password (optional)"
          value={passwordData.new}
          onChangeText={(text) =>
            setPasswordData((prev) => ({ ...prev, new: text }))
          }
          secureTextEntry
        />

        <Text style={styles.label}>Confirm New Password</Text>
        <TextInput
          style={styles.fullInput}
          placeholder="Confirm New Password"
          value={passwordData.confirm}
          onChangeText={(text) =>
            setPasswordData((prev) => ({ ...prev, confirm: text }))
          }
          secureTextEntry
        />
      </View>

      {/* Action Buttons */}
      <TouchableOpacity style={styles.editBtn} onPress={handleResetSkinType}>
        <Text style={styles.editBtnText}>Reset Skin Type</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteBtnText}>Delete Account</Text>
      </TouchableOpacity>

      {/* Delete Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalText}>
              This action is permanent and cannot be undone. Are you sure?
            </Text>
            <TouchableOpacity
              style={[styles.deleteBtn, { marginTop: 15 }]}
              onPress={confirmDelete}
            >
              <Text style={styles.deleteBtnText}>Yes, Delete My Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.editBtn, { marginTop: 10 }]}
              onPress={() => setShowDeleteModal(false)}
            >
              <Text style={styles.editBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 100 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
    marginTop: 10,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  nameContainer: { flex: 1, marginHorizontal: 15 },
  nameInput: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    fontSize: 16,
  },
  saveIcon: {
    fontSize: 32,
    color: "#00CC99",
    fontWeight: "bold",
  },
  form: { marginBottom: 20 },
  label: { fontWeight: "bold", fontSize: 16, marginBottom: 5, color: "#444" },
  fullInput: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    justifyContent: "center",
  },
  editBtn: {
    borderWidth: 1,
    borderColor: "#00CC99",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  editBtnText: { color: "#00CC99", fontWeight: "600", fontSize: 16 },
  deleteBtn: {
    backgroundColor: "#FFC1C1",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF8080",
  },
  deleteBtnText: { color: "#FF4D4D", fontWeight: "600", fontSize: 16 },
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: "#666",
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 20,
  },
});
