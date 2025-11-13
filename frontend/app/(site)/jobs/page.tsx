import JobsClient from "./parts/JobsClient";
import { JOBS, type Job } from "./data";

// SSG + ISR untuk halaman list (opsional, boleh tetap 60 dtk)
export const revalidate = 60;

export default async function JobsEnPage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { searchParams } = props;
  const { page: rawPage } = await searchParams;

  const all: Job[] = JOBS;
  const page = Math.max(1, Number(rawPage ?? 1));
  const size = 27;
  const totalPages = Math.ceil(all.length / size);
  const pageJobs = all.slice((page - 1) * size, page * size);

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold tracking-tight">Job Posting</h1>
      <JobsClient
        initialJobs={pageJobs}
        totalJobs={all.length}
        page={page}
        totalPages={totalPages}
        allJobs={all}
      />
    </main>
  );
}
