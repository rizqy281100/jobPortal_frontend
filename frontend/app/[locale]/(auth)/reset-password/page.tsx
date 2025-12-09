import { redirect } from "next/navigation";
import Link from "next/link";
import { emailExists, requestPasswordReset } from "@/lib/dummy-users";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { getTranslations } from "next-intl/server";

export const metadata = { title: "Reset Password" };

type Props = {
  params: { locale: string };
  searchParams?: { error?: string };
};

export default async function ResetPasswordPage({
  params,
  searchParams,
}: Props) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "AuthReset" });

  const errorKey = searchParams?.error;
  let errorMessage: string | null = null;

  if (errorKey === "required" || errorKey === "notFound") {
    errorMessage = t(`errors.${errorKey}`);
  }

  async function resetAction(formData: FormData) {
    "use server";

    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();

    // Base path dengan prefix locale
    const basePath = `/${locale}/reset-password`;

    if (!email) redirect(`${basePath}?error=required`);
    if (!emailExists(email)) redirect(`${basePath}?error=notFound`);

    // Dummy reset handler
    requestPasswordReset(email);

    // Redirect ke login dengan prefix locale
    redirect(`/${locale}/login?success=resetSent`);
  }

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

          {/* ERROR MESSAGE */}
          {errorMessage && (
            <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
              {errorMessage}
            </p>
          )}

          {/* FORM */}
          <form action={resetAction} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">{t("emailLabel")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder={t("emailPlaceholder")}
                autoComplete="email"
              />
            </div>

            <Button
              type="submit"
              className="group relative inline-flex w-full items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium text-white dark:text-white"
            >
              {t("submit")}
              <BottomGradient />
            </Button>
          </form>

          {/* FOOTER */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {t("backHint")}{" "}
            <Link
              href={`/${locale}/login`}
              className="text-primary underline-offset-4 hover:underline"
            >
              {t("backToLogin")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="pointer-events-none absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      <span className="pointer-events-none absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover:opacity-100" />
    </>
  );
};
