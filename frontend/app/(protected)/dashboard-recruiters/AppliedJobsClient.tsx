"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React from "react";
import { useState } from "react";
import TagsInput from "@/components/TagsInput";

type AppliedItem = {
  id: string;
  title?: string;
  company?: string;
  appliedAt: string;
  status?: "active" | "expired";
  locationText?: string;
  salaryText?: string;
  typeLabel?: string;
  policyLabel?: string;
  href?: string;
};

const LS_KEY = "appliedJobs";
const PAGE_SIZE = 8;

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PostJobForm() {
  const [currency, setCurrency] = useState("USD");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]); // ← dari TagsInput

  return (
    <form className="space-y-6">
      {/* Job Title */}
      <div>
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Add job title, role, vacancies etc"
          className="mt-1"
        />
      </div>

      {/* Tags */}
      <div>
        <TagsInput value={tags} onChange={setTags} />
      </div>

      {/* Salary */}
      <div>
        <Label>Salary</Label>
        <div className="grid md:grid-cols-3 gap-4 mt-1">
          {/* Min Salary */}
          <Input name="minSalary" type="number" placeholder="Minimum salary" />

          {/* Max Salary */}
          <Input name="maxSalary" type="number" placeholder="Maximum salary" />

          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="IDR">IDR</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="SGD">SGD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          Salary type: <span className="font-medium">Fixed (per month)</span>
        </p>
      </div>
      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
        <h3 className="font-semibold text-base col-span-3">
          Advanced Information
        </h3>

        {/* Education */}
        <div className="col-span-1">
          <Label>Education</Label>
          <Select>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="highschool">High School</SelectItem>
              <SelectItem value="diploma">Diploma</SelectItem>
              <SelectItem value="bachelor">Bachelor’s Degree</SelectItem>
              <SelectItem value="master">Master’s Degree</SelectItem>
              <SelectItem value="doctorate">Doctorate (PhD)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Experience */}
        <div className="col-span-1">
          <Label>Experience</Label>
          <Select>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">No Experience</SelectItem>
              <SelectItem value="1">1+ Year</SelectItem>
              <SelectItem value="2">2+ Years</SelectItem>
              <SelectItem value="3">3+ Years</SelectItem>
              <SelectItem value="5">5+ Years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job Type */}
        <div className="col-span-1">
          <Label>Job Type</Label>
          <Select>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fulltime">Full Time</SelectItem>
              <SelectItem value="parttime">Part Time</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Vacancies */}
        <div className="col-span-1">
          <Label htmlFor="vacancies">Vacancies</Label>
          <Input
            id="vacancies"
            name="vacancies"
            type="number"
            placeholder="Number of vacancies"
            className="mt-1"
          />
        </div>

        {/* Expiration Date */}
        <div className="col-span-1">
          <Label htmlFor="expiration">Expiration Date</Label>
          <Input
            id="expiration"
            name="expiration"
            type="date"
            className="mt-1"
          />
        </div>

        {/* Job Level (optional if needed) */}
        <div className="col-span-1">
          <Label>Job Level</Label>
          <Select>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entry">Entry Level</SelectItem>
              <SelectItem value="mid">Mid Level</SelectItem>
              <SelectItem value="senior">Senior Level</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="director">Director</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Location */}
      <div>
        <Label>Location</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
          <Input name="country" placeholder="Country" />
          <Input name="city" placeholder="City" />
        </div>
      </div>

      {/* Job Description */}
      <div>
        <Label htmlFor="description">Job Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Add your job description..."
          className="mt-1 min-h-[150px]"
        />
      </div>

      {/* Submit */}
      <Button type="submit" className="mt-2">
        Post Job →
      </Button>
    </form>
  );
}
