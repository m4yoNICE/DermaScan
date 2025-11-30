import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { triggerLogout } from "./AuthRef";
import { ToastMessage } from "@/components/ToastMessage";

const baseURL = "http://192.168.1.2:3000"; // might change when setting new devices

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
