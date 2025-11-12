import { redirect } from "next/navigation";
import { readSession } from "@/lib/session";
import Navbar from "@/components/general/Navbar";
import Footer from "@/components/general/Footer";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await readSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar bawaan situs (menu utama) */}
      <Navbar session={session} />

      <main className="container mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {children}
      </main>

      <Footer />
    </div>
  );
}
