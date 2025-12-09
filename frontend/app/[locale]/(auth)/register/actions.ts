"use server";

import { api } from "@/lib/axios";
import { createSession } from "@/lib/session";

export async function registerAction(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const fullName =
    String(formData.get("firstname") || "") +
    " " +
    String(formData.get("lastname") || "");

  const randomSuffix = Math.floor(Math.random() * 1000) + (Date.now() % 1000); // 0-999
  const username = String(formData.get("username") || "");
  // console.log(formData);
  // console.log("Email:", email);
  // console.log("Full name:", fullName);
  // console.log("Generated username:", username);

  try {
    const uname = process.env.NEXT_PUBLIC_USERNAME_BASIC;
    const pass = process.env.NEXT_PUBLIC_PASSWORD_BASIC;

    const basicHeader =
      uname && pass
        ? `Basic ${Buffer.from(`${uname}:${pass}`).toString("base64")}`
        : undefined;

    const response = await api.post<{ token: string; user: any }>(
      "/users/register-worker",
      { email, password, username, name: fullName },
      {
        headers: basicHeader ? { Authorization: basicHeader } : undefined,
      }
    );

    // await createSession({
    //   id: response?.data?.user?.id,
    //   name: response?.data?.user?.name,
    //   email: response?.data?.user?.email,
    //   role: response?.data?.user?.role,
    // });

    return { success: true };
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Invalid email or password";
    return { error: msg };
  }
}
