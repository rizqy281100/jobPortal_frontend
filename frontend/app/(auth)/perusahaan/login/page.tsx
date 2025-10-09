// app/(auth)/perusahaan/login/page.tsx
import { redirect } from "next/navigation";
import { verifyUser, toPublicUser } from "@/lib/dummy-users";
import { cookies } from "next/headers";

/* ========================================================================== */
/* Dummy check apakah perusahaan sudah terdaftar                              */
/* ========================================================================== */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function checkCompanyRegistered(): Promise<boolean> {
  return true;
}

/* ========================================================================== */
/* Server Action untuk login perusahaan                                       */
/* ========================================================================== */
async function loginCompanyAction(formData: FormData): Promise<void> {
  "use server";

  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const user = verifyUser(email, password);

  if (!user) {
    redirect("/perusahaan/login?error=invalid");
  }

  if (user.role !== "employer") {
    redirect("/perusahaan/login?error=forbidden");
  }

  const publicUser = toPublicUser(user);
  (await cookies()).set("session_user", JSON.stringify(publicUser), {
    httpOnly: true,
  });

redirect("/dashboard-recruiters");

}

/* ========================================================================== */
/* Component utama                                                            */
/* ========================================================================== */
export default function CompanyLoginPage() {
  // Kalau mau async check, bisa pakai useEffect client-side, bukan langsung di sini
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Login Perusahaan
        </h1>

        <form action={loginCompanyAction} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Perusahaan
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              defaultValue="aisha@example.com"
              className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              defaultValue="password"
              className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Masuk
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <a
            href="/perusahaan/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Daftar Perusahaan
          </a>
        </p>
      </div>
    </div>
  );
}
