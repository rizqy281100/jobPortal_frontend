"use client";

import * as React from "react";
import Link from "next/link";
import { MapPin, Clock, Trash2, AlertCircle } from "lucide-react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hooks";
import { makeHref } from "@/lib/locale";
import { useLocale } from "next-intl";

type SavedJobApi = {
  id: string;
  job_post_id: string;
  title: string;
  location?: string;
  deadline?: string;
  created_at: string;
  company_name?: string;
};

type SavedJobLite = {
  id: string;
  jobId: string;
  title: string;
  company?: string;
  location?: string;
  savedAt?: string;
  deadline?: string;
  isExpired: boolean;
};

const isJobExpired = (deadline?: string) => {
  if (!deadline) return false;
  return new Date(deadline).getTime() < Date.now();
};

export default function SavedJobsClient() {
  const [items, setItems] = React.useState<SavedJobLite[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  const { accessToken } = useAppSelector((state) => state.auth);
  // =========================
  // FETCH
  // =========================
  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/workers/saved-jobs/self", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const mapped: SavedJobLite[] = res.data.map((j: SavedJobApi) => ({
        id: j.id,
        jobId: j.job_post_id,
        title: j.title,
        company: j.company_name,
        location: j.location,
        savedAt: j.created_at,
        deadline: j.deadline,
        isExpired: isJobExpired(j.deadline),
      }));

      setItems(mapped);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      toast.error("Gagal mengambil saved jobs");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSavedJobs();
  }, []);

  // =========================
  // REMOVE
  // =========================
  const onRemove = async (savedId: string) => {
    try {
      await api.delete(`/saved-jobs/${savedId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setItems((prev) => prev.filter((x) => x.id !== savedId));
      toast.success("Job dihapus dari saved");
    } catch (error) {
      console.error("Error removing saved job:", error);
      toast.error("Gagal menghapus saved job");
    }
  };
  const locale = useLocale();

  return (
    <div className="rounded-lg border bg-background p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Saved Jobs</h2>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : !pageItems.length ? (
        <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
          Belum ada pekerjaan yang disimpan.
        </div>
      ) : (
        <ul className="space-y-3">
          {pageItems.map((j) => (
            <li
              key={j.id}
              className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0">
                <Link
                  href={`/jobs/${j.jobId}`}
                  className="font-medium hover:underline"
                >
                  {j.title}
                </Link>

                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/80">
                    {j.company}
                  </span>

                  {j.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {j.location}
                    </span>
                  )}

                  {j.savedAt && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Disimpan {new Date(j.savedAt).toLocaleDateString("id-ID")}
                    </span>
                  )}

                  {j.isExpired && (
                    <span className="inline-flex items-center gap-1 rounded bg-destructive/10 px-2 py-0.5 text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Expired
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* APPLY */}
                <Link
                  href={makeHref(locale, `/jobs/${j.jobId}`)}
                  aria-disabled={j.isExpired}
                  className={`inline-flex items-center rounded-md px-3 py-2 text-sm ${
                    j.isExpired
                      ? "cursor-not-allowed bg-muted text-muted-foreground"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  }`}
                  onClick={(e) => {
                    if (j.isExpired) e.preventDefault();
                  }}
                >
                  Apply
                </Link>

                {/* REMOVE */}
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
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
