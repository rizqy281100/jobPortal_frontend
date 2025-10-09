import { readSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SavedJobsClient from "./SavedJobsClient";

export default async function DashboardCandidatePage() {
  const session = await readSession();
  if (!session) redirect("/login");

  return (
    <div className="p-6 space-y-6">
      <header className="rounded-xl border bg-card p-5">
        <h1 className="text-2xl font-semibold">Dashboard Candidate</h1>
        <p className="text-sm text-muted-foreground">
          Selamat datang, {session.name}! Kelola semua aktivitasmu di sini.
        </p>
      </header>

      {/* --- Tabs Container --- */}
      <Tabs
        defaultValue="overview"
        orientation="vertical"
        className="flex w-full space-x-8"
      >
        {/* --- Tabs Sidebar --- */}
        <TabsList className="flex flex-col w-56 h-fit rounded-xl border bg-card p-2">
          <TabsTrigger
            value="overview"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="applied"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition"
          >
            Applied Jobs
          </TabsTrigger>
          <TabsTrigger
            value="favorites"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition"
          >
            Saved Jobs
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        {/* --- Tabs Content Area --- */}
        <div className="flex-1">
          <TabsContent value="overview">
            <div className="rounded-lg border bg-background p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">
                Ringkasan Aktivitas
              </h2>
              <p className="text-sm text-muted-foreground">
                Lihat sekilas progress lamaran dan aktivitasmu di platform ini.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Lamaran Aktif</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-muted-foreground">
                    Sudah Diterima
                  </p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-muted-foreground">Ditolak</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-sm text-muted-foreground">Favorit</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applied">
            <div className="rounded-lg border bg-background p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Lamaran Saya</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Berikut daftar pekerjaan yang sudah kamu lamar.
              </p>

              <ul className="space-y-3">
                <li className="border rounded-lg p-4 hover:bg-muted transition">
                  <p className="font-medium">Frontend Developer</p>
                  <p className="text-sm text-muted-foreground">
                    PT Digital Kreatif · Lamaran dikirim 2 hari lalu
                  </p>
                </li>
                <li className="border rounded-lg p-4 hover:bg-muted transition">
                  <p className="font-medium">UI/UX Designer</p>
                  <p className="text-sm text-muted-foreground">
                    PT Inovasi Cemerlang · Lamaran dikirim 1 minggu lalu
                  </p>
                </li>
              </ul>
            </div>
          </TabsContent>

          {/* ======= Saved Jobs ======= */}
          <TabsContent value="favorites">
            <SavedJobsClient />
          </TabsContent>

          <TabsContent value="settings">
            <div className="rounded-lg border bg-background p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Pengaturan Akun</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Ubah informasi akunmu seperti email, password, atau preferensi
                notifikasi.
              </p>

              <form className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={session.email}
                    className="w-full rounded-md border px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    placeholder="Input your password..."
                    className="w-full rounded-md border px-3 py-2"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
                >
                  Simpan Perubahan
                </button>
              </form>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
