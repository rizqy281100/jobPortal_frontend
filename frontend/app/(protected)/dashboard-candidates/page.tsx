"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SavedJobsClient from "./SavedJobsClient";
import AppliedJobsClient from "./AppliedJobsClient";
import UserSettingsClient from "./UserSettingsClient";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export default function DashboardCandidatePage() {
  const router = useRouter();
  const params = useSearchParams();
  const { user } = useAppSelector((state) => state.auth);

  // Ambil tab dari URL, kalau tidak ada default ke "overview"
  const currentTab = params.get("tab") ?? "overview";

  const handleChange = (value: string) => {
    const newUrl = `?tab=${value}`;
    router.push(newUrl, { scroll: false });
  };

  const userName = user?.name || "User";

  return (
    <div className="w-full px-4 py-6 space-y-6 sm:px-6 lg:px-8">
      {/* ===== Header ===== */}
      <header className="rounded-xl border bg-card p-4 sm:p-5">
        <h1 className="text-xl font-semibold sm:text-2xl">
          Dashboard Candidate
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome, {userName}! Check all your activities here.
        </p>
      </header>

      {/* ===== Tabs Root ===== */}
      <Tabs
        defaultValue={currentTab ?? "overview"}
        orientation="vertical"
        value={currentTab}
        onValueChange={handleChange}
        // MOBILE/TABLET: kolom; DESKTOP: baris
        className="flex w-full flex-col gap-4 lg:flex-row lg:gap-8"
      >
        {/* ================= MOBILE & TABLET TABS (TOP BAR) ================= */}
        <div className="w-full lg:hidden">
          {/* Mobile: scroll horizontal */}
          <TabsList className="justify-items-start w-full">
            <TabsTrigger
              value="overview"
              className="w-full rounded-lg text-sm data-[state=active]:bg-primary"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="applied"
              className="w-full rounded-lg text-sm data-[state=active]:bg-primary"
            >
              Applied
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="w-full rounded-lg text-sm data-[state=active]:bg-primary"
            >
              Favorites
            </TabsTrigger>
            <TabsTrigger
              value="user_settings"
              className="w-full rounded-lg text-sm data-[state=active]:bg-primary"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Tablet: grid 4 kolom full width */}
          {/* <TabsList
            className="
              hidden sm:grid md:hidden lg:hidden
              grid-cols-4
              w-full
              bg-card
              p-1
              rounded-xl
              shadow-sm
              gap-1
            "
          >
            <TabsTrigger
              value="overview"
              className="
                w-full py-2 text-sm rounded-md
                data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
              "
            >
              Overview
            </TabsTrigger>

            <TabsTrigger
              value="applied"
              className="
                w-full py-2 text-sm rounded-md
                data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
              "
            >
              Applied
            </TabsTrigger>

            <TabsTrigger
              value="favorites"
              className="
                w-full py-2 text-sm rounded-md
                data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
              "
            >
              Favorites
            </TabsTrigger>

            <TabsTrigger
              value="user_settings"
              className="
                w-full py-2 text-sm rounded-md
                data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
              "
            >
              Settings
            </TabsTrigger>
          </TabsList> */}
        </div>

        {/* ================= DESKTOP SIDEBAR ================= */}
        <div className="hidden lg:block lg:w-56 lg:flex-shrink-0">
          <TabsList className="flex flex-col w-full h-fit rounded-xl border bg-card p-2">
            <TabsTrigger
              value="overview"
              className="w-full justify-start px-4 py-2 rounded-md text-sm transition data-[state=active]:bg-primary"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="applied"
              className="w-full justify-start px-4 py-2 rounded-md text-sm transition data-[state=active]:bg-primary"
            >
              Applied Jobs
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="w-full justify-start px-4 py-2 rounded-md text-sm transition data-[state=active]:bg-primary"
            >
              Saved Jobs
            </TabsTrigger>
            <TabsTrigger
              value="user_settings"
              className="w-full justify-start px-4 py-2 rounded-md text-sm transition data-[state=active]:bg-primary"
            >
              User Settings
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ===== Tabs Content Area ===== */}
        <div className="flex-1 min-w-0">
          {/* Overview */}
          <TabsContent value="overview">
            <div className="rounded-xl border bg-background p-4 shadow-sm sm:p-6">
              <h2 className="text-base font-semibold sm:text-lg mb-1">
                Ringkasan Aktivitas
              </h2>
              <p className="text-sm text-muted-foreground">
                Lihat sekilas progress lamaran dan aktivitasmu di platform ini.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
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

          {/* Applied Jobs */}
          <TabsContent value="applied">
            <AppliedJobsClient />
          </TabsContent>

          {/* Saved Jobs */}
          <TabsContent value="favorites">
            <SavedJobsClient />
          </TabsContent>

          {/* User Settings */}
          <TabsContent value="user_settings">
            <UserSettingsClient />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
