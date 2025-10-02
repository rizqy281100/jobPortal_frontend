import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Banknote } from "lucide-react";
import { JOBS } from "../data";
import SaveShare, { PostedAgo, ApplyNowButton } from "./DetailsClient";
import type { Job } from "../data";

export const revalidate = 60;

const COLOR = {
  fulltime: {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  parttime: {
    badge:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  },
  contract: {
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  },
  internship: {
    badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  },
  volunteer: {
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  },
  wfh: {
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
  wfo: {
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  },
  hybrid: {
    badge:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  },
  noexp: {
    badge:
      "bg-neutral-200 text-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-200",
  },
  fresh: {
    badge: "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300",
  },
  "1-2": {
    badge:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  },
  "3-5": {
    badge:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  },
  "6-10": {
    badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  },
  "10+": {
    badge:
      "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300",
  },
} as const;

function postedAtFromAgo(ago: string): string {
  const now = new Date();
  const parts = ago.split(" ");
  if (parts.length >= 2) {
    const n = parseInt(parts[0], 10);
    const unit = parts[1].toLowerCase();
    const d = new Date(now);
    if (!Number.isNaN(n)) {
      if (unit.startsWith("sec")) d.setSeconds(d.getSeconds() - n);
      else if (unit.startsWith("min")) d.setMinutes(d.getMinutes() - n);
      else if (unit.startsWith("hour")) d.setHours(d.getHours() - n);
      else if (unit.startsWith("day")) d.setDate(d.getDate() - n);
      else if (unit.startsWith("week")) d.setDate(d.getDate() - 7 * n);
      return d.toISOString();
    }
  }
  if (/yesterday/i.test(ago)) {
    const d = new Date(now);
    d.setDate(d.getDate() - 1);
    return d.toISOString();
  }
  return now.toISOString();
}

export async function generateStaticParams() {
  return JOBS.map((j) => ({ uz: j.id }));
}

export default async function JobDetailPage(props: {
  params: Promise<{ uz: string }>;
}) {
  const { uz } = await props.params;

  const job = JOBS.find((j) => j.id === uz);
  if (!job) notFound();

  const location = `${job.district}, ${job.region}, ${job.province}`;
  const postedAtISO = postedAtFromAgo(job.postedAgo);

  const benefits: string[] = Array.isArray((job as any).benefits)
    ? ((job as any).benefits as string[])
    : ["Flexible work hours", "Health insurance", "Annual bonus"];

  const socials: { label: string; href: string }[] = (job as any).socials ?? [
    { label: "Website", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Twitter/X", href: "#" },
  ];

  const similar = JOBS.filter(
    (j) =>
      j.id !== job.id &&
      (j.type === job.type || j.title.split(" ")[0] === job.title.split(" ")[0])
  ).slice(0, 6);

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="rounded-xl border bg-card p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold sm:text-2xl">
                  {job.title}
                </h1>
              </div>
              <SaveShare
                jobId={job.id}
                title={job.title}
                company={job.company}
              />
            </div>

            <p className="mt-1 text-sm font-medium">{job.company}</p>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className={`rounded px-2 py-0.5 ${COLOR[job.type].badge}`}>
                {labelize(job.type)}
              </span>
              <span
                className={`rounded px-2 py-0.5 ${COLOR[job.policy].badge}`}
              >
                {labelize(job.policy)}
              </span>
              <span className={`rounded px-2 py-0.5 ${COLOR[job.exp].badge}`}>
                {expLabel(job.exp)}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Banknote className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                UZS {job.salaryMinM}–{job.salaryMaxM}M / month
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{location}</span>
            </div>

            <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* GANTI Link -> ApplyNowButton */}
              <ApplyNowButton jobId={job.id} />
              <PostedAgo postedAtISO={postedAtISO} />
            </div>

            <hr className="my-6 border-border/60" />

            <h2 className="text-base font-semibold">Job Description</h2>
            <div className="mt-3 space-y-2 text-sm leading-6">
              <p>
                We build fast, reliable products for our customers. You will
                collaborate with cross-functional teams to deliver high-quality
                features.
              </p>
              <p>
                Responsibilities include writing clean code, reviewing PRs,
                improving architecture, and mentoring junior engineers.
              </p>
            </div>

            <h2 className="mt-6 text-base font-semibold">Job Requirements</h2>
            <ul className="mt-3 list-inside list-decimal space-y-2 text-sm leading-6">
              <li>
                3+ years of experience in a related role (except for “No
                Experience” roles).
              </li>
              <li>Hands-on with modern tooling, testing, and code review.</li>
              <li>Clear communication and collaborative mindset.</li>
              <li>Bonus: exposure to cloud, CI/CD, and observability.</li>
              <li>
                Strong sense of ownership and ability to work with ambiguity.
              </li>
            </ul>

            <h2 className="mt-6 text-base font-semibold">About Company</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {job.company} is a fast-growing company in Uzbekistan focusing on
              people, product, and impact. We support flexible work and
              continuous learning.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              {socials.map((s, i) => (
                <Link
                  key={i}
                  href={s.href}
                  className="inline-flex items-center rounded-md border px-3 py-1.5 hover:bg-accent"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border bg-card p-4 sm:p-5 lg:p-6">
            <h2 className="text-base font-semibold">Benefits</h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm leading-6">
              {benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border bg-card p-3 sm:p-4 lg:p-5">
            <h2 className="mb-3 text-base font-semibold">Similar Jobs</h2>
            <div className="grid grid-cols-1 gap-3">
              {similar.map((s) => (
                <Link
                  key={s.id}
                  href={`/jobs/${s.id}`}
                  className="group rounded-lg border p-3 transition-colors hover:bg-accent"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{s.title}</p>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {s.company}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                    <span
                      className={`rounded px-2 py-0.5 ${COLOR[s.type].badge}`}
                    >
                      {labelize(s.type)}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 ${COLOR[s.policy].badge}`}
                    >
                      {labelize(s.policy)}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 ${COLOR[s.exp].badge}`}
                    >
                      {expLabel(s.exp)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Banknote className="h-3 w-3" />
                    <span>
                      UZS {s.salaryMinM}–{s.salaryMaxM}M
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">
                      {s.district}, {s.region}, {s.province}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function labelize(v: string) {
  return v
    .replaceAll("-", " ")
    .replace("wfh", "WFH")
    .replace("wfo", "WFO")
    .replace("hybrid", "Hybrid")
    .replace("fulltime", "Full-time")
    .replace("parttime", "Part-time")
    .replace("contract", "Contract")
    .replace("internship", "Internship")
    .replace("volunteer", "Volunteer")
    .replace("noexp", "No Experience")
    .replace("fresh", "Fresh Graduate");
}
function expLabel(v: Job["exp"]) {
  switch (v) {
    case "noexp":
      return "No Experience";
    case "fresh":
      return "Fresh Graduate";
    case "1-2":
      return "1-2 Years";
    case "3-5":
      return "3-5 Years";
    case "6-10":
      return "6-10 Years";
    case "10+":
      return "10+ Years";
  }
}
