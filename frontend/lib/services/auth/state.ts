/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import { useCallback } from "react";
import { ResponseRegister, BodyRegister } from "./types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Register } from "./api";

export const AuthState = () => {
  const router = useRouter();

  const registerUser = useCallback(
    async (payload: BodyRegister) => {
      try {
        const response: ResponseRegister = await Register(payload);

        // Backend biasanya kirim statusCode atau code
        const code =
          (response as any).statusCode ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (response as any).code ||
          (response as any).status;

        if (code === 200 || code === 201) {
          toast.success(response.message || "Registration successful!");
          setTimeout(() => {
            router.replace("/login");
          }, 1500);
          return;
        }

        // Kalau backend kirim message tapi bukan sukses
        toast.error(response.message || "Registration failed. Try again.");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Register error:", error);
          const errorMessage =
            error.response?.data?.message || "Registration failed. Try again.";
          toast.error(errorMessage);
        } else {
          toast.error("Unexpected error occurred.");
        }
      }
    },
    [router]
  );

  return {
    registerUser,
  };
};
