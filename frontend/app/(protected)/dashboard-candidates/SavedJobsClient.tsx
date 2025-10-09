"use client";

import * as React from "react";
import Link from "next/link";
import { MapPin, Clock, Trash2 } from "lucide-react";

export type SavedJobLite = {
  id: string;
  title: string;
  company: string;
  location?: string;
  savedAt?: string;
  href?: string;
};

const LS_KEY = "savedJobs";

function readSaved(): SavedJobLite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as SavedJobLite[]) : [];
  } catch {
    return [];
  }
}
function writeSaved(list: SavedJobLite[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("saved-jobs-changed"));
}

export default function SavedJobsClient() {
  const [items, setItems] = React.useState<SavedJobLite[]>([]);
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  React.useEffect(() => {
    const sync = () => setItems(readSaved());
    sync();
    const onChange = () => sync();
    window.addEventListener("storage", onChange);
    window.addEventListener("saved-jobs-changed", onChange as any);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("saved-jobs-changed", onChange as any);
    };
  }, []);

  const onRemove = (id: string) => {
    const next = readSaved().filter((x) => x.id !== id);
    writeSaved(next);
    setItems(next);
    if (start >= next.length && page > 1) setPage(page - 1);
  };

  return (
    <div className="rounded-lg border bg-background p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Saved Jobs</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Pekerjaan yang kamu simpan dari Job List akan muncul di sini. Kamu bisa
        melamar kapan saja.
      </p>

      {!pageItems.length ? (
        <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
          Belum ada pekerjaan yang disimpan.
        </div>
      ) : (
        <ul className="space-y-3">
          {pageItems.map((j) => (
            <li
              key={j.id}
              className="flex flex-col gap-2 rounded-lg border p-4 hover:bg-muted/50 md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0">
                <Link
                  href={j.href ?? `/jobs/${j.id}`}
                  className="font-medium hover:underline"
                >
                  {j.title}
                </Link>
                <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>{j.company}</span>
                  {j.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {j.location}
                    </span>
                  )}
                  {j.savedAt && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Disimpan {new Date(j.savedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={j.href ?? `/jobs/${j.id}`}
                  className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:opacity-90"
                >
                  Apply
                </Link>
                <button
                  onClick={() => onRemove(j.id)}
                  className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-accent"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {items.length > pageSize && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages} — {items.length} saved
          </span>
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
            >
              Prev
            </button>
            <button
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
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
