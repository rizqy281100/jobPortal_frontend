"use client";
import { use, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Timer, Layers, Map } from "lucide-react";
import { toast } from "sonner";
import { makeHref } from "@/lib/locale";
import { useLocale } from "next-intl";

const UPLOAD_LOCATION = process.env.NEXT_PUBLIC_UPLOAD;

export default function JobPostPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, accessToken } = useAppSelector((state) => state.auth);

  const [job, setJob] = useState<any>(null);
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  // FETCH DATA
  useEffect(() => {
    async function fetchResumes() {
      if (!user) return;
      try {
        const r = await api.get("/workers/resumes", {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        });
        setResumes(r.data.data || []);
      } catch (e) {}
    }

    async function fetchJob() {
      try {
        const res = await api.get(`/job-posts/${id}`);

        const tags = await api.get(`/job-posts/${id}/tags`);
        setJob({ ...res.data.data, tags: tags.data.data });
        console.log("job ", res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchResumes();
    fetchJob();
  }, [id, user, accessToken]);
  const locale = useLocale();
  // HANDLE APPLY
  const handleApply = () => {
    if (!user) {
      router.push(
        makeHref(
          locale,
          `/login?redirect=${encodeURIComponent(
            makeHref(locale, `/jobs/${id}`)
          )}`
        )
      );
      return;
    }

    if (user.role === "recruiter") {
      alert("Recruiters cannot apply to job posts.");
      return;
    }

    setApplyOpen(true);
  };
  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="text-sm">Loading job details…</p>
        </div>
      </div>
    );
  if (!job)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <svg
              className="h-6 w-6 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 9.172a4 4 0 015.656 5.656M6 6l12 12"
              />
            </svg>
          </div>

          <h2 className="text-lg font-semibold">Job not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The job you’re looking for doesn’t exist or may have been removed.
          </p>

          <button
            onClick={() => window.history.back()}
            className="mt-5 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            ← Go back
          </button>
        </div>
      </div>
    );

  return (
    <>
      {/* APPLY DIALOG */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply to this job</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Resume</p>
              <Select value={selectedResume} onValueChange={setSelectedResume}>
                <SelectTrigger>
                  <SelectValue placeholder="Select resume" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.title || r.file_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Cover Letter</p>
              <Textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={5}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                (async () => {
                  if (!selectedResume) return alert("Please select a resume");

                  try {
                    await api.post(
                      `/job-posts/${id}/apply`,
                      {
                        resume_id: selectedResume,
                        cover_letter: coverLetter,
                        application_status_id: 1,
                      },
                      {
                        headers: {
                          Authorization: accessToken
                            ? `Bearer ${accessToken}`
                            : "",
                        },
                      }
                    );

                    setApplyOpen(false);
                    // router.refresh();
                    // router.push(`/jobs/${id}`);
                    toast.success("Job Applied!");
                  } catch (err) {
                    alert("Failed to submit application");
                    console.error(err);
                  }
                })();
              }}
            >
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PAGE LAYOUT */}
      <div className="container mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT SECTION */}
        <div className="md:col-span-2 space-y-6 ">
          <div className="flex items-center gap-4">
            <img
              src={UPLOAD_LOCATION + job.avatar_url}
              className="w-28 h-28 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">{job.title}</h1>
              <p className="text-muted-foreground">{job.company_name}</p>
            </div>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-lg">Job Description</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6 ">
          <Card>
            <CardContent className="px-6 space-y-3 grid grid-cols-10 gap-4 ">
              <div className="col-span-5 self-center">
                <h2 className="font-semibold text-lg ">
                  Salary ({job.currency})
                </h2>
                <p className="text-xl font-bold">
                  {job.salary_min} - {job.salary_max}
                </p>
                <p className="text-muted-foreground text-sm">
                  {job.salary_type?.toUpperCase()} salary
                </p>
              </div>
              <div className="col-span-1">
                <Separator orientation="vertical"></Separator>
              </div>
              <div className="col-span-4 justify-items-center">
                <div>
                  <Map className="w-15 h-15 text-blue-500"></Map>
                </div>
                <h2 className="font-semibold text-lg">Job Location</h2>
                <p className="font-medium text-sm">{job.location}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pr-6 space-y-3 text-sm">
              <h2 className="font-semibold text-xl">Job Overview</h2>
              <div className="grid grid-cols-14 pt-3 space-y-6 justify-items-start">
                {/* <div className="space-y-2 col-span-1"> */}
                <div className="col-span-4">
                  <Calendar className="w-10 h-10 text-blue-600 mb-2" />
                  <h2 className="text-lg font-semibold">Job Posted :</h2>
                  <span className="text-md font-semibold">
                    {new Date(job.published_at).toISOString().split("T")[0]}
                  </span>
                </div>

                <div className="col-span-1">
                  <Separator orientation="vertical"></Separator>
                </div>
                <div className="col-span-4">
                  <Timer className="w-10 h-10 text-blue-600 mb-2" />
                  <h2 className="text-lg font-semibold">Job Expire in:</h2>
                  <span className="text-md font-semibold">
                    {new Date(job.deadline).toISOString().split("T")[0]}
                  </span>
                </div>

                <div className="col-span-1">
                  <Separator orientation="vertical"></Separator>
                </div>
                <div className="col-span-4">
                  <Layers className="w-10 h-10 text-blue-600 mb-2" />
                  <h2 className="text-lg font-semibold">Experience :</h2>
                  <span className="text-md font-semibold">
                    {job.experience_level}
                  </span>
                </div>
              </div>
              {/* </div> */}
            </CardContent>
          </Card>

          {job.tags?.length > 0 && (
            <Card>
              <CardContent className="px-6 space-y-3">
                <h2 className="font-semibold text-lg">Job Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      className="px-3 py-1 rounded-full text-white"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {user?.role !== "recruiter" && (
            <Button
              className="w-full"
              onClick={handleApply}
              disabled={job?.applied}
              variant={job?.applied ? "secondary" : "default"}
            >
              {job?.applied ? "Applied" : "Apply Now"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
