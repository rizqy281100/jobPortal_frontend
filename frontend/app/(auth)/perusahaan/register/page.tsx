// app/(auth)/perusahaan/register/page.tsx
import { redirect } from "next/navigation";

async function registerCompanyAction(formData: FormData) {
  "use server";

  const namaPerusahaan = formData.get("nama_perusahaan")?.toString() || "";
  const noHp = formData.get("no_hp")?.toString() || "";
  const alamat = formData.get("alamat")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  // Dummy: anggap pendaftaran berhasil
  console.log("Daftar perusahaan:", {
    namaPerusahaan,
    noHp,
    alamat,
    email,
    password,
  });

  // redirect ke halaman login dengan query 'registered=1'
  redirect("/perusahaan/login?registered=1");
}

export default function CompanyRegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Daftar Perusahaan
        </h1>

        <form action={registerCompanyAction} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="nama_perusahaan"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Perusahaan
            </label>
            <input
              type="text"
              id="nama_perusahaan"
              name="nama_perusahaan"
              required
              className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm"
            />
          </div>

          <div>
            <label
              htmlFor="no_hp"
              className="block text-sm font-medium text-gray-700"
            >
              Nomor Handphone
            </label>
            <input
              type="tel"
              id="no_hp"
              name="no_hp"
              required
              className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm"
            />
          </div>

          <div>
            <label
              htmlFor="alamat"
              className="block text-sm font-medium text-gray-700"
            >
              Alamat Perusahaan
            </label>
            <textarea
              id="alamat"
              name="alamat"
              rows={2}
              required
              className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm"
            ></textarea>
          </div>

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
              className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm"
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
              className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 transition-colors"
          >
            Daftar
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <a
            href="/perusahaan/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Masuk di sini
          </a>
        </p>
      </div>
    </div>
  );
}
