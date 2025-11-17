"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
import { useAppSelector } from "@/store/hooks";
import { ThemeProvider } from "@/components/general/ThemeProvider";
import { Toaster } from "sonner";
import Providers from "@/components/Providers";
import Navbar from "@/components/general/Navbar";
import SessionRestore from "@/components/SessionRestore";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <SessionRestore />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar
              session={
                user
                  ? {
                      id: user.id,
                      name: user.name,
                      email: user.email,
                      role: user.role,
                    }
                  : null
              }
            />
            {children}
            {/* ONE toaster globally */}
            <Toaster richColors position="bottom-right" />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
