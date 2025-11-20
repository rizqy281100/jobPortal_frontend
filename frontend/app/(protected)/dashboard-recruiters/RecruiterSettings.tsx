"use client";

import { api } from "@/lib/axios";
import { useAppSelector } from "@/store/hooks";
import * as React from "react";

/* ========================================================================
   Types
   ======================================================================== */

type RecruiterSettings = {
  companyName: string;
  companyWebsite?: string;
  contactName?: string;
  contactPhone?: string;
  companyAddress?: string;
  industry?: string;
  description?: string;
};

/* ========================================================================
   Constants & Helpers
   ======================================================================== */

const LS_KEY_RECRUITER = "recruiterSettings_v1";

function toPhone30(v: string) {
  const cleaned = v.replace(/[^\d+\-\s]/g, "");
  return cleaned.slice(0, 30);
}

/* ========================================================================
   Main Component
   ======================================================================== */

export default function RecruiterSettings() {
  const [settings, setSettings] = React.useState<RecruiterSettings>({
    companyName: "",
  });

  const { accessToken } = useAppSelector((state) => state.auth);
  // Tambahan: avatar
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);

  const userId = "REPLACE_WITH_USER_ID"; // ambil dari session kamu
  const recruiterId = "REPLACE_WITH_RECRUITER_ID"; // bisa setelah GET profile

  /* =================== LOAD BACKEND DATA =================== */
  React.useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/recruiter/${userId}`, {
          headers: {
            // Tambahkan header jika perlu, misal Authorization
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
            withCredentials: "true",
          },
        });
        const json = await res;

        if (json?.data) {
          const r = json?.data;

          setSettings({
            companyName: r.company_name ?? "",
            companyWebsite: r.company_website ?? "",
            contactName: r.contact_name ?? "",
            contactPhone: r.contact_phone ?? "",
            companyAddress: r.address ?? "",
            industry: r.industry_id ?? "",
            description: r.description ?? "",
          });

          if (r.avatar_url) {
            setAvatarPreview(r.avatar_url);
          }
        }
      } catch (e) {
        console.error("Failed to load recruiter", e);
      }
    }

    load();
  }, []);

  /* =================== LOCAL STORAGE SYNC =================== */
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY_RECRUITER);
      if (raw) {
        const obj = JSON.parse(raw);
        setSettings((s) => ({ ...s, ...obj }));
      }
    } catch {}
  }, []);

  React.useEffect(() => {
    localStorage.setItem(LS_KEY_RECRUITER, JSON.stringify(settings));
  }, [settings]);

  /* =================== SAVE TO BACKEND =================== */
  const onSave = async () => {
    const formData = new FormData();

    formData.append("company_name", settings.companyName);
    formData.append("company_website", settings.companyWebsite ?? "");
    formData.append("contact_name", settings.contactName ?? "");
    formData.append("contact_phone", settings.contactPhone ?? "");
    formData.append("address", settings.companyAddress ?? "");
    formData.append("industry_id", settings.industry ?? "");
    formData.append("description", settings.description ?? "");

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const res = await fetch(`/api/recruiter/${recruiterId}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });

    const json = await res.json();
    if (json.err) {
      alert("Failed to update: " + json.message);
    } else {
      alert("Profile updated successfully.");
    }
  };

  /* =======================================================================
     VIEW
  ======================================================================== */

  return (
    <div className="space-y-8">
      <section className="rounded-[20px] border bg-card/80 p-5 sm:p-6">
        <header className="pb-2 border-b mb-4">
          <h3 className="text-lg font-semibold">Recruiter Settings</h3>
          <p className="text-sm text-muted-foreground">
            Complete your company information so candidates can easily recognize
            your recruiter profile.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)]">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Avatar Upload */}
            <Field label="Avatar" full>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setAvatarFile(f);
                    setAvatarPreview(URL.createObjectURL(f));
                  }
                }}
              />

              {avatarPreview && (
                <img
                  src={avatarPreview}
                  className="h-20 rounded mt-2 border"
                  alt="Avatar Preview"
                />
              )}
            </Field>

            {/* 1. Company name */}
            <Field label="Company Name" required>
              <input
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Enter your company name..."
                maxLength={150}
                value={settings.companyName}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    companyName: e.target.value,
                  }))
                }
              />
            </Field>

            {/* 2. Company website */}
            <Field label="Company Website">
              <input
                className="w-full rounded-lg border px-3 py-2"
                placeholder="https://example.com"
                maxLength={255}
                value={settings.companyWebsite ?? ""}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    companyWebsite: e.target.value,
                  }))
                }
              />
            </Field>

            {/* 3. Contact name */}
            <Field label="Contact Name">
              <input
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Name of HR or recruiter..."
                maxLength={100}
                value={settings.contactName ?? ""}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    contactName: e.target.value,
                  }))
                }
              />
            </Field>

            {/* 4. Contact phone */}
            <Field label="Contact Phone">
              <input
                className="w-full rounded-lg border px-3 py-2"
                placeholder="+62 812 3456 7890"
                maxLength={30}
                value={settings.contactPhone ?? ""}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    contactPhone: toPhone30(e.target.value),
                  }))
                }
              />
            </Field>

            {/* 5. Company address */}
            <Field label="Company Address" full>
              <textarea
                rows={3}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Enter your full company address..."
                value={settings.companyAddress ?? ""}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    companyAddress: e.target.value,
                  }))
                }
              />
            </Field>

            {/* 6. Industry */}
            <Field label="Industry">
              <input
                className="w-full rounded-lg border px-3 py-2"
                placeholder="e.g. Information Technology..."
                maxLength={100}
                value={settings.industry ?? ""}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    industry: e.target.value,
                  }))
                }
              />
            </Field>

            {/* 7. Description */}
            <Field label="Company Description" full>
              <textarea
                rows={4}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Describe your company..."
                value={settings.description ?? ""}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    description: e.target.value,
                  }))
                }
              />
            </Field>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onSave}
            className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground dark:text-white shadow-sm hover:opacity-90"
          >
            Save Changes
          </button>
        </div>
      </section>
    </div>
  );
}

/* ========================================================================
   Field component
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
