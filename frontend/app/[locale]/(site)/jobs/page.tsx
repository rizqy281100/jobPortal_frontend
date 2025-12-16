import JobsClient from "./parts/JobsClient";
import { JOBS, type Job } from "./data";
import { api } from "@/lib/axios";
import { cookies } from "next/headers";

// SSG + ISR untuk halaman list (opsional, boleh tetap 60 dtk)
export const revalidate = 60;

// const { accessToken } = useAppSelector((state) => state.auth);
export default async function JobsEnPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  // const saved = await api.get("/saved-jobs/self");

  const searchParams = await props.searchParams;

  const page = Number(searchParams.page ?? 1);
  const limit = Number(searchParams.limit ?? 12);
  const search = searchParams.search ?? "";
  const location = searchParams.location ?? "";
  const sort = searchParams.sort ?? "";
  const tags = searchParams.tags ?? "";
  const JobType = searchParams.employment_type ?? "";
  const experience = searchParams.experience_level ?? ""; // bisa Junior,Senior
  // 🚀 generate query string otomatis
  const q = new URLSearchParams();

  const cookieStore = await cookies();
  const user =
    cookieStore.get("user")?.value !== undefined
      ? JSON.parse(cookieStore.get("user")?.value)
      : ""; // sesuaikan nama cookie-mu
  // console.log("iini dia", user);
  q.set("user_id", user.id);
  q.set("page", page.toString());
  q.set("limit", limit.toString());

  if (search) q.set("search", search);
  if (location) q.set("location", location);
  if (sort) q.set("sort", sort);

  // Format: ?tags=a,b,c
  if (tags) q.set("tags", tags);

  // Format: ?type=Full-time,Part-time
  if (JobType) q.set("employment_type", JobType);

  // Format: ?experience_level=Junior,Senior
  if (experience) q.set("experience_level", experience);

  const res = await api.get(`/job-posts?${q.toString()}`);
  // console.log("all jobs ", res);

  // console.log("Final URL:", `/job-posts?${q.toString()}`);
  const all: Job[] = res.data;
  // // const page = Math.max(1, Number(rawPage ?? 1));
  // const size = 27;
  // const pageJobs = all.slice((page - 1) * size, page * size);

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold tracking-tight">Job Posting</h1>
      <JobsClient
        initialJobs={res?.data}
        totalJobs={res?.meta.total}
        page={res?.meta.page}
        totalPages={res?.meta.totalPage}
        allJobs={res?.data}
      />
    </main>
  );
}
