"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import Navbar from "@/components/general/Navbar";
import Footer from "@/components/general/Footer";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Tunggu hingga loading selesai
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state saat masih mengecek autentikasi
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  // Jika tidak authenticated, jangan render apapun (akan redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar dengan session dari Redux */}
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

      <main className="container mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {children}
      </main>

      <Footer />
    </div>
  );
}
