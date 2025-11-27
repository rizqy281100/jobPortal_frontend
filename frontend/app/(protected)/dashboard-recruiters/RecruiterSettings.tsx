// "use client";

// import { Input } from "@/components/ui/input";
// import { api } from "@/lib/axios";
// import { useAppSelector } from "@/store/hooks";
// import * as React from "react";
// import { toast } from "sonner";

// /* ========================================================================
//    Types
//    ======================================================================== */

// type RecruiterSettings = {
//   companyName: string;
//   companyWebsite?: string;
//   contactName?: string;
//   contactPhone?: string;
//   companyAddress?: string;
//   industry?: string;
//   description?: string;
// };

// /* ========================================================================
//    Constants
//    ======================================================================== */

// const LS_KEY_RECRUITER = "recruiterSettings_v1";

// function toPhone30(v: string) {
//   return v.replace(/[^\d+\-\s]/g, "").slice(0, 30);
// }

// /* ========================================================================
//    Main Component — NOW RESPONSIVE
//    ======================================================================== */

// export default function RecruiterSettings() {
//   const [settings, setSettings] = React.useState<RecruiterSettings>({
//     companyName: "",
//   });

//   const [industry, setIndustry] = useState("");
//   const [query, setQuery] = useState("a"); // ← default UZS
//   const [industryOptions, setIndustryOptions] = useState([]);
//   const { accessToken, user } = useAppSelector((state) => state.auth);

//   // Avatar preview state
//   const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
//   const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
//   const [avatarPreviewFromBackend, setAvatarPreviewFromBackend] =
//     React.useState<string | null>(null);

//   const userId = user?.id; // ambil dari session kamu
//   const recruiterId = user?.id; // bisa setelah GET profile
//   React.useEffect(() => {
//     async function load() {
//       try {
//         const res = await api.get(`/users/${userId}/recruiters`, {
//           headers: {
//             Authorization: accessToken ? `Bearer ${accessToken}` : "",
//           },
//         });

//         const r = res?.data;
//         if (r) {
//           setSettings({
//             companyName: r.company_name ?? "",
//             companyWebsite: r.company_website ?? "",
//             contactName: r.contact_name ?? "",
//             contactPhone: r.contact_phone ?? "",
//             companyAddress: r.address ?? "",
//             industry: r.industry ?? "",
//             description: r.description ?? "",
//           });

//           if (r.avatar_url) {
//             setAvatarPreviewFromBackend(r.avatar_url);
//           }
//           setIndustry(r?.industry_id);
//         }

//         const industries = await api.get(`/industries`, {
//           headers: {
//             // Tambahkan header jika perlu, misal Authorization
//             Authorization: accessToken ? `Bearer ${accessToken}` : "",
//           },
//         });
//         // console.log(industries);
//         if (industries) {
//           const mapped = industries?.data.map(
//             (item: { id: string; name: string }) => ({
//               value: item.id,
//               label: item.name,
//             })
//           );
//           setIndustryOptions(mapped);
//         } else {
//           setIndustryOptions([]);
//         }
//       } catch (e) {
//         console.error("Failed to load recruiter", e);
//       }
//     }

//     load();
//   }, []);

//   /* =================== LOCAL STORAGE SYNC =================== */
//   React.useEffect(() => {
//     try {
//       const raw = localStorage.getItem(LS_KEY_RECRUITER);
//       if (raw) setSettings((s) => ({ ...s, ...JSON.parse(raw) }));
//     } catch {}
//   }, []);

//   React.useEffect(() => {
//     localStorage.setItem(LS_KEY_RECRUITER, JSON.stringify(settings));
//   }, [settings]);
//   const fetchIndustries = async (keyword = "") => {
//     const query = keyword ? `?search=${encodeURIComponent(keyword)}` : "";

//     const res = await api.get(`/industries${query}`, {
//       headers: {
//         Authorization: accessToken ? `Bearer ${accessToken}` : "",
//       },
//     });
//     const mapped = res?.data.map((item: { id: string; name: string }) => ({
//       value: item.id,
//       label: item.name,
//     }));
//     setIndustryOptions(mapped);
//   };
//   /* =================== SAVE TO BACKEND =================== */
//   const onSave = async () => {
//     const formData = new FormData();

