import { redirect } from "next/navigation";
import Link from "next/link";
import { emailExists, requestPasswordReset } from "@/lib/dummy-users";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Reset Password" };

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const error = searchParams?.error;

  async function resetAction(formData: FormData) {
    "use server";

    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();

    if (!email) redirect("/reset-password?error=Email is required");
    if (!emailExists(email)) redirect("/reset-password?error=Email not found");

    // Dummy reset handler
    requestPasswordReset(email);
    redirect("/login?success=We’ve sent a reset link to your email");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-background/80">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border bg-card/95 p-6 shadow-lg sm:p-8">
          {/* HEADER */}
          <div className="mb-6 text-center space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Reset your password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter the email you used to sign up and we’ll send you a reset
              link. This is a demo flow.
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </p>
          )}

          {/* FORM */}
          <form action={resetAction} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                autoComplete="email"
              />
            </div>

            <Button
              type="submit"
              className="group relative inline-flex w-full items-center justify-center rounded-md px-4 py-2.5 text-sm text-white dark:text-white font-medium"
            >
              Send reset link
              <BottomGradient />
            </Button>
          </form>

          {/* FOOTER */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-primary underline-offset-4 hover:underline"
            >
              Back to login
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
