import { ToastMessage } from "@/components/ToastMessage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";
<<<<<<< HEAD
import { triggerLogout } from "./AuthRef";
=======
import { triggerLogout } from "./logoutReference";
>>>>>>> cdfc7df3 (-fix: implemented mini server for AI called Fast API to initialize and load model that results to 2000ms-5000ms inference time. Adjusted layout in login and register to adjust when keyboard is present. Changed Camera UI to match to Figma Design. Fixed Analysis Pipeline.)

import Constants from "expo-constants";

const hostUri = Constants.expoConfig?.hostUri;
const lanIP = hostUri ? hostUri.split(":")[0] : null;

// 🟢 Android Emulator fallback → 10.0.2.2 (correct)
// 🟢 iOS Emulator fallback → localhost
// 🟢 LAN fallback if Expo not running with hostUri
const fallbackIP = Platform.OS === "android" ? "10.0.2.2" : "127.0.0.1";

const host = lanIP || fallbackIP;
const baseURL = `http://${host}:3000`;
console.log(host);

// const baseURL = "http://10.151.105.21:3000"; // might change when setting new devices
// // const baseURL = `http://${window.location.hostname}:3000`;

export const Http = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

const addAuthToken = async (config) => {
  const token = await AsyncStorage.getItem("authToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

//para automatic logout if expired ang token
const handleExpiryToken = async (error) => {
  const status = error.response?.status;

  if (status === 403) {
    console.warn("Session expired — clearing storage and redirecting.");

    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("user");
    router.replace("/");
  }

  return Promise.reject(error);
};

Http.interceptors.request.use(addAuthToken);
Http.interceptors.response.use((res) => res, handleExpiryToken);
