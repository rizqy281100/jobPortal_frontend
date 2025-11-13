"use client";
import React, { useEffect } from "react";
import Hero from "@/app/home/Hero";
import GetHired from "@/app/home/GetHired";
import CTA from "@/components/general/CTA";
import AuthToast from "./AuthToast";
import { useSearchParams } from "next/dist/client/components/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const logoutSuccess = searchParams.get("logout");

  useEffect(() => {
    if (logoutSuccess === "success") {
      // Refresh paksa browser
      window.location.replace("/");
    }
  }, [logoutSuccess]);
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
