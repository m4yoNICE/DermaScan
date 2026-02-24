import { ToastMessage } from "@/components/designs/ToastMessage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";
import { triggerLogout } from "../utils/logoutReference";

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

const handleExpiryToken = async (error) => {
  const status = error.response?.status;

  if (status === 403) {
    console.warn("Session expired — clearing storage and redirecting.");

    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("user");

    ToastMessage("error", "Session Expired", "Please log in again.");
    triggerLogout();
  }

  return Promise.reject(error);
};


Http.interceptors.request.use(addAuthToken);
Http.interceptors.response.use((res) => res, handleExpiryToken);
