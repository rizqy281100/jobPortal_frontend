import { NextResponse } from "next/server";
import { clearSession } from "@/lib/session";

export async function GET() {
  await clearSession();
  return NextResponse.redirect(
    new URL(
      "/?logout=success",
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    )
  );
}
