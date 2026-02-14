import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import { Link, router } from "expo-router";
import { useContext, useEffect, useState, useRef } from "react";
//external ui
import { Feather, Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";

//own ui
import Button from "@/components/designs/Button";
import Landing4 from "@/components/landing/Landing4";
import { ToastMessage } from "@/components/designs/ToastMessage";
import LoadingModal from "@/components/designs/LoadingModal";
import Api from "@/services/Api";
//User Context
import { useUser } from "src/contexts/UserContext";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);
  const sheetRef = useRef(null);
  const snapPoints = ["60%", "90%"];

  useEffect(() => {
    const keyboardHide = Keyboard.addListener("keyboardDidHide", () => {
      sheetRef.current?.snapToIndex(0);
    });

    return () => {
      keyboardHide.remove();
    };
  }, []);
  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(null), 7000);
  };

  const LoginAccount = async () => {
    console.log("LoginAccount called: ", { email, password });
    if (!email || !password)
      return showError("Please fill out all required fields");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return showError("Please enter a valid email address");

    try {
      setIsLoading(true);

      const loginData = { email: email.trim(), password };
      const res = await Api.loginAccountAPI(loginData);

      await login(res.data);
      ToastMessage("success", "Login Successful", "Welcome back 👋");

      router.replace("/");
    } catch (err) {
      console.log("Login error:", err);
      showError("Email or password is incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <LoadingModal visible={isLoading} />

      <View style={styles.backgroundWrapper}>
        <View style={styles.landingScale}>
          <Landing4 />
        </View>
      </View>
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
        animateOnMount={false} // ADD THIS
        backgroundStyle={{
          backgroundColor: "white",
          borderRadius: 40,
        }}
      >
        <BottomSheetView style={styles.sheetContent}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Good to see you again.</Text>

          {error && (
            <View style={styles.errorBox}>
              <Ionicons
                name="warning-outline"
                color="#cc0000"
                size={18}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

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
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

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
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Feather
                name={showPass ? "eye-off" : "eye"}
                size={20}
                color="#999"
                style={{ paddingHorizontal: 4 }}
              />
            </TouchableOpacity>
          </View>

          {/* LOGIN BUTTON */}
          <Button
            title="Log In"
            onPress={LoginAccount}
            icon={<Feather name="log-in" size={18} color="white" />}
            style={styles.loginBtn}
          />

          <Text style={styles.signUp}>
            Don't have an account?{" "}
            <Link href="/Register" style={styles.signUpLink}>
              Sign Up
            </Link>
          </Text>
          <View
            style={{ width: "100%", alignItems: "center", marginBottom: 10 }}
          >
            <Link href="/(OTP)/ForgetPassword" style={{ color: "#00CC99" }}>
              Forgot Password?
            </Link>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#05d6b2",
  },
  landingScale: {
    transform: [{ scale: 0.9 }],
  },
  backgroundWrapper: {
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },

  sheetContent: {
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 50,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#868585ff",
    marginBottom: 20,
  },

  title: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 5,
    color: "#00CC99",
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
  },

  signUp: {
    textAlign: "center",
    fontSize: 14,
    color: "gray",
    marginTop: 2,
  },

  signUpLink: {
    color: "#00CC99",
    fontWeight: "700",
  },

  errorBox: {
    flexDirection: "row",
    backgroundColor: "#ffe6e6",
    borderColor: "#ff9999",
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
    borderWidth: 1,
    alignItems: "center",
  },

  errorText: {
    color: "#cc0000",
    fontSize: 14,
    flex: 1,
    paddingRight: 5,
  },

  loginBtn: {
    width: "100%",
    height: 55,
    backgroundColor: "#00CC99",
    borderRadius: 12,
  },
});
