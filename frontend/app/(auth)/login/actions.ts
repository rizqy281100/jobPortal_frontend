"use server";

import { api } from "@/lib/axios";
import { createSession } from "@/lib/session";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("username") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  try {
    const username = process.env.NEXT_PUBLIC_USERNAME_BASIC;
    const pass = process.env.NEXT_PUBLIC_PASSWORD_BASIC;

    const basicHeader =
      username && pass
        ? `Basic ${Buffer.from(`${username}:${pass}`).toString("base64")}`
        : undefined;

    const response = await api.post<{ token: string; user: any }>(
      "/users/login",
      { email, password },
      {
        headers: basicHeader ? { Authorization: basicHeader } : undefined,
      }
    );

    await createSession({
      id: response?.data?.user?.id,
      name: response?.data?.user?.name,
      email: response?.data?.user?.email,
      role: response?.data?.user?.role,
    });

    return { success: true };
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Invalid email or password";
    return { error: msg };
  }
}
