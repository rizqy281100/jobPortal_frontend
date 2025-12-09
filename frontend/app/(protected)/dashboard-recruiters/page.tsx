"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Users,
  Clock,
  Notebook,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import AppliedJobsClient from "./AppliedJobsClient";
import RecruiterSettings from "./RecruiterSettings";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useSearchParams } from "next/navigation";
import { updateJobPostStatus } from "./actions";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { metadata } from "@/app/layout";

type Job = {
  id: string;
  title: string;
  type: string;
  status: string;
  remaining: string; // misal: date difference
  applications: number; // default 0
};

export default function DashboardRecruiterPage() {
  const { user, accessToken } = useAppSelector((state) => state.auth);

  const router = useRouter();
  const params = useSearchParams();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "overview";
  // const job = searchParams.get("success");

  function formatRemaining(deadline?: string | null): string {
    if (!deadline) return "No remaining time";

    const diff = formatDistanceToNow(new Date(deadline), {
      addSuffix: true,
    });

    return "expire " + diff;
  }
  function mapJobPost(apiJob: any): Job {
    return {
      id: apiJob.id,
      title: apiJob.title,
      type: apiJob.employment_type,
      status: apiJob.status,
      remaining: formatRemaining(apiJob.deadline), // nanti kamu format sendiri
      applications: apiJob.applications, // default, karena API tidak menyediakan
    };
  }
  // Ambil tab dari URL, kalau tidak ada default ke "overview"
  const currentTab = params.get("tab") ?? "overview";

  const handleChange = (value: string) => {
    const newUrl = `?tab=${value}`;
    router.push(newUrl, { scroll: false });
  };

  const userName = user?.name || "User";
  const [jobs, setJobs] = useState<Job[]>([]);
  const [meta, setMeta] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await api.get(`/recruiters/job-posts/self`, {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      });
      console.log(res);
      const mapped = res?.data.map(mapJobPost);
      setJobs(mapped);
      setMeta(res?.meta);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
    // if (job) {
    //   toast.success("Job Has been created");
    // }
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await updateJobPostStatus(id, status, accessToken);

    console.log(res);
    if (!res?.success) {
      toast.error("Fail to update status");
      return;
    }

    fetchJobs();
  };
  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="rounded-xl border bg-card p-4 sm:p-5">
        <h1 className="text-xl font-semibold sm:text-2xl">
          Dashboard Recruiter
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome, {userName}! Manage your job postings and candidates here.
        </p>
      </header>

      {/* Tabs Root */}
      <Tabs
        defaultValue={tab ?? "overview"}
        orientation="vertical"
        value={currentTab}
        onValueChange={handleChange}
        className="flex w-full flex-col gap-4 lg:flex-row lg:gap-8"
      >
        {/* ========== MOBILE & TABLET TABS (TOP BAR) ========== */}
        <div className="w-full lg:hidden">
          <TabsList
            className="
            justify-items-start w-full 
            "
          >
            <TabsTrigger
              value="overview"
              className="w-full rounded-md text-xs sm:text-sm data-[state=active]:bg-primary"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="post"
              className="w-full rounded-md text-xs sm:text-sm data-[state=active]:bg-primary"
            >
              Post Job
            </TabsTrigger>
            <TabsTrigger
              value="user_settings"
              className="w-full rounded-md text-xs sm:text-sm data-[state=active]:bg-primary"
            >
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ========== DESKTOP SIDEBAR TABS ========== */}
        <div className="hidden lg:block lg:w-56 lg:flex-shrink-0">
          <TabsList className="flex h-fit w-full flex-col rounded-xl border bg-card p-2">
            <TabsTrigger
              value="overview"
              className="w-full justify-start rounded-md px-4 py-2 text-sm transition data-[state=active]:bg-primary "
            >
              Overview
            </TabsTrigger>

            <TabsTrigger
              value="post"
              className="w-full justify-start rounded-md px-4 py-2 text-sm transition data-[state=active]:bg-primary "
            >
              Post a Job
            </TabsTrigger>
            <TabsTrigger
              value="user_settings"
              className="w-full justify-start rounded-md px-4 py-2 text-sm transition data-[state=active]:bg-primary "
            >
              User Settings
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ========== CONTENT AREA (SHARED) ========== */}
        <div className="min-w-0 flex-1">
          <DashboardContents
            jobs={jobs}
            updateStatus={updateStatus}
            meta={meta}
          />
        </div>
      </Tabs>
    </div>
  );
}

