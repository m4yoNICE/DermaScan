import axios from "axios";

const baseURL = "http://localhost:3000";

export const Http = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

const attachTokenInterceptor = (instance) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

attachTokenInterceptor(Http);
