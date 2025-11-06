import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { triggerLogout } from "./AuthRef";
import { ToastMessage } from "@/components/ToastMessage";

const baseURL = "http://192.168.1.11:3000";

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

Http.interceptors.request.use(addAuthToken);
Http.interceptors.response.use((res) => res, handleExpiryToken);
