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
  Save,
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
import Skills from "@/components/Skills";
import SkillsSelector from "@/components/Skills";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchableSelect } from "@/components/SearchableSelect";

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
  resume_url: string; // blob/object URL
  is_default?: boolean;
  uploadedAt: string;
};
type PortfolioItem = {
  id: string;
  title: string;
  description?: string;
  link?: string;
};

type Education = {
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

interface WorkExp {
  id: string;
  company_name: string;
  job_title: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description?: string;
}
/* ========================================================================
   Constants & Helpers
   ======================================================================== */
const LS_KEY = "userSettings_v1";
const SKILLS_BANK_KEY = "skillsBank_v1";
const UPLOAD_LOCATION = process.env.NEXT_PUBLIC_UPLOAD;
const RESUME_LIMIT = 3;
const PORTFOLIO_LIMIT = 10;
const CV_MAX_MB = 5;
const PHOTO_MAX_MB = 1;

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
  const [nationality, setNationality] = React.useState("");
  const [nationalitiesOptions, setNationalitiesOptions] = React.useState<
    string[]
  >([]);
  const [skillsBank, setSkillsBank] = React.useState<string[]>([]);
  const [work, setWork] = React.useState<WorkItem[]>([]);
  const [edu, setEdu] = React.useState<EduItem[]>([]);
  const [certs, setCerts] = React.useState<CertItem[]>([]);
  const [saving, setSaving] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { accessToken, user } = useAppSelector((state) => state.auth);
  React.useEffect(() => {
    const fetchMe = async () => {
      try {
        setLoading(true);
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

        setNationality(data.nationality_id);
        setAvatarPreviewFromBackend(data.avatar_url ?? null);
        // kalau backend punya data resume, portfolio, dll → masukkan di sini
        setResumes(data.resumes ?? []);
        setPortfolios(data.portfolios ?? []);
        setSkillsSel(data.worker_skills ?? []);
        setWork(data.work_experiences ?? []);
        setEducations(data.educations ?? []);
        // dst...
      } catch (err) {
        console.error("Failed to fetch /users/workers/me", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNationalities();
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
  // add resume
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
        resume_url: data.resume_url, // FULL URL: backend harus kirim atau frontend prefix sendiri
        is_default: data.is_default, // TRUE/FALSE
        uploadedAt: data.created_at,
      };

      // ADD TO STATE
      setResumes((r) => [...r, item]);
      if (item.is_default) {
        setResumes((prev) =>
          prev.map((x) => ({
            ...x,
            is_default: x.id === item.id,
          }))
        );
      }
      toast.success("Resume added successfully.");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to Upload Resume.");
      // alert(err?.response?.data?.message ?? "Failed to upload resume");
    }
  };

  const removeResume = async (id: string) => {
    try {
      setSaving(true);

      // 1. Hapus di backend
      await api.delete(`/workers/resumes/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // 2. Update local state jika berhasil
      setResumes((prev) => {
        const next = prev.filter((x) => x.id !== id);

        // kalau tidak ada primary, jadikan resume pertama jadi primary
        if (!next.some((x) => x.is_default) && next[0]) {
          next[0] = { ...next[0], is_default: true };
          setPrimaryResume(next[0].id);
        }

        return next;
      });
      toast.success("Resume removed successfully.");
    } catch (err) {
      toast.error("Failed to delete Resume.");
      console.error("Failed to delete resume:", err);
    } finally {
      setSaving(false);
    }
  };

  const setPrimaryResume = async (id: string) => {
    try {
      setSaving(true);

      // ambil data resume yang mau dijadikan primary
      const target = resumes.find((r) => r.id === id);

      if (!target) return;

      // 1. Call PUT ke server
      await api.put(
        `/workers/resumes/${id}`,
        {
          title: target.title,
          resume_url: target.resume_url,
          is_default: true,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // 2. Update state lokal setelah sukses
      setResumes((prev) =>
        prev.map((x) => ({
          ...x,
          is_default: x.id === id,
        }))
      );

      toast.success("Resume " + target.title + " set as Primary.");
    } catch (err) {
      toast.success("Failed to set primary resume");
      console.error("Failed to set primary resume:", err);
    } finally {
      setSaving(false);
    }
  };

  const addPortfolio = async () => {
    if (portfolios.length >= PORTFOLIO_LIMIT) {
      toast.error(`Max ${PORTFOLIO_LIMIT} portfolios`);
      return;
    }

    // create langsung ke backend
    const res = await api.post(
      "/workers/portfolios",
      {
        title: "Title Here",
        description: "Description Here",
        link: "Link here",
        is_public: true,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // backend harus return id portfolio
    const newItem = res.data.data;

    setPortfolios((p) => [{ ...newItem }, ...p]);
  };

  const savePortfolio = async (pf: PortfolioItem) => {
    if (!pf.id || pf.id.startsWith("pf_")) {
      // jika ID masih lokal, artinya belum disimpan ke backend → lakukan POST
      const res = await api.post(
        "/workers/portfolios",
        {
          title: pf.title,
          description: pf.description,
          link: pf.link,
          is_public: true,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const saved = res.data.data;

      // replace id lokal dengan id backend
      setPortfolios((p) => p.map((x) => (x.id === pf.id ? { ...saved } : x)));

      return toast.success("Portfolio created.");
    }

    // Jika sudah punya ID backend → lakukan update
    await api.put(
      `/workers/portfolios/${pf.id}`,
      {
        title: pf.title,
        description: pf.description,
        link: pf.link,
        is_public: true,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    toast.success("Portfolio updated.");
  };

  const deletePortfolio = async (pf: PortfolioItem) => {
    // jika belum pernah disimpan ke backend → hapus lokal saja
    if (!pf.id || pf.id.startsWith("pf_")) {
      setPortfolios((p) => p.filter((x) => x.id !== pf.id));
      return;
    }

    // delete ke backend
    await api.delete(`/workers/portfolios/${pf.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // hapus lokal
    setPortfolios((p) => p.filter((x) => x.id !== pf.id));
    toast.success("Portfolio Removed");
  };

  const fetchNationalities = async (keyword = "") => {
    const query = keyword ? `?search=${encodeURIComponent(keyword)}` : "";

    const res = await api.get(`/nationalities${query}`, {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    });
    console.log("data nation: ", res.data);
    const mapped = res?.data.data.map(
      (item: { id: string; country_name: string; iso_alpha3: string }) => ({
        value: item.id,
        label: item.country_name + ` (${item.iso_alpha3})`,
      })
    );
    setNationalitiesOptions(mapped);
  };

  const workExpDebounce: Record<string, NodeJS.Timeout> = {};

  const addWorkExp = async () => {
    const res = await api.post(
      "/workers/work-exp",
      {
        company_name: "Company Name Here",
        job_title: "Job Title Here",
        start_date: new Date("2020-1-1").toISOString().split("T")[0],
        end_date: null,
        is_current: false,
        description: "Desc",
      },
      {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      }
    );

    const newItem = res.data.data;

    setWork((p) => [newItem, ...p]);
  };

  const updateWorkExp = (id: string, patch: Partial<WorkExp>) => {
    // update state lokal
    setWork((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));

    // kalau id masih lokal → belum boleh update
    if (id.startsWith("we_")) return;

    // clear debounce sebelumnya
    if (workExpDebounce[id]) clearTimeout(workExpDebounce[id]);

    // auto save setelah 500ms
    workExpDebounce[id] = setTimeout(async () => {
      const current = work.find((x) => x.id === id);
      if (!current) return;

      await api.put(
        `/workers/work-exp/${id}`,
        {
          company_name: current.company_name,
          job_title: current.job_title,
          start_date: current.start_date,
          end_date: current.end_date,
          is_current: current.is_current,
          description: current.description,
        },
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        }
      );
    }, 1000);
  };

  const saveWorkExp = async (item: WorkExp) => {
    // Jika id masih dummy (belum tersimpan)
    if (item.id.startsWith("we_")) {
      const res = await api.post(
        "/workers/work-exp",
        {
          company_name: item.company_name,
          job_title: item.job_title,
          start_date: item.start_date,
          end_date: item.end_date,
          is_current: item.is_current,
          description: item.description,
        },
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        }
      );

      const saved = res.data.data;

      setWork((p) => p.map((x) => (x.id === item.id ? saved : x)));

      toast.success("Work experience created.");
      return;
    }

    // Jika sudah ada id backend → update
    await api.put(
      `/workers/work-exp/${item.id}`,
      {
        company_name: item.company_name,
        job_title: item.job_title,
        start_date: item.start_date,
        end_date: item.end_date,
        is_current: item.is_current,
        description: item.description,
      },
      {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      }
    );

    toast.success("Work experience updated.");
  };
  const deleteWorkExp = async (item: WorkExp) => {
    if (item.id.startsWith("we_")) {
      // delete lokal saja
      setWork((p) => p.filter((x) => x.id !== item.id));
      return;
    }

    await api.delete(`/workers/work-exp/${item.id}`, {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    });

    setWork((p) => p.filter((x) => x.id !== item.id));
  };

  const handleCurrentToggle = async (id: string, checked: boolean) => {
    setWork((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              is_current: checked,
              end_date: checked ? null : item.end_date,
            }
          : { ...item, is_current: false }
      )
    );

    // --- API CALLS ---
    const updatedList = work.map((item) =>
      item.id === id
        ? {
            ...item,
            is_current: checked,
            end_date: checked ? null : item.end_date,
          }
        : { ...item, is_current: false }
    );

    // update selected item
    if (!id.startsWith("we_")) {
      await api.put(
        `/workers/work-exp/${id}`,
        {
          company_name: updatedList.find((w) => w.id === id)?.company_name,
          job_title: updatedList.find((w) => w.id === id)?.job_title,
          start_date: updatedList.find((w) => w.id === id)?.start_date,
          end_date: updatedList.find((w) => w.id === id)?.end_date,
          is_current: true,
          description: updatedList.find((w) => w.id === id)?.description,
        },
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        }
      );
    }

    // uncheck others
    for (const item of updatedList) {
      if (item.id !== id && !item.id.startsWith("we_")) {
        await api.put(
          `/workers/work-exp/${item.id}`,
          {
            company_name: item.company_name,
            job_title: item.job_title,
            start_date: item.start_date,
            end_date: item.end_date,
            is_current: false,
            description: item.description,
          },
          {
            headers: {
              Authorization: accessToken ? `Bearer ${accessToken}` : "",
            },
          }
        );
      }
    }
  };

  const [educations, setEducations] = React.useState<Education[]>([]);

  const eduDebounce: Record<string, NodeJS.Timeout> = {};

  const addEducation = async () => {
    const res = await api.post(
      "/workers/educations",
      {
        institution_name: "Institution",
        degree: "Degree",
        major: "Major",
        start_date: new Date("2020-1-1").toISOString().split("T")[0],
        end_date: null,
        is_current: false,
        description: "",
      },
      {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      }
    );

    const newItem = res.data.data;
    setEducations((p) => [newItem, ...p]);
  };

  const updateEducation = (id: string, patch: Partial<Education>) => {
    setEducations((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));

    if (id.startsWith("edu_")) return;

    if (eduDebounce[id]) clearTimeout(eduDebounce[id]);

    eduDebounce[id] = setTimeout(async () => {
      const current = educations.find((x) => x.id === id);
      if (!current) return;

      // date validation
      if (
        current.start_date &&
        current.end_date &&
        new Date(current.start_date) > new Date(current.end_date)
      ) {
        console.warn("Invalid date range: start_date > end_date");
        return;
      }

      await api.put(
        `/workers/educations/${id}`,
        {
          institution_name: current.institution_name,
          degree: current.degree,
          major: current.major,
          start_date: current.start_date,
          end_date: current.end_date,
          is_current: current.is_current,
          description: current.description,
        },
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        }
      );
    }, 500);
  };

  const saveEducation = async (item: Education) => {
    if (item.id.startsWith("edu_")) {
      const res = await api.post(
        "/workers/educations",
        {
          institution_name: item.institution_name,
          degree: item.degree,
          major: item.major,
          start_date: item.start_date,
          end_date: item.end_date,
          is_current: item.is_current,
          description: item.description,
        },
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        }
      );

      const saved = res.data.data;
      setEducations((p) => p.map((x) => (x.id === item.id ? saved : x)));

      toast.success("Education created.");
      return;
    }

    await api.put(
      `/workers/educations/${item.id}`,
      {
        institution_name: item.institution_name,
        degree: item.degree,
        major: item.major,
        start_date: item.start_date,
        end_date: item.end_date,
        is_current: item.is_current,
        description: item.description,
      },
      {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      }
    );

    toast.success("Education updated.");
  };

  const deleteEducation = async (item: Education) => {
    if (item.id.startsWith("edu_")) {
      setEducations((p) => p.filter((x) => x.id !== item.id));
      return;
    }

    await api.delete(`/workers/educations/${item.id}`, {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    });

    setEducations((p) => p.filter((x) => x.id !== item.id));

    toast.success("Education Removed");
  };

  const toggleCurrentEducation = async (id: string, checked: boolean) => {
    // update UI first
    const updated = educations.map((item) =>
      item.id === id
        ? {
            ...item,
            is_current: checked,
            end_date: checked ? null : item.end_date,
          }
        : { ...item, is_current: false }
    );

    setEducations(updated);

    // update selected education
    const selected = updated.find((x) => x.id === id);
    if (!selected) return;

    if (!id.startsWith("edu_")) {
      await api.put(
        `/workers/educations/${id}`,
        {
          institution_name: selected.institution_name,
          degree: selected.degree,
          major: selected.major,
          start_date: selected.start_date,
          end_date: selected.end_date,
          is_current: true,
          description: selected.description,
        },
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        }
      );
    }

    // update others to false
    for (const item of updated) {
      if (item.id !== id && !item.id.startsWith("edu_")) {
        await api.put(
          `/workers/educations/${item.id}`,
          {
            institution_name: item.institution_name,
            degree: item.degree,
            major: item.major,
            start_date: item.start_date,
            end_date: item.end_date,
            is_current: false,
            description: item.description,
          },
          {
            headers: {
              Authorization: accessToken ? `Bearer ${accessToken}` : "",
            },
          }
        );
      }
    }
  };

  /** ===== Certs ===== */
  const addCert = () =>
    setCerts((c) => [
      { id: uid("c_"), title: "", issuer: "", issueDate: "" },
      ...c,
    ]);
  const updateCert = (id: string, patch: Partial<CertItem>) =>
    setCerts((c) => c.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const removeCert = (id: string) =>
    setCerts((c) => c.filter((x) => x.id !== id));
  const onCertFile = (id: string, f?: File) => {
    if (!f) return;
    if (!/application\/pdf/i.test(f.type)) return alert("Only PDF allowed");
    if (f.size > 2 * 1024 * 1024) return alert("Max 2 MB");
    const url = URL.createObjectURL(f);
    updateCert(id, { url, fileName: f.name, size: f.size });
  };

  /* -------------------------------------------------------------------- */
  /* View                                                                 */
  /* -------------------------------------------------------------------- */
  return (
    <div className="space-y-8">
      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
            <p className="text-white text-sm font-medium">Loading...</p>
          </div>
        </div>
      )}
      <Tabs defaultValue="Personal Information">
        <TabsList className="justify-items-start w-full">
          <TabsTrigger value="Personal Information" className="w-full">
            Personal Information
          </TabsTrigger>
          <TabsTrigger value="Resumes" className="w-full">
            Resumes
          </TabsTrigger>
          <TabsTrigger value="Work and Education" className="w-full">
            Work and Education
          </TabsTrigger>
        </TabsList>
        {/* =================== SECTION 1: PERSONAL INFO =================== */}
        <TabsContent value="Personal Information">
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
                    onValueChange={(v) =>
                      setProfile((p) => ({ ...p, gender: v }))
                    }
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
                  <SearchableSelect
                    options={nationalitiesOptions}
                    value={nationality}
                    onChange={setNationality}
                    placeholder="Your Nationality..."
                    onSearch={(text: string) => {
                      fetchNationalities(text);
                    }}
                    className="mt-1"
                  />
                  <input type="hidden" name="industry" value={nationality} />
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
                    onValueChange={(v) =>
                      setProfile((p) => ({ ...p, marital: v }))
                    }
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
                  className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </section>
        </TabsContent>

        {/* =================== SECTION 2: RESUME / PORTFOLIO / SKILLS =================== */}

        <TabsContent value="Resumes">
          <section className="rounded-[20px] border bg-card/80 p-6 sm:p-8">
            <header className="mb-6 border-b pb-2">
              <h3 className="text-xl font-semibold">
                Resume, Portfolios, and Skills
              </h3>
              <p className="text-sm text-muted-foreground">
                Upload resume, portfolios, and skills to boost up your profile
                to recruiters.
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
                        {cv.is_default && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                            <Star className="h-3 w-3" /> Primary
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2 md:mt-0">
                      <a
                        href={UPLOAD_LOCATION + cv.resume_url}
                        target="_blank"
                        className="rounded-lg border px-3 py-1.5 text-sm hover:bg-accent"
                      >
                        Preview
                      </a>
                      <button
                        onClick={() => setPrimaryResume(cv.id)}
                        className={`rounded-lg border px-3 py-1.5 text-sm ${
                          cv.is_default
                            ? "bg-primary text-white"
                            : "hover:bg-accent"
                        }`}
                      >
                        {cv.is_default ? "Primary" : "Set Primary"}
                      </button>
                      <button
                        onClick={() => removeResume(cv.id)}
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
                  onClick={addPortfolio}
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
                      onChange={(value) =>
                        setPortfolios((prev) =>
                          prev.map((x) =>
                            x.id === pf.id ? { ...x, title: value } : x
                          )
                        )
                      }
                      placeholder="Project title..."
                    />
                    <LabeledInput
                      label="Description (optional)"
                      value={pf.description ?? ""}
                      onChange={(value) =>
                        setPortfolios((prev) =>
                          prev.map((x) =>
                            x.id === pf.id ? { ...x, description: value } : x
                          )
                        )
                      }
                      placeholder="Short description..."
                    />
                    <LabeledInput
                      label="Portfolio Link"
                      required
                      value={pf.link ?? ""}
                      onChange={(value) =>
                        setPortfolios((prev) =>
                          prev.map((x) =>
                            x.id === pf.id ? { ...x, link: value } : x
                          )
                        )
                      }
                      placeholder="Portfolio link..."
                    />
                  </div>

                  <div className="flex justify-between">
                    {/* Save */}
                    <button
                      onClick={() => savePortfolio(pf)}
                      className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm text-primary hover:bg-primary/10"
                    >
                      <Save className="h-4 w-4" /> Save
                    </button>

                    {/* Remove */}
                    <button
                      onClick={() => deletePortfolio(pf)}
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
            <SkillsSelector value={skillsSel} onChange={setSkillsSel} />

            <div className="mt-6 flex justify-end">
              <button
                onClick={onSave}
                className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Save Changes
              </button>
            </div>
          </section>
        </TabsContent>
        {/* =================== SECTION 3: Work / Edu / Certs =================== */}
        <TabsContent value="Work and Education">
          <section className="rounded-2xl border bg-card/80 p-5 sm:p-6">
            {/* Work Experience */}

            <div className="mb-6 mt-8 space-y-3 rounded-xl border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-lg font-semibold">Work Experience</h4>

                <button
                  onClick={addWorkExp}
                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-accent"
                >
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>

              {work.map((exp) => (
                <div
                  key={exp.id}
                  className="rounded-xl border p-3 space-y-3 mb-2"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <LabeledInput
                      label="Company Name"
                      required
                      value={exp.company_name}
                      onChange={(v) =>
                        updateWorkExp(exp.id, { company_name: v })
                      }
                      placeholder="Company name..."
                    />

                    <LabeledInput
                      label="Job Title"
                      required
                      value={exp.job_title}
                      onChange={(v) => updateWorkExp(exp.id, { job_title: v })}
                      placeholder="Job title..."
                    />

                    {/* Start Date */}
                    <LabeledInput
                      label="Start Date"
                      type="date"
                      value={exp.start_date ? exp.start_date.slice(0, 10) : ""}
                      onChange={(v) => updateWorkExp(exp.id, { start_date: v })}
                    />

                    {/* End Date */}
                    <LabeledInput
                      label="End Date"
                      type="date"
                      disabled={exp.is_current}
                      value={
                        exp.end_date && !exp.is_current
                          ? exp.end_date.slice(0, 10)
                          : ""
                      }
                      onChange={(v) => updateWorkExp(exp.id, { end_date: v })}
                    />
                  </div>

                  {/* Toggle current job */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={exp.is_current}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        handleCurrentToggle(exp.id, checked);
                      }}
                    />
                    <label className="text-sm">I currently work here</label>
                  </div>

                  {/* Description */}
                  <LabeledInput
                    label="Description (optional)"
                    value={exp.description ?? ""}
                    onChange={(v) => updateWorkExp(exp.id, { description: v })}
                    placeholder="Short description..."
                  />

                  {/* Buttons */}
                  <div className="flex justify-between mt-2">
                    <button
                      onClick={() => saveWorkExp(exp)}
                      className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm text-primary hover:bg-primary/10"
                    >
                      <Save className="h-4 w-4" /> Save
                    </button>

                    <button
                      onClick={() => deleteWorkExp(exp)}
                      className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  </div>
                </div>
              ))}

              {!work.length && (
                <div className="rounded-xl border p-4 text-sm text-muted-foreground">
                  No work experience added.
                </div>
              )}
            </div>
            {/* Education */}
            <div className="mt-8 mb-6 space-y-3 rounded-xl border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-lg font-semibold">Education</h4>

                <button
                  onClick={addEducation}
                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-accent"
                >
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>

              {educations.map((edu) => (
                <div key={edu.id} className="rounded-xl border p-3 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <LabeledInput
                      label="Institution Name"
                      required
                      value={edu.institution_name}
                      onChange={(v) =>
                        updateEducation(edu.id, { institution_name: v })
                      }
                      placeholder="Institution name..."
                    />

                    <LabeledInput
                      label="Degree"
                      required
                      value={edu.degree}
                      onChange={(v) => updateEducation(edu.id, { degree: v })}
                      placeholder="Degree..."
                    />

                    <LabeledInput
                      label="Major"
                      value={edu.major ?? ""}
                      onChange={(v) => updateEducation(edu.id, { major: v })}
                      placeholder="Major..."
                    />

                    {/* Start Date */}
                    <LabeledInput
                      label="Start Date"
                      type="date"
                      value={edu.start_date ? edu.start_date.slice(0, 10) : ""}
                      onChange={(v) =>
                        updateEducation(edu.id, { start_date: v })
                      }
                    />

                    {/* End Date */}
                    <LabeledInput
                      label="End Date"
                      type="date"
                      disabled={edu.is_current}
                      value={
                        edu.end_date && !edu.is_current
                          ? edu.end_date.slice(0, 10)
                          : ""
                      }
                      onChange={(v) => updateEducation(edu.id, { end_date: v })}
                    />
                  </div>

                  {/* is_current */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={edu.is_current}
                      onChange={(e) =>
                        toggleCurrentEducation(edu.id, e.target.checked)
                      }
                    />
                    <label className="text-sm">I currently study here</label>
                  </div>

                  <LabeledInput
                    label="Description (optional)"
                    value={edu.description ?? ""}
                    onChange={(v) =>
                      updateEducation(edu.id, { description: v })
                    }
                    placeholder="Short description..."
                  />

                  {/* Buttons */}
                  <div className="flex justify-between mt-2">
                    <button
                      onClick={() => saveEducation(edu)}
                      className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm text-primary hover:bg-primary/10"
                    >
                      <Save className="h-4 w-4" /> Save
                    </button>

                    <button
                      onClick={() => deleteEducation(edu)}
                      className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  </div>
                </div>
              ))}

              {!educations.length && (
                <div className="rounded-xl border p-4 text-sm text-muted-foreground">
                  No education added.
                </div>
              )}
            </div>

            {/* Certifications */}
            <div>
              <div className="mb-2 mt-8 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Certifications (PDF, max 2MB)
                </h3>
                <button
                  onClick={addCert}
                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-accent"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {certs.map((c) => (
                  <div key={c.id} className="rounded-xl border p-3">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <LabeledInput
                        label="Title/Name"
                        required
                        value={c.title}
                        onChange={(v) => updateCert(c.id, { title: v })}
                        placeholder="e.g. AWS Certified Solutions Architect"
                      />
                      <LabeledInput
                        label="Issuer"
                        required
                        value={c.issuer}
                        onChange={(v) => updateCert(c.id, { issuer: v })}
                        placeholder="e.g. Amazon Web Services"
                      />
                      <LabeledInput
                        label="Issue date"
                        type="date"
                        value={c.issueDate ?? ""}
                        onChange={(v) => updateCert(c.id, { issueDate: v })}
                      />
                      <LabeledInput
                        label="Expiry date"
                        type="date"
                        value={c.expiryDate ?? ""}
                        onChange={(v) => updateCert(c.id, { expiryDate: v })}
                      />
                    </div>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-muted-foreground">
                        {c.fileName ? (
                          <>
                            {c.fileName} · {c.size ? fmtSize(c.size) : ""}
                          </>
                        ) : (
                          <>No file</>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-accent">
                          <Upload className="h-4 w-4" />
                          Upload PDF
                          <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={(e) =>
                              onCertFile(c.id, e.target.files?.[0])
                            }
                          />
                        </label>
                        {c.url && (
                          <a
                            href={c.url}
                            target="_blank"
                            className="rounded-lg border px-3 py-1.5 text-sm hover:bg-accent"
                          >
                            Preview
                          </a>
                        )}
                        <button
                          className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => removeCert(c.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {!certs.length && (
                  <div className="rounded-xl border p-4 text-sm text-muted-foreground">
                    No Certification Data.
                  </div>
                )}
              </div>
            </div>

            {/* <div className="mt-6 flex justify-end">
              <button
                onClick={onSave}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
              >
                Save Changes
              </button>
            </div> */}
          </section>
        </TabsContent>
      </Tabs>
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
  disabled,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
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
        onChange={(e) => onChange(e.target.value)}
        value={value}
        placeholder={placeholder}
      />
    </div>
  );
}
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
        <span className="text-[10px] float-right mt-2 ">
          {" "}
          maximum file size: 5 MB
        </span>
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
          className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
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
