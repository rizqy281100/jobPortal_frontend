"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Banknote,
  MapPin,
  Bookmark,
  Share2,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import type { Job } from "../data";
type JobType = Job["employment_type"];
type Policy = Job["policy"];
type Experience = Job["experience_level"];
import { api } from "@/lib/axios";
import { formatDistanceToNow } from "date-fns";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { makeHref } from "@/lib/locale";
import { useLocale } from "next-intl";
/* ================= Colors ================= */
const COLOR = {
  "Full-time": {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    hover: "hover:bg-blue-50 dark:hover:bg-blue-900/30",
  },
  "Part-time": {
    badge:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    hover: "hover:bg-violet-50 dark:hover:bg-violet-900/30",
  },
  Contract: {
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    hover: "hover:bg-amber-50 dark:hover:bg-amber-900/30",
  },
  Freelance: {
    badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    hover: "hover:bg-teal-50 dark:hover:bg-teal-900/30",
  },
  Internship: {
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    hover: "hover:bg-rose-50 dark:hover:bg-rose-900/30",
  },
  wfh: {
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    hover: "hover:bg-emerald-50 dark:hover:bg-emerald-900/30",
  },
  Senior: {
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    hover: "hover:bg-sky-50 dark:hover:bg-sky-900/30",
  },
  Middle: {
    badge:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    hover: "hover:bg-purple-50 dark:hover:bg-purple-900/30",
  },
  Junior: {
    badge:
      "bg-neutral-200 text-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-200",
    hover: "hover:bg-neutral-100 dark:hover:bg-neutral-800/40",
  },
  "Fresh Graduate": {
    badge: "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300",
    hover: "hover:bg-lime-50 dark:hover:bg-lime-900/30",
  },
  "1-2": {
    badge:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    hover: "hover:bg-indigo-50 dark:hover:bg-indigo-900/30",
  },
  "3-5": {
    badge:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    hover: "hover:bg-orange-50 dark:hover:bg-orange-900/30",
  },
  "6-10": {
    badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    hover: "hover:bg-red-50 dark:hover:bg-red-900/30",
  },
  "10+": {
    badge:
      "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300",
    hover: "hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30",
  },
} as const;

const RANDOM_COLOR_SETS = [
  {
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    hover: "hover:bg-emerald-50 dark:hover:bg-emerald-900/3",
  },
  {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    hover: "hover:bg-blue-50 dark:hover:bg-blue-900/30",
  },
  {
    badge:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    hover: "hover:bg-violet-50 dark:hover:bg-violet-900/30",
  },
  {
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    hover: "hover:bg-amber-50 dark:hover:bg-amber-900/30",
  },
  {
    badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    hover: "hover:bg-teal-50 dark:hover:bg-teal-900/30",
  },
  {
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    hover: "hover:bg-rose-50 dark:hover:bg-rose-900/30",
  },
  {
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    hover: "hover:bg-sky-50 dark:hover:bg-sky-900/30",
  },
  {
    badge:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    hover: "hover:bg-purple-50 dark:hover:bg-purple-900/30",
  },
];

