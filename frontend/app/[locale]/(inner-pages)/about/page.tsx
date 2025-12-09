"use client";

import { useTranslations } from "next-intl";

export default function About() {
  const t = useTranslations("About");

  return (
    <section className="relative flex h-100 w-full flex-col items-start justify-start overflow-hidden">
      <div className="mt-35 w-full">
        <h2 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-neutral-800 md:text-4xl lg:text-7xl dark:text-neutral-100">
          {t("title")}
        </h2>
        <p className="relative z-10 mx-auto mt-4 max-w-xl text-center text-neutral-800 dark:text-neutral-500">
          {t("subtitle")}
        </p>
      </div>
    </section>
  );
}
