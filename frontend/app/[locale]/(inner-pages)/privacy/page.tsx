"use client";

import { useTranslations } from "next-intl";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type SectionKey =
  | "userResponsibilities"
  | "limitations"
  | "companyRights"
  | "privacy";

const SECTION_CONFIG: { key: SectionKey; itemKeys: string[] }[] = [
  { key: "userResponsibilities", itemKeys: ["1", "2", "3", "4"] },
  { key: "limitations", itemKeys: ["1", "2", "3"] },
  { key: "companyRights", itemKeys: ["1", "2", "3", "4"] },
  { key: "privacy", itemKeys: ["1", "2", "3", "4"] },
];

export default function PrivacyPolicyPage() {
  const t = useTranslations("Privacy");

  return (
    <section className="container mx-auto max-w-4xl px-4 py-10 md:py-12 lg:py-16">
      {/* Header */}
      <header className="mb-8 space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground md:text-base leading-relaxed">
          {t("intro")}
        </p>
      </header>

      {/* Sections */}
      <div className="space-y-6 md:space-y-8">
        {SECTION_CONFIG.map(({ key, itemKeys }) => (
          <Card
            key={key}
            className="border border-border/70 shadow-sm bg-card/60"
          >
            <CardHeader className="pb-3">
              <h2 className="text-lg font-semibold md:text-xl">
                {t(`${key}.heading`)}
              </h2>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed md:text-[0.95rem]">
              <p className="text-muted-foreground">{t(`${key}.description`)}</p>

              <Separator className="my-2" />

              <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
                {itemKeys.map((itemKey) => (
                  <li key={itemKey}>{t(`${key}.items.${itemKey}`)}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
