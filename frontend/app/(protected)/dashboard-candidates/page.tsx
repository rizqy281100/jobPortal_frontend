import { readSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SavedJobsClient from "./SavedJobsClient";
import AppliedJobsClient from "./AppliedJobsClient";
import UserSettingsClient from "./UserSettingsClient";

export default async function DashboardCandidatePage() {
  const session = await readSession();
  if (!session) redirect("/login");

  return (
    <div className="p-6 space-y-6">
      <header className="rounded-xl border bg-card p-5">
        <h1 className="text-2xl font-semibold">Dashboard Candidate</h1>
        <p className="text-sm text-muted-foreground">
          Welcome, {session.name}! Manage your activities here.
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
            value="user_settings"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition"
          >
            User Settings
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
            <AppliedJobsClient />
          </TabsContent>

          {/* ======= Saved Jobs ======= */}
          <TabsContent value="favorites">
            <SavedJobsClient />
          </TabsContent>

          <TabsContent value="user_settings">
            <UserSettingsClient />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