function getColor(type: string) {
  if (COLOR[type as keyof typeof COLOR]) {
    return COLOR[type as keyof typeof COLOR];
  }
  let hash = 0;
  for (let i = 0; i < type.length; i++) {
    hash = (hash << 5) - hash + type.charCodeAt(i);
    hash |= 0;
  }
  const randomIndex = Math.abs(hash) % RANDOM_COLOR_SETS.length;

  return RANDOM_COLOR_SETS[randomIndex];
}
/* ============ Province → City → District ============ */
type Province = {
  province: string;
  cities: { city: string; districts: string[] }[];
};
const UZ_PROVINCES: Province[] = [
  {
    province: "Tashkent",
    cities: [{ city: "Tashkent City", districts: ["Mirabad", "Yunusabad"] }],
  },
  {
    province: "Samarkand",
    cities: [{ city: "Samarkand City", districts: ["Registan", "Siab"] }],
  },
  {
    province: "Bukhara",
    cities: [{ city: "Bukhara City", districts: ["Shofirkon", "Romitan"] }],
  },
  {
    province: "Fergana",
    cities: [{ city: "Fergana City", districts: ["Yangiobod", "Kokand"] }],
  },
  {
    province: "Andijan",
    cities: [{ city: "Andijan City", districts: ["Khodjaobod", "Asaka"] }],
  },
  {
    province: "Karakalpakstan",
    cities: [{ city: "Nukus", districts: ["Amir Temur"] }],
  },
  {
    province: "Jizzakh",
    cities: [{ city: "Jizzakh City", districts: ["Zafar"] }],
  },
  {
    province: "Kashkadarya",
    cities: [{ city: "Karshi", districts: ["Shurtan"] }],
  },
  {
    province: "Syrdarya",
    cities: [{ city: "Gulistan", districts: ["Yangiyer"] }],
  },
  { province: "Khorezm", cities: [{ city: "Urgench", districts: ["Khonqa"] }] },
  {
    province: "Surxondaryo",
    cities: [{ city: "Termez", districts: ["Denov"] }],
  },
  {
    province: "Navoi",
    cities: [{ city: "Navoi City", districts: ["Zarafshan"] }],
  },
];

const districtKey = (p: string, c: string, d: string) => `${p}/${c}/${d}`;
const canonicalCityName = (raw?: string) => {
  if (!raw) return "";
  const lower = raw.toLowerCase();
  if (lower.endsWith(" city")) return raw;
  if (lower === "navoi") return "Navoi City";
  if (lower === "tashkent city") return "Tashkent City";
  if (lower === "samarkand city") return "Samarkand City";
  return raw;
};
const jobCityKey = (j: Job) =>
  canonicalCityName(j.region) || canonicalCityName(j.province);

/* ================= Options ================= */

const employment_type = await api.get("/employment_types");
// const JOB_TYPES: JobType[] = [
//   "Full-time",
//   "Part-time",
//   "Contract",
//   "Internship",
//   "Freelance",
// ];
const nameParam = "_"; // biar ga kosong

