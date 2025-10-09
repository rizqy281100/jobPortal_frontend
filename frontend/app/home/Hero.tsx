// "use client";

// import * as React from "react";
// import Link from "next/link";
// import {
//   Play,
//   Briefcase,
//   Building2,
//   Stethoscope,
//   ShoppingBag,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// export default function Hero({
//   title = (
//     <>
//       Find, Connect &<br className="hidden md:block" />
//       Build Your <span className="text-primary">Career Path</span>
//     </>
//   ),
//   subtitle = "Discover opportunities from top companies and organizations across multiple industries in Uzbekistan.",
// }: {
//   title?: React.ReactNode;
//   subtitle?: string;
// }) {
//   return (
//     <section className="relative flex min-h-screen items-center">
//       <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-12 md:py-16 lg:py-20">
//         {/* Centered content */}
//         <div className="mx-auto max-w-3xl text-center">
//           <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
//             {title}
//           </h1>
//           <p className="mt-4 text-sm md:text-base text-muted-foreground">
//             {subtitle}
//           </p>

//           {/* Buttons (equal size) */}
//           <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
//             <Button
//               asChild
//               size="lg"
//               className="h-12 min-w-[160px] px-6 dark:text-white"
//             >
//               <Link href="/jobs">Browse Jobs</Link>
//             </Button>
//             <Button
//               asChild
//               variant="outline"
//               size="lg"
//               className="h-12 min-w-[160px] px-6"
//             >
//               <Link
//                 href="/how-it-works"
//                 className="flex items-center justify-center gap-2"
//               >
//                 <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border">
//                   <Play className="h-3.5 w-3.5" />
//                 </span>
//                 How It Works?
//               </Link>
//             </Button>
//           </div>
//         </div>

//         {/* Trending Industries */}
//         <div className="mx-auto mt-16 max-w-5xl text-center">
//           <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
//             Trending Industries
//           </h2>
//           <p className="mt-2 text-sm text-muted-foreground">
//             Explore the most popular industries and career paths
//           </p>

//           {/* Mobile: 2 cols (2x2); Tablet+ : 4 cols (1 row) */}
//           <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
//             <IndustryCard
//               icon={<Briefcase className="h-5 w-5" />}
//               title="Technology"
//               desc="Software, data, AI, and product roles."
//               href="/industries/technology"
//             />
//             <IndustryCard
//               icon={<Building2 className="h-5 w-5" />}
//               title="Finance"
//               desc="Banking, fintech, and corporate finance."
//               href="/industries/finance"
//             />
//             <IndustryCard
//               icon={<Stethoscope className="h-5 w-5" />}
//               title="Healthcare"
//               desc="Clinical, research, and health operations."
//               href="/industries/healthcare"
//             />
//             <IndustryCard
//               icon={<ShoppingBag className="h-5 w-5" />}
//               title="Retail"
//               desc="E-commerce, merchandising, and operations."
//               href="/industries/retail"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// function IndustryCard({
//   icon,
//   title,
//   desc,
//   href,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   desc: string;
//   href: string;
// }) {
//   return (
//     <Card className="transition-colors hover:border-primary/50">
//       <CardHeader className="flex flex-row items-center gap-2 space-y-0">
//         <div className="grid h-9 w-9 place-items-center rounded-lg border bg-background">
//           {icon}
//         </div>
//         <CardTitle className="text-base">{title}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <p className="text-sm text-muted-foreground">{desc}</p>
//         <Button asChild variant="link" className="px-0">
//           <Link href={href} className="mt-1">
//             Explore jobs →
//           </Link>
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  ChevronRight,
  Briefcase,
  Building2,
  GraduationCap,
  HeartPulse,
  ShoppingBag,
  Cpu,
  Hammer,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // kalau belum ada, ganti ke <input ... className="..." />

/**
 * Hero ala work.ua:
 * - Headline + subcopy
 * - Search bar (position/location)
 * - Stats ringkas
 * - Quick keywords
 * - Popular cities strip
 * - Category grid
 */
