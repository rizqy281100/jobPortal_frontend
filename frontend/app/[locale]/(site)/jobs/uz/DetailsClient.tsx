"use client";

import * as React from "react";
import { Bookmark, Share2, FileText, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

/** ====== Types for CV from user settings ====== */
type ResumeItem = {
  id: string;
  title: string;
  fileName: string;
  size: number;
  url: string;
  primary?: boolean;
  uploadedAt: string;
};

const USER_SETTINGS_KEY = "userSettings_v1";

/** ====== Save + Share (tetap seperti sebelumnya, sinkron Saved Jobs) ====== */
export default function SaveShare({
  jobId,
  title,
  company,
}: {
  jobId: string;
  title: string;
  company: string;
}) {
  const [saved, setSaved] = React.useState(false);
  const LS_KEY = "savedJobs";

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const arr: any[] = raw ? JSON.parse(raw) : [];
      setSaved(arr.some((x) => x.id === jobId));
    } catch {}
  }, [jobId]);

  const onToggleSave = () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const arr: any[] = raw ? JSON.parse(raw) : [];
      const idx = arr.findIndex((x) => x.id === jobId);
      if (idx >= 0) {
        arr.splice(idx, 1);
        setSaved(false);
        toast.success("Removed from Saved Jobs");
      } else {
        arr.unshift({
          id: jobId,
          title,
          company,
          savedAt: new Date().toISOString(),
          href: `/jobs/${jobId}`,
        });
        setSaved(true);
        toast.success("Saved to your Saved Jobs");
      }
      localStorage.setItem(LS_KEY, JSON.stringify(arr));
      window.dispatchEvent(new CustomEvent("saved-jobs-changed"));
    } catch {
      toast.error("Failed to update Saved Jobs");
    }
  };

  const onShare = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/jobs/${jobId}`
        : `/jobs/${jobId}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${title} — ${company}`,
          text: "Check out this job",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch {}
  };

  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        onClick={onToggleSave}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors hover:bg-accent ${
          saved ? "text-primary" : "text-muted-foreground"
        }`}
        aria-label="Save job"
      >
        <Bookmark className="h-4 w-4" />
      </button>
      <button
        onClick={onShare}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        aria-label="Share job"
      >
        <Share2 className="h-4 w-4" />
      </button>
    </div>
  );
}

/** ====== “Posted x ago” (real-time) ====== */
export function PostedAgo({ postedAtISO }: { postedAtISO: string }) {
  const [text, setText] = React.useState("Posted just now");

  React.useEffect(() => {
    function rel() {
      const now = Date.now();
      const t = new Date(postedAtISO).getTime();
      const diff = Math.max(0, Math.floor((now - t) / 1000));
      if (diff < 60) return `Posted ${diff}s ago`;
      const m = Math.floor(diff / 60);
      if (m < 60) return `Posted ${m}m ago`;
      const h = Math.floor(m / 60);
      if (h < 24) return `Posted ${h}h ago`;
      const d = Math.floor(h / 24);
      return `Posted ${d}d ago`;
    }
    setText(rel());
    const id = setInterval(() => setText(rel()), 30_000);
    return () => clearInterval(id);
  }, [postedAtISO]);

  return <span className="text-xs text-muted-foreground">{text}</span>;
}

