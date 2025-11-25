"use client";

import * as React from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Upload,
  Star,
  X,
  Calendar as CalIcon,
  Building2,
  Pencil,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios"; // sesuaikan path-mu
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

/* ========================================================================
   Types
   ======================================================================== */
type Gender = "male" | "female" | "others";
type Marital = "married" | "not married" | "divorced" | "widowed";
type Religion =
  | "islam"
  | "kristen"
  | "katolik"
  | "hindu"
  | "buddha"
  | "konghucu"
  | "judaism"
  | "others";

type ResumeItem = {
  id: string;
  title: string;
  fileName: string;
  size: number;
  url: string; // blob/object URL
  primary?: boolean;
  uploadedAt: string;
};
type PortfolioItem = {
  id: string;
  title: string;
  description?: string;
  link?: string;
};
type WorkItem = {
  id: string;
  company: string;
  title: string;
  start: string; // ISO
  end?: string; // ISO
  current?: boolean;
};

type EduItem = {
  id: string;
  school: string;
  degree: string;
  major?: string;
  start: string;
  end?: string;
  current?: boolean;
};
type CertItem = {
  id: string;
  title: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  fileName?: string;
  size?: number;
  url?: string;
};

type Profile = {
  id: string;
  userId?: string;
  name: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  nationality?: string;
  religion?: string;
  marital?: string;
  address?: string;
  summary?: string;
  currentSalary?: string; // "12,2" numeric as string
  expectedSalary?: string;
  photoUrl?: string;
  photoName?: string;
};

/* ========================================================================
   Constants & Helpers
   ======================================================================== */
const LS_KEY = "userSettings_v1";
const SKILLS_BANK_KEY = "skillsBank_v1";

const RESUME_LIMIT = 3;
const PORTFOLIO_LIMIT = 10;
const CV_MAX_MB = 5;
const PHOTO_MAX_MB = 1;

const COUNTRIES = [
  { id: "1", name: "Uzbekistan" },
  { id: "2", name: "Kazakhstan" },
  { id: "3", name: "Kyrgyzstan" },
  { id: "4", name: "Tajikistan" },
  { id: "5", name: "Turkmenistan" },
  { id: "6", name: "Russia" },
  { id: "7", name: "Turkey" },
  { id: "8", name: "India" },
  { id: "9", name: "Indonesia" },
  { id: "10", name: "Malaysia" },
  { id: "11", name: "United States" },
  { id: "12", name: "United Kingdom" },
  { id: "13", name: "Germany" },
  { id: "14", name: "France" },
];

const UZ_INSTITUTIONS = [
  "National University of Uzbekistan (Tashkent)",
  "Tashkent University of Information Technologies",
  "Tashkent State Technical University",
  "Tashkent State University of Economics",
  "Tashkent Pediatric Medical Institute",
  "Samarkand State University",
  "Bukhara State University",
  "Fergana State University",
  "Andijan State University",
  "Urgench State University",
  "Namangan State University",
  "Tashkent State Transport University",
];

const UZ_DEGREES = [
  "Secondary School",
  "Lyceum / College",
  "Bachelor",
  "Master",
  "Doctorate (PhD)",
  "Post-Doctorate",
];

function uid(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 10);
}
function fmtSize(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}
function toMoney12_2(v: string) {
  const cleaned = v.replace(/[^\d.,]/g, "");
  const [L, R = ""] = cleaned.replace(",", ".").split(".");
  const left = L.replace(/^0+(\d)/, "$1").slice(0, 12);
  const right = R.slice(0, 2);
  return right ? `${left}.${right}` : left;
}
function getSkillsBank(): string[] {
  try {
    const raw = localStorage.getItem(SKILLS_BANK_KEY);
    const arr: string[] = raw ? JSON.parse(raw) : [];
    return Array.from(new Set(arr.map((s) => s.trim()).filter(Boolean))).sort();
  } catch {
    return [];
  }
}
function saveSkillsBank(list: string[]) {
  localStorage.setItem(SKILLS_BANK_KEY, JSON.stringify(list));
}

const setPrimaryResume = (id: string) =>
  setResumes((r) => r.map((x) => ({ ...x, primary: x.id === id })));
const removeResume = (id: string) =>
  setResumes((r) => {
    const next = r.filter((x) => x.id !== id);
    if (!next.some((x) => x.primary) && next[0]) next[0].primary = true;
    return [...next];
  });
/* ========================================================================
   Main Component
   ======================================================================== */
