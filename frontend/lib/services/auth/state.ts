"use client";

import axios from "axios";
import { useCallback } from "react";
import { ResponseRegister, BodyRegister } from "./types";
import { toast } from "sonner";
import { redirect, RedirectType } from "next/navigation";
import { Register } from "./api";

export const AuthState = () => {
  const registerUser = useCallback(async (payload: BodyRegister) => {
    try {
      const response: ResponseRegister = await Register(payload);
      if (response.statusCode === 200) {
        toast.success(response.message);
        setTimeout(() => {
          redirect("/login", RedirectType.replace);
        }, 1500);
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        const errorMessage =
          error.response?.data?.message || "Registration failed. Try again.";
        toast.error(errorMessage);
      } else {
        toast.error("Error");
      }
    }
  }, []);

  return {
    registerUser,
  };
};
