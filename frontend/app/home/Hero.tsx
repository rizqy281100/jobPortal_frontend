"use client";

import * as React from "react";
import Link from "next/link";
import {
  Play,
  Briefcase,
  Building2,
  Stethoscope,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Hero({
  title = (
    <>
      Find, Connect &<br className="hidden md:block" />
      Build Your <span className="text-primary">Career Path</span>
    </>
  ),
  subtitle = "Discover opportunities from top companies and organizations across multiple industries in Uzbekistan.",
}: {
  title?: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <section className="relative flex min-h-screen items-center">
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-12 md:py-16 lg:py-20">
        {/* Centered content */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-4 text-sm md:text-base text-muted-foreground">
            {subtitle}
          </p>

          {/* Buttons (equal size) */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 min-w-[160px] px-6 dark:text-white"
            >
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 min-w-[160px] px-6"
            >
              <Link
                href="/how-it-works"
                className="flex items-center justify-center gap-2"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border">
                  <Play className="h-3.5 w-3.5" />
                </span>
                How It Works?
              </Link>
            </Button>
          </div>
        </div>

        {/* Trending Industries */}
        <div className="mx-auto mt-16 max-w-5xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Trending Industries
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore the most popular industries and career paths
          </p>

          {/* Mobile: 2 cols (2x2); Tablet+ : 4 cols (1 row) */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <IndustryCard
              icon={<Briefcase className="h-5 w-5" />}
              title="Technology"
              desc="Software, data, AI, and product roles."
              href="/industries/technology"
            />
            <IndustryCard
              icon={<Building2 className="h-5 w-5" />}
              title="Finance"
              desc="Banking, fintech, and corporate finance."
              href="/industries/finance"
            />
            <IndustryCard
              icon={<Stethoscope className="h-5 w-5" />}
              title="Healthcare"
              desc="Clinical, research, and health operations."
              href="/industries/healthcare"
            />
            <IndustryCard
              icon={<ShoppingBag className="h-5 w-5" />}
              title="Retail"
              desc="E-commerce, merchandising, and operations."
              href="/industries/retail"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function IndustryCard({
  icon,
  title,
  desc,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Card className="transition-colors hover:border-primary/50">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0">
        <div className="grid h-9 w-9 place-items-center rounded-lg border bg-background">
          {icon}
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{desc}</p>
        <Button asChild variant="link" className="px-0">
          <Link href={href} className="mt-1">
            Explore jobs →
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
