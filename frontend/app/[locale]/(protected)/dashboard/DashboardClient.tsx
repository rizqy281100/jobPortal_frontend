"use client";

import * as React from "react";
import Link from "next/link";
import {
  LayoutGrid,
  ClipboardList,
  Bookmark,
  Settings,
  ChevronRight,
  MapPin,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Shield,
} from "lucide-react";

/* ========= Types ========= */
export type JobStatus = "active" | "expired";
export type JobLite = {
  id: string;
  title: string;
  company: string;
  location: string;
  date: string; // ISO
  status?: JobStatus; // only for applied
  href?: string;
};
type SessionLite = { id: string; name: string; email: string } | null;

/* ========= Helpers ========= */
function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
function clsx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

/* ========= Main ========= */
export default function DashboardClient({
  session,
  applied = [],
  saved = [],
  profileCompletion = 42,
}: {
  session: SessionLite;
  applied?: JobLite[];
  saved?: JobLite[];
  profileCompletion?: number;
}) {
  // tab dari query (?tab=overview|applied|saved|settings)
  // const initialTab =
  //   typeof window !== "undefined"
  //     ? (new URLSearchParams(window.location.search).get("tab") as any) ??
  //       "overview"
  //     : "overview";

  const initialTab =
    typeof window !== "undefined"
      ? (new URLSearchParams(window.location.search).get("tab") as any) ??
        "overview"
      : "overview";

  // const [tab, setTab] = React.useState<
  //   "overview" | "applied" | "saved" | "settings"
  // >(initialTab);

  const [tab, setTab] = React.useState<
    "overview" | "applied" | "saved" | "settings"
  >("overview");

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const usp = new URLSearchParams(window.location.search);
    usp.set("tab", tab);
    window.history.replaceState({}, "", `${window.location.pathname}?${usp}`);
  }, [tab]);

  // pagination 10/halaman
  const APPLIED_PAGES = chunk(applied, 10);
  const SAVED_PAGES = chunk(saved, 10);
  const [apPage, setApPage] = React.useState(1);
  const [svPage, setSvPage] = React.useState(1);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px,1fr]">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-24 hidden h-[calc(100vh-9rem)] overflow-auto rounded-2xl border bg-card/70 p-3 lg:block">
        <Sidebar
          active={tab}
          setActive={(t) => setTab(t)}
          appliedCount={applied.length}
          savedCount={saved.length}
          completion={profileCompletion}
        />
      </aside>

      {/* Header mobile + drawer trigger */}
      <div className="flex items-center justify-between lg:hidden">
        <button
          className="inline-flex items-center gap-2 rounded-lg border bg-card/80 px-3 py-2 text-sm"
          onClick={() => {
            const el = document.getElementById("mobile-dashboard-menu");
            if (!el) return;
            el.classList.toggle("hidden");
          }}
        >
          <LayoutGrid className="h-4 w-4" />
          Dashboard Menu
        </button>
        <div className="text-sm text-muted-foreground capitalize">{tab}</div>
      </div>
      <div id="mobile-dashboard-menu" className="lg:hidden hidden">
        <MobileSidebar
          active={tab}
          setActive={(t) => setTab(t)}
          appliedCount={applied.length}
          savedCount={saved.length}
          completion={profileCompletion}
        />
      </div>

      {/* Content */}
      <section className="space-y-6">
        {tab === "overview" && (
          <Overview
            name={session?.name ?? "Job Seeker"}
            profileCompletion={profileCompletion}
            appliedCount={applied.length}
            savedCount={saved.length}
            recent={applied.slice(0, 4)}
          />
        )}

        {tab === "applied" && (
          <JobsTable
            title="Applied Jobs"
            emptyText="You haven't applied to any jobs yet."
            jobs={APPLIED_PAGES[apPage - 1] ?? []}
            total={applied.length}
            page={apPage}
            totalPages={Math.max(1, APPLIED_PAGES.length)}
            onPageChange={setApPage}
            mode="applied"
          />
        )}

        {tab === "saved" && (
          <JobsTable
            title="Saved Jobs"
            emptyText="No saved jobs yet."
            jobs={SAVED_PAGES[svPage - 1] ?? []}
            total={saved.length}
            page={svPage}
            totalPages={Math.max(1, SAVED_PAGES.length)}
            onPageChange={setSvPage}
            mode="saved"
          />
        )}

        {tab === "settings" && <SettingsPanel />}
      </section>
    </div>
  );
}