//     formData.append("company_name", settings.companyName);
//     formData.append("company_website", settings.companyWebsite ?? "");
//     formData.append("contact_name", settings.contactName ?? "");
//     formData.append("contact_phone", settings.contactPhone ?? "");
//     formData.append("address", settings.companyAddress ?? "");
//     formData.append("industry_id", settings.industry ?? "");
//     formData.append("description", settings.description ?? "");

//     if (avatarFile) formData.append("avatar", avatarFile);

//     const res = await api.put(`/users/recruiters`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: accessToken ? `Bearer ${accessToken}` : "",
//       },
//     });

//     if (res?.data?.code !== 200) {
//       toast.error("Failed to update: " + res.data.message);
//     } else {
//       toast.success("Profile updated successfully.");
//     }
//   };

//   /* ========================================================================
//      VIEW — FLEXIBLE RESPONSIVE GRID
//      ======================================================================== */

//   return (
//     <div className="space-y-8">
//       <section className="rounded-[20px] border bg-card/80 p-5 sm:p-6">
//         <header className="pb-2 border-b mb-4">
//           <h3 className="text-lg font-semibold">Recruiter Settings</h3>
//           <p className="text-sm text-muted-foreground">
//             Complete your company information so candidates can easily recognize
//             your recruiter profile.
//           </p>
//         </header>

//         {/*
//           MOBILE: 1 column
//           TABLET: 2 columns
//           DESKTOP: avatar on left + form on right
//         */}
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px,1fr]">
//           {/* Avatar Section */}
//           <div className="flex flex-col items-center gap-4 p-3 rounded-lg bg-muted/20 border lg:items-start">
//             <div className="h-[160px] w-[160px] rounded-full overflow-hidden ring-1 ring-border bg-muted/50 grid place-items-center">
//               {avatarPreviewFromBackend || avatarPreview ? (
//                 <img
//                   src={
//                     avatarPreviewFromBackend
//                       ? `http://localhost:5000${avatarPreviewFromBackend}`
//                       : avatarPreview
//                   }
//                   className="h-full w-full object-cover"
//                 />
//               ) : (
//                 <span className="text-sm text-muted-foreground">No Photo</span>
//               )}
//             </div>

//             <Input
//               type="file"
//               accept="image/*"
//               onChange={(e) => {
//                 const f = e.target.files?.[0];
//                 if (f) {
//                   setAvatarFile(f);
//                   setAvatarPreview(URL.createObjectURL(f));
//                   setAvatarPreviewFromBackend(null);
//                 }
//               }}
//             />
//           </div>

//           {/* FORM */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//             <Field label="Company Name" required>
//               <Input
//                 placeholder="Enter your company name..."
//                 value={settings.companyName}
//                 maxLength={150}
//                 onChange={(e) =>
//                   setSettings({ ...settings, companyName: e.target.value })
//                 }
//               />
//             </Field>

//             <Field label="Company Website">
//               <Input
//                 placeholder="https://example.com"
//                 value={settings.companyWebsite ?? ""}
//                 onChange={(e) =>
//                   setSettings({ ...settings, companyWebsite: e.target.value })
//                 }
//               />
//             </Field>

//             <Field label="Contact Name">
//               <Input
//                 placeholder="HR or Recruiter Name"
//                 value={settings.contactName ?? ""}
//                 onChange={(e) =>
//                   setSettings({ ...settings, contactName: e.target.value })
//                 }
//               />
//             </Field>

//             <Field label="Contact Phone">
//               <Input
//                 placeholder="+62 812 3456 7890"
//                 maxLength={30}
//                 name="contact_phone"
//                 value={settings.contactPhone ?? ""}
//                 onChange={(e) =>
//                   setSettings({
//                     ...settings,
//                     contactPhone: toPhone30(e.target.value),
//                   })
//                 }
//               />
//             </Field>

//             <Field label="Company Address" full>
//               <textarea
//                 rows={3}
//                 className="w-full rounded-lg border px-3 py-2"
//                 placeholder="Enter your company address..."
//                 value={settings.companyAddress ?? ""}
//                 onChange={(e) =>
//                   setSettings({ ...settings, companyAddress: e.target.value })
//                 }
//               />
//             </Field>

