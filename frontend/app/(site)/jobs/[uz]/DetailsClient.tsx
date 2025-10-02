"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Share2 } from "lucide-react";
import { toast } from "sonner";

/** Tombol Save & Share (client-only) */
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
        alert("Link copied to clipboard");
      }
    } catch {}
  };

  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        onClick={() => setSaved((s) => !s)}
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

/** Komponen kecil “Posted x ago”, dihitung real-time di client */
export function PostedAgo({ postedAtISO }: { postedAtISO: string }) {
  const [text, setText] = React.useState("Posted just now");

  React.useEffect(() => {
    function rel() {
      const now = Date.now();
      const t = new Date(postedAtISO).getTime();
      const diff = Math.max(0, Math.floor((now - t) / 1000)); // seconds
      if (diff < 60) return `Posted ${diff}s ago`;
      const m = Math.floor(diff / 60);
      if (m < 60) return `Posted ${m}m ago`;
      const h = Math.floor(m / 60);
      if (h < 24) return `Posted ${h}h ago`;
      const d = Math.floor(h / 24);
      return `Posted ${d}d ago`;
    }
    setText(rel());
    const id = setInterval(() => setText(rel()), 30000);
    return () => clearInterval(id);
  }, [postedAtISO]);

  return <span className="text-xs text-muted-foreground">{text}</span>;
}

/** Tombol Apply Now dengan toast sukses (dummy apply) */
export function ApplyNowButton({
  jobId,
  label = "Apply Now",
}: {
  jobId: string;
  label?: string;
}) {
  const [applied, setApplied] = React.useState(false);
  const router = useRouter();

  const onApply = () => {
    if (applied) return;
    setApplied(true);
    toast.success("Job successfully applied");
    // kalau mau refresh state lain (mis. badge "Applied"), bisa:
    // setTimeout(() => router.refresh(), 250);
  };

  return (
    <button
      onClick={onApply}
      disabled={applied}
      className={`inline-flex h-10 items-center justify-center rounded-md px-5 text-sm font-medium transition
        ${
          applied
            ? "bg-muted text-muted-foreground cursor-default"
            : "bg-primary text-primary-foreground hover:opacity-90"
        }`}
      aria-label="Apply for this job"
    >
      {applied ? "Applied" : label}
    </button>
  );
}
