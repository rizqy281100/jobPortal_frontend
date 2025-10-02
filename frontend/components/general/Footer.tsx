"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ------------------------------------------------------------------
// Footer (JobStreet-style) — responsive for desktop, tablet, and mobile
// ------------------------------------------------------------------

export type FooterLink = { label: string; href: string };
export type FooterSection = { title: string; links: FooterLink[] };

const SECTIONS: FooterSection[] = [
  {
    title: "Pencari kerja",
    links: [
      { label: "Cari lowongan", href: "/jobs" },
      { label: "Lihat profil", href: "/profile" },
      { label: "Pencarian tersimpan", href: "/saved-searches" },
      { label: "Lowongan tersimpan", href: "/saved-jobs" },
      { label: "Lamaran kerja", href: "/applications" },
      { label: "Sumber daya karir", href: "/career-resources" },
      { label: "Jelajahi karier", href: "/explore-careers" },
      { label: "Jelajahi gaji", href: "/salaries" },
      { label: "Jelajahi perusahaan", href: "/companies" },
      { label: "Komunitas", href: "/community" },
      { label: "Unduh aplikasi", href: "/apps" },
    ],
  },
  {
    title: "Perusahaan",
    links: [
      { label: "Daftar gratis", href: "/employers/signup" },
      { label: "Pasang iklan lowongan kerja", href: "/employers/post-job" },
      { label: "Produk & harga", href: "/employers/products" },
      { label: "Layanan pelanggan", href: "/employers/support" },
      { label: "Saran perekrutan", href: "/employers/tips" },
      { label: "Wawasan pasar", href: "/employers/insights" },
      {
        label: "Mitra perangkat lunak perekrutan",
        href: "/employers/partners",
      },
    ],
  },
  {
    title: "Tentang kami",
    links: [
      { label: "Tentang kami", href: "/about" },
      { label: "Ruang berita", href: "/press" },
      { label: "Investor", href: "/investors" },
      { label: "Karir", href: "/careers" },
      { label: "Mitra internasional", href: "/partners" },
      { label: "Layanan mitra", href: "/partner-services" },
    ],
  },
  {
    title: "Kontak",
    links: [
      { label: "Pusat bantuan", href: "/help" },
      { label: "Hubungi kami", href: "/contact" },
      { label: "Blog produk & teknologi", href: "/blog" },
      { label: "Media sosial", href: "/social" },
    ],
  },
];

export default function Footer({
  brand = { name: "JobPortal", href: "/", logo: null },
  sections = SECTIONS,
}: {
  brand?: { name: string; href: string; logo?: React.ReactNode | null };
  sections?: FooterSection[];
}) {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-10">
        {/* Desktop & Tablet */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((sec) => (
            <div key={sec.title}>
              <h3 className="mb-3 text-base font-semibold tracking-tight text-foreground">
                {sec.title}
              </h3>
              <ul className="space-y-2">
                {sec.links.map((l) => (
                  <li key={l.href}>
                    <FooterLinkItem href={l.href} active={pathname === l.href}>
                      {l.label}
                    </FooterLinkItem>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile: Accordion */}
        <div className="md:hidden">
          <Accordion type="multiple" className="w-full">
            {sections.map((sec) => (
              <AccordionItem value={sec.title} key={sec.title}>
                <AccordionTrigger className="text-base font-semibold">
                  {sec.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 pb-2">
                    {sec.links.map((l) => (
                      <li key={l.href}>
                        <FooterLinkItem
                          href={l.href}
                          active={pathname === l.href}
                        >
                          {l.label}
                        </FooterLinkItem>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <Separator className="my-8" />

        {/* Bottom bar */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <Link href={brand.href} className="flex items-center gap-2">
            {brand.logo ?? (
              <div className="h-8 w-8 rounded-full bg-primary/15 text-primary grid place-items-center font-bold">
                i
              </div>
            )}
            <span className="font-bold text-lg">
              Job<span className="text-primary">Portal</span>
            </span>
          </Link>

          <p className="text-xs text-muted-foreground">
            © {year} JobPortal. All rights reserved.
          </p>
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
      className="text-sm text-foreground/90 hover:text-primary transition-colors"
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
