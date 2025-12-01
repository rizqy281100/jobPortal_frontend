import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/general/ThemeProvider";
import { Toaster } from "sonner";
import Providers from "@/components/Providers";
import Navbar from "@/components/general/Navbar";

import SessionRestore from "@/components/SessionRestore";
import SessionSync from "@/components/SessionSync";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobPortal",
  description: "Number #1 Job Platform in Uzbekistan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          {/* <SessionRestore /> */}
          <SessionSync />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            {/* ONE toaster globally */}
            <Toaster richColors position="bottom-right" />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
