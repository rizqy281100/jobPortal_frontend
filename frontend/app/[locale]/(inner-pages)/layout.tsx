import type { ReactNode } from "react";
import Navbar from "@/components/general/Navbar";
import Footer from "@/components/general/Footer";

export default function InnerPagesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
