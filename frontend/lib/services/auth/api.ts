import axios from "axios";
import { ResponseRegister, BodyRegister } from "./types";
import baseApi from "../baseApi";

export const Register = async (
  data: BodyRegister
): Promise<ResponseRegister> => {
  try {
    const username = process.env.NEXT_PUBLIC_USERNAME_BASIC!;
    const password = process.env.NEXT_PUBLIC_PASSWORD_BASIC!;
    const token = btoa(`${username}:${password}`);

    const response = await baseApi.post("/users/register-worker", data, {
      headers: {
        Authorization: `Basic ${token}`,
        Accept: "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Register error:", error.response?.data || error.message);
      throw error;
    }
    throw new Error("Terjadi kesalahan saat register.");
  }
};
