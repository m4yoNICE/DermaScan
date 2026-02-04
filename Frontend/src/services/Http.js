import { ToastMessage } from "@/components/ToastMessage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";
import { router } from "expo-router";

// const DEV_LAN_IP = "10.115.185.25";

// const baseURL =
//   Platform.OS === "android"
//     ? "http://10.0.2.2:3000"
//     : `http://${DEV_LAN_IP}:3000`;
const DEV_LAN_IP = "10.115.185.25";

const baseURL = `http://${DEV_LAN_IP}:3000`;

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
