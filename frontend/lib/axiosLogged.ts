import axios from "axios";
/**
 * Base Axios instance
 */

// localStorage.getItem("auth_token") || localStorage.getItem("auth_key");
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    // Authorization: token ? `Bearer ${token.replace("Bearer ", "")}` : undefined,
  },
});

/**
 * Modular API wrapper — tanpa import tipe tambahan
 */

export const api = {
  async request<TResponse = unknown>(
    method: string,
    url: string,
    data?: Record<string, unknown>,
    config?: Record<string, unknown>
  ): Promise<TResponse> {
    const res = await apiClient.request({
      method,
      url,
      data,
      ...config,
    });
    return res.data as TResponse;
  },

  async get<TResponse = unknown>(
    url: string,
    config?: Record<string, unknown>
  ): Promise<TResponse> {
    const res = await apiClient.get(url, config);
    return res.data as TResponse;
  },

  async post<TResponse = unknown>(
    url: string,
    data?: Record<string, unknown>,
    config?: Record<string, unknown>
  ): Promise<TResponse> {
    const res = await apiClient.post(url, data, config);
    return res.data as TResponse;
  },

  async put<TResponse = unknown>(
    url: string,
    data?: Record<string, unknown>,
    config?: Record<string, unknown>
  ): Promise<TResponse> {
    const res = await apiClient.put(url, data, config);
    return res.data as TResponse;
  },

  async patch<TResponse = unknown>(
    url: string,
    data?: Record<string, unknown>,
    config?: Record<string, unknown>
  ): Promise<TResponse> {
    const res = await apiClient.patch(url, data, config);
    return res.data as TResponse;
  },

  async delete<TResponse = unknown>(
    url: string,
    config?: Record<string, unknown>
  ): Promise<TResponse> {
    const res = await apiClient.delete(url, config);
    return res.data as TResponse;
  },
};

export default apiClient;
