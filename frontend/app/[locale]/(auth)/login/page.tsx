"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Eye, EyeOff, Github } from "lucide-react";

import { loginAction } from "./actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { loginRequest, loginSuccess, loginFailed } from "@/store/authSlice";
import { toast } from "sonner";

import { useLocale, useTranslations } from "next-intl";

export default function LoginPage() {
  const locale = useLocale();
  const t = useTranslations("AuthLogin");

  const searchParams = useSearchParams();
  const fromRegister = searchParams.get("fromRegister");
  const redirectRaw = searchParams.get("redirect");
  const redirectTo = redirectRaw || `/${locale}`;

  const router = useRouter();
  const dispatch = useAppDispatch();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [register, setRegister] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (fromRegister === "true") {
      setRegister(t("registerSuccess"));
    }
  }, [fromRegister, t]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    dispatch(loginRequest());

    startTransition(async () => {
      try {
        const result = await loginAction(formData);

        if (result.success && result.token && result.user) {
          dispatch(
            loginSuccess({
              accessToken: result.token,
              user: result.user,
            })
          );

          toast.success(t("toastSuccess"));
          router.push(redirectTo);
          router.refresh();
        } else {
          const errorMessage = result.message || t("toastFailed");
          setError(errorMessage);
          dispatch(loginFailed(errorMessage));
          toast.error(errorMessage);
        }
      } catch (err) {
        const errorMessage = t("toastError");
        setError(errorMessage);
        dispatch(loginFailed(errorMessage));
        toast.error(errorMessage);
      }
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-background/80 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border bg-card/95 p-6 shadow-lg sm:p-8">
          {/* HEADER */}
          <div className="mb-6 space-y-1 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>

          {/* ALERTS */}
          {error && (
            <p className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </p>
          )}
          {success && (
            <p className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-300">
              {success}
            </p>
          )}
          {register && (
            <p className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-300">
              {register}
            </p>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <LabelInputContainer className="mb-1">
              <Label htmlFor="username">{t("emailOrUsernameLabel")}</Label>
              <Input
                id="username"
                name="username"
                placeholder={t("emailOrUsernamePlaceholder")}
                type="text"
                autoComplete="username"
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
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </LabelInputContainer>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                {/* tempat "remember me" kalau nanti mau nambah */}
              </div>
              <Link
                href={`/${locale}/reset-password`}
                className="text-primary underline-offset-4 hover:underline"
              >
                {t("forgotPassword")}
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="group relative inline-flex w-full items-center justify-center gap-1 rounded-md px-4 py-2.5 text-sm font-medium dark:text-white"
            >
              {isPending ? t("buttonLoading") : t("buttonIdle")}
              <BottomGradient />
            </Button>
          </form>

          {/* OR + SOCIAL */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Separator className="flex-1" />
              <span>{t("orContinueWith")}</span>
              <Separator className="flex-1" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="inline-flex w-full items-center justify-center gap-2 text-sm"
            >
              <Github className="h-4 w-4" />
              {t("github")}
            </Button>
          </div>

          {/* FOOTER LINKS */}
          <div className="mt-6 flex items-center justify-center text-xs text-muted-foreground">
            <p>
              {t("tosPrefix")}{" "}
              <Link
                href={`/${locale}/terms`}
                className="underline underline-offset-4 hover:text-primary"
              >
                {t("tosTerms")}
              </Link>{" "}
              {t("tosAnd")}{" "}
              <Link
                href={`/${locale}/privacy`}
                className="underline underline-offset-4 hover:text-primary"
              >
                {t("tosPrivacy")}
              </Link>
              .
            </p>
          </div>

          <div className="mt-3 flex items-center justify-center text-xs text-muted-foreground">
            <span>{t("noAccount")}</span>
            <Link
              href={`/${locale}/register`}
              className="ml-1 font-medium text-primary underline-offset-4 hover:underline"
            >
              {t("createAccount")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ===== Helper components ===== */

const BottomGradient = () => {
  return (
    <>
      <span className="pointer-events-none absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      <span className="pointer-events-none absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-1.5", className)}>
    {children}
  </div>
);
