import Landing4 from "@/components/landing/Landing4";
import BottomSheet, {
  BottomSheetView,
  BottomSheetTextInput, // ADD THIS
} from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Link, router } from "expo-router";
import { useContext, useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import Button from "@/components/designs/Button";
import LoadingModal from "@/components/designs/feedback/LoadingModal";
import { UserContext } from "src/contexts/UserContext";
import Api from "src/services/Api.js";

import { ToastMessage } from "@/components/designs/feedback/ToastMessage";
import { Feather, Ionicons } from "@expo/vector-icons";

const Register = () => {
  const { login } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [dob, setdob] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const sheetRef = useRef(null);
  const snapPoints = ["80%", "100%"];

  useEffect(() => {
    const keyboardHide = Keyboard.addListener("keyboardDidHide", () => {
      sheetRef.current?.snapToIndex(0);
    });

    return () => {
      keyboardHide.remove();
    };
  }, []);

  const formatDate = (date) => {
    if (!date) return "Select Date of Birth";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const registerAccount = async () => {
    if (
      !email ||
      !password ||
      !firstname ||
      !lastname ||
      !confirmPassword ||
      !dob
    ) {
      return ToastMessage(
        "error",
        "Missing Fields",
        "Please fill out all required fields",
      );
    }

    if (password !== confirmPassword) {
      return ToastMessage(
        "error",
        "Password Mismatch",
        "Passwords do not match",
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return ToastMessage(
        "error",
        "Invalid Email",
        "Please enter a valid email address",
      );
    }
    if (dob > new Date()) {
      return ToastMessage(
        "error",
        "Invalid Date",
        "Date of birth cannot be in the future",
      );
    }

    try {
      setLoading(true);
      const registerData = {
        email,
        firstname,
        dob: dob.toISOString().split("T")[0],
        lastname,
        password,
      };
      console.log(registerData);
      const res = await Api.registerAccountAPI(registerData);
      const { token, user } = res.data;
      if (token && user) {
        await login({ token, user });
        ToastMessage(
          "success",
          "Registration Successful!",
          "Welcome aboard 👋",
        );
        router.push("/BaumannQuestionnaire");
      }
    } catch (err) {
      const message =
        err.response?.data?.error || "Registration failed. Try again.";
      ToastMessage("error", "Server Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <LoadingModal
        visible={loading}
        onTimeout={() => {
          setLoading(false);
          ToastMessage("error", "Request timed out", "Please try again.");
        }}
      />
      {/* Top Background Section */}
      <View style={styles.backgroundWrapper}>
        <View style={styles.landingScale}>
          <Landing4 />
        </View>
      </View>

      {/* BottomSheet */}
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        handleComponent={null}
        enableContentPanningGesture={false}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        animateOnMount={false}
        backgroundStyle={{
          backgroundColor: "white",
          borderRadius: 40,
        }}
      >
        <BottomSheetView style={styles.sheetContent}>
          {/* BACK BUTTON */}
          <View style={styles.backRow}>
            <Link href="/Login">
              <Ionicons name="chevron-back" size={26} color="#666" />
            </Link>
          </View>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join us and personalize your skin journey.
          </Text>

          {/* EMAIL */}
          <View style={styles.inputGroup}>
            <Feather
              name="mail"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <BottomSheetTextInput
              style={styles.input}
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* NAME ROW (First & Last) */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 15 }]}>
              <Feather
                name="user"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <BottomSheetTextInput
                style={styles.input}
                placeholder="First Name"
                value={firstname}
                onChangeText={setfirstname}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <BottomSheetTextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastname}
                onChangeText={setlastname}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.inputGroup}
            onPress={() => setShowPicker(true)}
            activeOpacity={0.7}
          >
            <Feather
              name="calendar"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <Text style={[styles.input, !dob && { color: "#999" }]}>
              {formatDate(dob)}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              mode="date"
              value={dob || new Date()}
              display="default"
              maximumDate={new Date()}
              onChange={(_, date) => {
                setShowPicker(false);
                if (date) setdob(date);
              }}
            />
          )}

          {/* PASSWORD */}
          <View style={styles.inputGroup}>
            <Feather
              name="lock"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <BottomSheetTextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              secureTextEntry={!showPass}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Feather
                name={showPass ? "eye-off" : "eye"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {/* CONFIRM PASSWORD */}
          <View style={styles.inputGroup}>
            <Feather
              name="shield"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <BottomSheetTextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              secureTextEntry={!showConfirmPass}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPass(!showConfirmPass)}
            >
              <Feather
                name={showConfirmPass ? "eye-off" : "eye"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {/* REGISTER BUTTON */}
          <Button
            title="Register"
            onPress={registerAccount}
            style={styles.regBtn}
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#05d6b2",
  },
  backgroundWrapper: {
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  landingScale: {
    transform: [{ scale: 0.6 }],
  },
  sheetContent: {
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 50,
  },
  backRow: {
    width: "100%",
    marginBottom: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 5,
    color: "#00CC99",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#868585ff",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    width: "100%",
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  regBtn: {
    width: "100%",
    height: 55,
    backgroundColor: "#00CC99",
    borderRadius: 12,
    marginTop: 10,
  },
});
