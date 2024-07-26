import axios from "axios";
import { authService } from "../services/auth.service";

export const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add token to headers if available
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("auth-token");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Methods for API requests
export const api = {
  login: async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      if (response.data.user) {
        authService.setUser(response.data.user);
        localStorage.setItem("auth-token", response.data.accessToken);
      }
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  signup: async (name: string, email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      });
      if (response.data.user) {
        authService.setUser(response.data.user);
        localStorage.setItem("auth-token", response.data.accessToken);
      }
      return response.data;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  verifyOthers: async (
    countryCode: string,
    phoneNumber: string,
    type: string
  ) => {
    try {
      const response = await axiosInstance.post("/verification", {
        countryCode,
        phoneNumber,
        type,
      });
      return response.data;
    } catch (error) {
      console.error("VerifyOthers error:", error);
      throw error;
    }
  },

  verifyMe: async (number: string, type: string) => {
    try {
      const response = await axiosInstance.post("/verification/me", {
        number,
        type,
      });
      //   if (response.data.isVerified) {
      //     authService.setVerified(true);
      //   }
      return response.data;
    } catch (error) {
      console.error("VerifyMe error:", error);
      throw error;
    }
  },
};

export default axiosInstance;