export default function UserSettingsClient() {
  /** ===== load & persist ===== */
  const [profile, setProfile] = React.useState<Profile>({ name: "" });
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const [avatarPreviewFromBackend, setAvatarPreviewFromBackend] =
    React.useState<string | null>(null);
  const [resumes, setResumes] = React.useState<ResumeItem[]>([]);
  const [portfolios, setPortfolios] = React.useState<PortfolioItem[]>([]);
  const [skillsSel, setSkillsSel] = React.useState<string[]>([]);
  const [skillsBank, setSkillsBank] = React.useState<string[]>([]);
  const [work, setWork] = React.useState<WorkItem[]>([]);
  const [edu, setEdu] = React.useState<EduItem[]>([]);
  const [certs, setCerts] = React.useState<CertItem[]>([]);

  const { accessToken, user } = useAppSelector((state) => state.auth);
  React.useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/users/workers/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }); // sesuaikan path-mu
        const data = res.data?.data;
        console.log("Fetched /users/workers/me:", data);
        if (!data) return;

        // mapping JSON backend -> state frontend
        setProfile({
          id: data.id ?? "",
          userId: data.user_id ?? "",
          name: data.name ?? "",
          email: data.email ?? "",
          phone: data.telephone ?? "",
          dob: data.date_of_birth
            ? new Date(data.date_of_birth).toISOString().split("T")[0]
            : "",
          gender: String(data.gender_id ?? ""),
          nationality: String(data.nationality_id ?? ""),
          religion: String(data.religion_id ?? ""),
          marital: String(data.marriage_status_id ?? ""),
          address: data.address ?? "",
          summary: data.profile_summary ?? "",
          currentSalary: data.current_salary ?? "",
          expectedSalary: data.expected_salary ?? "",
          photoUrl: data.avatar_url ?? "",
          photoName: data.avatar_name ?? "",
        });

        setAvatarPreviewFromBackend(data.avatar_url ?? null);
        // kalau backend punya data resume, portfolio, dll → masukkan di sini
        setResumes(data.resumes ?? []);
        // setWork(data.work_history ?? []);
        // dst...
      } catch (err) {
        console.error("Failed to fetch /users/workers/me", err);
      }
    };

    fetchMe();
  }, []);
  const onSave = async () => {
    try {
      const formData = new FormData();

      formData.append("name", profile.name ?? "");
      formData.append("id", profile.id ?? "");
      formData.append("telephone", profile.phone ?? "");
      formData.append("date_of_birth", profile.dob ?? "");
      formData.append("gender_id", profile.gender ?? "");
      formData.append("nationality_id", profile.nationality ?? "");
      formData.append("religion_id", profile.religion ?? "");
      formData.append("marriage_status_id", profile.marital ?? "");
      formData.append("address", profile.address ?? "");
      formData.append("profile_summary", profile.summary ?? "");
      formData.append("current_salary", profile.currentSalary ?? "");
      formData.append("expected_salary", profile.expectedSalary ?? "");

      // Jika kamu punya upload foto
      if (avatarFile) {
        formData.append("avatar", avatarFile ?? "");
      }

      const res = await api.put("/users/workers/me", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // local cache update
      // persist();
      const json = await res.data;
      console.log("PUT /users/workers/me response:", json);
      if (json?.code !== 200) {
        // alert("Failed to update: " + json.message);
        toast.error("Failed to update: " + json.message);
      } else {
        // alert("Profile updated successfully.");
        toast.success("Profile updated successfully.");
      }
    } catch (err: any) {
      console.error("PUT /users/workers/me error:", err);
      toast.error(err?.response?.data?.message || "Failed to update profile");
    }
  };
  const addResume = async (file: File, title: string, isDefault: boolean) => {
    try {
      // VALIDATION
      if (!/application\/pdf/i.test(file.type))
        return alert("Only PDF allowed");

      if (file.size > CV_MAX_MB * 1024 * 1024)
        return alert(`Max size ${CV_MAX_MB}MB`);

      if (!title.trim()) return alert("Title is required");

      if (resumes.length >= RESUME_LIMIT)
        return alert(`Max ${RESUME_LIMIT} resumes`);

      // --- BUILD FORM DATA ---
      const formData = new FormData();
      formData.append("resume", file); // <== backend must expect 'resume'
      formData.append("title", title.trim());
      formData.append("is_default", isDefault ? "true" : "false");

      // --- CALL BACKEND ---
      const res = await api.post("/workers/resumes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = res.data?.data;

      // EXAMPLE JSON expected from backend:
      // {
      //   id: UUID,
      //   worker_id: UUID,
      //   resume_url: "/uploads/resumes/xxx.pdf",
      //   title: "My Resume",
      //   is_default: false,
      //   created_at: "...",
      //   updated_at: "..."
      // }

      const item: ResumeItem = {
        id: data.id,
        title: data.title,
        fileName: file.name,
        size: file.size,
        url: data.resume_url, // FULL URL: backend harus kirim atau frontend prefix sendiri
        primary: data.is_default, // TRUE/FALSE
        uploadedAt: data.created_at,
      };

      // ADD TO STATE
      setResumes((r) => [item, ...r]);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message ?? "Failed to upload resume");
    }
  };

  /* -------------------------------------------------------------------- */
  /* View                                                                 */
  /* -------------------------------------------------------------------- */
  return (
    <div className="space-y-8">
      {/* =================== SECTION 1: PERSONAL INFO =================== */}
      <section className="rounded-[20px] border bg-card/80 p-5 sm:p-6">
        <header className="pb-2 border-b mb-4">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <p className="text-sm text-muted-foreground">
            Complete your profile to make it easier for recruiters to get to
            know you.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px,1fr]">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="h-[180px] w-[180px] rounded-full bg-muted/60 ring-1 ring-border overflow-hidden grid place-items-center text-muted-foreground">
              {avatarPreviewFromBackend || avatarPreview ? (
                <img
                  src={
                    avatarPreviewFromBackend
                      ? `http://localhost:5000${avatarPreviewFromBackend}`
                      : avatarPreview
                  }
                  alt="Avatar Preview"
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <span className="text-base">No Photo</span>
              )}
            </div>

            <div className="text-center text-xs leading-snug text-muted-foreground">
              Profile Photo Max. 2MB
              <br />
              (.png/.jpg/.jpeg format)
            </div>

            <label className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm hover:bg-accent cursor-pointer">
              <Upload className="h-4 w-4" />
              Upload
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setAvatarFile(f);
                    setAvatarPreview(URL.createObjectURL(f));
                  }
                }}
              />
            </label>

            {profile.photoName && (
              <div className="max-w-[220px] truncate text-xs text-muted-foreground">
                {profile.photoName}
              </div>
            )}
          </div>

          {/* Form kanan */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* REQUIRED */}
            <Field label="Your Name" required>
              <Input
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Enter your name here..."
                value={profile.name}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, name: e.target.value }))
                }
              />
            </Field>

            {/* REQUIRED */}
            <Field label="Your Email" required>
              <Input
                type="email"
                className="w-full rounded-lg border px-3 py-2 disabled:bg-muted/50"
                placeholder="Enter your email here..."
                value={profile.email ?? ""}
                disabled
                onChange={(e) =>
                  setProfile((p) => ({ ...p, email: e.target.value }))
                }
              />
            </Field>

            {/* REQUIRED */}
            <Field label="Date of Birth" required>
              <div className="relative">
                <CalIcon className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="w-full rounded-lg border px-3 py-2 pr-9"
                  value={profile.dob ?? ""}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, dob: e.target.value }))
                  }
                />
              </div>
            </Field>

            {/* REQUIRED */}
            <Field label="Phone" required>
              <Input
                maxLength={20}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Enter your phone number here..."
                value={profile.phone ?? ""}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, phone: e.target.value }))
                }
              />
            </Field>

            {/* REQUIRED */}
            <Field label="Gender" required>
              <Select
                value={profile.gender ?? ""}
                onValueChange={(v) => setProfile((p) => ({ ...p, gender: v }))}
              >
                <SelectTrigger className="w-full rounded-lg border px-3 py-2">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Male</SelectItem>
                  <SelectItem value="2">Female</SelectItem>
                  <SelectItem value="3">Others</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* REQUIRED */}
            <Field label="Nationality" required>
              <Select
                value={profile.nationality ?? ""}
                onValueChange={(v) =>
                  setProfile((p) => ({ ...p, nationality: v }))
                }
              >
                <SelectTrigger className="w-full rounded-lg border px-3 py-2">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>

                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* REQUIRED */}
            <Field label="Religion" required>
              <Select
                value={profile.religion ?? ""}
                onValueChange={(v) =>
                  setProfile((p) => ({ ...p, religion: v }))
                }
              >
                <SelectTrigger className="w-full rounded-lg border px-3 py-2">
                  <SelectValue placeholder="Select your religion" />
                </SelectTrigger>

                <SelectContent>
                  {[
                    { id: "1", name: "Islam" },
                    { id: "2", name: "Christian" },
                    { id: "3", name: "Catholic" },
                    { id: "4", name: "Hindu" },
                    { id: "5", name: "Buddha" },
                    { id: "6", name: "Other" },
                  ].map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name.charAt(0).toUpperCase() + r.name.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* REQUIRED */}
            <Field label="Status" required>
              <Select
                value={profile.marital ?? ""}
                onValueChange={(v) => setProfile((p) => ({ ...p, marital: v }))}
              >
                <SelectTrigger className="w-full rounded-lg border px-3 py-2">
                  <SelectValue placeholder="Select marriage status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="1">Married</SelectItem>
                  <SelectItem value="2">Not married</SelectItem>
                  <SelectItem value="3">Divorced</SelectItem>
                  <SelectItem value="4">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* OPTIONAL */}
            <Field label="Current Salary (optional)">
              <Input
                inputMode="decimal"
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Enter your current salary here..."
                value={profile.currentSalary ?? ""}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    currentSalary: toMoney12_2(e.target.value),
                  }))
                }
              />
            </Field>

            {/* OPTIONAL */}
            <Field label="Expected Salary (optional)">
              <Input
                inputMode="decimal"
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Enter your expected salary here..."
                value={profile.expectedSalary ?? ""}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    expectedSalary: toMoney12_2(e.target.value),
                  }))
                }
              />
            </Field>

            {/* REQUIRED */}
            <Field label="Address" required full>
              <Input
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Enter your address here..."
                value={profile.address ?? ""}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, address: e.target.value }))
                }
              />
            </Field>

            {/* REQUIRED */}
            <Field label="Profile Summary" required full>
              <Textarea
                rows={4}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Enter your profile summary here..."
                value={profile.summary ?? ""}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, summary: e.target.value }))
                }
              />
            </Field>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={onSave}
              className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
            >
              Save Changes
            </button>
          </div>
        </div>
      </section>

      {/* =================== SECTION 2: RESUME / PORTFOLIO / SKILLS =================== */}
      <section className="rounded-[20px] border bg-card/80 p-6 sm:p-8">
        <header className="mb-6 border-b pb-2">
          <h3 className="text-xl font-semibold">
            Resume, Portfolios, and Skills
          </h3>
          <p className="text-sm text-muted-foreground">
            Upload resume, portfolios, and skills to boost up your profile to
            recruiters.
          </p>
        </header>

        {/* Resume block */}
        <div className="space-y-4 rounded-xl border p-4">
          <UploadResume onAdd={addResume} />

          {/* Resume List */}
          <div className="space-y-3">
            {resumes.map((cv) => (
              <div
                key={cv.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between rounded-xl border p-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{cv.title}</p>
                    {cv.primary && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                        <Star className="h-3 w-3" /> Primary
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {cv.fileName} · {fmtSize(cv.size)}
                  </p>
                </div>

                <div className="mt-2 flex flex-wrap gap-2 md:mt-0">
                  <a
                    href={cv.url}
                    target="_blank"
                    className="rounded-lg border px-3 py-1.5 text-sm hover:bg-accent"
                  >
                    Preview
                  </a>
                  <button
                    // onClick={() => setPrimaryResume(cv.id)}
                    className={`rounded-lg border px-3 py-1.5 text-sm ${
                      cv.primary ? "bg-primary text-white" : "hover:bg-accent"
                    }`}
                  >
                    {cv.primary ? "Primary" : "Set Primary"}
                  </button>
                  <button
                    // onClick={() => removeResume(cv.id)}
                    className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            ))}
            {!resumes.length && (
              <div className="rounded-xl border p-4 text-sm text-muted-foreground">
                No resume uploaded yet.
              </div>
            )}
          </div>
        </div>

        {/* Portfolio */}
        <div className="mt-8 space-y-3 rounded-xl border p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-lg font-semibold">Portfolio (optional)</h4>
            <button
              // onClick={addPortfolio}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-accent"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>

          {portfolios.map((pf) => (
            <div key={pf.id} className="rounded-xl border p-3 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <LabeledInput
                  label="Title"
                  required
                  value={pf.title}
                  // onChange={(v) => updatePortfolio(pf.id, { title: v })}
                  placeholder="Project title..."
                />
                <LabeledInput
                  label="Description (optional)"
                  value={pf.description ?? ""}
                  // onChange={(v) => updatePortfolio(pf.id, { description: v })}
                  placeholder="Short description..."
                />
                <LabeledInput
                  label="Portfolio Link"
                  required
                  value={pf.link ?? ""}
                  // onChange={(v) => updatePortfolio(pf.id, { link: v })}
                  placeholder="Portfolio link..."
                />
              </div>
              <div className="flex justify-end">
                <button
                  // onClick={() => removePortfolio(pf.id)}
                  className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              </div>
            </div>
          ))}

          {!portfolios.length && (
            <div className="rounded-xl border p-4 text-sm text-muted-foreground">
              No portfolio added.
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="mt-8">
          <h4 className="font-semibold mb-2">Skills (at least 5 skills)</h4>
          <div className="relative">
            <input
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Search or add your skills..."
              // value={skillQuery}
              // onChange={(e) => setSkillQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  // addSkill(skillQuery);
                }
              }}
            />
            {/* {!!suggestions.length && (
              <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border bg-card shadow">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-accent"
                    onClick={() => addSkill(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )} */}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {skillsSel.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm"
              >
                {s}
                <button
                  className="rounded-full p-0.5 hover:bg-accent"
                  // onClick={() => removeSkill(s)}
                  aria-label={`remove ${s}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
            {!skillsSel.length && (
              <span className="text-sm text-muted-foreground">
                No skills added.
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onSave}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Save Changes
          </button>
        </div>
      </section>
    </div>
  );
}

/* ========================================================================
   Small reusable form bits
   ======================================================================== */
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Label + input/select wrapper (1 field) */
function Field({
  label,
  required,
  full,
  children,
}: React.PropsWithChildren<{
  label: string;
  required?: boolean;
  full?: boolean;
}>) {
  return (
    <div className={`space-y-1 ${full ? "md:col-span-2" : ""}`}>
      <label className="block text-xs font-medium">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
    </div>
  );
}

/** Simple labeled input */
function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        type={type}
        className="w-full rounded-lg border px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

/** Styled native select with placeholder & options */
// function Select({
//   value,
//   onChange,
//   options,
//   placeholder = "Select…",
// }: {
//   value: string;
//   onChange: (v: string) => void;
//   options: { label: string; value: string }[];
//   placeholder?: string;
// }) {
//   return (
//     <div className="relative">
//       <select
//         className="w-full appearance-none rounded-lg border px-3 py-2 pr-8"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//       >
//         <option value="">{placeholder}</option>
//         {options.map((o) => (
//           <option key={o.value} value={o.value}>
//             {o.label}
//           </option>
//         ))}
//       </select>
//       <svg
//         className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
//         viewBox="0 0 20 20"
//         fill="currentColor"
//         aria-hidden="true"
//       >
//         <path
//           fillRule="evenodd"
//           d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 011.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
//           clipRule="evenodd"
//         />
//       </svg>
//     </div>
//   );
// }

/** Upload form for Resume */

function UploadResume({
  onAdd,
}: {
  onAdd: (file: File, title: string, isDefault: boolean) => void;
}) {
  const [file, setFile] = React.useState<File | null>(null);
  const [title, setTitle] = React.useState("");
  const [isDefault, setIsDefault] = React.useState(false);

  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border p-3 md:grid-cols-[1fr,1fr,auto]">
      {/* File */}
      <div>
        <label className="mb-1 block text-xs font-medium">
          Upload PDF <span className="text-red-600">*</span>
        </label>
        <label className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-sm hover:bg-accent">
          <span className="truncate">
            {file ? `${file.name} · ${fmtSize(file.size)}` : "Choose file…"}
          </span>
          <Upload className="h-4 w-4" />
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      {/* Title */}
      <div>
        <label className="mb-1 block text-xs font-medium">
          Title <span className="text-red-600">*</span>
        </label>
        <input
          className="w-full rounded-lg border px-3 py-2"
          placeholder="e.g. Professional Resume"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Toggle is_default */}
      <div className="flex flex-col justify-end gap-2">
        <label className="flex items-center gap-2 text-xs font-medium">
          <Switch checked={isDefault} onCheckedChange={setIsDefault} />
          Set as default
        </label>

        {/* Button */}
        <button
          className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          onClick={() => {
            if (!file) return alert("Choose a PDF file");
            if (!title.trim()) return alert("Title is required");

            onAdd(file, title, isDefault);

            // reset
            setFile(null);
            setTitle("");
            setIsDefault(false);
          }}
        >
          Add Resume
        </button>
      </div>
    </div>
  );
}
