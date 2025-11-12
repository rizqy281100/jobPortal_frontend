// "use client";

// import * as React from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import {
//   Search,
//   MapPin,
//   ChevronRight,
//   Briefcase,
//   Building2,
//   GraduationCap,
//   HeartPulse,
//   ShoppingBag,
//   Cpu,
//   Hammer,
//   Shield,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

// export default function Hero({
//   headline = "Find jobs in Uzbekistan",
//   subcopy = "Search thousands of vacancies from verified companies. Simple, fast, and free.",
//   stats = [
//     { label: "Vacancies", value: "12,430" },
//     { label: "Companies", value: "3,218" },
//     { label: "Resumes", value: "54,901" },
//   ],
//   popularKeywords = [
//     "Frontend",
//     "Backend",
//     "Designer",
//     "Product",
//     "Data",
//     "Marketing",
//   ],
//   cities = ["Tashkent", "Samarkand", "Bukhara", "Fergana", "Andijan", "Nukus"],
// }: {
//   headline?: string;
//   subcopy?: string;
//   stats?: { label: string; value: string }[];
//   popularKeywords?: string[];
//   cities?: string[];
// }) {
//   const router = useRouter();
//   const [q, setQ] = React.useState("");
//   const [loc, setLoc] = React.useState("");

//   const onSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     const sp = new URLSearchParams();
//     if (q) sp.set("q", q);
//     if (loc) sp.set("loc", loc);
//     router.push(sp.toString() ? `/jobs?${sp.toString()}` : "/jobs");
//   };

//   return (
//     <section className="relative bg-gradient-to-b from-background to-muted/40">
//       <BackgroundRippleEffect />
//       <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-10 sm:pt-14 md:pb-16">
//         {/* Headline */}
//         <div className="max-w-3xl">
//           <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
//             {headline}
//           </h1>
//           <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
//             {subcopy}
//           </p>
//         </div>

//         {/* Search bar */}
//         <form
//           onSubmit={onSearch}
//           className="mt-6 rounded-2xl border bg-card/80 p-3 shadow-sm backdrop-blur md:p-4"
//         >
//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr,300px,140px]">
//             <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2">
//               <Search className="h-4 w-4 text-muted-foreground" />
//               <input
//                 value={q}
//                 onChange={(e) => setQ(e.target.value)}
//                 placeholder="Job title, keyword, company"
//                 className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
//                 aria-label="Job keyword"
//               />
//             </div>

//             <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2">
//               <MapPin className="h-4 w-4 text-muted-foreground" />
//               <input
//                 value={loc}
//                 onChange={(e) => setLoc(e.target.value)}
//                 placeholder="City or region"
//                 className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
//                 aria-label="Location"
//               />
//             </div>

//             <Button
//               type="submit"
//               className="h-10 w-full text-white dark:text-white"
//             >
//               Search
//             </Button>
//           </div>

//           {/* Quick links (keywords) */}
//           <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
//             <span className="text-muted-foreground">Popular:</span>
//             {popularKeywords.map((k) => (
//               <Link
//                 key={k}
//                 href={`/jobs?q=${encodeURIComponent(k)}`}
//                 className="rounded-full border px-2.5 py-1 hover:bg-accent"
//               >
//                 {k}
//               </Link>
//             ))}
//           </div>
//         </form>

//         {/* Stats pills */}
//         <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-xl">
//           {stats.map((s) => (
//             <div
//               key={s.label}
//               className="rounded-xl border bg-card/80 px-4 py-3 text-center shadow-sm"
//             >
//               <div className="text-lg font-bold md:text-xl">{s.value}</div>
//               <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
//                 {s.label}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Cities strip */}
//         <div className="mt-8 rounded-2xl border bg-card/60 p-3 sm:p-4">
//           <div className="flex flex-wrap items-center gap-2 text-sm">
//             <span className="mr-1 font-medium">Popular cities:</span>
//             {cities.map((c) => (
//               <Link
//                 key={c}
//                 href={`/jobs?loc=${encodeURIComponent(c)}`}
//                 className="inline-flex items-center rounded-full border px-3 py-1 hover:bg-accent"
//               >
//                 {c}
//               </Link>
//             ))}
//             <Link
//               href="/jobs"
//               className="ml-auto inline-flex items-center gap-1 text-primary hover:underline"
//             >
//               Browse all <ChevronRight className="h-4 w-4" />
//             </Link>
//           </div>
//         </div>

