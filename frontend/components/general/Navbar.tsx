"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  User,
  FileText,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";

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

/* ==== Types ==== */
export type NavItem = { href: string; label: string };
type UserSession = {
  id: string;
  name: string;
  email: string;
  role: string;
} | null;

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
              <AccountDropdown name={session.name} role={session.role} />

              {/* 🔽 Tombol Login Perusahaan muncul di sebelah dropdown */}
              {session.role !== "recruiter" && (
                <>
                  {/* 🔽 Tombol Login Perusahaan versi mobile */}
                  <Button asChild size="sm" variant="outline">
                    <Link href="/perusahaan/login">Recruiter</Link>
                  </Button>
                </>
              )}

              {session.role === "recruiter" && (
                <>
                  {/* 🔽 Tombol Login Perusahaan versi mobile */}
                  <Button asChild size="sm" variant="outline">
                    <Link href="/">Post A Job</Link>
                  </Button>
                </>
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
                role={session.role}
                compact
              />
              {session.role !== "recruiter" && (
                <>
                  {/* 🔽 Tombol Login Perusahaan versi mobile */}
                  <Button asChild size="sm" variant="outline">
                    <Link href="/perusahaan/login">Recruitesr</Link>
                  </Button>
                </>
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
  role,
  compact = false,
}: {
  name: string;
  role: string;
  compact?: boolean;
}) {
  const first = name.split(" ")[0];

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
                {/* hindari &nbsp; agar tidak memicu mismatch SSR/CSR */}
                Hello, <b>{name}</b>!
              </>
            )}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Application Status → Dashboard (Applied tab) */}
        {role !== "recruiter" ? (
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard-candidates"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard-recruiters"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="text-red-600 focus:text-red-600">
          <Link href="/logout" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
