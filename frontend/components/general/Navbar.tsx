"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, FileText, LogOut, Menu } from "lucide-react";

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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useLocale, useTranslations } from "next-intl";

/* ==== Types ==== */
export type NavItem = { href: string; label: string };

/* ==== Defaults ==== */
const recruiterNavItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/dashboard-recruiters", label: "Dashboard" },
  { href: "/about", label: "About" },
];

const defaultNavItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/about", label: "About" },
];

/** Map href → key di translation "Navbar" */
const NAV_KEYS: Record<string, string> = {
  "/": "home",
  "/jobs": "jobs",
  "/about": "about",
  "/dashboard-recruiters": "dashboard",
  "/dashboard-candidates": "dashboard",
};

/* ==== Helpers ==== */
function NavLink({
  href,
  children,
  makeHref,
}: React.PropsWithChildren<{
  href: string;
  makeHref: (href: string) => string;
}>) {
  const pathname = usePathname();
  const target = makeHref(href);

  const active = pathname === target || pathname?.startsWith(target + "/");

  return (
    <Button
      asChild
      variant={active ? "secondary" : "ghost"}
      className="justify-start"
      size="sm"
    >
      <Link href={target} aria-current={active ? "page" : undefined}>
        {children}
      </Link>
    </Button>
  );
}

/* ============================ Language Switcher ============================ */
const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  ru: "Русский",
  uz: "O‘zbek",
};

const LOCALE_FLAGS: Record<string, string> = {
  en: "🇺🇸",
  ru: "🇷🇺",
  uz: "🇺🇿",
};

