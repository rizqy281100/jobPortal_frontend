"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ChevronRight } from "lucide-react";

const popularKeys = [
  "noPersonalInfo",
  "jobTitle",
  "photo",
  "verifiedCompany",
  "applyWithoutResume",
  "noCalls",
  "deleteData",
  "cantLogin",
  "hideResume",
] as const;

const categories = [
  { key: "jobSearch", count: 15 },
  { key: "myResume", count: 18 },
  { key: "createResume", count: 18 },
  { key: "response", count: 15 },
  { key: "auth", count: 10 },
  { key: "newJobs", count: 5 },
] as const;

export default function HelpPage() {
  const t = useTranslations("Help");

  return (
    <section className="container mx-auto max-w-6xl px-4 py-8 sm:py-10 md:px-6 md:py-12 lg:py-16">
      <div className="grid gap-8 md:gap-10 lg:grid-cols-[minmax(0,2.1fr),minmax(0,1fr)]">
        {/* ================= LEFT ================= */}
        <div>
          {/* Title + search */}
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("title")}
          </h1>

          <div className="mt-4">
            <Input
              type="search"
              placeholder={t("searchPlaceholder")}
              className="h-11 text-sm sm:text-base"
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="jobSeekers" className="mt-4 sm:mt-6">
            <TabsList className="h-9 gap-1 rounded-full bg-muted p-1">
              <TabsTrigger
                value="jobSeekers"
                className="rounded-full px-4 py-1 text-xs sm:text-sm"
              >
                {t("tabs.jobSeekers")}
              </TabsTrigger>
              <TabsTrigger
                value="employers"
                className="rounded-full px-4 py-1 text-xs sm:text-sm"
              >
                {t("tabs.employers")}
              </TabsTrigger>
            </TabsList>

            {/* ------ Job seekers tab ------ */}
            <TabsContent
              value="jobSeekers"
              className="mt-5 space-y-6 sm:space-y-8"
            >
              {/* Most popular (Accordion) */}
              <Card className="border-none shadow-sm sm:border">
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-base font-semibold sm:text-lg">
                      {t("popular.title")}
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      {popularKeys.length}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-1">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full divide-y divide-border/60"
                  >
                    {popularKeys.map((k) => (
                      <AccordionItem key={k} value={k} className="border-0">
                        <AccordionTrigger className="flex items-center gap-2 py-2 text-left text-sm font-normal hover:no-underline sm:py-2.5">
                          <span className="flex-1 pr-4 text-left">
                            {t(`popular.items.${k}`)}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" />
                        </AccordionTrigger>
                        <AccordionContent className="pb-3 text-xs text-muted-foreground sm:text-sm">
                          {t("popular.answerPlaceholder")}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              {/* Categories (Accordion per section) */}
              <div className="space-y-3">
                <Accordion type="multiple" className="w-full space-y-3">
                  {categories.map((cat) => (
                    <AccordionItem
                      key={cat.key}
                      value={cat.key}
                      className="overflow-hidden rounded-xl border bg-card"
                    >
                      <AccordionTrigger className="px-4 py-3 text-left text-sm font-medium hover:no-underline sm:px-5">
                        <div className="flex w-full items-center justify-between gap-2">
                          <span>{t(`categories.${cat.key}.title`)}</span>
                          <span className="text-xs text-muted-foreground">
                            {cat.count}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 text-xs text-muted-foreground sm:px-5 sm:text-sm">
                        {t("categories.answerPlaceholder")}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>

            {/* ------ Employers tab (placeholder) ------ */}
            <TabsContent value="employers" className="mt-5">
              <Card className="border-dashed">
                <CardContent className="py-6 text-sm text-muted-foreground">
                  {t("employers.placeholder")}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="space-y-4 md:space-y-5 lg:pt-9">
          <Card className="border shadow-sm">
            <CardHeader className="pb-2 sm:pb-3">
              <p className="text-sm font-semibold sm:text-base">
                {t("sidebar.cantFindTitle")}
              </p>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground sm:text-sm">
              <p>{t("sidebar.cantFindBody")}</p>
              <button
                type="button"
                className="text-sm font-medium text-primary hover:underline"
              >
                {t("sidebar.contactSupport")}
              </button>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-2 sm:pb-3">
              <p className="text-sm font-semibold sm:text-base">
                {t("sidebar.lookingForJobTitle")}
              </p>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground sm:text-sm">
              <p>{t("sidebar.lookingForJobBody")}</p>
              <button
                type="button"
                className="text-sm font-medium text-primary hover:underline"
              >
                {t("sidebar.jobGuide")}
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