//         {/* Categories */}
//         {/* <div className="mt-10">
//           <h2 className="text-xl font-bold md:text-2xl">Popular categories</h2>
//           <p className="mt-1 text-sm text-muted-foreground">
//             Explore vacancies by industry
//           </p>

//           <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
//             <CategoryCard
//               icon={<Cpu className="h-5 w-5" />}
//               label="IT / Tech"
//               href="/jobs?q=IT"
//               chip="+3.2k"
//             />
//             <CategoryCard
//               icon={<Briefcase className="h-5 w-5" />}
//               label="Business"
//               href="/jobs?q=Business"
//               chip="+1.4k"
//             />
//             <CategoryCard
//               icon={<Building2 className="h-5 w-5" />}
//               label="Finance"
//               href="/jobs?q=Finance"
//               chip="+980"
//             />
//             <CategoryCard
//               icon={<GraduationCap className="h-5 w-5" />}
//               label="Education"
//               href="/jobs?q=Education"
//               chip="+530"
//             />
//             <CategoryCard
//               icon={<HeartPulse className="h-5 w-5" />}
//               label="Healthcare"
//               href="/jobs?q=Healthcare"
//               chip="+760"
//             />
//             <CategoryCard
//               icon={<ShoppingBag className="h-5 w-5" />}
//               label="Retail"
//               href="/jobs?q=Retail"
//               chip="+1.1k"
//             />
//             <CategoryCard
//               icon={<Hammer className="h-5 w-5" />}
//               label="Construction"
//               href="/jobs?q=Construction"
//               chip="+420"
//             />
//             <CategoryCard
//               icon={<Shield className="h-5 w-5" />}
//               label="Security"
//               href="/jobs?q=Security"
//               chip="+360"
//             />
//           </div>
//         </div> */}
//       </div>
//     </section>
//   );
// }

// /* ---------- Small building blocks ---------- */

// // function CategoryCard({
// //   icon,
// //   label,
// //   href,
// //   chip,
// // }: {
// //   icon: React.ReactNode;
// //   label: string;
// //   href: string;
// //   chip?: string;
// // }) {
// //   return (
// //     <Link
// //       href={href}
// //       className="group rounded-xl border bg-card p-3 transition-colors hover:bg-accent/40"
// //     >
// //       <div className="flex items-center gap-2">
// //         <div className="grid h-9 w-9 place-items-center rounded-lg border bg-background">
// //           {icon}
// //         </div>
// //         <div className="min-w-0">
// //           <div className="truncate text-sm font-medium">{label}</div>
// //           {!!chip && (
// //             <div className="text-[11px] text-muted-foreground">{chip} jobs</div>
// //           )}
// //         </div>
// //       </div>
// //     </Link>
// //   );
// // }

"use client";

import * as React from "react";

import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

export default function Hero() {
  const placeholders = [
    "Find the best jobs in Uzbekistan",
    "Software Engineer",
    "UI/UX Designer",
    "Copywriter",
    "Data Analyst",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <section className="relative flex h-200 w-full flex-col items-start justify-start overflow-hidden">
      <BackgroundRippleEffect />
      <div className="mt-50 w-full">
        <h2 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-neutral-800 md:text-4xl lg:text-7xl dark:text-neutral-100">
          Find jobs in Uzbekistan
        </h2>
        <p className="relative z-10 mx-auto mt-4 max-w-xl text-center text-neutral-800 dark:text-neutral-500">
          Search thousands of vacancies from verified companies. Simple, fast,
          and free.
        </p>
      </div>

      <div className="flex w-full justify-center mt-12 px-4">
        <div className="relative w-full max-w-xl">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </section>
  );
}
