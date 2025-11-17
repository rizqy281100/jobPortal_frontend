"use client";

import Navbar from "@/components/general/Navbar";
import Footer from "@/components/general/Footer";
import { useAppSelector } from "@/store/hooks";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAppSelector(
    (state) => state.auth
  );

  // Ambil session hanya jika user sudah loaded
  const session =
    !isLoading && user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar session={session} />

      {/* konten halaman */}
      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