//             {/* 6. Industry */}
//             {/* <Field label="Industry">
//               <Input
//                 placeholder="e.g. Information Technology"
//                 value={settings.industry ?? ""}
//                 onChange={(e) =>
//                   setSettings({ ...settings, industry: e.target.value })
//                 }
//               />
//             </Field> */}
//             <SearchableSelect
//               options={industryOptions}
//               value={industry}
//               onChange={setIndustry}
//               placeholder="Select Industries..."
//               onSearch={(text: string) => {
//                 fetchIndustries(text);
//                 setQuery(text);
//               }}
//               className="mt-1"
//             />
//             <input type="hidden" name="industry" value={industry} />

//             {/* 7. Description */}
//             <Field label="Company Description" full>
//               <textarea
//                 rows={4}
//                 className="w-full rounded-lg border px-3 py-2"
//                 placeholder="Tell more about your company..."
//                 value={settings.description ?? ""}
//                 onChange={(e) =>
//                   setSettings({ ...settings, description: e.target.value })
//                 }
//               />
//             </Field>
//           </div>
//         </div>

//         <div className="mt-6 flex justify-end">
//           <button
//             onClick={onSave}
//             className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
//           >
//             Save Changes
//           </button>
//         </div>
//       </section>
//     </div>
//   );
// }

// /* ========================================================================
//    Field Component
//    ======================================================================== */

// function Field({
//   label,
//   required,
//   full,
//   children,
// }: React.PropsWithChildren<{
//   label: string;
//   required?: boolean;
//   full?: boolean;
// }>) {
//   return (
//     <div className={`space-y-1 ${full ? "sm:col-span-2" : ""}`}>
//       <label className="block text-xs font-medium">
//         {label} {required && <span className="text-red-600">*</span>}
//       </label>
//       {children}
//     </div>
//   );
// }

"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/axios";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import { SearchableSelect } from "@/components/SearchableSelect";

/* ========================================================================
   Types
   ======================================================================== */

type RecruiterSettingsType = {
  companyName: string;
  companyWebsite?: string;
  contactName?: string;
  contactPhone?: string;
  companyAddress?: string;
  industry?: string; // industry_id
  description?: string;
};

type Option = { value: string; label: string };

/* ========================================================================
   Constants
   ======================================================================== */

const LS_KEY_RECRUITER = "recruiterSettings_v1";

function toPhone30(v: string) {
  return v.replace(/[^\d+\-\s]/g, "").slice(0, 30);
}

/* ========================================================================
   Main Component — RESPONSIVE
   ======================================================================== */

