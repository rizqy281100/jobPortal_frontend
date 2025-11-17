// lib/session.ts
import { cookies } from "next/headers";

const COOKIE_NAME = "refreshToken";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/",
};

/**
 * Create session dengan menyimpan refreshToken di httpOnly cookie
 * PENTING: Hanya simpan refreshToken, JANGAN simpan accessToken di cookie
 */
export async function createSession(refreshToken: string) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
}

/**
 * Get refresh token dari cookie
 */
export async function getSession() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(COOKIE_NAME);

  return refreshToken?.value || null;
}

/**
 * Verify apakah session valid
 * Next.js 15: Untuk production, gunakan JWT verify di sini
 */
export async function verifySession(): Promise<boolean> {
  const refreshToken = await getSession();

  if (!refreshToken) {
    return false;
  }

  // TODO: Add JWT verification jika diperlukan
  // Untuk sekarang, cukup cek keberadaan token
  // Backend akan validasi saat refresh token dipanggil
  return true;
}

/**
 * Delete session (logout)
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Update refresh token
 */
export async function updateSession(newRefreshToken: string) {
  await createSession(newRefreshToken);
}