/* ========= Sidebar ========= */
function Sidebar({
  active,
  setActive,
  appliedCount,
  savedCount,
  completion,
}: {
  active: "overview" | "applied" | "saved" | "settings";
  setActive: (t: "overview" | "applied" | "saved" | "settings") => void;
  appliedCount: number;
  savedCount: number;
  completion: number;
}) {
  const Item = ({
    id,
    icon,
    label,
    badge,
  }: {
    id: "overview" | "applied" | "saved" | "settings";
    icon: React.ReactNode;
    label: string;
    badge?: React.ReactNode;
  }) => {
    const isActive = active === id;
    return (
      <button
        onClick={() => setActive(id)}
        className={clsx(
          "group relative flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors",
          isActive
            ? "bg-primary/10 text-primary dark:bg-primary/20"
            : "hover:bg-muted"
        )}
      >
        <span className="inline-flex items-center gap-2">
          {icon}
          {label}
        </span>
        {badge}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Candidate Dashboard
      </p>

      <Item
        id="overview"
        icon={<LayoutGrid className="h-4 w-4" />}
        label="Overview"
      />
      <Item
        id="applied"
        icon={<ClipboardList className="h-4 w-4" />}
        label="Applied Jobs"
        badge={
          <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            {appliedCount}
          </span>
        }
      />
      <Item
        id="saved"
        icon={<Bookmark className="h-4 w-4" />}
        label="Saved Jobs"
        badge={
          <span className="rounded-md bg-violet-100 px-2 py-0.5 text-xs text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
            {savedCount}
          </span>
        }
      />
      <Item
        id="settings"
        icon={<Settings className="h-4 w-4" />}
        label="Settings"
      />

      {/* Profile completeness card */}
      <div className="rounded-xl border bg-gradient-to-br from-emerald-50 to-white p-3 dark:from-emerald-950/30 dark:to-transparent">
        <div className="mb-1 flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
          Profile completeness
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-emerald-500"
            style={{ width: `${Math.min(100, Math.max(0, completion))}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {completion}% completed
        </p>
      </div>
    </div>
  );
}
function MobileSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <div className="mt-3 rounded-xl border bg-card p-3">
      <Sidebar {...props} />
    </div>
  );
}

/* ========= Overview ========= */
function Overview({
  name,
  profileCompletion,
  appliedCount,
  savedCount,
  recent,
}: {
  name: string;
  profileCompletion: number;
  appliedCount: number;
  savedCount: number;
  recent: JobLite[];
}) {
  const notComplete = profileCompletion < 100;

  return (
    <div className="space-y-6">
      {/* Greeting + Alert */}
      <div className="rounded-2xl border bg-card p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">
              Hello, {name.split(" ")[0]} 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              Here is your daily summary and quick actions.
            </p>
          </div>
        </div>

        {notComplete && (
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-700 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-200">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="text-sm">
              <p className="font-medium">Your profile isn&apos;t complete.</p>
              <p className="text-xs opacity-90">
                Complete your personal details, profile, and add social links to
                reach 100%.
              </p>
            </div>
            <Link
              href="/dashboard?tab=settings"
              className="ml-auto inline-flex items-center gap-1 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 dark:bg-rose-500"
            >
              Edit Profile <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Stats (tanpa Job Alerts) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          title="Applied jobs"
          value={appliedCount}
          tone="blue"
          icon={<ClipboardList className="h-5 w-5" />}
        />
        <StatCard
          title="Saved jobs"
          value={savedCount}
          tone="violet"
          icon={<Bookmark className="h-5 w-5" />}
        />
      </div>

      {/* Recently Applied preview */}
      <div className="rounded-2xl border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h3 className="text-base font-semibold">Recently Applied</h3>
          <Link
            href="/dashboard?tab=applied"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="divide-y">
          {recent.length === 0 && (
            <p className="px-5 py-8 text-sm text-muted-foreground">
              No recent applications.
            </p>
          )}
          {recent.map((j) => (
            <div
              key={`recent-${j.id}`}
              className="grid grid-cols-12 items-center gap-3 px-5 py-4"
            >
              <div className="col-span-6 sm:col-span-5">
                <p className="font-medium">{j.title}</p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" /> {j.company}
                </div>
              </div>
              <div className="col-span-3 hidden sm:block">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{j.location}</span>
                </div>
              </div>
              <div className="col-span-3 text-right text-xs sm:text-sm text-muted-foreground">
                {new Date(j.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  tone,
  icon,
}: {
  title: string;
  value: number | string;
  tone: "blue" | "violet";
  icon: React.ReactNode;
}) {
  const toneBg =
    tone === "blue"
      ? "from-blue-500/15 to-blue-500/5"
      : "from-violet-500/15 to-violet-500/5";
  const iconBg = "bg-white/70 dark:bg-neutral-900/60";
  return (
    <div className={clsx("rounded-2xl border bg-gradient-to-br p-4", toneBg)}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className={clsx("rounded-md p-2 shadow-sm", iconBg)}>{icon}</div>
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

/* ========= Jobs Table (Applied / Saved) ========= */
function JobsTable({
  title,
  emptyText,
  jobs,
  total,
  page,
  totalPages,
  onPageChange,
  mode,
}: {
  title: string;
  emptyText: string;
  jobs: JobLite[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  mode: "applied" | "saved";
}) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="flex items-center justify-between gap-2 border-b px-5 py-3">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">
            Showing {jobs.length ? (page - 1) * 10 + 1 : 0}–
            {(page - 1) * 10 + jobs.length} of {total} jobs
          </p>
        </div>
        <span className="hidden rounded-md bg-neutral-100 px-2 py-0.5 text-xs dark:bg-neutral-800/50 sm:block">
          Page {page}/{totalPages || 1}
        </span>
      </div>

      {/* Desktop/tablet table */}
      <div className="hidden sm:block">
        {jobs.length === 0 ? (
          <p className="px-6 py-10 text-sm text-muted-foreground">
            {emptyText}
          </p>
        ) : (
          <div className="divide-y">
            {jobs.map((j) => (
              <div
                key={`${mode}-${j.id}`}
                className="grid grid-cols-12 items-center gap-3 px-6 py-4 hover:bg-muted/40"
              >
                <div className="col-span-5">
                  <Link
                    href={j.href ?? `/jobs/${j.id}`}
                    className="font-medium hover:underline"
                  >
                    {j.title}
                  </Link>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" /> {j.company}
                  </div>
                </div>
                <div className="col-span-3 hidden md:block">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{j.location}</span>
                  </div>
                </div>
                <div className="col-span-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {new Date(j.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  {mode === "applied" && (
                    <span
                      className={clsx(
                        "rounded-md px-2 py-0.5 text-xs",
                        j.status === "active"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800/40 dark:text-neutral-300"
                      )}
                    >
                      {j.status === "active" ? "Active" : "Expired"}
                    </span>
                  )}
                  <Link
                    href={j.href ?? `/jobs/${j.id}`}
                    className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
                  >
                    View Details <ChevronRight className="h-4 w-4" />
                  </Link>
                  {mode === "saved" && (
                    <Link
                      href={`/jobs/${j.id}`}
                      className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:opacity-90"
                    >
                      Apply
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="divide-y sm:hidden">
        {jobs.length === 0 ? (
          <p className="px-4 py-8 text-sm text-muted-foreground">{emptyText}</p>
        ) : (
          jobs.map((j) => (
            <div key={`${mode}-m-${j.id}`} className="p-4">
              <Link
                href={j.href ?? `/jobs/${j.id}`}
                className="font-medium hover:underline"
              >
                {j.title}
              </Link>
              <div className="mt-1 text-sm text-muted-foreground">
                {j.company}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {j.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />{" "}
                  {new Date(j.date).toLocaleDateString()}
                </span>
                {mode === "applied" && (
                  <span
                    className={clsx(
                      "inline-flex items-center gap-1 rounded-md px-2 py-0.5",
                      j.status === "active"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800/40 dark:text-neutral-300"
                    )}
                  >
                    <Shield className="h-3.5 w-3.5" />
                    {j.status === "active" ? "Active" : "Expired"}
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Link
                  href={j.href ?? `/jobs/${j.id}`}
                  className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-accent"
                >
                  View Details
                </Link>
                {mode === "saved" && (
                  <Link
                    href={`/jobs/${j.id}`}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:opacity-90"
                  >
                    Apply
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 border-t px-4 py-3 sm:px-6">
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
            >
              Prev
            </button>
            <button
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========= Settings (ringkas, warna & layout sesuai referensi) ========= */
function SettingsPanel() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-5">
        <h3 className="text-base font-semibold">Personal Details</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload profile photo, set name & email, add skills, and upload your CV
          (PDF).
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* kiri */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Full Name</label>
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Your full name"
            />

            <label className="text-sm font-medium">Email Address</label>
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="you@example.com"
            />

            <label className="text-sm font-medium">Skills (5–15)</label>
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="e.g. React, Node.js, PostgreSQL"
            />
          </div>

          {/* kanan */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Profile Picture (png/jpg/jpeg, max 1MB)
            </label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-muted file:px-3 file:py-1.5"
            />

            <label className="text-sm font-medium">
              Upload CV (PDF, max 5MB)
            </label>
            <input
              type="file"
              accept=".pdf"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-muted file:px-3 file:py-1.5"
            />
          </div>
        </div>

        <div className="mt-4">
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            Save Changes
          </button>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5">
        <h3 className="text-base font-semibold">Profile</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            className="rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Nationality"
          />
          <input
            type="date"
            className="rounded-md border bg-background px-3 py-2 text-sm"
          />
          <input
            className="rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Phone (+998…)"
          />
          <select className="rounded-md border bg-background px-3 py-2 text-sm">
            <option>Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Others</option>
          </select>
          <select className="rounded-md border bg-background px-3 py-2 text-sm">
            <option>Marital Status</option>
            <option>Single</option>
            <option>Married</option>
          </select>
          <select className="rounded-md border bg-background px-3 py-2 text-sm">
            <option>Education</option>
            <option>High School</option>
            <option>Bachelor</option>
            <option>Master</option>
          </select>
          <input
            className="rounded-md border bg-background px-3 py-2 text-sm md:col-span-2"
            placeholder="Location (Uzbekistan)"
          />
          <textarea
            className="rounded-md border bg-background px-3 py-2 text-sm md:col-span-2"
            rows={3}
            placeholder="About me (max 300 chars)"
          ></textarea>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5">
        <h3 className="text-base font-semibold">Social Links (optional)</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            className="rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="LinkedIn URL"
          />
          <input
            className="rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="GitHub URL"
          />
          <input
            className="rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Portfolio URL"
          />
          <input
            className="rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Twitter/X URL"
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5">
        <h3 className="text-base font-semibold">Account Settings</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            type="password"
            className="rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Current password"
          />
          <input
            type="password"
            className="rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="New password"
          />
          <input
            type="password"
            className="rounded-md border bg-background px-3 py-2 text-sm md:col-span-2"
            placeholder="Confirm new password"
          />
        </div>
        <div className="mt-4">
          <button className="rounded-md border px-4 py-2 text-sm hover:bg-accent">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
