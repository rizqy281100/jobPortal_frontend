import { redirect } from "next/navigation";
import Link from "next/link";
import { createUser, emailExists } from "@/lib/dummy-users";
import { createSession } from "@/lib/session";

export const metadata = { title: "Register" };

export default function RegisterPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const error = searchParams?.error;

  async function registerAction(formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") || "");

    if (!name || !email || !password)
      redirect("/register?error=Please fill all fields");
    if (emailExists(email))
      redirect("/register?error=Email already registered");

    const user = createUser({ name, email, password });
    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    redirect("/jobs");
  }

  return (
    <main className="container mx-auto max-w-md px-4 py-10">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold">Create account</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Registrasi dummy (non-persisten).
        </p>

        {error && (
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </p>
        )}

        <form action={registerAction} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm">Full name</label>
            <input
              name="name"
              required
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Create account
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}
