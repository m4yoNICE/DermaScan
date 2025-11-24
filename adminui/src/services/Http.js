import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = "http://192.168.1.2:3000";

export const Http = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});