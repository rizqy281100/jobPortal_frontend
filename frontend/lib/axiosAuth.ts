// lib/axiosAuth.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Axios instance untuk authenticated requests
export const axiosAuth = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Penting untuk mengirim cookies
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request Interceptor: Tambahkan accessToken ke header
axiosAuth.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get accessToken from Redux store
    // Note: Ini akan diset dari client component
    const token = config.headers?.Authorization || null;

    if (token) {
      config.headers.Authorization = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 dan refresh token
axiosAuth.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Jika 401 dan belum retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Antri request yang gagal
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosAuth(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh token endpoint
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Refresh token failed");
        }

        const data = await response.json();
        const newAccessToken = data.accessToken;

        // Update header dengan token baru
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Process antrian
        processQueue(null, newAccessToken);

        return axiosAuth(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);

        // Redirect ke login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosAuth;
