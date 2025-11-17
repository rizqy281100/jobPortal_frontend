import "server-only";
import { cookies } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";
import crypto from "crypto";

const COOKIE_NAME = "jp_session";
const secret = process.env.AUTH_SECRET || "dev-secret-change-me";

export type Session = {
  id: string;
  name: string;
  email: string;
  role: string;
  auth_key: string;
};

function sign(value: string) {
  const mac = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${mac}`;
}
function verify(signed: string) {
  const i = signed.lastIndexOf(".");
  if (i < 0) return null;
  const raw = signed.slice(0, i);
  return sign(raw) === signed ? raw : null;
}

export async function createSession(s: Session) {
  const jar = await cookies();
  const raw = JSON.stringify(s);
  const token = sign(Buffer.from(raw).toString("base64url"));
  jar.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function readSession(): Promise<Session | null> {
  noStore(); // ⟵ force dynamic for this read
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const raw = verify(token);
  if (!raw) return null;

  try {
    return JSON.parse(Buffer.from(raw, "base64url").toString());
  } catch {
    return null;
  }
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
