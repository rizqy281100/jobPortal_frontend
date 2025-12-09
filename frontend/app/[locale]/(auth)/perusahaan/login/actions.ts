// app/(auth)/login/actions.ts
"use server";

import { createSession, refreshSession } from "@/lib/session";
// import axios from "axios";
import { api } from "@/lib/axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const username = process.env.NEXT_PUBLIC_USERNAME_BASIC;
const pass = process.env.NEXT_PUBLIC_PASSWORD_BASIC;
const basicHeader =
  username && pass
    ? `Basic ${Buffer.from(`${username}:${pass}`).toString("base64")}`
    : undefined;

export interface LoginResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: "user" | "recruiter";
    avatar?: string;
  };
  message?: string;
}

export async function loginAction(formData: FormData): Promise<LoginResponse> {
  try {
    const email = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return {
        success: false,
        message: "Email dan password harus diisi",
      };
    }

    // Call backend API
    const response = await api.post(
      `/users/login`,
      {
        email,
        password,
      },
      {
        headers: basicHeader ? { Authorization: basicHeader } : undefined,
      }
    );

    const { token, refreshToken, user } = response?.data;

    if (!token || !refreshToken) {
      return {
        success: false,
        message: "Response dari server tidak valid",
      };
    }

    // Simpan refreshToken di httpOnly cookie

    await createSession(refreshToken, user.role);
    await refreshSession(token, user);

    // Return token dan user ke client
    // Client akan menyimpan ini di Redux
    return {
      success: true,
      token,
      user,
    };
  } catch (error: unknown) {
    console.error("Login error:", error);

    return {
      success: false,
      message: "Terjadi kesalahan pada server",
    };
  }
}

/**
 * Register Action (Candidate)
 */
export async function registerAction(
  formData: FormData
): Promise<LoginResponse> {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const response = await api.post(`/auth/register`, {
      name,
      email,
      password,
      role: "candidate",
    });

    const { token, refreshToken, user } = response?.data;

    await createSession(refreshToken);

    return {
      success: true,
      token,
      user,
    };
  } catch (error: unknown) {
    console.error("Register error:", error);

    return {
      success: false,
      message: "Terjadi kesalahan pada server",
    };
  }
}
