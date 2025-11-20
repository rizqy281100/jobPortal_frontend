// middleware.ts
import { NextRequest, NextResponse } from "next/server";

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const refreshToken = request.cookies.get("refreshToken")?.value || null;
  const role = request.cookies.get("role")?.value || null;
  const isAuthenticated = !!refreshToken;

  // =============================
  // 1. Cegah akses login/register umum jika SUDAH login
  // =============================
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
  // 5. Role tidak punya izin ke route tersebut
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
