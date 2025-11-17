"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, FileText, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/general/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useAppSelector } from "@/store/hooks";

/* ==== Types ==== */
export type NavItem = { href: string; label: string };
type UserSession = {
  id: string;
  name: string;
  email: string;
  role: string;
} | null;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
const username = process.env.NEXT_PUBLIC_USERNAME_BASIC;
const pass = process.env.NEXT_PUBLIC_PASSWORD_BASIC;
const basicHeader =
  username && pass
    ? `Basic ${Buffer.from(`${username}:${pass}`).toString("base64")}`
    : undefined;
/* ==== Defaults ==== */
const recruiterNavItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/dashboard-recruiters", label: "Dashboard" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
];
const defaultNavItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
];

/* ==== Helpers ==== */
function NavLink({
  href,
  children,
}: React.PropsWithChildren<{ href: string }>) {
  const pathname = usePathname();
  const active = pathname === href || pathname?.startsWith(href + "/");
  return (
    <Button
      asChild
      variant={active ? "secondary" : "ghost"}
      className="justify-start"
      size="sm"
    >
      <Link href={href} aria-current={active ? "page" : undefined}>
        {children}
      </Link>
    </Button>
  );
}

/* ============================ Component ============================ */
export default function Navbar({
  navItems = defaultNavItems,
  brand = { name: "JobPortal", href: "/" },
  session,
}: {
  navItems?: NavItem[];
  brand?: { name: string; href: string };
  session?: UserSession;
}) {
  let items = navItems || defaultNavItems;

  // 🔁 Ganti secara dinamis tergantung role
  if (session?.role === "recruiter") {
    items = [
      { href: "/dashboard-recruiters", label: "Dashboard" },
      { href: "/jobs", label: "My Jobs" },
      { href: "/post", label: "Post Job" },
    ];
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* -------------------- Desktop & Tablet (≥md) -------------------- */}
      <div className="container mx-auto hidden h-20 grid-cols-3 items-center px-4 md:grid">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href={brand.href} className="font-bold text-2xl">
            Job<span className="text-primary">Portal</span>
          </Link>
        </div>

        {/* Center: Nav */}
        <nav className="flex items-center justify-center gap-1">
          {items.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-2">
          {session ? (
            <>
              {/* Dropdown Akun */}
              <AccountDropdown
                name={session.name}
                email={session.email}
                role={session.role}
              />

              {/* 🔽 Tombol Login Perusahaan muncul di sebelah dropdown */}
              {session.role !== "recruiter" && (
                <Button asChild size="sm" variant="outline">
                  <Link href="/perusahaan/login">Recruiter</Link>
                </Button>
              )}

              {session.role === "recruiter" && (
                <Button asChild size="sm" variant="outline">
                  <Link href="/post">Post A Job</Link>
                </Button>
              )}

              <ThemeToggle />
            </>
          ) : (
            <>
              <ThemeToggle />
              <Button asChild variant="outline">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="text-white dark:text-white">
                <Link href="/perusahaan/login">Recruiter</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* -------------------- Mobile (<md) -------------------- */}
      <div className="container mx-auto flex h-14 items-center justify-between px-3 md:hidden">
        {/* Left: Logo */}
        <Link href={brand.href} className="font-bold text-lg">
          Job<span className="text-primary">Portal</span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-1">
          {session ? (
            <>
              <AccountDropdown
                name={session.name}
                email={session.email}
                role={session.role}
                compact
              />
              {session.role !== "recruiter" && (
                <Button asChild size="sm" variant="outline">
                  <Link href="/perusahaan/login">Recruiter</Link>
                </Button>
              )}

              <ThemeToggle />
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm" className="text-white dark:text-white">
                <Link href="/perusahaan/login">Recruiter</Link>
              </Button>
              <ThemeToggle />
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/* ============================ Account Dropdown ============================ */
function AccountDropdown({
  name,
  email,
  role,
  compact = false,
}: {
  name: string;
  email: string;
  role: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const first = name.split(" ")[0];
  const { accessToken } = useAppSelector((state) => state.auth);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      // Call logout API untuk hapus cookie
      const response = await api.post(`${API_URL}/users/logout`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status !== 200) {
        throw new Error("Logout failed");
      }

      // Clear Redux state
      dispatch(logout());

      toast.success("Logout berhasil");

      // Redirect ke login
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout gagal, silakan coba lagi");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 px-2">
          <span className="hidden sm:inline">
            {compact ? (
              <>
                Hi, <b>{first}</b>
              </>
            ) : (
              <>
                Hello, <b>{name}</b>!
              </>
            )}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
            <p className="text-xs text-muted-foreground capitalize">{role}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Dashboard Link */}
        {role !== "recruiter" ? (
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard-candidates"
              className="flex items-center gap-2 cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard-recruiters"
              className="flex items-center gap-2 cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-red-600 focus:text-red-600 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
