// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";
import { api } from "@/lib/axios";
import { access } from "fs";

// =====================================
// ROLE BASED ROUTING CONFIG
// =====================================
// Tinggal tambah role baru di sini
const roleAccess: Record<string, string[]> = {
  user: ["/dashboard-candidates", "/profile"], // user/worker
  recruiter: ["/dashboard-recruiters", "/profile"], // recruiter
  admin: ["/admin", "/profile"], // admin (opsional)
};

// =====================================
// AUTH ROUTES – diblokir kalau SUDAH login
// =====================================
const authRoutes = ["/login", "/register"];

// =====================================
// COMPANY AUTH ROUTES – SELALU boleh diakses
// =====================================
const companyAuthRoutes = ["/perusahaan/login", "/perusahaan/register"];

// =====================================
// PUBLIC ROUTES – bebas diakses semua
// =====================================
const publicRoutes = ["/", "/jobs", "/about"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const refreshToken = request.cookies.get("refreshToken")?.value || null;
  const accessToken = request.cookies.get("accessToken")?.value || null;
  const role = request.cookies.get("role")?.value || null;
  console.log("data we got : " + refreshToken, role);
  // =============================
  // 🔥 SESSION RESTORE START — SERVER-SIDE REFRESH TOKEN
  // =============================
  if (refreshToken) {
    try {
      console.log("Trying to refresh session in middleware...");
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      const username = process.env.NEXT_PUBLIC_USERNAME_BASIC;
      const pass = process.env.NEXT_PUBLIC_PASSWORD_BASIC;
      const basicHeader =
        username && pass
          ? `Basic ${Buffer.from(`${username}:${pass}`).toString("base64")}`
          : undefined;

      const headers: Record<string, string> = {
        Cookie: `refreshToken=${refreshToken};`,
      };
      if (basicHeader) {
        headers.Authorization = basicHeader;
      }

      const refreshReq = await fetch(`${apiUrl}/users/refresh-token`, {
        method: "PUT",
        headers,
      });

      const data = await refreshReq.json();
      const dataRefresh = data.data;
      console.log("Refresh response data:", data);
      console.log("Refresh response data token:", dataRefresh);
      if (!dataRefresh.token) {
        const res = NextResponse.next();
        res.cookies.delete("refreshToken");
        res.cookies.delete("accessToken");
        res.cookies.delete("role");
        return res;
      }

      const res = NextResponse.next();

      res.cookies.set("accessToken", dataRefresh.token, {
        httpOnly: false,
        path: "/",
      });

      res.cookies.set("role", dataRefresh.user.role, {
        httpOnly: false,
        path: "/",
      });

      return res;
    } catch (err) {
      console.error("Error refreshing session in middleware:", err);
      const res = NextResponse.next();
      res.cookies.delete("refreshToken");
      res.cookies.delete("accessToken");
      res.cookies.delete("role");
      return res;
    }
  }
  // =============================
  // 🔥 SESSION RESTORE END
  // =============================

  if (pathname.startsWith("/jobs")) {
    return NextResponse.next();
  }

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  
  // =============================
  // 1. Cegah akses login/register umum jika SUDAH login
  // =============================
  const isAuthenticated = !!refreshToken;
  if (isAuthenticated && authRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // =============================
  // 2. Company login/register selalu boleh
  // =============================
  if (companyAuthRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // =============================
  // 3. Belum login → cek route protected
  // =============================
  if (!isAuthenticated) {
    const allProtectedRoutes = Object.values(roleAccess).flat();

    const tryingToAccessProtected = allProtectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (tryingToAccessProtected) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // =============================
  // 4. Sudah login tapi role tidak ditemukan
  // =============================
  if (!roleAccess[role || ""]) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const allowedRoutes = roleAccess[role];
  const allProtectedRoutes = Object.values(roleAccess).flat();

  const isTryingProtected = allProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // =============================
  // 5. Role tidak punya izin
  // =============================
  if (isTryingProtected) {
    const allowed = allowedRoutes.some((route) => pathname.startsWith(route));

    if (!allowed) {
      const defaultDashboard = allowedRoutes[0] || "/";
      return NextResponse.redirect(new URL(defaultDashboard, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