export default function Hero({
  headline = "Find jobs in Uzbekistan",
  subcopy = "Search thousands of vacancies from verified companies. Simple, fast, and free.",
  stats = [
    { label: "Vacancies", value: "12,430" },
    { label: "Companies", value: "3,218" },
    { label: "Resumes", value: "54,901" },
  ],
  popularKeywords = [
    "Frontend",
    "Backend",
    "Designer",
    "Product",
    "Data",
    "Marketing",
  ],
  cities = ["Tashkent", "Samarkand", "Bukhara", "Fergana", "Andijan", "Nukus"],
}: {
  headline?: string;
  subcopy?: string;
  stats?: { label: string; value: string }[];
  popularKeywords?: string[];
  cities?: string[];
}) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [loc, setLoc] = React.useState("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (loc) sp.set("loc", loc);
    router.push(sp.toString() ? `/jobs?${sp.toString()}` : "/jobs");
  };

  return (
    <section className="relative bg-gradient-to-b from-background to-muted/40">
      <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-10 sm:pt-14 md:pb-16">
        {/* Headline */}
        <div className="max-w-3xl">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
            {headline}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            {subcopy}
          </p>
        </div>

        {/* Search bar */}
        <form
          onSubmit={onSearch}
          className="mt-6 rounded-2xl border bg-card/80 p-3 shadow-sm backdrop-blur md:p-4"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr,300px,140px]">
            <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Job title, keyword, company"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                aria-label="Job keyword"
              />
            </div>

            <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <input
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                placeholder="City or region"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                aria-label="Location"
              />
            </div>

            <Button
              type="submit"
              className="h-10 w-full text-white dark:text-white"
            >
              Search
            </Button>
          </div>

          {/* Quick links (keywords) */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground">Popular:</span>
            {popularKeywords.map((k) => (
              <Link
                key={k}
                href={`/jobs?q=${encodeURIComponent(k)}`}
                className="rounded-full border px-2.5 py-1 hover:bg-accent"
              >
                {k}
              </Link>
            ))}
          </div>
        </form>

        {/* Stats pills */}
        <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-xl">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border bg-card/80 px-4 py-3 text-center shadow-sm"
            >
              <div className="text-lg font-bold md:text-xl">{s.value}</div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Cities strip */}
        <div className="mt-8 rounded-2xl border bg-card/60 p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="mr-1 font-medium">Popular cities:</span>
            {cities.map((c) => (
              <Link
                key={c}
                href={`/jobs?loc=${encodeURIComponent(c)}`}
                className="inline-flex items-center rounded-full border px-3 py-1 hover:bg-accent"
              >
                {c}
              </Link>
            ))}
            <Link
              href="/jobs"
              className="ml-auto inline-flex items-center gap-1 text-primary hover:underline"
            >
              Browse all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-10">
          <h2 className="text-xl font-bold md:text-2xl">Popular categories</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore vacancies by industry
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <CategoryCard
              icon={<Cpu className="h-5 w-5" />}
              label="IT / Tech"
              href="/jobs?q=IT"
              chip="+3.2k"
            />
            <CategoryCard
              icon={<Briefcase className="h-5 w-5" />}
              label="Business"
              href="/jobs?q=Business"
              chip="+1.4k"
            />
            <CategoryCard
              icon={<Building2 className="h-5 w-5" />}
              label="Finance"
              href="/jobs?q=Finance"
              chip="+980"
            />
            <CategoryCard
              icon={<GraduationCap className="h-5 w-5" />}
              label="Education"
              href="/jobs?q=Education"
              chip="+530"
            />
            <CategoryCard
              icon={<HeartPulse className="h-5 w-5" />}
              label="Healthcare"
              href="/jobs?q=Healthcare"
              chip="+760"
            />
            <CategoryCard
              icon={<ShoppingBag className="h-5 w-5" />}
              label="Retail"
              href="/jobs?q=Retail"
              chip="+1.1k"
            />
            <CategoryCard
              icon={<Hammer className="h-5 w-5" />}
              label="Construction"
              href="/jobs?q=Construction"
              chip="+420"
            />
            <CategoryCard
              icon={<Shield className="h-5 w-5" />}
              label="Security"
              href="/jobs?q=Security"
              chip="+360"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Small building blocks ---------- */

function CategoryCard({
  icon,
  label,
  href,
  chip,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  chip?: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border bg-card p-3 transition-colors hover:bg-accent/40"
    >
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-lg border bg-background">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{label}</div>
          {!!chip && (
            <div className="text-[11px] text-muted-foreground">{chip} jobs</div>
          )}
        </div>
      </div>
    </Link>
  );
}
