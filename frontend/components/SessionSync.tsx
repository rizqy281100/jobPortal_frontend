"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginSuccess, logout } from "@/store/authSlice";
import Cookies from "js-cookie";

export default function SessionSync() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    const rawUser = Cookies.get("user");

    // 🛑 Kalau Redux sudah authenticated → JANGAN sync ulang
    // Ini mencegah Redux di-reset setelah login
    if (isAuthenticated) return;

    // Kalau tidak ada cookie → logout
    if (!accessToken || !rawUser) {
      dispatch(logout());
      return;
    }

    // Kalau ada cookie → sync Redux
    dispatch(
      loginSuccess({
        accessToken,
        user: JSON.parse(rawUser),
      })
    );
  }, [isAuthenticated]);

  return null;
}
