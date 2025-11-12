<<<<<<< HEAD
=======
// "use client";

// import * as React from "react";
// import { Bookmark, Share2 } from "lucide-react";
// import { toast } from "sonner";

// /** ====== Save + Share (sinkron dengan SavedJobsClient) ====== */
// export default function SaveShare({
//   jobId,
//   title,
//   company,
// }: {
//   jobId: string;
//   title: string;
//   company: string;
// }) {
//   const [saved, setSaved] = React.useState(false);
//   const LS_KEY = "savedJobs";

//   React.useEffect(() => {
//     if (typeof window === "undefined") return;
//     try {
//       const raw = localStorage.getItem(LS_KEY);
//       const arr: any[] = raw ? JSON.parse(raw) : [];
//       setSaved(arr.some((x) => x.id === jobId));
//     } catch {}
//   }, [jobId]);

//   const onToggleSave = () => {
//     try {
//       const raw = localStorage.getItem(LS_KEY);
//       const arr: any[] = raw ? JSON.parse(raw) : [];
//       const idx = arr.findIndex((x) => x.id === jobId);

//       if (idx >= 0) {
//         arr.splice(idx, 1);
//         setSaved(false);
//         toast.success("Removed from Saved Jobs");
//       } else {
//         arr.unshift({
//           id: jobId,
//           title,
//           company,
//           savedAt: new Date().toISOString(),
//           href: `/jobs/${jobId}`,
//         });
//         setSaved(true);
//         toast.success("Saved to your Saved Jobs");
//       }
//       localStorage.setItem(LS_KEY, JSON.stringify(arr));
//       window.dispatchEvent(new CustomEvent("saved-jobs-changed"));
//     } catch {
//       toast.error("Failed to update Saved Jobs");
//     }
//   };

//   const onShare = async () => {
//     const url =
//       typeof window !== "undefined"
//         ? `${window.location.origin}/jobs/${jobId}`
//         : `/jobs/${jobId}`;
//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title: `${title} — ${company}`,
//           text: "Check out this job",
//           url,
//         });
//       } else {
//         await navigator.clipboard.writeText(url);
//         toast.success("Link copied to clipboard");
//       }
//     } catch {}
//   };

//   return (
//     <div className="flex shrink-0 items-center gap-2">
//       <button
//         onClick={onToggleSave}
//         className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors hover:bg-accent ${
//           saved ? "text-primary" : "text-muted-foreground"
//         }`}
//         aria-label="Save job"
//       >
//         <Bookmark className="h-4 w-4" />
//       </button>
//       <button
//         onClick={onShare}
//         className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
//         aria-label="Share job"
//       >
//         <Share2 className="h-4 w-4" />
//       </button>
//     </div>
//   );
// }

// /** ====== “Posted x ago”, dihitung real-time di client ====== */
// export function PostedAgo({ postedAtISO }: { postedAtISO: string }) {
//   const [text, setText] = React.useState("Posted just now");

//   React.useEffect(() => {
//     function rel() {
//       const now = Date.now();
//       const t = new Date(postedAtISO).getTime();
//       const diff = Math.max(0, Math.floor((now - t) / 1000)); // seconds
//       if (diff < 60) return `Posted ${diff}s ago`;
//       const m = Math.floor(diff / 60);
//       if (m < 60) return `Posted ${m}m ago`;
//       const h = Math.floor(m / 60);
//       if (h < 24) return `Posted ${h}h ago`;
//       const d = Math.floor(h / 24);
//       return `Posted ${d}d ago`;
//     }
//     setText(rel());
//     const id = setInterval(() => setText(rel()), 30000);
//     return () => clearInterval(id);
//   }, [postedAtISO]);

//   return <span className="text-xs text-muted-foreground">{text}</span>;
// }

// /** ====== Apply Now → simpan ke localStorage("appliedJobs") ====== */
// export function ApplyNowButton({
//   jobId,
//   title,
//   company,
//   label = "Apply Now",
// }: {
//   jobId: string;
//   title: string;
//   company: string;
//   label?: string;
// }) {
//   const [applied, setApplied] = React.useState(false);
//   const LS_KEY = "appliedJobs";

//   React.useEffect(() => {
//     if (typeof window === "undefined") return;
//     try {
//       const raw = localStorage.getItem(LS_KEY);
//       const arr: any[] = raw ? JSON.parse(raw) : [];
//       setApplied(arr.some((x) => x.id === jobId));
//     } catch {}
//   }, [jobId]);

//   const onApply = () => {
//     if (applied) return;

//     try {
//       const raw = localStorage.getItem(LS_KEY);
//       const arr: any[] = raw ? JSON.parse(raw) : [];

//       // hindari duplikat
//       if (!arr.some((x) => x.id === jobId)) {
//         arr.unshift({
//           id: jobId,
//           title,
//           company,
//           appliedAt: new Date().toISOString(),
//           status: "active", // default
//           href: `/jobs/${jobId}`,
//         });
//         localStorage.setItem(LS_KEY, JSON.stringify(arr));
//         // beri tahu dashboard
//         window.dispatchEvent(new CustomEvent("applied-jobs-changed"));
//       }

//       setApplied(true);
//       toast.success("Job successfully applied");
//     } catch {
//       toast.error("Failed to save applied job");
//     }
//   };

//   return (
//     <button
//       onClick={onApply}
//       disabled={applied}
//       className={`inline-flex h-10 items-center justify-center rounded-md px-5 text-sm font-medium transition
//         ${
//           applied
//             ? "bg-muted text-muted-foreground cursor-default"
//             : "bg-primary text-primary-foreground hover:opacity-90"
//         }`}
//       aria-label="Apply for this job"
//     >
//       {applied ? "Applied" : label}
//     </button>
//   );
// }

>>>>>>> 38f30502643f1fa9177a2480584f53342b0321f5
"use client";

import * as React from "react";
import { Bookmark, Share2 } from "lucide-react";
import { toast } from "sonner";

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

/** ====== Apply Now → simpan ke localStorage('appliedJobs') + refresh dashboard ====== */
export function ApplyNowButton({
  jobId,
  label = "Apply Now",
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
  const LS_KEY = "appliedJobs";

  const onApply = () => {
    if (applied) return;

    try {
      const raw = localStorage.getItem(LS_KEY);
      const arr: any[] = raw ? JSON.parse(raw) : [];

      // kalau sudah ada, jangan double
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
        });
        localStorage.setItem(LS_KEY, JSON.stringify(arr));
      }

      setApplied(true);
      window.dispatchEvent(new CustomEvent("applied-jobs-changed"));
      toast.success("Job successfully applied");
    } catch {
      toast.error("Failed to save application");
    }
  };

  return (
    <button
      onClick={onApply}
      disabled={applied}
      className={`inline-flex h-10 items-center justify-center rounded-md px-5 text-sm font-medium transition ${
        applied
          ? "cursor-default bg-muted text-muted-foreground"
          : "bg-primary text-primary-foreground hover:opacity-90"
      }`}
      aria-label="Apply for this job"
    >
      {applied ? "Applied" : label}
    </button>
  );
}
