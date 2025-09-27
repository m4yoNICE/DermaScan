import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = "http://192.168.1.2:3000"; //ip address differ device to device, pls go to CMD and type "ipconfig" and copypaste the ipaddress
// dont forget to put the port number, express for now is at :3000
//                                         -jasperbayot
const Http = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

Http.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default Http;
