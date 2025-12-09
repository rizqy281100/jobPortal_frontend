"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";

export default function AuthToast() {
  const sp = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const loginOk = sp.get("login") === "success";
  const logoutOk =
    sp.get("logout") === "success" || sp.get("loggedout") === "1";

  const notice = useMemo(() => {
    if (loginOk)
      return {
        key: "login",
        type: "success" as const,
        text: "User has successfully logged in",
        ms: 1800,
      };
    if (logoutOk)
      return {
        key: "logout",
        type: "error" as const,
        text: "User has been logged out",
        ms: 1500,
      };
    return null;
  }, [loginOk, logoutOk]);

  const firedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!notice) return;

    const queryKey = `${pathname}?${sp.toString()}#${notice.key}`;
    const storeKey = "auth-toast-last";
    const last = sessionStorage.getItem(storeKey);

    if (firedRef.current === queryKey || last === queryKey) return;

    firedRef.current = queryKey;
    sessionStorage.setItem(storeKey, queryKey);

    // tampilkan toast sesuai tipe
    if (notice.type === "success") {
      toast.success(notice.text);
    } else if (notice.type === "error") {
      toast.error(notice.text);
    }

    const id = setTimeout(() => {
      router.replace("/", { scroll: true });
      router.refresh();
    }, notice.ms);

    return () => clearTimeout(id);
  }, [notice, pathname, sp, router]);

  return null;
}
