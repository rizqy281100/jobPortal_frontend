"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { useLocale, useTranslations } from "next-intl";

// ------------------------------------------------------------------
// Simple localized footer
// ------------------------------------------------------------------

type FooterLink = {
  href: string;
  key: "help" | "terms" | "privacy" | "contact";
};

const FOOTER_LINKS: FooterLink[] = [
  { href: "/help", key: "help" },
  { href: "/terms", key: "terms" },
  { href: "/privacy", key: "privacy" },
  { href: "/contact", key: "contact" },
];

export default function Footer({
  brand = { name: "JobPortal", href: "/", logo: null },
}: {
  brand?: { name: string; href: string; logo?: React.ReactNode | null };
}) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  const makeHref = (path: string) => {
    if (path === "/") return `/${locale}`;
    return `/${locale}${path}`;
  };

  return (
    <footer className="border-t bg-background mt-10">
      <div className="container mx-auto px-4 py-8">
        {/* Top row: brand + links */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <Link href={makeHref(brand.href)} className="flex items-center gap-2">
            {brand.logo ?? (
              <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-primary font-bold">
                i
              </div>
            )}
            <span className="text-lg font-bold">
              Job<span className="text-primary">Portal</span>
            </span>
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap gap-3 text-xs md:text-sm">
            {FOOTER_LINKS.map((item) => {
              const target = makeHref(item.href);
              const active =
                pathname === target || pathname?.startsWith(target + "/");

              return (
                <FooterLinkItem key={item.key} href={target} active={active}>
                  {t(item.key)}
                </FooterLinkItem>
              );
            })}
          </nav>
        </div>

        <Separator className="my-6" />

        {/* Bottom row: copyright */}
        <div className="flex flex-col items-start justify-between gap-3 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {year} JobPortal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkItem({
  href,
  children,
  active,
}: React.PropsWithChildren<{ href: string; active?: boolean }>) {
  return (
    <Link
      href={href}
      className={`transition-colors hover:text-primary ${
        active ? "font-medium text-foreground" : "text-foreground/80"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