export default function RecruiterSettings() {
  const [settings, setSettings] = React.useState<RecruiterSettingsType>({
    companyName: "",
  });

  const [industry, setIndustry] = React.useState<string>("");
  const [query, setQuery] = React.useState<string>("a");
  const [industryOptions, setIndustryOptions] = React.useState<Option[]>([]);

  const { accessToken, user } = useAppSelector((state) => state.auth);

  // Avatar preview state
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const [avatarPreviewFromBackend, setAvatarPreviewFromBackend] =
    React.useState<string | null>(null);

  const userId = user?.id;

  React.useEffect(() => {
    async function load() {
      try {
        if (!userId) return;

        const res = await api.get(`/users/${userId}/recruiters`, {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        });

        const r = res?.data;
        if (r) {
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
            setAvatarPreviewFromBackend(r.avatar_url);
          }

          if (r.industry_id) setIndustry(String(r.industry_id));
        }

        const industriesRes = await api.get(`/industries`, {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        });

        const mapped: Option[] = industriesRes?.data?.data?.map(
          (item: { id: string; name: string }) => ({
            value: String(item.id),
            label: item.name,
          })
        );

        setIndustryOptions(mapped ?? []);
      } catch (e) {
        console.error("Failed to load recruiter", e);
      }
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =================== LOCAL STORAGE SYNC =================== */
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY_RECRUITER);
      if (raw) setSettings((s) => ({ ...s, ...JSON.parse(raw) }));
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem(LS_KEY_RECRUITER, JSON.stringify(settings));
  }, [settings]);

  const fetchIndustries = async (keyword = "") => {
    const q = keyword ? `?search=${encodeURIComponent(keyword)}` : "";

    const res = await api.get(`/industries${q}`, {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    });

    const mapped: Option[] = res?.data?.data?.map(
      (item: { id: string; name: string }) => ({
        value: String(item.id),
        label: item.name,
      })
    );

    setIndustryOptions(mapped ?? []);
  };

  /* =================== SAVE TO BACKEND =================== */
  const onSave = async () => {
    try {
      const formData = new FormData();

      formData.append("company_name", settings.companyName);
      formData.append("company_website", settings.companyWebsite ?? "");
      formData.append("contact_name", settings.contactName ?? "");
      formData.append("contact_phone", settings.contactPhone ?? "");
      formData.append("address", settings.companyAddress ?? "");
      formData.append("industry_id", industry || settings.industry || "");
      formData.append("description", settings.description ?? "");

      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await api.put(`/users/recruiters`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      });

      if (res?.data?.code !== 200) {
        toast.error("Failed to update: " + res.data.message);
      } else {
        toast.success("Profile updated successfully.");
      }
    } catch (e: any) {
      console.error(e);
      toast.error(
        e?.response?.data?.message || "Failed to update recruiter profile"
      );
    }
  };

  /* ========================================================================
     VIEW
     ======================================================================== */

  return (
    <div className="space-y-8">
      <section className="rounded-[20px] border bg-card/80 p-5 sm:p-6">
        <header className="mb-4 border-b pb-2">
          <h3 className="text-lg font-semibold">Recruiter Settings</h3>
          <p className="text-sm text-muted-foreground">
            Complete your company information so candidates can easily recognize
            your recruiter profile.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px,1fr]">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4 rounded-lg border bg-muted/20 p-3 lg:items-start">
            <div className="grid h-[160px] w-[160px] place-items-center rounded-full bg-muted/50 ring-1 ring-border overflow-hidden">
              {avatarPreviewFromBackend || avatarPreview ? (
                <img
                  src={
                    avatarPreviewFromBackend
                      ? `http://localhost:5000${avatarPreviewFromBackend}`
                      : avatarPreview!
                  }
                  className="h-full w-full object-cover"
                  alt="Company logo"
                />
              ) : (
                <span className="text-sm text-muted-foreground">No Photo</span>
              )}
            </div>

            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setAvatarFile(f);
                  setAvatarPreview(URL.createObjectURL(f));
                  setAvatarPreviewFromBackend(null);
                }
              }}
            />
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Company Name" required>
              <Input
                placeholder="Enter your company name..."
                value={settings.companyName}
                maxLength={150}
                onChange={(e) =>
                  setSettings({ ...settings, companyName: e.target.value })
                }
              />
            </Field>

            <Field label="Company Website">
              <Input
                placeholder="https://example.com"
                value={settings.companyWebsite ?? ""}
                onChange={(e) =>
                  setSettings({ ...settings, companyWebsite: e.target.value })
                }
              />
            </Field>

            <Field label="Contact Name">
              <Input
                placeholder="HR or Recruiter Name"
                value={settings.contactName ?? ""}
                onChange={(e) =>
                  setSettings({ ...settings, contactName: e.target.value })
                }
              />
            </Field>

            <Field label="Contact Phone">
              <Input
                placeholder="+62 812 3456 7890"
                maxLength={30}
                value={settings.contactPhone ?? ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contactPhone: toPhone30(e.target.value),
                  })
                }
              />
            </Field>

            <Field label="Company Address" full>
              <textarea
                rows={3}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Enter your company address..."
                value={settings.companyAddress ?? ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    companyAddress: e.target.value,
                  })
                }
              />
            </Field>

            {/* Industry */}
            <Field label="Industry">
              <SearchableSelect
                options={industryOptions}
                value={industry}
                onChange={(val: string) => {
                  setIndustry(val);
                  setSettings((prev) => ({ ...prev, industry: val }));
                }}
                placeholder="Select industry..."
                onSearch={(text: string) => {
                  fetchIndustries(text);
                  setQuery(text);
                }}
                className="mt-1"
              />
              <input type="hidden" name="industry" value={industry} />
            </Field>

            {/* Description */}
            <Field label="Company Description" full>
              <textarea
                rows={4}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Tell more about your company..."
                value={settings.description ?? ""}
                onChange={(e) =>
                  setSettings({ ...settings, description: e.target.value })
                }
              />
            </Field>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onSave}
            className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
          >
            Save Changes
          </button>
        </div>
      </section>
    </div>
  );
}

/* ========================================================================
   Field Component
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
    <div className={`space-y-1 ${full ? "sm:col-span-2" : ""}`}>
      <label className="block text-xs font-medium">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
    </div>
  );
}
