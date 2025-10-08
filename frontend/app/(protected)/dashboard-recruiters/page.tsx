import { readSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function DashboardRecruitersPage() {
  const session = await readSession();

  // kalau belum login, lempar ke halaman login perusahaan
  if (!session) redirect("/perusahaan/login");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Dashboard Recruiter
        </h1>
        <p className="text-gray-600 mb-6">
          Selamat datang, <span className="font-medium">{session?.email}</span>
        </p>

        {/* Tab navigasi */}
        <Tabs defaultValue="lowongan" className="w-full">
          <TabsList className="bg-gray-100 p-1 rounded-md mb-4">
            <TabsTrigger value="lowongan">Lowongan</TabsTrigger>
            <TabsTrigger value="pelamar">Pelamar</TabsTrigger>
            <TabsTrigger value="profil">Profil Perusahaan</TabsTrigger>
          </TabsList>

          {/* Konten tab */}
          <TabsContent value="lowongan">
            <div className="p-4 border rounded-md">
              <h2 className="text-lg font-semibold mb-2">Lowongan Aktif</h2>
              <p className="text-gray-600">
                Belum ada lowongan. Tambahkan lowongan baru untuk menarik kandidat!
              </p>
            </div>
          </TabsContent>

          <TabsContent value="pelamar">
            <div className="p-4 border rounded-md">
              <h2 className="text-lg font-semibold mb-2">Data Pelamar</h2>
              <p className="text-gray-600">
                Belum ada pelamar untuk saat ini.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="profil">
            <div className="p-4 border rounded-md">
              <h2 className="text-lg font-semibold mb-2">Profil Perusahaan</h2>
              <p className="text-gray-600 mb-4">
                Perbarui informasi perusahaan Anda agar terlihat lebih profesional.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Edit Profil
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
