"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
} from "@tabler/icons-react";
import { Eye, EyeOff } from "lucide-react";

import { registerAction } from "./actions";
import { useLocale, useTranslations } from "next-intl";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("AuthRegister");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const result = await registerAction(formData);

    if (result?.success) {
      setSuccess(t("successRedirect"));
      // arahkan ke login dengan prefix locale
      router.push(`/${locale}/login?fromRegister=true`);
    } else {
      setError(result?.error || t("errorGeneric"));
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        {/* HEADER */}
        <div className="mb-6 space-y-1 text-center">
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* ALERTS */}
        {error && (
          <p className="mb-4 rounded-md border border-red-300 bg-red-100 px-3 py-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-4 rounded-md border border-emerald-300 bg-emerald-100 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-300">
            {success}
          </p>
        )}

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <LabelInputContainer>
              <Label htmlFor="firstname">{t("firstNameLabel")}</Label>
              <Input
                id="firstname"
                name="firstname"
                placeholder={t("firstNamePlaceholder")}
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="lastname">{t("lastNameLabel")}</Label>
              <Input
                id="lastname"
                name="lastname"
                placeholder={t("lastNamePlaceholder")}
              />
            </LabelInputContainer>
          </div>

          <LabelInputContainer>
            <Label htmlFor="username">{t("usernameLabel")}</Label>
            <Input
              id="username"
              name="username"
              placeholder={t("usernamePlaceholder")}
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="email">{t("emailLabel")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("emailPlaceholder")}
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="password">{t("passwordLabel")}</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </LabelInputContainer>

          {/* PRIMARY BUTTON */}
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 dark:text-white"
          >
            {t("buttonSubmit")}
          </button>

          {/* DIVIDER */}
          <div className="my-6 h-[1px] w-full bg-muted" />

          {/* SOCIAL BUTTONS */}
          <div className="flex flex-col space-y-3">
            <button
              type="button"
              className="flex h-10 w-full items-center space-x-2 rounded-md border bg-muted px-4 text-sm transition hover:bg-muted/80"
            >
              <IconBrandGithubFilled className="h-4 w-4" />
              <span>{t("github")}</span>
            </button>

            <button
              type="button"
              className="flex h-10 w-full items-center space-x-2 rounded-md border bg-muted px-4 text-sm transition hover:bg-muted/80"
            >
              <IconBrandGoogleFilled className="h-4 w-4 text-red-500" />
              <span>{t("google")}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);
