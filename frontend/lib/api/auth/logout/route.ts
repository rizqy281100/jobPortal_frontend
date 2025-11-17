// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

export async function POST() {
  try {
    // Hapus refresh token dari cookie
    await deleteSession();

    return NextResponse.json({
      success: true,
      message: "Logout berhasil",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout gagal" }, { status: 500 });
  }
}
