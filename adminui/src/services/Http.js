import axios from "axios";
<<<<<<< HEAD
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
=======

const getAuthToken = () => localStorage.getItem("authToken");
const baseURL = "localhost:3000";

export const Http = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

//ako kidungang ang http og ImageHttp
const addAuthToken = (config) => {
  const token = getAuthToken();
>>>>>>> origin/main
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
<<<<<<< HEAD
=======
  // Uncomment this if you use FormData uploads
>>>>>>> origin/main
  // if (config.data instanceof FormData) {
  //   config.headers["Content-Type"] = "multipart/form-data";
  // }
  return config;
};
<<<<<<< HEAD

// Handle expired token
=======
//para automatic logout if expired ang token
>>>>>>> origin/main
const handleExpiryToken = (error) => {
  const status = error.response?.status;

  if (status === 403) {
    console.warn("Session expired — clearing storage and redirecting.");

    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

<<<<<<< HEAD
    toast.error("Session Expired. Please log in again."); // Toast message for web

    // Redirect to login page (you can also use context or props)
=======
    alert("Session Expired. Please log in again.");
>>>>>>> origin/main
    window.location.href = "/login";
  }

  return Promise.reject(error);
};

<<<<<<< HEAD
// Apply interceptors
Http.interceptors.request.use(addAuthToken);
Http.interceptors.response.use((res) => res, handleExpiryToken);
=======
Http.interceptors.request.use(addAuthToken);
Http.interceptors.response.use((res) => res, handleExpiryToken);
>>>>>>> origin/main
