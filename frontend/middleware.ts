// middleware.ts
import { NextRequest, NextResponse } from "next/server";

// Routes yang memerlukan autentikasi
const protectedRoutes = [
  "/dashboard-candidates",
  "/dashboard-recruiters",
  "/profile",
];

// Routes yang tidak boleh diakses jika sudah login
const authRoutes = [
  "/login",
  "/register",
  "/perusahaan/login",
  "/perusahaan/register",
];

// Routes yang selalu diizinkan
const publicRoutes = ["/", "/jobs", "/about", "/api"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ambil refresh token dari cookie
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isAuthenticated = !!refreshToken;

  // Check jika route adalah protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check jika route adalah auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Check jika route adalah public route
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Jika user belum login dan mengakses protected route
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Jika user sudah login dan mengakses auth route (login/register)
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Izinkan akses ke public routes dan API routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
