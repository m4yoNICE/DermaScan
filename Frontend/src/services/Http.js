import { ToastMessage } from "@/components/designs/feedback/ToastMessage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { triggerLogout } from "../utils/logoutReference";

const baseURL = "https://dermascan-backend.up.railway.app";

export const Http = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

console.log("Base URL:", Http.defaults.baseURL);

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
  const url = error.config?.url || "";

  // 401: no token, 403: invalid/expired token
  const isAuthError = status === 401 || status === 403;
  // 404 on /api/users = user deleted or no longer exists
  const isUserNotFound = status === 404 && url.includes("/api/users");

  if (isAuthError || isUserNotFound) {
    console.warn("Session invalid — clearing storage and redirecting.");

    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("user");

    ToastMessage(
      "error",
      isUserNotFound ? "Account Not Found" : "Session Expired",
      "Please log in again."
    );
    triggerLogout();
  }

  throw error;
};

Http.interceptors.request.use(addAuthToken);
Http.interceptors.response.use((res) => res, handleExpiryToken);
