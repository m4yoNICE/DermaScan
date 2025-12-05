import { ToastMessage } from "@/components/ToastMessage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";
import { triggerLogout } from "./AuthRef";

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

//ako kidungang ang http og ImageHttp
const addAuthToken = async (config) => {
  const token = await AsyncStorage.getItem("authToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  // if (config.data instanceof FormData) {
  //   config.headers["Content-Type"] = "multipart/form-data";
  // }
  return config;
};

//para automatic logout if expired ang token
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

//i will over document these for my sake
// Axios interceptors behave differently from Express middleware.
// Response interceptors receive (response, error), not (req, res).
//
// request.use(addAuthToken)
// - Attaches the Authorization header before each request.
//
// response.use(onSuccess, onError)
// - onSuccess handles all 2xx responses.
// - onError handles all non-2xx responses (401, 403, 500, etc.).
//
// We use handleExpiryToken in the error interceptor because Http.js lives
// outside the Expo Router tree. It cannot access navigation or context directly,
// so it triggers logout via triggerLogout().
Http.interceptors.request.use(addAuthToken);
Http.interceptors.response.use((res) => res, handleExpiryToken);
