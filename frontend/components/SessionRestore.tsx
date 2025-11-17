// components/SessionRestore.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginSuccess, logout } from "@/store/authSlice";
import { api } from "@/lib/axios";
const username = process.env.NEXT_PUBLIC_USERNAME_BASIC;
const pass = process.env.NEXT_PUBLIC_PASSWORD_BASIC;
const basicHeader =
  username && pass
    ? `Basic ${Buffer.from(`${username}:${pass}`).toString("base64")}`
    : undefined;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
/**
 * Component untuk restore session saat aplikasi pertama kali load
 * Dipasang di root layout
 */
export default function SessionRestore() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, accessToken } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Jika sudah login, tidak perlu restore session
    if (isAuthenticated) return;

    const restoreSession = async () => {
      try {
        // Panggil refresh token TANPA Authorization header
        const response = await api.put(
          "/users/refresh-token",
          {},
          {
            headers: { Authorization: accessToken },
            withCredentials: true, // penting untuk cookie refresh
          }
        );

        // Jika server membalas token baru
        const data = response.data;

        dispatch(
          loginSuccess({
            accessToken: data.token,
            user: data.user,
          })
        );
      } catch (err) {
        console.log("No active session");
        dispatch(logout()); // biar bersih
      }
    };

    restoreSession();
  }, [isAuthenticated, dispatch]);

  return null; // Component ini tidak render apapun
}
