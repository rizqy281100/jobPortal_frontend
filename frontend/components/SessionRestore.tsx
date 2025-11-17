// components/SessionRestore.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginSuccess, logout } from "@/store/authSlice";
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
    // Jika sudah ada accessToken di Redux, skip
    if (isAuthenticated && accessToken) {
      return;
    }

    // Coba restore session dari server
    const restoreSession = async () => {
      try {
        // Call refresh token endpoint untuk mendapatkan accessToken baru
        const response = await fetch(`${API_URL}/users/refresh-token`, {
          method: "POST",
          headers: basicHeader ? { Authorization: basicHeader } : {},
          credentials: "include", // kirim cookie
        });

        if (!response.ok) {
          throw new Error("Session restore failed");
        }

        const data = await response.json();

        // Get user profile
        // const userResponse = await fetch("/users/login", {
        //   headers: {
        //     Authorization: `Bearer ${data.accessToken}`,
        //   },
        // });

        // if (!userResponse.ok) {
        //   throw new Error("Get user failed");
        // }

        const userData = data.user;

        // Update Redux state
        dispatch(
          loginSuccess({
            accessToken: data.token,
            user: userData,
          })
        );
      } catch (error) {
        console.error("Failed to restore session:", error);
        // Jika gagal, clear state
        dispatch(logout());
      }
    };

    restoreSession();
  }, [dispatch, isAuthenticated, accessToken]);

  return null; // Component ini tidak render apapun
}
