"use client";

import * as React from "react";
import {
  Plus,
  Trash2,
  Upload,
  Star,
  Calendar as CalIcon,
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
import api from "@/lib/axios";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import SkillsSelector from "@/components/Skills";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchableSelect } from "@/components/SearchableSelect";

/* ========================================================================
   Types
   ======================================================================== */
type ResumeItem = {
  id: string;
  title: string;
  fileName: string;
  size: number;
  resume_url: string;
  is_default?: boolean;
  uploadedAt: string;
};

type PortfolioItem = {
  id: string;
  title: string;
  description?: string;
  link?: string;
};

type CertificationItem = {
  id: string;
  name: string;
  url: string;
  issuer: string;
  issue_date: string | null;
  expiry_date: string | "";
  credential_id?: string | "";
  is_active: boolean | false;
  isSaved?: boolean | false; // ⬅ untuk cek apakah sudah tersimpan di server
};

type Education = {
  id: string;
  institution_name: string;
  degree: string;
  major?: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description?: string;
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
  currentSalary?: string;
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
const UPLOAD_LOCATION = process.env.NEXT_PUBLIC_UPLOAD;
const RESUME_LIMIT = 3;
const PORTFOLIO_LIMIT = 10;
const CV_MAX_MB = 5;

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

/* ========================================================================
   Main Component
   ======================================================================== */
export default function UserSettingsClient() {
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
    { value: string; label: string }[]
  >([]);
  const [certifications, setCertifications] = React.useState<
    CertificationItem[]
  >([]);

  const [educations, setEducations] = React.useState<Education[]>([]);
  const [skillsBank, setSkillsBank] = React.useState<string[]>([]);
  const [work, setWork] = React.useState<WorkItem[]>([]);
  const [edu, setEdu] = React.useState<EduItem[]>([]);
  const [certs, setCerts] = React.useState<CertItem[]>([]);
  const [saving, setSaving] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { accessToken } = useAppSelector((state) => state.auth);

  /* ====================== FETCH INITIAL DATA ====================== */
  React.useEffect(() => {
    const fetchMe = async () => {
      try {
        setLoading(true);
        const res = await api.get("/users/workers/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = res.data?.data;
        if (!data) return;

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

        setNationality(String(data.nationality_id ?? ""));
        setAvatarPreviewFromBackend(data.avatar_url ?? null);

        setResumes(data.resumes ?? []);
        setPortfolios(data.portfolios ?? []);
        setSkillsSel(data.worker_skills ?? []);
        setWork(data.work_experiences ?? []);
        setEducations(data.educations ?? []);
        setCertifications(
          (data.certifications ?? []).map((c) => ({
            ...c,
            isSaved: true, // tambahkan flag
            url: c.link,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch /users/workers/me", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNationalities();
    fetchMe();
  }, []);

  /* ========================== SAVE PROFILE ========================= */
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

      if (avatarFile) {
        formData.append("avatar", avatarFile ?? "");
      }

      const res = await api.put("/users/workers/me", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const json = res.data;
      if (json?.code !== 200) {
        toast.error("Failed to update: " + json.message);
      } else {
        toast.success("Profile updated successfully.");
      }
    } catch (err: any) {
      console.error("PUT /users/workers/me error:", err);
      toast.error(err?.response?.data?.message || "Failed to update profile");
    }
  };

  /* ============================ RESUMES ============================ */
  const addResume = async (file: File, title: string, isDefault: boolean) => {
    try {
      if (!/application\/pdf/i.test(file.type))
        return alert("Only PDF allowed");

      if (file.size > CV_MAX_MB * 1024 * 1024)
        return alert(`Max size ${CV_MAX_MB}MB`);

      if (!title.trim()) return alert("Title is required");

      if (resumes.length >= RESUME_LIMIT)
        return alert(`Max ${RESUME_LIMIT} resumes`);

      const formData = new FormData();
      formData.append("resume", file);
      formData.append("title", title.trim());
      formData.append("is_default", isDefault ? "true" : "false");

      const res = await api.post("/workers/resumes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = res.data?.data;

      const item: ResumeItem = {
        id: data.id,
        title: data.title,
        fileName: file.name,
        size: file.size,
        resume_url: data.resume_url,
        is_default: data.is_default,
        uploadedAt: data.created_at,
      };

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
    }
  };

  const removeResume = async (id: string) => {
    try {
      setSaving(true);

      await api.delete(`/workers/resumes/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setResumes((prev) => {
        const next = prev.filter((x) => x.id !== id);

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

      const target = resumes.find((r) => r.id === id);
      if (!target) return;

      await api.put(
        `/workers/resumes/${id}`,
        {
          title: target.title,
          resume_url: target.resume_url,
          is_default: true,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setResumes((prev) =>
        prev.map((x) => ({
          ...x,
          is_default: x.id === id,
        }))
      );

      toast.success("Resume " + target.title + " set as Primary.");
    } catch (err) {
      toast.error("Failed to set primary resume");
      console.error("Failed to set primary resume:", err);
    } finally {
      setSaving(false);
    }
  };

  /* =========================== PORTFOLIOS ========================== */
  const addPortfolio = async () => {
    if (portfolios.length >= PORTFOLIO_LIMIT) {
      toast.error(`Max ${PORTFOLIO_LIMIT} portfolios`);
      return;
    }

    const res = await api.post(
      "/workers/portfolios",
      {
        title: "Title Here",
        description: "Description Here",
        link: "Link here",
        is_public: true,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const newItem = res.data.data;
    setPortfolios((p) => [{ ...newItem }, ...p]);
  };

  const savePortfolio = async (pf: PortfolioItem) => {
    if (!pf.id || pf.id.startsWith("pf_")) {
      const res = await api.post(
        "/workers/portfolios",
        {
          title: pf.title,
          description: pf.description,
          link: pf.link,
          is_public: true,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const saved = res.data.data;
      setPortfolios((p) => p.map((x) => (x.id === pf.id ? { ...saved } : x)));
      return toast.success("Portfolio created.");
    }

    await api.put(
      `/workers/portfolios/${pf.id}`,
      {
        title: pf.title,
        description: pf.description,
        link: pf.link,
        is_public: true,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    toast.success("Portfolio updated.");
  };

  const deletePortfolio = async (pf: PortfolioItem) => {
    if (!pf.id || pf.id.startsWith("pf_")) {
      setPortfolios((p) => p.filter((x) => x.id !== pf.id));
      return;
    }

    await api.delete(`/workers/portfolios/${pf.id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    setPortfolios((p) => p.filter((x) => x.id !== pf.id));
    toast.success("Portfolio Removed");
  };

  /* ========================== NATIONALITIES ======================== */
  const fetchNationalities = async (keyword = "") => {
    const query = keyword ? `?search=${encodeURIComponent(keyword)}` : "";

    const res = await api.get(`/nationalities${query}`, {
      headers: { Authorization: accessToken ? `Bearer ${accessToken}` : "" },
    });

    const mapped = res?.data.data.map(
      (item: { id: string; country_name: string; iso_alpha3: string }) => ({
        value: item.id,
        label: item.country_name + ` (${item.iso_alpha3})`,
      })
    );
    setNationalitiesOptions(mapped);
  };

  /* ========================= WORK EXPERIENCE ======================= */
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
        headers: { Authorization: accessToken ? `Bearer ${accessToken}` : "" },
      }
    );

    const newItem = res.data.data;
    setWork((p) => [newItem, ...p]);
  };

  const updateWorkExp = (id: string, patch: Partial<WorkExp>) => {
    setWork((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));

    if (id.startsWith("we_")) return;

    if (workExpDebounce[id]) clearTimeout(workExpDebounce[id]);

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
        headers: { Authorization: accessToken ? `Bearer ${accessToken}` : "" },
      }
    );

    toast.success("Work experience updated.");
  };

  const deleteWorkExp = async (item: WorkExp) => {
    if (item.id.startsWith("we_")) {
      setWork((p) => p.filter((x) => x.id !== item.id));
      return;
    }

    await api.delete(`/workers/work-exp/${item.id}`, {
      headers: { Authorization: accessToken ? `Bearer ${accessToken}` : "" },
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

    const updatedList = work.map((item) =>
      item.id === id
        ? {
            ...item,
            is_current: checked,
            end_date: checked ? null : item.end_date,
          }
        : { ...item, is_current: false }
    );

    if (!id.startsWith("we_")) {
      const selected = updatedList.find((w) => w.id === id);
      if (selected) {
        await api.put(
          `/workers/work-exp/${id}`,
          {
            company_name: selected.company_name,
            job_title: selected.job_title,
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
    }

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

  /* ============================= EDUCATION ========================== */
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
        headers: { Authorization: accessToken ? `Bearer ${accessToken}` : "" },
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
        headers: { Authorization: accessToken ? `Bearer ${accessToken}` : "" },
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
      headers: { Authorization: accessToken ? `Bearer ${accessToken}` : "" },
    });

    setEducations((p) => p.filter((x) => x.id !== item.id));
    toast.success("Education Removed");
  };

  const toggleCurrentEducation = async (id: string, checked: boolean) => {
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
  // Add local only
  const addCertification = () =>
    setCertifications((p) => [
      {
        id: uid("cert_"),
        name: "",
        issuer: "",
        url: "",
        issue_date: null,
        expiry_date: "",
        credential_id: "",
        is_active: true,
        isSaved: false,
      },
      ...p,
    ]);

  // Update ONLY local state
  const updateCertification = (id: string, patch: Partial<CertificationItem>) =>
    setCertifications((p) =>
      p.map((x) => (x.id === id ? { ...x, ...patch } : x))
    );

  // Delete local OR API
  const removeCertification = async (id: string) => {
    console.log(id);
    const cert = certifications.find((c) => c.id === id);
    if (!cert) return;

    console.log(cert.isSaved);
    // if not saved yet
    if (!cert.isSaved) {
      setCertifications((p) => p.filter((x) => x.id !== id));
      return;
    }
    console.log("sampe sini");
    // if saved -> call API
    await api.delete(`/workers/cert/${id}`, {
      headers: { Authorization: accessToken ? `Bearer ${accessToken}` : "" },
    });

    setCertifications((p) => p.filter((x) => x.id !== id));
    toast.success("certifications removed");
  };

  // Manual save button
  const saveCertification = async (id: string) => {
    const cert = certifications.find((c) => c.id === id);
    if (!cert) return;

    if (!cert.name || !cert.issuer || !cert.issue_date) {
      alert("Name, Issuer and Issue Date are required.");
      return;
    }

    // If it's new (local only)
    if (!cert.isSaved) {
      const res = await api.post(
        "/workers/cert",
        {
          name: cert.name,
          issuer: cert.issuer,
          issue_date: cert.issue_date,
          link: cert.url,
          expiry_date: cert.expiry_date || null,
          credential_id: cert.credential_id || "",
          is_active: cert.is_active,
        },
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        }
      );
      // const certs = await api.get(`/workers/cert?limit=100`, {
      //   headers: { Authorization: accessToken ? `Bearer ${accessToken}` : "" },
      // });
      // console.log(certs);
      // setCertifications(certs.data);
      const saved = res.data; // backend response
      // Replace temp ID with real ID
      console.log(saved.data);
      setCertifications((prev) => {
        return prev.map((item) => {
          if (item.id !== id) return item;
          return {
            ...item, // keep UI states like isEditing
            id: saved.data.id,
            ...saved, // full backend fields
            isSaved: true,
          };
        });
      });
      // console.log()
      console.log(certifications);
      toast.success("Certifications Added");
      return;
    }

    // Update via API
    await api.put(
      `/workers/cert/${id}`,
      {
        name: cert.name,
        issuer: cert.issuer,
        issue_date: cert.issue_date,
        link: cert.url,
        expiry_date: cert.expiry_date || null,
        credential_id: cert.credential_id || "",
        is_active: cert.is_active,
      },
      {
        headers: { Authorization: accessToken ? `Bearer ${accessToken}` : "" },
      }
    );
  };

  /* -------------------------------------------------------------------- */
  /* View                                                                 */
  /* -------------------------------------------------------------------- */
  return (
    <div className="w-full space-y-8">
      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent" />
            <p className="text-white text-sm font-medium">Loading...</p>
          </div>
        </div>
      )}

      <Tabs
        defaultValue="Personal Information"
        className="w-full flex flex-col gap-4"
      >
        <TabsList className="justify-items-start w-full">
          <TabsTrigger
            value="Personal Information"
            className="
        w-full text-xs sm:text-sm rounded-md
        data-[state=active]:bg-primary
      "
          >
            Personal Info
          </TabsTrigger>

          <TabsTrigger
            value="Resumes"
            className="
        w-full text-xs sm:text-sm rounded-md
        data-[state=active]:bg-primary
      "
          >
            Resumes
          </TabsTrigger>

          <TabsTrigger
            value="Work and Education"
            className="
        w-full text-xs sm:text-sm rounded-md
        data-[state=active]:bg-primary
      "
          >
            Work & Education
          </TabsTrigger>
        </TabsList>

        {/* =================== SECTION 1: PERSONAL INFO =================== */}
        <TabsContent value="Personal Information">
          <section className="w-full rounded-2xl border bg-card/80 p-4 sm:p-6 md:p-8">
            <header className="mb-4 border-b pb-2">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <p className="text-sm text-muted-foreground">
                Complete your profile to make it easier for recruiters to get to
                know you.
              </p>
            </header>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px,1fr]">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3">
                <div className="h-[150px] w-[150px] rounded-full bg-muted/60 ring-1 ring-border overflow-hidden grid place-items-center text-muted-foreground">
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
                        setAvatarPreviewFromBackend(null);
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Your Name" required>
                  <Input
                    className="w-full"
                    placeholder="Enter your name here..."
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </Field>

                <Field label="Your Email" required>
                  <Input
                    type="email"
                    className="w-full disabled:bg-muted/60"
                    placeholder="Enter your email here..."
                    value={profile.email ?? ""}
                    disabled
                  />
                </Field>

                <Field label="Date of Birth" required>
                  <div className="relative">
                    <CalIcon className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      className="w-full pr-9"
                      value={profile.dob ?? ""}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, dob: e.target.value }))
                      }
                    />
                  </div>
                </Field>

                <Field label="Phone" required>
                  <Input
                    maxLength={20}
                    className="w-full"
                    placeholder="Enter your phone number..."
                    value={profile.phone ?? ""}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, phone: e.target.value }))
                    }
                  />
                </Field>

                <Field label="Gender" required>
                  <Select
                    value={profile.gender ?? ""}
                    onValueChange={(v) =>
                      setProfile((p) => ({ ...p, gender: v }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Male</SelectItem>
                      <SelectItem value="2">Female</SelectItem>
                      <SelectItem value="3">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Nationality" required>
                  <SearchableSelect
                    options={nationalitiesOptions}
                    value={nationality}
                    onChange={setNationality}
                    placeholder="Your nationality..."
                    onSearch={(text: string) => {
                      fetchNationalities(text);
                    }}
                    className="mt-1"
                  />
                  <input type="hidden" name="industry" value={nationality} />
                </Field>

                <Field label="Religion" required>
                  <Select
                    value={profile.religion ?? ""}
                    onValueChange={(v) =>
                      setProfile((p) => ({ ...p, religion: v }))
                    }
                  >
                    <SelectTrigger className="w-full">
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
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Status" required>
                  <Select
                    value={profile.marital ?? ""}
                    onValueChange={(v) =>
                      setProfile((p) => ({ ...p, marital: v }))
                    }
                  >
                    <SelectTrigger className="w-full">
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

                <Field label="Current Salary (optional)">
                  <Input
                    inputMode="decimal"
                    className="w-full"
                    placeholder="Current salary..."
                    value={profile.currentSalary ?? ""}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        currentSalary: toMoney12_2(e.target.value),
                      }))
                    }
                  />
                </Field>

                <Field label="Expected Salary (optional)">
                  <Input
                    inputMode="decimal"
                    className="w-full"
                    placeholder="Expected salary..."
                    value={profile.expectedSalary ?? ""}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        expectedSalary: toMoney12_2(e.target.value),
                      }))
                    }
                  />
                </Field>

                <Field label="Address" required full>
                  <Input
                    className="w-full"
                    placeholder="Enter your address..."
                    value={profile.address ?? ""}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, address: e.target.value }))
                    }
                  />
                </Field>

                <Field label="Profile Summary" required full>
                  <Textarea
                    rows={4}
                    className="w-full"
                    placeholder="Enter your profile summary..."
                    value={profile.summary ?? ""}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, summary: e.target.value }))
                    }
                  />
                </Field>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onSave}
                className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90"
              >
                Save Changes
              </button>
            </div>
          </section>
        </TabsContent>

        {/* =================== SECTION 2: RESUME / PORTFOLIO / SKILLS =================== */}
        <TabsContent value="Resumes">
          <section className="w-full rounded-2xl border bg-card/80 p-4 sm:p-6 md:p-8 space-y-8">
            <header className="border-b pb-2">
              <h3 className="text-lg font-semibold">
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
            <div className="space-y-3 rounded-xl border p-4">
              <div className="mb-1 flex items-center justify-between">
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
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
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
                    <button
                      onClick={() => savePortfolio(pf)}
                      className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm text-primary hover:bg-primary/10"
                    >
                      <Save className="h-4 w-4" /> Save
                    </button>

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
          <section className="w-full rounded-2xl border bg-card/80 p-4 sm:p-6 md:p-8 space-y-8">
            {/* Work Experience */}

            <div className="mb-6 space-y-3 rounded-xl p-4">
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
                  className="mb-2 space-y-3 rounded-xl border p-3"
                >
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
                    <LabeledInput
                      label="Start Date"
                      type="date"
                      value={exp.start_date ? exp.start_date.slice(0, 10) : ""}
                      onChange={(v) => updateWorkExp(exp.id, { start_date: v })}
                    />
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

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={exp.is_current}
                      onChange={(e) =>
                        handleCurrentToggle(exp.id, e.target.checked)
                      }
                    />
                    <label className="text-sm">I currently work here</label>
                  </div>

                  <LabeledInput
                    label="Description (optional)"
                    value={exp.description ?? ""}
                    onChange={(v) => updateWorkExp(exp.id, { description: v })}
                    placeholder="Short description..."
                  />

                  <div className="mt-2 flex justify-between">
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
            <div className="space-y-3 rounded-xl p-4">
              <div className="mb-1 flex items-center justify-between">
                <h4 className="text-lg font-semibold">Education</h4>
                <button
                  onClick={addEducation}
                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-accent"
                >
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>

              {educations.map((edu) => (
                <div key={edu.id} className="space-y-3 rounded-xl border p-3">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
                    <LabeledInput
                      label="Start Date"
                      type="date"
                      value={edu.start_date ? edu.start_date.slice(0, 10) : ""}
                      onChange={(v) =>
                        updateEducation(edu.id, { start_date: v })
                      }
                    />
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

                  <div className="mt-2 flex justify-between">
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
            <div className="mt-8 space-y-3 rounded-xl p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-lg font-semibold">Certifications</h4>

                <button
                  onClick={addCertification}
                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-accent"
                >
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>

              {certifications.map((cert) => (
                <div key={cert.id} className="rounded-xl border p-3 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <LabeledInput
                      label="Certification Name"
                      required
                      value={cert.name}
                      onChange={(v) =>
                        updateCertification(cert.id, { name: v })
                      }
                      placeholder="Certification name..."
                    />

                    <LabeledInput
                      label="Issuer"
                      required
                      value={cert.issuer}
                      onChange={(v) =>
                        updateCertification(cert.id, { issuer: v })
                      }
                      placeholder="Issued by..."
                    />

                    <LabeledInput
                      label="Credential ID (optional)"
                      value={cert.credential_id ?? ""}
                      onChange={(v) =>
                        updateCertification(cert.id, { credential_id: v })
                      }
                      placeholder="Credential ID..."
                    />
                  </div>
                  <LabeledInput
                    label="Certification URL"
                    value={cert.url ?? ""}
                    onChange={(v) => updateCertification(cert.id, { url: v })}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <LabeledInput
                      label="Issue Date"
                      type="date"
                      required
                      value={
                        cert.issue_date ? cert.issue_date.slice(0, 10) : ""
                      }
                      onChange={(v) =>
                        updateCertification(cert.id, { issue_date: v || null })
                      }
                    />

                    <LabeledInput
                      label="Expiry Date (optional)"
                      type="date"
                      value={
                        cert.expiry_date ? cert.expiry_date.slice(0, 10) : ""
                      }
                      onChange={(v) =>
                        updateCertification(cert.id, { expiry_date: v || null })
                      }
                    />

                    <div className="flex items-center gap-2 mt-6">
                      <input
                        type="checkbox"
                        checked={cert.is_active}
                        onChange={(e) =>
                          updateCertification(cert.id, {
                            is_active: e.target.checked,
                          })
                        }
                      />
                      <label>Is Active</label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => saveCertification(cert.id)}
                      className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-accent"
                    >
                      <Save className="h-4 w-4" /> Save
                    </button>

                    <button
                      onClick={() => removeCertification(cert.id)}
                      className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  </div>
                </div>
              ))}

              {!certifications.length && (
                <div className="rounded-xl border p-4 text-sm text-muted-foreground">
                  No certifications added.
                </div>
              )}
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ========================================================================
   Small reusable form bits
   ======================================================================== */
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
        disabled={disabled}
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
        <span className="mt-2 float-right text-[10px]">
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

        <button
          className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          onClick={() => {
            if (!file) return alert("Choose a PDF file");
            if (!title.trim()) return alert("Title is required");

            onAdd(file, title, isDefault);

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