const tags = await api.get(`/tags/all/${nameParam}`);
const JOB_TYPES: JobType[] = employment_type?.data.map((k) => k.name);
const POLICIES: Policy[] = tags?.data.map((k) => k.name);
const exp = await api.get("/experience_levels");
// console.log(exp.data);
const EXPS: Experience[] = exp?.data.map((k) => k.name);
console.log(EXPS);
/* ===================================================================== */
/* Main */
/* ===================================================================== */
export default function JobsClient({
  allJobs,
  initialJobs,
  totalJobs,
  page: pageProp,
  totalPages,
}: {
  allJobs: Job[];
  initialJobs: Job[];
  totalJobs: number;
  page: number;
  totalPages: number;
}) {
  const pathname = usePathname();
  const params = useSearchParams();
  const pageFromURL = Number(params.get("page") || pageProp || 1);
  const page = Number.isNaN(pageFromURL) ? 1 : Math.max(1, pageFromURL);
  const router = useRouter();

  /* --- Hydration-safe responsive page size (desktop 30 / tablet 20 / mobile 10) --- */
  const [pageSize, setPageSize] = React.useState<number>(10); // default SSR aman
  React.useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setPageSize(w >= 1280 ? 30 : w >= 1024 ? 20 : 10);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  const isMobile = pageSize === 10;
  const isTablet = pageSize === 20;

  /* filters */
  const [typeSet, setTypeSet] = React.useState<Set<string>>(new Set());
  const [polSet, setPolSet] = React.useState<Set<string>>(new Set());
  const [expSet, setExpSet] = React.useState<Set<string>>(new Set());
  const [allUz, setAllUz] = React.useState(true);
  const [selectedDistricts, setSelectedDistricts] = React.useState<Set<string>>(
    new Set()
  );

  const toggle = (
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    v: string
  ) =>
    setter((prev) => {
      const n = new Set(prev);
      n.has(v) ? n.delete(v) : n.add(v);
      return n;
    });

  /* filter + paginate */
  const filteredAll = React.useMemo(() => {
    return allJobs.filter((j) => {
      const t = typeSet.size ? typeSet.has(j.type) : true;
      const p = polSet.size ? polSet.has(j.policy) : true;
      const e = expSet.size ? expSet.has(j.exp) : true;
      let L = true;
      if (!allUz) {
        const city = jobCityKey(j);
        L = selectedDistricts.size
          ? selectedDistricts.has(districtKey(j.province, city, j.district))
          : true;
      }
      return t && p && e && L;
    });
  }, [allJobs, typeSet, polSet, expSet, allUz, selectedDistricts]);

  // const totalPages = Math.max(1, Math.ceil(filteredAll.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageJobs = filteredAll.slice(start, start + pageSize);

  const pageHref = (p: number) => {
    const q = new URLSearchParams(params.toString());
    q.set("page", p.toString());
    return `?${q.toString()}`;
  };

  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);

  const [query, setQuery] = useState(""); // ★ jangan ambil dari params langsung

  useEffect(() => {
    const param = params.get("search") || "";
    setQuery(param); // ★ update setelah hydration aman
  }, [params]);

  const locale = useLocale();
  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (query.trim() !== "") params.set("search", query.trim());

    router.push(makeHref(locale, `/jobs?${params.toString()}`), {
      scroll: false,
    });
  };

  function resetFilters() {
    // 1) Kosongin semua state checkbox kamu
    setTypeSet(new Set());
    setExpSet(new Set());
    setPolSet(new Set());
    // tambahkan state lain kalau ada...

    // 2) Hapus semua query kecuali page & limit
    const params = new URLSearchParams(searchParams.toString());

    params.delete("employment_type");
    params.delete("experience_level");
    params.delete("tags");
    params.delete("location");
    params.delete("search");
    params.delete("sort");
    params.delete("salary");

    // (opsional) reset page ke 1
    params.set("page", "1");

    router.push("?" + params.toString(), { scroll: false });
  }
  const searchParams = useSearchParams();
  function toggleQueryParam(
    key: string,
    value: string,
    searchParams: URLSearchParams,
    router: any
  ) {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(key)?.split(",").filter(Boolean) || [];

    // cek apakah value sudah ada
    if (current.includes(value)) {
      // hapus value nya
      const next = current.filter((v) => v !== value);
      if (next.length > 0) params.set(key, next.join(","));
      else params.delete(key);
    } else {
      // tambah value baru
      current.push(value);
      params.set(key, current.join(","));
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }
  useEffect(() => {
    // Ambil param dari URL
    const typeParam = searchParams.get("employment_type");
    const tagParam = searchParams.get("tags");
    const expParam = searchParams.get("experience_level");

    // Helper untuk ubah "a,b,c" → Set(['a','b','c'])
    const toSet = (v: string | null): Set<string> =>
      v ? new Set(v.split(",").filter(Boolean)) : new Set();

    // Masukkan ke state
    setTypeSet(toSet(typeParam));
    setPolSet(toSet(tagParam));
    setExpSet(toSet(expParam));
  }, [searchParams]);
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:col-span-2 lg:block">
        <div className="sticky top-24 rounded-xl border bg-card p-4">
          {/* Header tetap fix */}
          <h3 className="text-sm font-semibold">Filters</h3>
          <Section title="Search">
            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
              <Input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              <Button
                type="submit"
                className="bg-black text-white px-3 py-1 rounded btn"
              >
                Go
              </Button>
            </form>
          </Section>
          {/* ==== BODY YANG DISCROLL ==== */}
          <div className="mt-3 max-h-[70vh] overflow-y-auto pr-1">
            <Section title="Job Type">
              {JOB_TYPES.map((k) => (
                <FilterRow key={k}>
                  <Checkbox
                    checked={typeSet.has(k)}
                    onCheckedChange={() => {
                      {
                        toggle(setTypeSet, k);
                        toggleQueryParam(
                          "employment_type",
                          k,
                          searchParams,
                          router
                        );
                      }
                    }}
                  />
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${
                      getColor(k).badge
                    }`}
                  >
                    {k}
                  </span>
                </FilterRow>
              ))}
            </Section>

            <Separator className="my-4" />

            <Section title="Tags">
              {(() => {
                const JOB_TYPES_L = JOB_TYPES.map((v) => v.toLowerCase());
                const EXPS_L = EXPS.map((v) => v.toLowerCase());
                // jika collapsed → tampilkan hanya 3 item

                const FILTERED_POLICIES = POLICIES.filter(
                  (k) =>
                    !JOB_TYPES_L.includes(k.toLowerCase()) &&
                    !EXPS_L.includes(k.toLowerCase())
                );
                const visiblePolicies = expanded
                  ? FILTERED_POLICIES
                  : FILTERED_POLICIES.slice(0, 3);
                console.log(visiblePolicies);
                return (
                  <>
                    {visiblePolicies.map((k) => (
                      <FilterRow
                        key={k}
                        style={{
                          maxHeight: expanded
                            ? `${ref.current?.scrollHeight}px`
                            : "0px",
                        }}
                        className="transition-all duration-300 overflow-hidden"
                      >
                        <Checkbox
                          checked={polSet.has(k)}
                          onCheckedChange={() => {
                            toggle(setPolSet, k);
                            toggleQueryParam("tags", k, searchParams, router);
                          }}
                        />
                        <span
                          className={`rounded px-2 py-0.5 text-xs ${
                            getColor(k).badge
                          }`}
                        >
                          {k}
                        </span>
                      </FilterRow>
                    ))}

                    {FILTERED_POLICIES.length > 3 && (
                      <button
                        type="button"
                        onClick={() => setExpanded(!expanded)}
                        className="text-xs text-primary mt-1 hover:underline"
                      >
                        {expanded
                          ? "Show less"
                          : `Show more (${FILTERED_POLICIES.length - 3} more)`}
                      </button>
                    )}
                  </>
                );
              })()}
            </Section>

            <Separator className="my-4" />

            <Section title="Experience">
              {EXPS.map((k) => (
                <FilterRow key={k}>
                  <Checkbox
                    checked={expSet.has(k)}
                    onCheckedChange={() => {
                      toggle(setExpSet, k);
                      toggleQueryParam(
                        "experience_level",
                        k,
                        searchParams,
                        router
                      );
                    }}
                  />
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${
                      getColor(k).badge
                    }`}
                  >
                    {k}
                  </span>
                </FilterRow>
              ))}
            </Section>

            <Separator className="my-4" />

            {/* <Section title="Location"> */}
            <FilterRow className="hidden">
              <Checkbox
                checked={allUz}
                onCheckedChange={(v) => {
                  const val = Boolean(v);
                  setAllUz(val);
                  if (val) setSelectedDistricts(new Set());
                }}
              />
              <span>All Uzbekistan</span>
            </FilterRow>

            {!allUz && (
              <div className="mt-2 rounded-md border">
                {/* scroller untuk tree lokasi */}
                <div className="max-h-[55vh] overflow-y-auto p-2 thin-scrollbar">
                  <Accordion type="multiple">
                    {UZ_PROVINCES.map((P) => (
                      <AccordionItem key={P.province} value={P.province}>
                        <AccordionTrigger className="text-sm">
                          {P.province}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="ml-2 space-y-2 border-l pl-3">
                            <Accordion type="multiple">
                              {P.cities.map((C) => (
                                <AccordionItem
                                  key={`${P.province}/${C.city}`}
                                  value={`${P.province}/${C.city}`}
                                >
                                  <AccordionTrigger className="text-sm">
                                    {C.city}
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="ml-2 space-y-1 border-l pl-3">
                                      {C.districts.map((D) => (
                                        <FilterRow
                                          key={`${P.province}/${C.city}/${D}`}
                                        >
                                          <Checkbox
                                            checked={selectedDistricts.has(
                                              `${P.province}/${C.city}/${D}`
                                            )}
                                            onCheckedChange={() =>
                                              toggle(
                                                setSelectedDistricts,
                                                `${P.province}/${C.city}/${D}`
                                              )
                                            }
                                          />
                                          <span>{D}</span>
                                        </FilterRow>
                                      ))}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            )}
            {/* </Section> */}
            {/* ==== /BODY ==== */}
          </div>

          {/* Tombol reset di luar area scroll biar selalu terlihat */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => {
              resetFilters();
            }}
          >
            Reset Filters
          </Button>
        </div>
      </aside>

      {/* Content */}
      <section className="lg:col-span-10">
        {/* Mobile/Tablet filter trigger */}
        <div className="mb-3 flex items-center justify-between lg:hidden">
          <MobileFilter
            typeSet={typeSet}
            setTypeSet={setTypeSet}
            polSet={polSet}
            setPolSet={setPolSet}
            expSet={expSet}
            setExpSet={setExpSet}
            allUz={allUz}
            setAllUz={(v) => {
              setAllUz(v);
              if (v) setSelectedDistricts(new Set());
            }}
            selectedDistricts={selectedDistricts}
            setSelectedDistricts={setSelectedDistricts}
          />
          <p className="text-xs text-muted-foreground">
            {pageJobs.length} of {filteredAll.length} jobs
          </p>
        </div>

        {/* Grid: mobile=1, tablet(lg)=2, desktop(xl)=3 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {allJobs.map((j) => (
            <JobCard key={j.id} job={j} />
          ))}
          {!pageJobs.length && (
            <div className="col-span-full rounded-lg border p-6 text-center text-sm text-muted-foreground">
              No jobs match current filters.
            </div>
          )}
        </div>

        {/* Pagination */}
        <PaginationResponsive
          currentPage={currentPage}
          totalPages={totalPages}
          pageHref={pageHref}
          isMobile={isMobile}
          isTablet={isTablet}
          totalItems={filteredAll.length}
        />
      </section>
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  const locale = useLocale();
  const [saved, setSaved] = React.useState(false);
  const LS_KEY = "savedJobs";

  const toggleSave = () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const arr: any[] = raw ? JSON.parse(raw) : [];
      const idx = arr.findIndex((x) => x.id === job.id);
      if (idx >= 0) {
        arr.splice(idx, 1);
        setSaved(false);
      } else {
        // const city = jobCityKey(job);
        // const locationStr = `${job.district}, ${city}, ${job.province}`;
        arr.unshift({
          id: job.id,
          title: job.title,
          company: job.company_name,
          location: job.location,
          savedAt: new Date().toISOString(),
          href: makeHref(locale, `/jobs/${job.id}`),
        });
        setSaved(true);
      }
      localStorage.setItem(LS_KEY, JSON.stringify(arr));
      window.dispatchEvent(new CustomEvent("saved-jobs-changed"));
    } catch {}
  };

  const onShare = async () => {
    const href = makeHref(locale, `/jobs/${job.id}`);
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${href}`
        : `${href}`;
    try {
      if (navigator.share)
        await navigator.share({
          title: `${job.title} — ${job.company_name}`,
          text: "Check out this job",
          url,
        });
      else {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard");
      }
    } catch {}
  };

  function formatCurrency(value: number, currency: string = "IDR") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  }
  // const city = jobCityKey(job);
  // const locationStr = `${job.district}, ${city}, ${job.province}`;
  const locationStr = `${job.location}`;

  return (
    <Card
      className={`relative  transform transition-transform duration-300 ease-in-out hover:scale-105`}
    >
      <div className="absolute right-2 top-2 md:right-3 md:top-3 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 transition-colors hover:bg-accent ${
            saved ? "text-primary" : "text-muted-foreground"
          }`}
          onClick={toggleSave}
          aria-label="Save job"
        >
          <Bookmark className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          onClick={onShare}
          aria-label="Share job"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      <CardHeader className="space-y-3 pr-10 md:pr-12 xl:pr-14">
        <div className="flex items-center gap-3 ">
          {/* Avatar */}
          {job.avatar_url ? (
            <img
              src={"http://localhost:5000" + job.avatar_url}
              onError={(e) => {
                e.currentTarget.style.display = "none"; // hide broken img
                e.currentTarget.nextSibling.style.display = "flex"; // show fallback
              }}
              alt={job.company_name}
              className="w-15 h-15 rounded-full object-cover border"
            />
          ) : null}

          {/* Fallback Avatar (initials) */}
          <div
            className={`w-15 h-15 rounded-full border bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 flex items-center justify-center font-semibold ${
              job.avatar_url ? "hidden" : "flex"
            }`}
          >
            {job.company_name?.charAt(0)?.toUpperCase() || "?"}
          </div>

          {/* Title + Company Name */}
          <div className="flex flex-col">
            <CardTitle className="text-base">{job.title}</CardTitle>
            <span className="text-xs text-muted-foreground">
              {job.company_name}
            </span>
          </div>
        </div>

        {/* BADGES */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`rounded px-2 py-0.5 ${
              getColor(job.employment_type).badge
            } ${getColor(job.employment_type).hover}`}
          >
            {job.employment_type}
          </span>

          <span
            className={`rounded px-2 py-0.5 ${
              getColor(job.experience_level).badge
            } ${getColor(job.experience_level).hover}`}
          >
            {job.experience_level}
          </span>

          {job.tags &&
            job.tags.map((tag) => {
              if (
                ![
                  job.experience_level.toLowerCase(),
                  job.employment_type.toLowerCase(),
                ].includes(tag.name.toLowerCase())
              )
                return (
                  <span
                    key={tag.id}
                    className={`rounded px-2 py-0.5 ${
                      getColor(tag.name).badge
                    } ${getColor(tag.name).hover}`}
                  >
                    {tag.name}
                  </span>
                );
            })}
        </div>
      </CardHeader>

      <CardContent className="text-sm">
        <div className="mb-2 flex items-center gap-2">
          <Banknote className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {job.currency &&
              (job.salary_max
                ? `${formatCurrency(
                    job.salary_min,
                    job.currency
                  )} – ${formatCurrency(job.salary_max, job.currency)} / month`
                : `${formatCurrency(job.salary_min, job.currency)} / month`)}
          </span>
        </div>
        <div className="mb-2 text-sm text-muted-foreground">{job.company}</div>

        <div className="mb-3 flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span
            className="truncate text-xs sm:text-[13px] md:text-sm"
            title={locationStr}
          >
            {locationStr}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <Link
            href={makeHref(locale, `/jobs/${job.id}`)}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Apply Now →
          </Link>
          <span className="text-xs text-muted-foreground">
            Posted
            {" " +
              formatDistanceToNow(new Date(job.created_at), {
                addSuffix: true,
              })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function Section({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted-foreground">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function FilterRow({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2 text-sm ${className}`}
    >
      {children}
    </label>
  );
}
function labelize(v: string) {
  return v
    .replaceAll("-", " ")
    .replace("wfh", "WFH")
    .replace("wfo", "WFO")
    .replace("hybrid", "Hybrid")
    .replace("fulltime", "Full-time")
    .replace("contract", "Contract")
    .replace("parttime", "Part-time")
    .replace("internship", "Internship")
    .replace("noexp", "No Experience")
    .replace("fresh", "Fresh Graduate");
}

/* =================== Mobile Filter (with scroller) =================== */
function MobileFilter({
  typeSet,
  setTypeSet,
  polSet,
  setPolSet,
  expSet,
  setExpSet,
  allUz,
  setAllUz,
  selectedDistricts,
  setSelectedDistricts,
}: {
  typeSet: Set<string>;
  setTypeSet: React.Dispatch<React.SetStateAction<Set<string>>>;
  polSet: Set<string>;
  setPolSet: React.Dispatch<React.SetStateAction<Set<string>>>;
  expSet: Set<string>;
  setExpSet: React.Dispatch<React.SetStateAction<Set<string>>>;
  allUz: boolean;
  setAllUz: (v: boolean) => void;
  selectedDistricts: Set<string>;
  setSelectedDistricts: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
  const toggle = (
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    v: string
  ) =>
    setter((prev) => {
      const n = new Set(prev);
      n.has(v) ? n.delete(v) : n.add(v);
      return n;
    });

  const [expanded, setExpanded] = React.useState(false);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[88vw] sm:w-[420px] p-0">
        <SheetHeader className="px-5 py-4">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <Separator />
        <div className="max-h-[calc(100vh-120px)] overflow-auto p-4 space-y-6">
          <Section title="Job Type">
            {JOB_TYPES.map((k) => (
              <FilterRow key={k}>
                <Checkbox
                  checked={typeSet.has(k)}
                  onCheckedChange={() => toggle(setTypeSet, k)}
                />
                <span
                  className={`rounded px-2 py-0.5 text-xs ${getColor(k).badge}`}
                >
                  {labelize(k)}
                </span>
              </FilterRow>
            ))}
          </Section>

          <Separator />

          <Section title="Tags">
            {(() => {
              // jika collapsed → tampilkan hanya 3 item
              const visiblePolicies = expanded
                ? POLICIES
                : POLICIES.slice(0, 3);
              console.log(visiblePolicies);
              return (
                <>
                  {visiblePolicies.map((k) => (
                    <FilterRow key={k}>
                      <Checkbox
                        checked={polSet.has(k)}
                        onCheckedChange={() => toggle(setPolSet, k)}
                      />
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${
                          getColor(k).badge
                        }`}
                      >
                        {k}
                      </span>
                    </FilterRow>
                  ))}

                  {POLICIES.length > 3 && (
                    <button
                      type="button"
                      onClick={() => setExpanded(!expanded)}
                      className="text-xs text-primary mt-1 hover:underline"
                    >
                      {expanded
                        ? "Show less"
                        : `Show more (${POLICIES.length - 3} more)`}
                    </button>
                  )}
                </>
              );
            })()}
          </Section>

          <Separator />

          <Section title="Experience">
            {EXPS.map((k) => (
              <FilterRow key={k}>
                <Checkbox
                  checked={expSet.has(k)}
                  onCheckedChange={() => toggle(setExpSet, k)}
                />
                <span
                  className={`rounded px-2 py-0.5 text-xs ${getColor(k).badge}`}
                >
                  {k}
                </span>
              </FilterRow>
            ))}
          </Section>

          <Separator />

          <Section title="Location">
            <FilterRow>
              <Checkbox
                checked={allUz}
                onCheckedChange={(v) => {
                  const val = Boolean(v);
                  setAllUz(val);
                  if (val) setSelectedDistricts(new Set());
                }}
              />
              <span>All Uzbekistan</span>
            </FilterRow>

            {!allUz && (
              <div className="mt-2 rounded-md border">
                <div className="max-h-[55vh] overflow-y-auto p-2 thin-scrollbar">
                  <Accordion type="multiple">
                    {UZ_PROVINCES.map((P) => (
                      <AccordionItem key={P.province} value={P.province}>
                        <AccordionTrigger className="text-sm">
                          {P.province}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="ml-2 space-y-2 border-l pl-3">
                            <Accordion type="multiple">
                              {P.cities.map((C) => (
                                <AccordionItem
                                  key={`${P.province}/${C.city}`}
                                  value={`${P.province}/${C.city}`}
                                >
                                  <AccordionTrigger className="text-sm">
                                    {C.city}
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="ml-2 space-y-1 border-l pl-3">
                                      {C.districts.map((D) => (
                                        <FilterRow
                                          key={districtKey(
                                            P.province,
                                            C.city,
                                            D
                                          )}
                                        >
                                          <Checkbox
                                            checked={selectedDistricts.has(
                                              districtKey(P.province, C.city, D)
                                            )}
                                            onCheckedChange={() =>
                                              toggle(
                                                setSelectedDistricts,
                                                districtKey(
                                                  P.province,
                                                  C.city,
                                                  D
                                                )
                                              )
                                            }
                                          />
                                          <span>{D}</span>
                                        </FilterRow>
                                      ))}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            )}
          </Section>

          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => {
              setTypeSet(new Set());
              setPolSet(new Set());
              setExpSet(new Set());
              setAllUz(true);
              setSelectedDistricts(new Set());
            }}
          >
            Reset Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ================= Pagination (hydration-safe) ================= */
function PaginationResponsive({
  currentPage,
  totalPages,
  pageHref,
  isMobile,
  isTablet,
  totalItems,
}: {
  currentPage: number;
  totalPages: number;
  pageHref: (p: number) => string;
  isMobile: boolean;
  isTablet: boolean;
  totalItems: number;
}) {
  if (totalPages <= 1) return null;

  const PageLink = ({ p, active }: { p: number; active?: boolean }) => (
    <Link
      href={pageHref(p)}
      className={`inline-flex min-w-[2rem] justify-center rounded-md border px-3 py-1.5 text-sm ${
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent text-foreground dark:text-foreground"
      }`}
    >
      {p}
    </Link>
  );

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      {isMobile ? (
        <div className="flex items-center gap-2">
          <Link
            href={pageHref(Math.max(1, currentPage - 1))}
            className="inline-flex rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
          >
            Prev
          </Link>
          <span className="text-sm">
            {currentPage}/{totalPages}
          </span>
          <Link
            href={pageHref(Math.min(totalPages, currentPage + 1))}
            className="inline-flex rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
          >
            Next
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={pageHref(Math.max(1, currentPage - 1))}
            className="inline-flex rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
          >
            Prev
          </Link>
          {(() => {
            const buttons: React.ReactNode[] = [];
            const windowSize = isTablet ? 5 : 7;
            const start = Math.max(1, currentPage - Math.floor(windowSize / 2));
            const end = Math.min(totalPages, start + windowSize - 1);

            if (start > 1) {
              buttons.push(
                <PageLink key={1} p={1} active={1 === currentPage} />
              );
              if (start > 2)
                buttons.push(
                  <span
                    key="s-ellips"
                    className="px-1 text-sm text-muted-foreground"
                  >
                    …
                  </span>
                );
            }
            for (let p = start; p <= end; p++) {
              buttons.push(
                <PageLink key={p} p={p} active={p === currentPage} />
              );
            }
            if (end < totalPages) {
              if (end < totalPages - 1)
                buttons.push(
                  <span
                    key="e-ellips"
                    className="px-1 text-sm text-muted-foreground"
                  >
                    …
                  </span>
                );
              buttons.push(
                <PageLink
                  key={totalPages}
                  p={totalPages}
                  active={totalPages === currentPage}
                />
              );
            }
            return buttons;
          })()}
          <Link
            href={pageHref(Math.min(totalPages, currentPage + 1))}
            className="inline-flex rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
