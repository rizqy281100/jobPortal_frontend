"use client";

import * as React from "react";
import Link from "next/link";
import { MapPin, Banknote, CheckCircle2, Clock, Building2 } from "lucide-react";

type AppliedItem = {
  id: string;
  title?: string;
  company?: string;
  appliedAt: string;
  status?: "active" | "expired";
  locationText?: string;
  salaryText?: string;
  typeLabel?: string;
  policyLabel?: string;
  href?: string;
};

const LS_KEY = "appliedJobs";
const PAGE_SIZE = 8;

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AppliedJobsClient() {
  const [data, setData] = React.useState<AppliedItem[]>([]);
  const [page, setPage] = React.useState(1);

  const load = React.useCallback(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const arr: AppliedItem[] = raw ? JSON.parse(raw) : [];
      arr.sort(
        (a, b) =>
          new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
      );
      setData(arr);
      setPage((p) =>
        Math.min(p, Math.max(1, Math.ceil(arr.length / PAGE_SIZE)))
      );
    } catch {
      setData([]);
    }
  }, []);

  React.useEffect(() => {
    load();
    const h = () => load();
    window.addEventListener("applied-jobs-changed", h);
    return () => window.removeEventListener("applied-jobs-changed", h);
  }, [load]);

  const start = (page - 1) * PAGE_SIZE;
  const pageItems = data.slice(start, start + PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));

  const removeOne = (id: string) => {
    const next = data.filter((x) => x.id !== id);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    setData(next);
    window.dispatchEvent(new CustomEvent("applied-jobs-changed"));
  };

  // const clearAll = () => {
  //   localStorage.removeItem(LS_KEY);
  //   setData([]);
  //   window.dispatchEvent(new CustomEvent("applied-jobs-changed"));
  // };

  return (
    <section className="rounded-2xl border bg-card/80 p-4 sm:p-6 shadow-sm">
      {/* Header */}
      {/* <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Applied Jobs{" "}
          <span className="font-normal text-muted-foreground">
            ({data.length})
          </span>
        </h2>
        {data.length > 0 && (
          <button
            onClick={clearAll}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
          >
            Clear all
          </button>
        )}
      </div> */}

      {/* Empty state */}
      {data.length === 0 ? (
        <div className="rounded-xl border bg-background p-8 text-center text-sm text-muted-foreground">
          Belum ada lamaran. Klik <b>Apply Now</b> pada halaman pekerjaan untuk
          mulai melamar.
        </div>
      ) : (
        <>
          {/* LIST STYLE TANPA HEADER */}
          <div className="divide-y rounded-xl border">
            {pageItems.map((j) => (
              <div
                key={j.id}
                className="flex flex-col gap-4 p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                {/* Left: Logo + Info */}
                <div className="flex min-w-0 items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-neutral-100 text-neutral-600 ring-1 ring-border dark:bg-neutral-800 dark:text-neutral-300">
                    {(j.company?.[0] ?? "J").toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <Link
                      href={j.href ?? `/jobs/${j.id}`}
                      className="block truncate text-base font-semibold hover:underline"
                    >
                      {j.title ?? "Untitled Job"}
                    </Link>
                    <p className="text-sm text-muted-foreground truncate">
                      {j.company ?? "Unknown Company"}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      {j.locationText && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {j.locationText}
                        </span>
                      )}
                      {j.salaryText && (
                        <span className="inline-flex items-center gap-1">
                          <Banknote className="h-3.5 w-3.5" />
                          {j.salaryText}
                        </span>
                      )}
                      {(j.typeLabel || j.policyLabel) && (
                        <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] dark:bg-neutral-800/50">
                          {[j.typeLabel, j.policyLabel]
                            .filter(Boolean)
                            .join(" • ")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Status, Date, Action */}
                <div className="flex flex-wrap items-center justify-start gap-3 sm:justify-end sm:gap-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                      (j.status ?? "active") === "active"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800/40 dark:text-neutral-300"
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {(j.status ?? "active") === "active" ? "Active" : "Expired"}
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {fmtDate(j.appliedAt)}
                  </span>

                  <Link
                    href={j.href ?? `/jobs/${j.id}`}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => removeOne(j.id)}
                    className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-full border px-3 py-2 text-sm hover:bg-accent disabled:opacity-50"
                disabled={page <= 1}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                const active = p === page;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-9 w-9 rounded-full text-sm font-medium ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "border hover:bg-accent"
                    }`}
                  >
                    {String(p).padStart(2, "0")}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-full border px-3 py-2 text-sm hover:bg-accent disabled:opacity-50"
                disabled={page >= totalPages}
              >
                ›
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
