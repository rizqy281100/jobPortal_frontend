import { readSession } from "@/lib/session";
import DashboardClient, { JobLite, JobStatus } from "./DashboardClient";
import Link from "next/link";

// OPTIONAL breadcrumbs (ringkas & responsif)
function Crumbs() {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>
        <li>/</li>
        <li className="text-foreground">Dashboard</li>
      </ol>
    </nav>
  );
}

export default async function DashboardPage() {
  const session = await readSession();

  // --- Dummy data (ganti dengan data asli kalau sudah siap) ---
  const applied: JobLite[] = Array.from({ length: 23 }).map((_, i) => ({
    id: `a${i}`,
    title: i % 2 ? "Frontend Developer" : "Backend Engineer",
    company: ["Acme Co", "Glints", "Dealls", "Work.ua"][i % 4],
    location: ["Tashkent, Uzbekistan", "Samarkand, Uzbekistan"][i % 2],
    date: new Date(Date.now() - i * 864e5).toISOString(),
    status: (i % 3 === 0 ? "expired" : "active") as JobStatus,
    href: `/jobs/${i + 1}`,
  }));

  const saved: JobLite[] = Array.from({ length: 17 }).map((_, i) => ({
    id: `s${i}`,
    title: i % 2 ? "Product Designer" : "Data Analyst",
    company: ["Technohub", "NextGen", "FooBar"][i % 3],
    location: ["Tashkent, Uzbekistan", "Bukhara, Uzbekistan"][i % 2],
    date: new Date(Date.now() - i * 432e5).toISOString(),
    href: `/jobs/${i + 101}`,
  }));

  return (
    <main className="container mx-auto px-4 py-6">
      <Crumbs />
      <DashboardClient
        session={
          session
            ? { id: session.id, name: session.name, email: session.email }
            : null
        }
        applied={applied}
        saved={saved}
        profileCompletion={58}
      />
    </main>
  );
}
