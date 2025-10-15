import axios from "axios";
import { ResponseRegister, BodyRegister } from "./types";
import baseApi from "../baseApi";
import { log } from "console";

function base64Utf8(str: string) {
  return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}

export const Register = async (
  data: BodyRegister
): Promise<ResponseRegister> => {
  try {
    const username = process.env.NEXT_PUBLIC_USERNAME_BASIC;
    const password = process.env.NEXT_PUBLIC_PASSWORD_BASIC;
    console.log(username);
    console.log(password);

    // const token = Buffer.from(
    //     `${process.env.NEXT_PUBLIC_USERNAME_BASIC}:${process.env.NEXT_PUBLIC_PASSWORD_BASIC}`
    // ).toString("base64");
    const token = btoa(`${username}:${password}`);
    console.log(token);
    const response = await baseApi.post("/users/register-worker", data, {
      headers: { Authorization: `Basic ${token}`, Accept: "application/json" },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      throw error;
    }
    throw new Error("Terjadi kesalahan saat register.");
  }
};
