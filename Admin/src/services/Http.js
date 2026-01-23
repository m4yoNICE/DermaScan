import axios from "axios";

const getAuthToken = () => localStorage.getItem("authToken");
const baseURL = "http://localhost:3000";

export const Http = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

//ako kidungang ang http og ImageHttp
const addAuthToken = (config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Uncomment this if you use FormData uploads
  // if (config.data instanceof FormData) {
  //   config.headers["Content-Type"] = "multipart/form-data";
  // }
  return config;
};
//para automatic logout if expired ang token
const handleExpiryToken = (error) => {
  const status = error.response?.status;

  if (status === 403) {
    console.warn("Session expired — clearing storage and redirecting.");

    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    alert("Session Expired. Please log in again.");
    window.location.href = "/login";
  }

  return Promise.reject(error);
};

Http.interceptors.request.use(addAuthToken);
Http.interceptors.response.use((res) => res, handleExpiryToken);
