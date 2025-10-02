"use client";

import * as React from "react";
import { UserPlus, Search, FileUp, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GetHired() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-16 md:py-12 lg:py-16">
      {/* Section heading */}
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Get Hired in <span className="text-primary">4 Quick Easy Steps</span>
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">
          The quickest and most effective way to get hired by the top firms in
          your career interest areas.
        </p>
      </div>

      {/* Steps grid */}
      <div className="mt-10 md:mt-8 lg:mt-10 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StepCard
          icon={<UserPlus className="h-6 w-6" />}
          iconClass="bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300"
          hoverClass="hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 dark:hover:border-orange-500/40"
          title="Create an Account"
          desc="Sign up for the job applicant profile, mention your qualifications, past experiences, and expertise."
        />

        <StepCard
          icon={<Search className="h-6 w-6" />}
          iconClass="bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300"
          hoverClass="hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 dark:hover:border-purple-500/40"
          title="Search Job"
          desc="Once you set your job hunting parameters, you’ll find many openings related to your career interest."
        />

        <StepCard
          icon={<FileUp className="h-6 w-6" />}
          iconClass="bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300"
          hoverClass="hover:border-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/30 dark:hover:border-sky-500/40"
          title="Upload CV/Resume"
          desc="Shortlist the right-match vacancy and apply right after by uploading your CV/Resume."
        />

        <StepCard
          icon={<Briefcase className="h-6 w-6" />}
          iconClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300"
          hoverClass="hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 dark:hover:border-emerald-500/40"
          title="Get Job"
          desc="After applying, schedule an interview, and if everything goes right, get hired faster than traditional methods."
        />
      </div>
    </section>
  );
}

function StepCard({
  icon,
  iconClass,
  hoverClass,
  title,
  desc,
}: {
  icon: React.ReactNode;
  iconClass: string;
  hoverClass: string;
  title: string;
  desc: string;
}) {
  return (
    <Card
      className={`transition-transform duration-200 ${hoverClass} hover:scale-[1.02]`}
    >
      <CardHeader className="flex flex-row items-center gap-2 space-y-0">
        <div
          className={`grid h-10 w-10 place-items-center rounded-full ${iconClass}`}
        >
          {icon}
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}
