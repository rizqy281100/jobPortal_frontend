"use client";

import React, { useEffect } from "react";

import Hero from "../home/Hero";
import GetHired from "../home/GetHired";
import CTA from "@/components/general/CTA";
import AuthToast from "./AuthToast";

import { useSearchParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale(); // locale aktif: "en", "ru", "uz", dll

  useEffect(() => {
    const logoutSuccess = searchParams.get("logout");

    if (logoutSuccess === "success") {
      // redirect ke /[locale] dan hapus query
      router.replace(`/${locale}`);
    }
  }, [searchParams, router, locale]);

  return (
    <>
      {/* toast login/logout + auto-clean query */}
      <AuthToast />

      <div>
        <Hero />
        <GetHired />
        <CTA />
      </div>
    </>
  );
}
