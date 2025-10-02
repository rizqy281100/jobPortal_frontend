import Hero from "@/app/home/Hero";
import GetHired from "@/app/home/GetHired";
import CTA from "@/components/general/CTA";
import AuthToast from "./AuthToast";

export default function Home() {
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