function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (nextLocale: string) => {
    if (nextLocale === locale) return;

    // pathname saat ini: /en/about, /ru/jobs, /uz, dst
    const segments = pathname.split("/"); // ["", "en", "about"]
    if (segments.length > 1) {
      segments[1] = nextLocale; // ganti segmen locale
    }

    const newPath = segments.join("/") || "/";
    router.push(newPath);
  };

  const currentFlag = LOCALE_FLAGS[locale] ?? "🌐";
  const currentLabel = LOCALE_LABELS[locale] ?? locale.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 px-2"
        >
          <span className="text-base">{currentFlag}</span>
          <span className="text-xs font-medium">{currentLabel}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {["en", "ru", "uz"].map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleChange(code)}
            className={code === locale ? "font-semibold" : ""}
          >
            <span className="mr-2 text-base">{LOCALE_FLAGS[code]}</span>
            <span>{LOCALE_LABELS[code]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ============================ Component ============================ */
export default function Navbar({
  navItems = defaultNavItems,
  brand = { name: "JobPortal", href: "/" },
}: {
  navItems?: NavItem[];
  brand?: { name: string; href: string };
}) {
  const locale = useLocale();
  const t = useTranslations("Navbar");

  const { user: session, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  // Helper: buat URL dengan prefix locale
  const makeHref = (href: string) => {
    if (href === "/") return `/${locale}`;
    return `/${locale}${href}`;
  };

  let items = navItems;

  // role recruiter → menu berbeda
  if (session?.role === "recruiter") {
    items = recruiterNavItems;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* -------------------- Desktop (≥1024px) -------------------- */}
      <div className="container mx-auto hidden h-20 grid-cols-3 items-center px-4 lg:grid">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href={makeHref(brand.href)} className="font-bold text-2xl">
            Job<span className="text-primary">Portal</span>
          </Link>
        </div>

        {/* Center: Nav */}
        <nav className="flex items-center justify-center gap-1">
          {items.map((item) => {
            const key = NAV_KEYS[item.href];
            const label = key ? t(key) : item.label;

            return (
              <NavLink key={item.href} href={item.href} makeHref={makeHref}>
                {label}
              </NavLink>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-2">
          {/* Language switcher selalu tampil */}
          <LanguageSwitcher />

          {isAuthenticated && session ? (
            <>
              <AccountDropdown
                name={session.name}
                email={session.email}
                role={session.role}
                locale={locale}
              />

              {session.role !== "recruiter" && (
                <Button asChild size="sm" variant="outline">
                  <Link href={makeHref("/perusahaan/login")}>
                    {t("recruiter")}
                  </Link>
                </Button>
              )}

              {session.role === "recruiter" && (
                <Button asChild size="sm" variant="outline">
                  <Link href={makeHref("/dashboard-recruiters") + "?tab=post"}>
                    {t("postJob")}
                  </Link>
                </Button>
              )}

              <ThemeToggle />
            </>
          ) : (
            <>
              <ThemeToggle />
              <Button asChild variant="outline">
                <Link href={makeHref("/login")}>{t("login")}</Link>
              </Button>
              <Button asChild className="text-white dark:text-white">
                <Link href={makeHref("/perusahaan/login")}>
                  {t("recruiter")}
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* -------------------- Mobile & Tablet (<1024px) -------------------- */}
      <div className="container mx-auto flex h-14 items-center justify-between px-3 lg:hidden">
        <Link href={makeHref(brand.href)} className="font-bold text-lg">
          Job<span className="text-primary">Portal</span>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <MobileNav items={items} />
        </div>
      </div>
    </header>
  );
}

/* ============================ Mobile Nav (Sheet) ============================ */
function MobileNav({ items }: { items: NavItem[] }) {
  const locale = useLocale();
  const t = useTranslations("Navbar");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    user: session,
    isAuthenticated,
    accessToken,
  } = useAppSelector((state) => state.auth);

  const makeHref = (href: string) => {
    if (href === "/") return `/${locale}`;
    return `/${locale}${href}`;
  };

  const handleLogout = async () => {
    try {
      const response = await api.delete(`users/logout`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // @ts-ignore – sesuaikan dengan bentuk response API-mu
      if (response.code !== 200 && response.status !== 200) {
        throw new Error("Logout failed");
      }

      dispatch(logout());
      toast.success("Logout success");
      router.push(`/${locale}`);
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed, please try again");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-left">
            Job<span className="text-primary">Portal</span>
          </SheetTitle>
        </SheetHeader>

        {/* Nav items */}
        <nav className="flex flex-col gap-1">
          {items.map((item) => {
            const key = NAV_KEYS[item.href];
            const label = key ? t(key) : item.label;

            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className="justify-start"
                size="sm"
              >
                <Link href={makeHref(item.href)}>{label}</Link>
              </Button>
            );
          })}
        </nav>

        {/* Auth actions */}
        <div className="mt-6 border-t pt-4 space-y-2">
          {isAuthenticated && session ? (
            <>
              <div className="text-xs text-muted-foreground">
                {t("hi")}, <span className="font-semibold">{session.name}</span>
              </div>

              <Button asChild variant="outline" size="sm" className="w-full">
                <Link
                  href={
                    session.role === "recruiter"
                      ? makeHref("/dashboard-recruiters")
                      : makeHref("/dashboard-candidates")
                  }
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {t("dashboard")}
                </Link>
              </Button>

              <Button
                onClick={handleLogout}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t("logout")}
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={makeHref("/login")}>{t("login")}</Link>
              </Button>
              <Button asChild size="sm" className="w-full text-white">
                <Link href={makeHref("/perusahaan/login")}>
                  {t("recruiter")}
                </Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ============================ Account Dropdown (Desktop) ============================ */
function AccountDropdown({
  name,
  email,
  role,
  compact = false,
  locale,
}: {
  name: string;
  email: string;
  role: string;
  compact?: boolean;
  locale: string;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const first = name.split(" ")[0];
  const { accessToken } = useAppSelector((state) => state.auth);
  const t = useTranslations("Navbar");

  const makeHref = (href: string) => {
    if (href === "/") return `/${locale}`;
    return `/${locale}${href}`;
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      const response = await api.delete(`users/logout`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // @ts-ignore – sesuaikan dengan bentuk response API-mu
      if (response.code !== 200 && response.status !== 200) {
        throw new Error("Logout failed");
      }

      dispatch(logout());

      toast.success("Logout success");
      router.push(`/${locale}`);
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed, please try again");
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
                {t("hi")}, <b>{first}</b>
              </>
            ) : (
              <>
                {t("hello")}, <b>{name}</b>!
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

        {role !== "recruiter" ? (
          <DropdownMenuItem asChild>
            <Link
              href={makeHref("/dashboard-candidates")}
              className="flex cursor-pointer items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              {t("dashboard")}
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link
              href={makeHref("/dashboard-recruiters")}
              className="flex cursor-pointer items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              {t("dashboard")}
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <div className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "Logging out..." : t("logout")}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
