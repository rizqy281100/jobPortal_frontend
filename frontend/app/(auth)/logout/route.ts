import { NextResponse } from "next/server";
import { clearSession, readSession } from "@/lib/session";

export async function GET() {
  // baca session untuk ambil token
  const session = await readSession();

  // panggil backend logout dulu
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.auth_key || "", // kirim access token
      },
      credentials: "include", // biar refreshToken cookie ke-backend
    });
  } catch (err) {
    console.error("Error calling backend logout:", err);
  }

  // Hapus session NEXT
  await clearSession();

  // Redirect ke home
  return NextResponse.redirect(
    new URL(
      "/?logout=success",
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    )
  );
}
