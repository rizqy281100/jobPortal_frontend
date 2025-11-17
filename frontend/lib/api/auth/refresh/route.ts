// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession } from "@/lib/session";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function POST(request: NextRequest) {
  try {
    // Ambil refresh token dari cookie
    const refreshToken = await getSession();

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token tidak ditemukan" },
        { status: 401 }
      );
    }

    // Kirim refresh token ke backend
    const response = await axios.post(
      `${API_URL}/auth/refresh`,
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { token, refreshToken: newRefreshToken } = response.data;

    // Update refresh token jika backend memberikan yang baru
    if (newRefreshToken) {
      await updateSession(newRefreshToken);
    }

    return NextResponse.json({
      token,
      success: true,
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.message || "Token refresh gagal" },
        { status: error.response?.status || 401 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
