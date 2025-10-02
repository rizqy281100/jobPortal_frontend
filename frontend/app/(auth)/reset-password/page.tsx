import { redirect } from "next/navigation";
import Link from "next/link";
import { emailExists, requestPasswordReset } from "@/lib/dummy-users";

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

    requestPasswordReset(email); // no-op (dummy)
    redirect("/login?success=Reset link sent to your email");
  }

  return (
    <main className="container mx-auto max-w-md px-4 py-10">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold">Reset password</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Masukkan email—kami kirim tautan reset (dummy).
        </p>

        {error && (
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </p>
        )}

        <form action={resetAction} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Send reset link
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link
            href="/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
