import Navbar from "@/components/general/Navbar";
import Footer from "@/components/general/Footer";
import { readSession } from "@/lib/session";
// import AuthToast from "./AuthToast";
// import { Toaster } from "@/components/ui/sonner";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await readSession();

  return (
    <>
      <Navbar session={session ?? null} />
      {/* Gate yang membaca ?login=success / ?logout=success */}
      {/* <AuthToast /> */}
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
      {/* SATU Toaster global */}
      {/* <Toaster position="bottom-right" richColors closeButton /> */}
    </>
  );
}
