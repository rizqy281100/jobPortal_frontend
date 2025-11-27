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
import { MoreHorizontal, CheckCircle, XCircle, Users } from "lucide-react";

import AppliedJobsClient from "./AppliedJobsClient";
import RecruiterSettings from "./RecruiterSettings";

import { useAppSelector } from "@/store/hooks";
import { useRouter, useSearchParams } from "next/navigation";

export default function DashboardRecruiterPage() {
  const { user } = useAppSelector((state) => state.auth);

  const router = useRouter();
  const params = useSearchParams();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "overview";

  // Ambil tab dari URL, kalau tidak ada default ke "overview"
  const currentTab = params.get("tab") ?? "overview";

  const handleChange = (value: string) => {
    const newUrl = `?tab=${value}`;
    router.push(newUrl, { scroll: false });
  };
  // User sudah pasti ada karena sudah diproteksi di layout
  const userName = user?.name || "User";

  const jobs = [
    {
      title: "UI/UX Designer",
      type: "Full Time",
      remaining: "27 days remaining",
      status: "Active",
      applications: 798,
    },
    {
      title: "Technical Support Specialist",
      type: "Full Time",
      remaining: "4 days remaining",
      status: "Active",
      applications: 556,
    },
    {
      title: "Junior Graphic Designer",
      type: "Part Time",
      remaining: "24 days remaining",
      status: "Active",
      applications: 583,
    },
    {
      title: "Front End Developer",
      type: "Full Time",
      remaining: "Dec 7, 2019",
      status: "Expired",
      applications: 740,
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <header className="rounded-xl border bg-card p-5">
        <h1 className="text-2xl font-semibold">Dashboard Recruiter</h1>
        <p className="text-sm text-muted-foreground">
          Welcome, {userName}! Manage your job postings and candidates here.
        </p>
      </header>

      <Tabs
        defaultValue={tab ?? "overview"}
        value={currentTab}
        onValueChange={handleChange}
        orientation="vertical"
        className="flex w-full space-x-8"
      >
        {/* Sidebar tabs (desktop) */}
        <TabsList className="hidden lg:flex flex-col w-56 h-fit rounded-xl border bg-card p-2">
          <TabsTrigger
            value="overview"
            className="w-full justify-start px-4 py-2 rounded-md transition data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Overview
          </TabsTrigger>

          <TabsTrigger
            value="post"
            className="w-full justify-start px-4 py-2 rounded-md transition data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Post a Job
          </TabsTrigger>

          <TabsTrigger
            value="user_settings"
            className="w-full justify-start px-4 py-2 rounded-md transition data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            User Settings
          </TabsTrigger>
        </TabsList>

        {/* Desktop content */}
        <div className="hidden lg:flex flex-1">
          <DashboardContents jobs={jobs} />
        </div>

        {/* Mobile tabs list */}
        <div className="lg:hidden w-full">
          <TabsList className="grid grid-cols-2 gap-2 rounded-xl border bg-card p-2">
            <TabsTrigger
              value="overview"
              className="px-4 py-2 rounded-md text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Overview
            </TabsTrigger>

            <TabsTrigger
              value="post"
              className="px-4 py-2 rounded-md text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Post a Job
            </TabsTrigger>

            <TabsTrigger
              value="user_settings"
              className="px-4 py-2 rounded-md text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              User Settings
            </TabsTrigger>
          </TabsList>

          {/* Mobile content */}
          <div className="mt-4">
            <DashboardContents jobs={jobs} />
          </div>
        </div>
      </Tabs>
    </div>
  );
}

/* ========================================================================
   Shared contents (dipakai di mobile & desktop)
   ======================================================================== */

function DashboardContents({ jobs }: { jobs: any[] }) {
  return (
    <>
      {/* Overview */}
      <TabsContent value="overview" className="w-full">
        <div className="rounded-lg border bg-background p-4 sm:p-6 shadow-sm ">
          <h2 className="text-lg font-semibold mb-2">Overview</h2>
          <p className="text-sm text-muted-foreground">
            See a quick glance of your activities as a recruiter.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-muted-foreground">Open Jobs</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-muted-foreground">Saved Candidates</p>
            </div>
          </div>

          <Table className="border shadow-sm rounded-[0.3vw] mt-4 border-separate border-spacing-0 overflow-hidden">
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow>
                <TableHead>Jobs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {jobs.map((job, i) => (
                <TableRow
                  key={i}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {job.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {job.type} · {job.remaining}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      {job.status === "Active" ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm ${
                          job.status === "Active"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      {job.applications} Applications
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button variant="outline" size="sm">
                        View Applications
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Promote Job</DropdownMenuItem>
                          <DropdownMenuItem>View Detail</DropdownMenuItem>
                          <DropdownMenuItem>Mark as expired</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      {/* Post a Job */}
      <TabsContent value="post">
        <AppliedJobsClient />
      </TabsContent>

      {/* Saved Jobs */}
      <TabsContent value="favorites">
        <div className="rounded-lg border bg-background p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Saved Candidates</h2>
          <p className="text-sm text-muted-foreground">
            View candidates you've saved for future consideration.
          </p>
        </div>
      </TabsContent>

      {/* Recruiter Settings */}
      <TabsContent value="user_settings">
        <RecruiterSettings />
      </TabsContent>
    </>
  );
}