/* ============================================================
   Shared contents (dipakai untuk semua breakpoint)
   ============================================================ */

function DashboardContents({
  jobs,
  updateStatus,
  meta,
}: {
  jobs: Job[];
  updateStatus: (id: number, newStatus: string) => Promise<any>;
  meta: [];
}) {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(jobs.length / pageSize);

  const paginatedJobs = jobs.slice((page - 1) * pageSize, page * pageSize);
  return (
    <>
      {/* Overview */}
      <TabsContent value="overview" className="mt-2">
        <div className="rounded-xl border bg-background p-4 shadow-sm sm:p-6">
          <h2 className="mb-2 text-lg font-semibold">Overview</h2>
          <p className="text-sm text-muted-foreground">
            See a quick glance of your activities as a recruiter.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold">{meta?.total}</p>
              <p className="text-sm text-muted-foreground">Jobs</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-muted-foreground">Saved Candidates</p>
            </div>
          </div>

          <Table className="mt-4 overflow-hidden rounded-lg border border-separate border-spacing-0 shadow-sm">
            <TableHeader className="bg-muted/60">
              <TableRow>
                <TableHead>Jobs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedJobs.map((job, i) => (
                <TableRow
                  key={i}
                  className="transition hover:bg-muted/40 dark:hover:bg-muted/20"
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{job.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {job.type} · {job.remaining}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      {job.status === "OPEN" && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}

                      {job.status === "CLOSED" && (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}

                      {job.status === "DRAFT" && (
                        <Notebook className="h-4 w-4 text-amber-500" />
                      )}

                      <span
                        className={`
        text-sm font-medium
        ${
          job.status === "OPEN"
            ? "text-green-600"
            : job.status === "CLOSED"
            ? "text-red-600"
            : "text-amber-600"
        }
      `}
                      >
                        {job.status}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {job.applications} Applications
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm">
                        View Applications
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Promote Job</DropdownMenuItem>
                          <DropdownMenuItem>View Detail</DropdownMenuItem>

                          {/* Conditional action */}
                          {job.status === "DRAFT" && (
                            <DropdownMenuItem
                              onClick={() => updateStatus(job.id, 1)}
                            >
                              Publish
                            </DropdownMenuItem>
                          )}

                          {job.status === "OPEN" && (
                            <DropdownMenuItem
                              onClick={() => updateStatus(job.id, 2)}
                            >
                              Mark as expired
                            </DropdownMenuItem>
                          )}

                          {/* CLOSED → no action shown */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </TabsContent>

      {/* Post a Job */}
      <TabsContent value="post" className="mt-2">
        {/* pakai komponenmu sendiri, di sini contoh reuse AppliedJobsClient */}
        <AppliedJobsClient />
      </TabsContent>

      {/* Saved Jobs */}
      <TabsContent value="favorites" className="mt-2">
        <div className="rounded-xl border bg-background p-4 shadow-sm sm:p-6">
          <h2 className="mb-2 text-lg font-semibold">Saved Candidates</h2>
          <p className="text-sm text-muted-foreground">
            View candidates you&apos;ve saved for future consideration.
          </p>
        </div>
      </TabsContent>

      {/* Recruiter Settings */}
      <TabsContent value="user_settings" className="mt-2">
        <RecruiterSettings />
      </TabsContent>
    </>
  );
  // formatDistanceToNow is imported from date-fns above
}
