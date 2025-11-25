import axios from "axios";
import { toast } from "react-toastify"; 
import { useNavigate } from "react-router-dom";

const baseURL = "http://localhost:3000"; 

// Create axios instance
export const Http = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

// Add token to headers
const addAuthToken = (config) => {
  const token = localStorage.getItem("authToken"); 
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  // if (config.data instanceof FormData) {
  //   config.headers["Content-Type"] = "multipart/form-data";
  // }
  return config;
};

// Handle expired token
const handleExpiryToken = (error) => {
  const status = error.response?.status;

  if (status === 403) {
    console.warn("Session expired — clearing storage and redirecting.");

    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    toast.error("Session Expired. Please log in again."); // Toast message for web

    // Redirect to login page (you can also use context or props)
    window.location.href = "/login";
  }

  return Promise.reject(error);
};

// Apply interceptors
Http.interceptors.request.use(addAuthToken);
Http.interceptors.response.use((res) => res, handleExpiryToken);