/** ====== Apply Job (modal CV + cover letter + login guard + localStorage) ====== */
export function ApplyNowButton({
  jobId,
  label = "Apply Job",
  meta,
}: {
  jobId: string;
  label?: string;
  meta?: {
    title?: string;
    company?: string;
    locationText?: string; // "District, City, Province"
    salaryText?: string; // "UZS 50–80M / month"
    typeLabel?: string; // "Full Time"
    policyLabel?: string; // "Remote/Hybrid/WFO"
    status?: "active" | "expired";
    href?: string;
  };
}) {
  const [applied, setApplied] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [resumes, setResumes] = React.useState<ResumeItem[]>([]);
  const [selectedResumeId, setSelectedResumeId] = React.useState<string>("");
  const [coverLetter, setCoverLetter] = React.useState("");
  const LS_KEY = "appliedJobs";

  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const isLoggedIn = Boolean(accessToken && user);

  /** Cek apakah sudah pernah apply sebelumnya */
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const arr: any[] = raw ? JSON.parse(raw) : [];
      if (arr.some((x) => x.id === jobId)) {
        setApplied(true);
      }
    } catch {}
  }, [jobId]);

  /** Load resumes dari userSettings_v1 */
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_SETTINGS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const list: ResumeItem[] = parsed?.resumes ?? [];
      setResumes(list);

      const primary = list.find((r) => r.primary) ?? list[0];
      if (primary) {
        setSelectedResumeId(primary.id);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleOpen = () => {
    if (applied) return;

    // ===== Guard: wajib login dulu =====
    if (!isLoggedIn) {
      toast.error("You need to log in before applying for a job.");

      const redirectTo = meta?.href ?? pathname ?? `/jobs/${jobId}`;

      router.push(`/login?redirect=${encodeURIComponent(redirectTo)}`);
      return;
    }

    setOpen(true);
  };

  const handleSubmit = () => {
    if (!selectedResumeId) {
      toast.error("Please select a CV to use for this application.");
      return;
    }

    const chosen = resumes.find((r) => r.id === selectedResumeId);

    try {
      const raw = localStorage.getItem(LS_KEY);
      const arr: any[] = raw ? JSON.parse(raw) : [];

      if (!arr.some((x) => x.id === jobId)) {
        arr.unshift({
          id: jobId,
          appliedAt: new Date().toISOString(),
          status: meta?.status ?? "active",
          title: meta?.title ?? undefined,
          company: meta?.company ?? undefined,
          locationText: meta?.locationText ?? undefined,
          salaryText: meta?.salaryText ?? undefined,
          typeLabel: meta?.typeLabel ?? undefined,
          policyLabel: meta?.policyLabel ?? undefined,
          href: meta?.href ?? `/jobs/${jobId}`,

          // Extra info terkait CV dan cover letter
          cvId: chosen?.id,
          cvTitle: chosen?.title,
          cvFileName: chosen?.fileName,
          cvUploadedAt: chosen?.uploadedAt,
          coverLetter: coverLetter || undefined,
        });
        localStorage.setItem(LS_KEY, JSON.stringify(arr));
      }

      setApplied(true);
      setOpen(false);
      window.dispatchEvent(new CustomEvent("applied-jobs-changed"));
      toast.success("Application sent to recruiter");
    } catch {
      toast.error("Failed to save application");
    }
  };

  const disabledNoCV = resumes.length === 0;

  return (
    <>
      {/* Trigger button */}
      <Button
        onClick={handleOpen}
        disabled={applied}
        className={`inline-flex h-10 items-center justify-center px-5 text-sm font-medium ${
          applied
            ? "cursor-default bg-muted text-muted-foreground"
            : "bg-primary text-primary-foreground hover:opacity-90"
        }`}
        aria-label="Apply for this job"
      >
        {applied ? "Applied" : label}
      </Button>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply for this job</DialogTitle>
            <DialogDescription>
              Choose which CV you want to send and write a short cover letter
              for the recruiter.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* CV list */}
            <div>
              <Label className="text-xs font-medium">Select CV</Label>
              {disabledNoCV ? (
                <p className="mt-2 text-xs text-red-600">
                  You don&apos;t have any CV uploaded yet. Please upload a CV in
                  your profile settings before applying.
                </p>
              ) : (
                <RadioGroup
                  className="mt-2 space-y-2"
                  value={selectedResumeId}
                  onValueChange={setSelectedResumeId}
                >
                  {resumes.map((cv) => (
                    <Label
                      key={cv.id}
                      className="flex cursor-pointer items-start gap-3 rounded-md border p-2 text-xs hover:bg-accent"
                    >
                      <RadioGroupItem value={cv.id} className="mt-0.5" />
                      <div className="flex flex-1 flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {cv.title}
                          </span>
                          {cv.primary && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                              Primary
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {cv.fileName}
                        </span>
                      </div>
                      {cv.url && (
                        <a
                          href={cv.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] hover:bg-accent"
                        >
                          <FileText className="h-3 w-3" />
                          <span>Preview</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </Label>
                  ))}
                </RadioGroup>
              )}
            </div>

            {/* Cover letter */}
            <div>
              <Label className="text-xs font-medium">Cover Letter</Label>
              <Textarea
                className="mt-2 h-32 text-sm"
                placeholder="Write a short introduction, why you are a good fit, and any additional information for the recruiter..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                This message will be sent together with your CV to the
                recruiter.
              </p>
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={disabledNoCV}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
