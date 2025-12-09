import "../globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/general/ThemeProvider";
import { Toaster } from "sonner";
import Providers from "@/components/Providers";
import SessionSync from "@/components/SessionSync";

import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { locales } from "../../next-intl.config";
import { notFound } from "next/navigation";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "JobPortal",
  description: "Number #1 Job Platform in Uzbekistan",
};

type LayoutProps = {
  children: React.ReactNode;
  // ⚠️ params sekarang Promise, bukan object langsung
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  // ⬇️ WAJIB di-await dulu
  const { locale } = await params;

  // Kalau locale nggak termasuk daftar locales → 404
  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  // Beritahu next-intl locale yang sedang aktif
  setRequestLocale(locale);

  // Load messages sesuai locale
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <SessionSync />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster richColors position="bottom-right" />
            </ThemeProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
