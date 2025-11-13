import { readSession } from "@/lib/session";
import { redirect } from "next/navigation";
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
import Link from "next/link";
// import SavedJobsClient from "./SavedJobsClient";
// import AppliedJobsClient from "./AppliedJobsClient";
// import UserSettingsClient from "./UserSettingsClient";

export default async function DashboardRecruiterPage() {
  const session = await readSession();
  if (!session) redirect("/login");
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
    <div className="p-6 space-y-6">
      <header className="rounded-xl border bg-card p-5">
        <h1 className="text-2xl font-semibold">Dashboard Recruiter</h1>
        <p className="text-sm text-muted-foreground">
          Welcome, {session.name}! Manage your job postings and candidates here.
        </p>
      </header>

      {/* --- Tabs Container --- */}
      <Tabs
        defaultValue="overview"
        orientation="vertical"
        className="flex w-full space-x-8"
      >
        {/* --- Tabs Sidebar --- */}
        <TabsList className="flex flex-col w-56 h-fit rounded-xl border bg-card p-2">
          <TabsTrigger
            value="overview"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="applied"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition"
          >
            Post a Job
          </TabsTrigger>
          <TabsTrigger
            value="favorites"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition"
          >
            Saved Jobs
          </TabsTrigger>
          <TabsTrigger
            value="user_settings"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition"
          >
            User Settings
          </TabsTrigger>
        </TabsList>

        {/* --- Tabs Content Area --- */}
        <div className="flex-1">
          <TabsContent value="overview">
            <div className="rounded-lg border bg-background p-6 shadow-sm">
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
                  <p className="text-sm text-muted-foreground">
                    Saved Candidates
                  </p>
                </div>
              </div>
              <Table className="border shadow-sm rounded-[0.3vw] mt-4 border-separate border-spacing-0 overflow-hidden">
                <TableHeader className="bg-gray-50 dark:bg-gray-800 ">
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
                      {/* JOB */}
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

                      {/* STATUS */}
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

                      {/* APPLICATIONS */}
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          {job.applications} Applications
                        </div>
                      </TableCell>

                      {/* ACTIONS */}
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
                              <DropdownMenuItem>
                                Mark as expired
                              </DropdownMenuItem>
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

          <TabsContent value="applied">
            {/* <AppliedJobsClient /> */}
          </TabsContent>

          {/* ======= Saved Jobs ======= */}
          <TabsContent value="favorites">
            {/* <SavedJobsClient /> */}
          </TabsContent>

          <TabsContent value="user_settings">
            {/* <UserSettingsClient /> */}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
