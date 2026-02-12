import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { Platform } from "react-native";

// Replace with your actual backend URL
// For Android Emulator, use 'http://10.0.2.2:3000'
// For iOS Simulator, use 'http://localhost:3000'
const BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
