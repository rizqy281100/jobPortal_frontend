// "use client";

// import * as React from "react";
// import Link from "next/link";
// import {
//   Plus,
//   Trash2,
//   Upload,
//   Star,
//   X,
//   Calendar as CalIcon,
//   Building2,
// } from "lucide-react";

// /** -------------------- Types -------------------- */
// type Gender = "male" | "female" | "others";
// type Marital = "married" | "not married" | "divorced" | "widowed";
// type Religion =
//   | "islam"
//   | "kristen"
//   | "katolik"
//   | "hindu"
//   | "buddha"
//   | "konghucu"
//   | "judaism"
//   | "others";

// type ResumeItem = {
//   id: string;
//   title: string;
//   fileName: string;
//   size: number;
//   url: string; // blob/object URL
//   primary?: boolean;
//   uploadedAt: string;
// };
// type PortfolioItem = {
//   id: string;
//   title: string;
//   description?: string;
//   link?: string;
// };
// type WorkItem = {
//   id: string;
//   company: string;
//   title: string;
//   start: string; // ISO
//   end?: string; // ISO
//   current?: boolean;
// };
// type EduItem = {
//   id: string;
//   school: string;
//   degree: string;
//   major?: string;
//   start: string;
//   end?: string;
//   current?: boolean;
// };
// type CertItem = {
//   id: string;
//   title: string;
//   issuer: string;
//   issueDate?: string;
//   expiryDate?: string;
//   fileName?: string;
//   size?: number;
//   url?: string;
// };

// type Profile = {
//   name: string;
//   phone?: string;
//   dob?: string;
//   gender?: Gender;
//   nationality?: string;
//   religion?: Religion;
//   marital?: Marital;
//   address?: string;
//   summary?: string;
//   currentSalary?: string; // "12,2" numeric as string
//   expectedSalary?: string;
//   photoUrl?: string;
//   photoName?: string;
// };

// const LS_KEY = "userSettings_v1";
// const RESUME_LIMIT = 3;
// const PORTFOLIO_LIMIT = 10;
// const CV_MAX_MB = 2;
// const PHOTO_MAX_MB = 1;

// /** -------------------- Helpers -------------------- */
// const COUNTRIES = [
//   "Uzbekistan",
//   "Kazakhstan",
//   "Kyrgyzstan",
//   "Tajikistan",
//   "Turkmenistan",
//   "Russia",
//   "Turkey",
//   "India",
//   "Indonesia",
//   "Malaysia",
//   "United States",
//   "United Kingdom",
//   "Germany",
//   "France",
// ];

// const UZ_INSTITUTIONS = [
//   "National University of Uzbekistan (Tashkent)",
//   "Tashkent University of Information Technologies",
//   "Tashkent State Technical University",
//   "Tashkent State University of Economics",
//   "Tashkent Pediatric Medical Institute",
//   "Samarkand State University",
//   "Bukhara State University",
//   "Fergana State University",
//   "Andijan State University",
//   "Urgench State University",
//   "Namangan State University",
//   "Tashkent State Transport University",
// ];

// const UZ_DEGREES = [
//   "Secondary School",
//   "Lyceum / College",
//   "Bachelor",
//   "Master",
//   "Doctorate (PhD)",
//   "Post-Doctorate",
// ];

// function uid(prefix = "") {
//   return prefix + Math.random().toString(36).slice(2, 10);
// }
// function fmtSize(n: number) {
//   if (n < 1024) return `${n} B`;
//   if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
//   return `${(n / (1024 * 1024)).toFixed(2)} MB`;
// }
// function toMoney12_2(v: string) {
//   // keep digits + comma/period; normalize to dot decimal; constrain
//   const cleaned = v.replace(/[^\d.,]/g, "");
//   // allow max 12 digits before, max 2 after
//   const [L, R = ""] = cleaned.replace(",", ".").split(".");
//   const left = L.replace(/^0+(\d)/, "$1").slice(0, 12);
//   const right = R.slice(0, 2);
//   return right ? `${left}.${right}` : left;
// }

// /** -------------------- Skills bank (simple auto-complete via localStorage) -------------------- */
// const SKILLS_BANK_KEY = "skillsBank_v1";
// function getSkillsBank(): string[] {
//   try {
//     const raw = localStorage.getItem(SKILLS_BANK_KEY);
//     const arr: string[] = raw ? JSON.parse(raw) : [];
//     return Array.from(new Set(arr.map((s) => s.trim()).filter(Boolean))).sort();
//   } catch {
//     return [];
//   }
// }
// function saveSkillsBank(list: string[]) {
//   localStorage.setItem(SKILLS_BANK_KEY, JSON.stringify(list));
// }

// /** -------------------- Main Component -------------------- */
// export default function UserSettingsClient() {
//   /** ===== load & persist ===== */
//   const [profile, setProfile] = React.useState<Profile>({ name: "" });
//   const [resumes, setResumes] = React.useState<ResumeItem[]>([]);
//   const [portfolios, setPortfolios] = React.useState<PortfolioItem[]>([]);
//   const [skillsSel, setSkillsSel] = React.useState<string[]>([]);
//   const [skillsBank, setSkillsBank] = React.useState<string[]>([]);
//   const [work, setWork] = React.useState<WorkItem[]>([]);
//   const [edu, setEdu] = React.useState<EduItem[]>([]);
//   const [certs, setCerts] = React.useState<CertItem[]>([]);

//   React.useEffect(() => {
//     try {
//       const raw = localStorage.getItem(LS_KEY);
//       if (raw) {
//         const obj = JSON.parse(raw);
//         setProfile(obj.profile ?? { name: "" });
//         setResumes(obj.resumes ?? []);
//         setPortfolios(obj.portfolios ?? []);
//         setSkillsSel(obj.skillsSel ?? []);
//         setWork(obj.work ?? []);
//         setEdu(obj.edu ?? []);
//         setCerts(obj.certs ?? []);
//       }
//       setSkillsBank(getSkillsBank());
//     } catch {}
//   }, []);
//   const persist = React.useCallback(() => {
//     localStorage.setItem(
//       LS_KEY,
//       JSON.stringify({
//         profile,
//         resumes,
//         portfolios,
//         skillsSel,
//         work,
//         edu,
//         certs,
//       })
//     );
//   }, [profile, resumes, portfolios, skillsSel, work, edu, certs]);
//   React.useEffect(() => {
//     persist();
//   }, [persist]);

//   /** ===== Profile handlers ===== */
//   const onPhoto = (f?: File) => {
//     if (!f) return;
//     const okType = /image\/(png|jpe?g)/i.test(f.type);
//     const okSize = f.size <= PHOTO_MAX_MB * 1024 * 1024;
//     if (!okType || !okSize) {
//       alert("Photo must be PNG/JPG/JPEG and ≤ 1 MB");
//       return;
//     }
//     const url = URL.createObjectURL(f);
//     setProfile((p) => ({ ...p, photoUrl: url, photoName: f.name }));
//   };

//   /** ===== Resume handlers ===== */
//   const addResume = async (file: File, title: string) => {
//     if (!/application\/pdf/i.test(file.type)) return alert("Only PDF allowed");
//     if (file.size > CV_MAX_MB * 1024 * 1024)
//       return alert(`Max size ${CV_MAX_MB}MB`);
//     if (!title.trim()) return alert("Title is required");
//     if (resumes.length >= RESUME_LIMIT)
//       return alert(`Max ${RESUME_LIMIT} resumes`);

//     const url = URL.createObjectURL(file);
//     const item: ResumeItem = {
//       id: uid("cv_"),
//       title: title.trim(),
//       fileName: file.name,
//       size: file.size,
//       url,
//       primary: resumes.length === 0, // first becomes primary
//       uploadedAt: new Date().toISOString(),
//     };
//     setResumes((r) => [item, ...r]);
//   };
//   const setPrimaryResume = (id: string) =>
//     setResumes((r) => r.map((x) => ({ ...x, primary: x.id === id })));
//   const removeResume = (id: string) =>
//     setResumes((r) => {
//       const next = r.filter((x) => x.id !== id);
//       if (!next.some((x) => x.primary) && next[0]) next[0].primary = true; // keep one as primary if exists
//       return [...next];
//     });

//   /** ===== Portfolios ===== */
//   const addPortfolio = () =>
//     setPortfolios((p) => {
//       if (p.length >= PORTFOLIO_LIMIT) {
//         alert(`Max ${PORTFOLIO_LIMIT} portfolios`);
//         return p;
//       }
//       return [{ id: uid("pf_"), title: "" }, ...p];
//     });
//   const updatePortfolio = (id: string, patch: Partial<PortfolioItem>) =>
//     setPortfolios((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));
//   const removePortfolio = (id: string) =>
//     setPortfolios((p) => p.filter((x) => x.id !== id));

//   /** ===== Skills ===== */
//   const [skillQuery, setSkillQuery] = React.useState("");
//   const suggestions = React.useMemo(() => {
//     if (!skillQuery) return [];
//     const q = skillQuery.toLowerCase();
//     return skillsBank
//       .filter((s) => s.toLowerCase().includes(q) && !skillsSel.includes(s))
//       .slice(0, 7);
//   }, [skillQuery, skillsBank, skillsSel]);
//   const addSkill = (s: string) => {
//     const val = s.trim();
//     if (!val) return;
//     if (skillsSel.includes(val)) return;
//     const next = [...skillsSel, val];
//     setSkillsSel(next);
//     // update bank
//     const bank = Array.from(new Set([val, ...skillsBank]));
//     setSkillsBank(bank);
//     saveSkillsBank(bank);
//     setSkillQuery("");
//   };
//   const removeSkill = (s: string) =>
//     setSkillsSel((list) => list.filter((x) => x !== s));

//   /** ===== Work & Edu ===== */
//   const addWork = () =>
//     setWork((w) => [
//       {
//         id: uid("w_"),
//         company: "",
//         title: "",
//         start: "",
//         current: true,
//       },
//       ...w,
//     ]);
//   const updateWork = (id: string, patch: Partial<WorkItem>) =>
//     setWork((w) => w.map((x) => (x.id === id ? { ...x, ...patch } : x)));
//   const removeWork = (id: string) =>
//     setWork((w) => w.filter((x) => x.id !== id));

//   const addEdu = () =>
//     setEdu((e) => [
//       {
//         id: uid("e_"),
//         school: "",
//         degree: "",
//         major: "",
//         start: "",
//         current: true,
//       },
//       ...e,
//     ]);
//   const updateEdu = (id: string, patch: Partial<EduItem>) =>
//     setEdu((e) => e.map((x) => (x.id === id ? { ...x, ...patch } : x)));
//   const removeEdu = (id: string) => setEdu((e) => e.filter((x) => x.id !== id));

//   /** ===== Certs ===== */
//   const addCert = () =>
//     setCerts((c) => [
//       { id: uid("c_"), title: "", issuer: "", issueDate: "" },
//       ...c,
//     ]);
//   const updateCert = (id: string, patch: Partial<CertItem>) =>
//     setCerts((c) => c.map((x) => (x.id === id ? { ...x, ...patch } : x)));
//   const removeCert = (id: string) =>
//     setCerts((c) => c.filter((x) => x.id !== id));
//   const onCertFile = (id: string, f?: File) => {
//     if (!f) return;
//     if (!/application\/pdf/i.test(f.type)) return alert("Only PDF allowed");
//     if (f.size > 2 * 1024 * 1024) return alert("Max 2 MB");
//     const url = URL.createObjectURL(f);
//     updateCert(id, { url, fileName: f.name, size: f.size });
//   };

//   /** ===== Submit (just persist & toast) ===== */
//   const onSave = () => {
//     persist();
//     alert("Saved locally. Integrasikan API backend untuk persist ke server.");
//   };

//   return (
//     <div className="space-y-8">
//       {/* ============= SECTION 1: PROFILE ============= */}
//       <section className="rounded-xl border bg-card/80 p-4 sm:p-6">
//         <h3 className="text-base font-semibold">Personal Information</h3>
//         <p className="text-sm text-muted-foreground">
//           Lengkapi profilmu agar rekruter lebih mudah mengenalmu.
//         </p>

//         <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
//           {/* Name */}
//           <Field label="Name" required>
//             <input
//               className="w-full rounded-md border px-3 py-2"
//               value={profile.name}
//               onChange={(e) =>
//                 setProfile((p) => ({ ...p, name: e.target.value }))
//               }
//               placeholder="Your full name"
//             />
//           </Field>

//           {/* Photo */}
//           <Field label="Photo Profile (max 1 MB, png/jpg/jpeg)">
//             <div className="flex items-center gap-3">
//               <div className="h-14 w-14 overflow-hidden rounded-full ring-1 ring-border">
//                 {profile.photoUrl ? (
//                   // eslint-disable-next-line @next/next/no-img-element
//                   <img
//                     src={profile.photoUrl}
//                     alt="photo"
//                     className="h-full w-full object-cover"
//                   />
//                 ) : (
//                   <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
//                     No Photo
//                   </div>
//                 )}
//               </div>
//               <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent">
//                 <Upload className="h-4 w-4" />
//                 Upload
//                 <input
//                   type="file"
//                   accept="image/png,image/jpeg"
//                   className="hidden"
//                   onChange={(e) => onPhoto(e.target.files?.[0])}
//                 />
//               </label>
//               {profile.photoName && (
//                 <span className="truncate text-xs text-muted-foreground">
//                   {profile.photoName}
//                 </span>
//               )}
//             </div>
//           </Field>

//           {/* Telephone */}
//           <Field label="Telephone (max 20 char)">
//             <input
//               maxLength={20}
//               className="w-full rounded-md border px-3 py-2"
//               value={profile.phone ?? ""}
//               onChange={(e) =>
//                 setProfile((p) => ({ ...p, phone: e.target.value }))
//               }
//               placeholder="+998-XX-XXX-XX-XX"
//             />
//           </Field>

//           {/* DOB */}
//           <Field label="Date of birth">
//             <div className="relative">
//               <CalIcon className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
//               <input
//                 type="date"
//                 className="w-full rounded-md border px-3 py-2 pr-9"
//                 value={profile.dob ?? ""}
//                 onChange={(e) =>
//                   setProfile((p) => ({ ...p, dob: e.target.value }))
//                 }
//               />
//             </div>
//           </Field>

//           {/* Gender */}
//           <Field label="Gender">
//             <select
//               className="w-full rounded-md border px-3 py-2"
//               value={profile.gender ?? ""}
//               onChange={(e) =>
//                 setProfile((p) => ({ ...p, gender: e.target.value as Gender }))
//               }
//             >
//               <option value="">Select…</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="others">Others</option>
//             </select>
//           </Field>

//           {/* Nationality */}
//           <Field label="Nationality">
//             <select
//               className="w-full rounded-md border px-3 py-2"
//               value={profile.nationality ?? ""}
//               onChange={(e) =>
//                 setProfile((p) => ({ ...p, nationality: e.target.value }))
//               }
//             >
//               <option value="">Select country…</option>
//               {COUNTRIES.map((c) => (
//                 <option key={c} value={c}>
//                   {c}
//                 </option>
//               ))}
//             </select>
//           </Field>

//           {/* Religion */}
//           <Field label="Religion">
//             <select
//               className="w-full rounded-md border px-3 py-2"
//               value={profile.religion ?? ""}
//               onChange={(e) =>
//                 setProfile((p) => ({
//                   ...p,
//                   religion: e.target.value as Religion,
//                 }))
//               }
//             >
//               <option value="">Select…</option>
//               <option value="islam">Islam</option>
//               <option value="kristen">Kristen</option>
//               <option value="katolik">Katolik</option>
//               <option value="hindu">Hindu</option>
//               <option value="buddha">Buddha</option>
//               <option value="konghucu">Konghucu</option>
//               <option value="judaism">Judaism</option>
//               <option value="others">Others</option>
//             </select>
//           </Field>

//           {/* Marriage status */}
//           <Field label="Marriage status">
//             <select
//               className="w-full rounded-md border px-3 py-2"
//               value={profile.marital ?? ""}
//               onChange={(e) =>
//                 setProfile((p) => ({
//                   ...p,
//                   marital: e.target.value as Marital,
//                 }))
//               }
//             >
//               <option value="">Select…</option>
//               <option value="married">Married</option>
//               <option value="not married">Not married</option>
//               <option value="divorced">Divorced</option>
//               <option value="widowed">Widowed</option>
//             </select>
//           </Field>

//           {/* Address */}
//           <Field label="Address" full>
//             <textarea
//               rows={2}
//               className="w-full rounded-md border px-3 py-2"
//               value={profile.address ?? ""}
//               onChange={(e) =>
//                 setProfile((p) => ({ ...p, address: e.target.value }))
//               }
//             />
//           </Field>

//           {/* Profile summary */}
//           <Field label="Profile summary" full>
//             <textarea
//               rows={3}
//               className="w-full rounded-md border px-3 py-2"
//               value={profile.summary ?? ""}
//               onChange={(e) =>
//                 setProfile((p) => ({ ...p, summary: e.target.value }))
//               }
//             />
//           </Field>

//           {/* Salaries */}
//           <Field label="Current salary (12,2)">
//             <input
//               inputMode="decimal"
//               className="w-full rounded-md border px-3 py-2"
//               value={profile.currentSalary ?? ""}
//               onChange={(e) =>
//                 setProfile((p) => ({
//                   ...p,
//                   currentSalary: toMoney12_2(e.target.value),
//                 }))
//               }
//               placeholder="e.g. 1200.00"
//             />
//           </Field>
//           <Field label="Expected salary (12,2)">
//             <input
//               inputMode="decimal"
//               className="w-full rounded-md border px-3 py-2"
//               value={profile.expectedSalary ?? ""}
//               onChange={(e) =>
//                 setProfile((p) => ({
//                   ...p,
//                   expectedSalary: toMoney12_2(e.target.value),
//                 }))
//               }
//               placeholder="e.g. 2000.00"
//             />
//           </Field>
//         </div>
//       </section>

//       {/* ============= SECTION 2: DOCUMENTS & SKILLS ============= */}
//       <section className="rounded-xl border bg-card/80 p-4 sm:p-6">
//         <h3 className="text-base font-semibold">Resumes (PDF, max 2MB)</h3>
//         <p className="text-sm text-muted-foreground">
//           Maksimal {RESUME_LIMIT} file. Pilih satu sebagai <b>Utama</b>.
//         </p>

//         {/* Upload form */}
//         <UploadResume onAdd={addResume} />

//         {/* List */}
//         <div className="mt-4 grid grid-cols-1 gap-3">
//           {resumes.map((cv) => (
//             <div
//               key={cv.id}
//               className="flex items-center justify-between rounded-lg border p-3"
//             >
//               <div className="min-w-0">
//                 <div className="flex items-center gap-2">
//                   <span className="truncate font-medium">{cv.title}</span>
//                   {cv.primary && (
//                     <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
//                       <Star className="h-3 w-3" /> Primary
//                     </span>
//                   )}
//                 </div>
//                 <p className="truncate text-xs text-muted-foreground">
//                   {cv.fileName} · {fmtSize(cv.size)}
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <a
//                   href={cv.url}
//                   target="_blank"
//                   className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
//                 >
//                   Preview
//                 </a>
//                 <button
//                   className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
//                   onClick={() => setPrimaryResume(cv.id)}
//                 >
//                   Set Primary
//                 </button>
//                 <button
//                   className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
//                   onClick={() => removeResume(cv.id)}
//                 >
//                   <Trash2 className="h-4 w-4" />
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))}
//           {!resumes.length && (
//             <div className="rounded-lg border p-4 text-sm text-muted-foreground">
//               Belum ada resume diunggah.
//             </div>
//           )}
//         </div>

//         {/* Portfolios */}
//         <div className="mt-8">
//           <div className="mb-2 flex items-center justify-between">
//             <h3 className="text-base font-semibold">
//               Portfolios (max {PORTFOLIO_LIMIT})
//             </h3>
//             <button
//               onClick={addPortfolio}
//               className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
//             >
//               <Plus className="h-4 w-4" />
//               Add
//             </button>
//           </div>

//           <div className="grid grid-cols-1 gap-3">
//             {portfolios.map((pf) => (
//               <div key={pf.id} className="rounded-lg border p-3">
//                 <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
//                   <div>
//                     <label className="mb-1 block text-xs font-medium">
//                       Title *
//                     </label>
//                     <input
//                       className="w-full rounded-md border px-3 py-2"
//                       value={pf.title}
//                       onChange={(e) =>
//                         updatePortfolio(pf.id, { title: e.target.value })
//                       }
//                       placeholder="e.g. Design System"
//                     />
//                   </div>
//                   <div>
//                     <label className="mb-1 block text-xs font-medium">
//                       Description
//                     </label>
//                     <input
//                       className="w-full rounded-md border px-3 py-2"
//                       value={pf.description ?? ""}
//                       onChange={(e) =>
//                         updatePortfolio(pf.id, { description: e.target.value })
//                       }
//                       placeholder="Short summary"
//                     />
//                   </div>
//                   <div>
//                     <label className="mb-1 block text-xs font-medium">
//                       Portfolio Link
//                     </label>
//                     <input
//                       className="w-full rounded-md border px-3 py-2"
//                       value={pf.link ?? ""}
//                       onChange={(e) =>
//                         updatePortfolio(pf.id, { link: e.target.value })
//                       }
//                       placeholder="https://…"
//                     />
//                   </div>
//                 </div>
//                 <div className="mt-2 flex justify-end">
//                   <button
//                     className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
//                     onClick={() => removePortfolio(pf.id)}
//                   >
//                     <Trash2 className="h-4 w-4" /> Remove
//                   </button>
//                 </div>
//               </div>
//             ))}
//             {!portfolios.length && (
//               <div className="rounded-lg border p-4 text-sm text-muted-foreground">
//                 Belum ada portfolio.
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Skills */}
//         <div className="mt-8">
//           <h3 className="mb-2 text-base font-semibold">Skills</h3>
//           <div className="relative">
//             <input
//               className="w-full rounded-md border px-3 py-2"
//               placeholder="Search or add skill…"
//               value={skillQuery}
//               onChange={(e) => setSkillQuery(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   addSkill(skillQuery);
//                 }
//               }}
//             />
//             {!!suggestions.length && (
//               <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border bg-card shadow">
//                 {suggestions.map((s) => (
//                   <button
//                     key={s}
//                     className="block w-full px-3 py-2 text-left text-sm hover:bg-accent"
//                     onClick={() => addSkill(s)}
//                   >
//                     {s}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="mt-3 flex flex-wrap gap-2">
//             {skillsSel.map((s) => (
//               <span
//                 key={s}
//                 className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm"
//               >
//                 {s}
//                 <button
//                   className="rounded-full p-0.5 hover:bg-accent"
//                   onClick={() => removeSkill(s)}
//                   aria-label={`remove ${s}`}
//                 >
//                   <X className="h-3.5 w-3.5" />
//                 </button>
//               </span>
//             ))}
//             {!skillsSel.length && (
//               <span className="text-sm text-muted-foreground">
//                 Belum ada skill.
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Work Experience */}
//         <div className="mt-8">
//           <div className="mb-2 flex items-center justify-between">
//             <h3 className="text-base font-semibold">Work Experience</h3>
//             <button
//               onClick={addWork}
//               className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
//             >
//               <Plus className="h-4 w-4" />
//               Add
//             </button>
//           </div>

//           <div className="grid grid-cols-1 gap-3">
//             {work.map((w) => (
//               <div key={w.id} className="rounded-lg border p-3">
//                 <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//                   <div>
//                     <label className="mb-1 block text-xs font-medium">
//                       Company name
//                     </label>
//                     <input
//                       className="w-full rounded-md border px-3 py-2"
//                       value={w.company}
//                       onChange={(e) =>
//                         updateWork(w.id, { company: e.target.value })
//                       }
//                       placeholder="e.g. Acme Inc."
//                     />
//                   </div>
//                   <div>
//                     <label className="mb-1 block text-xs font-medium">
//                       Job title
//                     </label>
//                     <input
//                       className="w-full rounded-md border px-3 py-2"
//                       value={w.title}
//                       onChange={(e) =>
//                         updateWork(w.id, { title: e.target.value })
//                       }
//                       placeholder="e.g. Backend Engineer"
//                     />
//                   </div>
//                   <div>
//                     <label className="mb-1 block text-xs font-medium">
//                       Start date
//                     </label>
//                     <input
//                       type="date"
//                       className="w-full rounded-md border px-3 py-2"
//                       value={w.start}
//                       onChange={(e) =>
//                         updateWork(w.id, { start: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div>
//                     <label className="mb-1 block text-xs font-medium">
//                       End date
//                     </label>
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="date"
//                         disabled={w.current}
//                         className="w-full rounded-md border px-3 py-2 disabled:opacity-60"
//                         value={w.end ?? ""}
//                         onChange={(e) =>
//                           updateWork(w.id, { end: e.target.value })
//                         }
//                       />
//                       <label className="inline-flex items-center gap-2 text-sm">
//                         <input
//                           type="checkbox"
//                           checked={Boolean(w.current)}
//                           onChange={(e) =>
//                             updateWork(w.id, { current: e.target.checked })
//                           }
//                         />
//                         Current
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-2 flex justify-end">
//                   <button
//                     className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
//                     onClick={() => removeWork(w.id)}
//                   >
//                     <Trash2 className="h-4 w-4" /> Remove
//                   </button>
//                 </div>
//               </div>
//             ))}
//             {!work.length && (
//               <div className="rounded-lg border p-4 text-sm text-muted-foreground">
//                 Belum ada pengalaman kerja.
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* ============= SECTION 3: EDUCATION & CERTS ============= */}
//       <section className="rounded-xl border bg-card/80 p-4 sm:p-6">
//         {/* Educations */}
//         <div className="mb-6">
//           <div className="mb-2 flex items-center justify-between">
//             <h3 className="text-base font-semibold">Educations</h3>
//             <button
//               onClick={addEdu}
//               className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
//             >
//               <Plus className="h-4 w-4" />
//               Add
//             </button>
//           </div>

//           <div className="grid grid-cols-1 gap-3">
//             {edu.map((e) => (
//               <div key={e.id} className="rounded-lg border p-3">
//                 <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//                   <div>
//                     <label className="mb-1 block text-xs font-medium">
//                       Institution (Uzbekistan)
//                     </label>
//                     <div className="relative">
//                       <Building2 className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
//                       <select
//                         className="w-full appearance-none rounded-md border px-3 py-2 pr-9"
//                         value={e.school}
//                         onChange={(ev) =>
//                           updateEdu(e.id, { school: ev.target.value })
//                         }
//                       >
//                         <option value="">Select institution…</option>
//                         {UZ_INSTITUTIONS.map((s) => (
//                           <option key={s} value={s}>
//                             {s}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                   <div>
//                     <label className="mb-1 block text-xs font-medium">
//                       Degree
//                     </label>
//                     <select
//                       className="w-full rounded-md border px-3 py-2"
//                       value={e.degree}
//                       onChange={(ev) =>
//                         updateEdu(e.id, { degree: ev.target.value })
//                       }
//                     >
//                       <option value="">Select degree…</option>
//                       {UZ_DEGREES.map((d) => (
//                         <option key={d} value={d}>
//                           {d}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="mb-1 block text-xs font-medium">
//                       Major
//                     </label>
//                     <input
//                       className="w-full rounded-md border px-3 py-2"
//                       value={e.major ?? ""}
//                       onChange={(ev) =>
//                         updateEdu(e.id, { major: ev.target.value })
//                       }
//                       placeholder="e.g. Computer Science"
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="mb-1 block text-xs font-medium">
//                         Start date
//                       </label>
//                       <input
//                         type="date"
//                         className="w-full rounded-md border px-3 py-2"
//                         value={e.start}
//                         onChange={(ev) =>
//                           updateEdu(e.id, { start: ev.target.value })
//                         }
//                       />
//                     </div>
//                     <div>
//                       <label className="mb-1 block text-xs font-medium">
//                         End date
//                       </label>
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="date"
//                           disabled={e.current}
//                           className="w-full rounded-md border px-3 py-2 disabled:opacity-60"
//                           value={e.end ?? ""}
//                           onChange={(ev) =>
//                             updateEdu(e.id, { end: ev.target.value })
//                           }
//                         />
//                         <label className="inline-flex items-center gap-2 text-sm">
//                           <input
//                             type="checkbox"
//                             checked={Boolean(e.current)}
//                             onChange={(ev) =>
//                               updateEdu(e.id, { current: ev.target.checked })
//                             }
//                           />
//                           Current
//                         </label>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-2 flex justify-end">
//                   <button
//                     className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
//                     onClick={() => removeEdu(e.id)}
//                   >
//                     <Trash2 className="h-4 w-4" /> Remove
//                   </button>
//                 </div>
//               </div>
//             ))}
//             {!edu.length && (
//               <div className="rounded-lg border p-4 text-sm text-muted-foreground">
//                 Belum ada pendidikan.
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Certifications */}
//         <div>
//           <div className="mb-2 flex items-center justify-between">
//             <h3 className="text-base font-semibold">
//               Certifications (PDF, max 2MB)
//             </h3>
//             <button
//               onClick={addCert}
//               className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
//             >
//               <Plus className="h-4 w-4" />
//               Add
//             </button>
//           </div>

//           <div className="grid grid-cols-1 gap-3">
//             {certs.map((c) => (
//               <div key={c.id} className="rounded-lg border p-3">
//                 <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//                   <div>
//                     <label className="mb-1 block text-xs font-medium">
//                       Title/Name *
//                     </label>
//                     <input
//                       className="w-full rounded-md border px-3 py-2"
//                       value={c.title}
//                       onChange={(e) =>
//                         updateCert(c.id, { title: e.target.value })
//                       }
//                       placeholder="e.g. AWS Certified Solutions Architect"
//                     />
//                   </div>
//                   <div>
//                     <label className="mb-1 block text-xs font-medium">
//                       Issuer *
//                     </label>
//                     <input
//                       className="w-full rounded-md border px-3 py-2"
//                       value={c.issuer}
//                       onChange={(e) =>
//                         updateCert(c.id, { issuer: e.target.value })
//                       }
//                       placeholder="e.g. Amazon Web Services"
//                     />
//                   </div>

//                   <div>
//                     <label className="mb-1 block text-xs font-medium">
//                       Issue date
//                     </label>
//                     <input
//                       type="date"
//                       className="w-full rounded-md border px-3 py-2"
//                       value={c.issueDate ?? ""}
//                       onChange={(e) =>
//                         updateCert(c.id, { issueDate: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div>
//                     <label className="mb-1 block text-xs font-medium">
//                       Expiry date
//                     </label>
//                     <input
//                       type="date"
//                       className="w-full rounded-md border px-3 py-2"
//                       value={c.expiryDate ?? ""}
//                       onChange={(e) =>
//                         updateCert(c.id, { expiryDate: e.target.value })
//                       }
//                     />
//                   </div>
//                 </div>

//                 {/* File */}
//                 <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
//                   <div className="text-xs text-muted-foreground">
//                     {c.fileName ? (
//                       <>
//                         {c.fileName} · {c.size ? fmtSize(c.size) : ""}
//                       </>
//                     ) : (
//                       <>No file</>
//                     )}
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
//                       <Upload className="h-4 w-4" />
//                       Upload PDF
//                       <input
//                         type="file"
//                         accept="application/pdf"
//                         className="hidden"
//                         onChange={(e) => onCertFile(c.id, e.target.files?.[0])}
//                       />
//                     </label>
//                     {c.url && (
//                       <a
//                         href={c.url}
//                         target="_blank"
//                         className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
//                       >
//                         Preview
//                       </a>
//                     )}
//                     <button
//                       className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
//                       onClick={() => removeCert(c.id)}
//                     >
//                       <Trash2 className="h-4 w-4" /> Remove
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {!certs.length && (
//               <div className="rounded-lg border p-4 text-sm text-muted-foreground">
//                 Belum ada sertifikasi.
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Save bar */}
//       <div className="flex items-center justify-end gap-3">
//         <Link
//           href="/profile"
//           className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
//         >
//           Cancel
//         </Link>
//         <button
//           onClick={onSave}
//           className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
//         >
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// }

// /** ---------- Small field wrapper ---------- */
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
//     <div className={`space-y-1 ${full ? "md:col-span-2" : ""}`}>
//       <label className="block text-xs font-medium">
//         {label} {required && <span className="text-red-600">*</span>}
//       </label>
//       {children}
//     </div>
//   );
// }

// /** ---------- Upload resume sub-form ---------- */
// function UploadResume({
//   onAdd,
// }: {
//   onAdd: (file: File, title: string) => void;
// }) {
//   const [file, setFile] = React.useState<File | null>(null);
//   const [title, setTitle] = React.useState("");

//   return (
//     <div className="mt-3 grid grid-cols-1 gap-3 rounded-lg border p-3 md:grid-cols-[1fr,1fr,auto]">
//       <div>
//         <label className="mb-1 block text-xs font-medium">Upload PDF</label>
//         <label className="inline-flex w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-accent">
//           <span className="truncate">
//             {file ? `${file.name} · ${fmtSize(file.size)}` : "Choose file…"}
//           </span>
//           <Upload className="h-4 w-4" />
//           <input
//             type="file"
//             accept="application/pdf"
//             className="hidden"
//             onChange={(e) => setFile(e.target.files?.[0] ?? null)}
//           />
//         </label>
//       </div>
//       <div>
//         <label className="mb-1 block text-xs font-medium">Title *</label>
//         <input
//           className="w-full rounded-md border px-3 py-2"
//           placeholder="e.g. Professional Resume"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//       </div>
//       <div className="flex items-end">
//         <button
//           className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 md:w-auto"
//           onClick={() => {
//             if (!file) return alert("Choose a PDF file");
//             onAdd(file, title);
//             setFile(null);
//             setTitle("");
//           }}
//         >
//           Add Resume
//         </button>
//       </div>
//     </div>
//   );
// }

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
} from "lucide-react";

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
  name: string;
  phone?: string;
  dob?: string;
  gender?: Gender;
  nationality?: string;
  religion?: Religion;
  marital?: Marital;
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
const CV_MAX_MB = 2;
const PHOTO_MAX_MB = 1;

const COUNTRIES = [
  "Uzbekistan",
  "Kazakhstan",
  "Kyrgyzstan",
  "Tajikistan",
  "Turkmenistan",
  "Russia",
  "Turkey",
  "India",
  "Indonesia",
  "Malaysia",
  "United States",
  "United Kingdom",
  "Germany",
  "France",
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
  // keep digits + comma/period; normalize to dot decimal; constrain
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
  const [resumes, setResumes] = React.useState<ResumeItem[]>([]);
  const [portfolios, setPortfolios] = React.useState<PortfolioItem[]>([]);
  const [skillsSel, setSkillsSel] = React.useState<string[]>([]);
  const [skillsBank, setSkillsBank] = React.useState<string[]>([]);
  const [work, setWork] = React.useState<WorkItem[]>([]);
  const [edu, setEdu] = React.useState<EduItem[]>([]);
  const [certs, setCerts] = React.useState<CertItem[]>([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        setProfile(obj.profile ?? { name: "" });
        setResumes(obj.resumes ?? []);
        setPortfolios(obj.portfolios ?? []);
        setSkillsSel(obj.skillsSel ?? []);
        setWork(obj.work ?? []);
        setEdu(obj.edu ?? []);
        setCerts(obj.certs ?? []);
      }
      setSkillsBank(getSkillsBank());
    } catch {}
  }, []);
  const persist = React.useCallback(() => {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({
        profile,
        resumes,
        portfolios,
        skillsSel,
        work,
        edu,
        certs,
      })
    );
  }, [profile, resumes, portfolios, skillsSel, work, edu, certs]);
  React.useEffect(() => {
    persist();
  }, [persist]);

  /** ===== Profile handlers ===== */
  const onPhoto = (f?: File) => {
    if (!f) return;
    const okType = /image\/(png|jpe?g)/i.test(f.type);
    const okSize = f.size <= PHOTO_MAX_MB * 1024 * 1024;
    if (!okType || !okSize) {
      alert("Photo must be PNG/JPG/JPEG and ≤ 1 MB");
      return;
    }
    const url = URL.createObjectURL(f);
    setProfile((p) => ({ ...p, photoUrl: url, photoName: f.name }));
  };

  /** ===== Resume handlers ===== */
  const addResume = async (file: File, title: string) => {
    if (!/application\/pdf/i.test(file.type)) return alert("Only PDF allowed");
    if (file.size > CV_MAX_MB * 1024 * 1024)
      return alert(`Max size ${CV_MAX_MB}MB`);
    if (!title.trim()) return alert("Title is required");
    if (resumes.length >= RESUME_LIMIT)
      return alert(`Max ${RESUME_LIMIT} resumes`);

    const url = URL.createObjectURL(file);
    const item: ResumeItem = {
      id: uid("cv_"),
      title: title.trim(),
      fileName: file.name,
      size: file.size,
      url,
      primary: resumes.length === 0, // first becomes primary
      uploadedAt: new Date().toISOString(),
    };
    setResumes((r) => [item, ...r]);
  };
  const setPrimaryResume = (id: string) =>
    setResumes((r) => r.map((x) => ({ ...x, primary: x.id === id })));
  const removeResume = (id: string) =>
    setResumes((r) => {
      const next = r.filter((x) => x.id !== id);
      if (!next.some((x) => x.primary) && next[0]) next[0].primary = true;
      return [...next];
    });

  /** ===== Portfolios ===== */
  const addPortfolio = () =>
    setPortfolios((p) => {
      if (p.length >= PORTFOLIO_LIMIT) {
        alert(`Max ${PORTFOLIO_LIMIT} portfolios`);
        return p;
      }
      return [{ id: uid("pf_"), title: "" }, ...p];
    });
  const updatePortfolio = (id: string, patch: Partial<PortfolioItem>) =>
    setPortfolios((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const removePortfolio = (id: string) =>
    setPortfolios((p) => p.filter((x) => x.id !== id));

  /** ===== Skills ===== */
  const [skillQuery, setSkillQuery] = React.useState("");
  const suggestions = React.useMemo(() => {
    if (!skillQuery) return [];
    const q = skillQuery.toLowerCase();
    return skillsBank
      .filter((s) => s.toLowerCase().includes(q) && !skillsSel.includes(s))
      .slice(0, 7);
  }, [skillQuery, skillsBank, skillsSel]);
  const addSkill = (s: string) => {
    const val = s.trim();
    if (!val) return;
    if (skillsSel.includes(val)) return;
    const next = [...skillsSel, val];
    setSkillsSel(next);
    const bank = Array.from(new Set([val, ...skillsBank]));
    setSkillsBank(bank);
    saveSkillsBank(bank);
    setSkillQuery("");
  };
  const removeSkill = (s: string) =>
    setSkillsSel((list) => list.filter((x) => x !== s));

  /** ===== Work & Edu ===== */
  const addWork = () =>
    setWork((w) => [
      {
        id: uid("w_"),
        company: "",
        title: "",
        start: "",
        current: true,
      },
      ...w,
    ]);
  const updateWork = (id: string, patch: Partial<WorkItem>) =>
    setWork((w) => w.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const removeWork = (id: string) =>
    setWork((w) => w.filter((x) => x.id !== id));

  const addEdu = () =>
    setEdu((e) => [
      {
        id: uid("e_"),
        school: "",
        degree: "",
        major: "",
        start: "",
        current: true,
      },
      ...e,
    ]);
  const updateEdu = (id: string, patch: Partial<EduItem>) =>
    setEdu((e) => e.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const removeEdu = (id: string) => setEdu((e) => e.filter((x) => x.id !== id));

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

  /** ===== Submit (local-only demo) ===== */
  const onSave = () => {
    persist();
    alert("Saved locally. Integrasikan API backend untuk persist ke server.");
  };

  /* -------------------------------------------------------------------- */
  /* View                                                                 */
  /* -------------------------------------------------------------------- */
  return (
    <div className="space-y-8">
      {/* =================== SECTION 1: PERSONAL INFO =================== */}
      <section className="rounded-2xl border bg-card/80 p-5 sm:p-6">
        <header className="mb-4">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <p className="text-sm text-muted-foreground">
            Lengkapi profilmu agar rekruter lebih mudah mengenalmu.
          </p>
        </header>

        <div className="mt-2 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Name */}
          <Field label="Name" required>
            <input
              className="w-full rounded-lg border px-3 py-2"
              value={profile.name}
              onChange={(e) =>
                setProfile((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="Your full name"
            />
          </Field>

          {/* Photo */}
          <Field label="Photo Profile (max 1 MB, png/jpg/jpeg)">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 overflow-hidden rounded-full ring-1 ring-border">
                {profile.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.photoUrl}
                    alt="photo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
                    No Photo
                  </div>
                )}
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-accent">
                <Upload className="h-4 w-4" />
                Upload
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={(e) => onPhoto(e.target.files?.[0])}
                />
              </label>
              {profile.photoName && (
                <span className="truncate text-xs text-muted-foreground">
                  {profile.photoName}
                </span>
              )}
            </div>
          </Field>

          {/* Phone */}
          <Field label="Telephone (max 20 char)">
            <input
              maxLength={20}
              className="w-full rounded-lg border px-3 py-2"
              value={profile.phone ?? ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder="+998-XX-XXX-XX-XX"
            />
          </Field>

          {/* DOB */}
          <Field label="Date of birth">
            <div className="relative">
              <CalIcon className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                className="w-full rounded-lg border px-3 py-2 pr-9"
                value={profile.dob ?? ""}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, dob: e.target.value }))
                }
              />
            </div>
          </Field>

          {/* Gender */}
          <Field label="Gender">
            <Select
              value={profile.gender ?? ""}
              onChange={(v) =>
                setProfile((p) => ({ ...p, gender: v as Gender }))
              }
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Others", value: "others" },
              ]}
            />
          </Field>

          {/* Nationality */}
          <Field label="Nationality">
            <Select
              value={profile.nationality ?? ""}
              onChange={(v) => setProfile((p) => ({ ...p, nationality: v }))}
              options={COUNTRIES.map((c) => ({ label: c, value: c }))}
              placeholder="Select country…"
            />
          </Field>

          {/* Religion */}
          <Field label="Religion">
            <Select
              value={profile.religion ?? ""}
              onChange={(v) =>
                setProfile((p) => ({ ...p, religion: v as Religion }))
              }
              options={[
                "islam",
                "kristen",
                "katolik",
                "hindu",
                "buddha",
                "konghucu",
                "judaism",
                "others",
              ].map((r) => ({ label: capitalize(r), value: r }))}
            />
          </Field>

          {/* Marital */}
          <Field label="Marriage status">
            <Select
              value={profile.marital ?? ""}
              onChange={(v) =>
                setProfile((p) => ({ ...p, marital: v as Marital }))
              }
              options={["married", "not married", "divorced", "widowed"].map(
                (m) => ({ label: capitalize(m), value: m })
              )}
            />
          </Field>

          {/* Address */}
          <Field label="Address" full>
            <textarea
              rows={2}
              className="w-full rounded-lg border px-3 py-2"
              value={profile.address ?? ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, address: e.target.value }))
              }
              placeholder="Street, City, Province"
            />
          </Field>

          {/* Profile summary */}
          <Field label="Profile summary" full>
            <textarea
              rows={3}
              className="w-full rounded-lg border px-3 py-2"
              value={profile.summary ?? ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, summary: e.target.value }))
              }
              placeholder="Short summary about yourself"
            />
          </Field>

          {/* Salaries */}
          <Field label="Current salary (12,2)">
            <input
              inputMode="decimal"
              className="w-full rounded-lg border px-3 py-2"
              value={profile.currentSalary ?? ""}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  currentSalary: toMoney12_2(e.target.value),
                }))
              }
              placeholder="e.g. 1200.00"
            />
          </Field>
          <Field label="Expected salary (12,2)">
            <input
              inputMode="decimal"
              className="w-full rounded-lg border px-3 py-2"
              value={profile.expectedSalary ?? ""}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  expectedSalary: toMoney12_2(e.target.value),
                }))
              }
              placeholder="e.g. 2000.00"
            />
          </Field>
        </div>
      </section>

      {/* =================== SECTION 2: CV / PORTFOLIO / SKILLS =================== */}
      <section className="rounded-2xl border bg-card/80 p-5 sm:p-6">
        {/* CV */}
        <header>
          <h3 className="text-lg font-semibold">Resumes (PDF, max 2MB)</h3>
          <p className="text-sm text-muted-foreground">
            Maksimal {RESUME_LIMIT} file. Pilih satu sebagai <b>Utama</b>.
          </p>
        </header>

        <div className="mt-4">
          <UploadResume onAdd={addResume} />
        </div>

        {/* List */}
        <div className="mt-4 grid grid-cols-1 gap-3">
          {resumes.map((cv) => (
            <div
              key={cv.id}
              className="flex items-center justify-between rounded-xl border p-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium">{cv.title}</span>
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
              <div className="flex items-center gap-2">
                <a
                  href={cv.url}
                  target="_blank"
                  className="rounded-lg border px-3 py-1.5 text-sm hover:bg-accent"
                >
                  Preview
                </a>
                <button
                  className="rounded-lg border px-3 py-1.5 text-sm hover:bg-accent"
                  onClick={() => setPrimaryResume(cv.id)}
                >
                  Set Primary
                </button>
                <button
                  className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => removeResume(cv.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </div>
          ))}
          {!resumes.length && (
            <div className="rounded-xl border p-4 text-sm text-muted-foreground">
              Belum ada resume diunggah.
            </div>
          )}
        </div>

        {/* Portfolio */}
        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Portfolios (max {PORTFOLIO_LIMIT})
            </h3>
            <button
              onClick={addPortfolio}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-accent"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {portfolios.map((pf) => (
              <div key={pf.id} className="rounded-xl border p-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <LabeledInput
                    label="Title *"
                    value={pf.title}
                    onChange={(v) => updatePortfolio(pf.id, { title: v })}
                    placeholder="e.g. Design System"
                  />
                  <LabeledInput
                    label="Description"
                    value={pf.description ?? ""}
                    onChange={(v) => updatePortfolio(pf.id, { description: v })}
                    placeholder="Short summary"
                  />
                  <LabeledInput
                    label="Portfolio Link"
                    value={pf.link ?? ""}
                    onChange={(v) => updatePortfolio(pf.id, { link: v })}
                    placeholder="https://…"
                  />
                </div>
                <div className="mt-2 flex justify-end">
                  <button
                    className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => removePortfolio(pf.id)}
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            ))}
            {!portfolios.length && (
              <div className="rounded-xl border p-4 text-sm text-muted-foreground">
                Belum ada portfolio.
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="mt-8">
          <h3 className="mb-2 text-lg font-semibold">Skills</h3>
          <div className="relative">
            <input
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Search or add skill…"
              value={skillQuery}
              onChange={(e) => setSkillQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill(skillQuery);
                }
              }}
            />
            {!!suggestions.length && (
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
            )}
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
                  onClick={() => removeSkill(s)}
                  aria-label={`remove ${s}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
            {!skillsSel.length && (
              <span className="text-sm text-muted-foreground">
                Belum ada skill.
              </span>
            )}
          </div>
        </div>
      </section>

      {/* =================== SECTION 3: EDUCATION & CERTS =================== */}
      <section className="rounded-2xl border bg-card/80 p-5 sm:p-6">
        {/* Educations */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Educations</h3>
            <button
              onClick={addEdu}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-accent"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {edu.map((e) => (
              <div key={e.id} className="rounded-xl border p-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Institution (Uzbekistan)
                    </label>
                    <div className="relative">
                      <Building2 className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <select
                        className="w-full appearance-none rounded-lg border px-3 py-2 pr-9"
                        value={e.school}
                        onChange={(ev) =>
                          updateEdu(e.id, { school: ev.target.value })
                        }
                      >
                        <option value="">Select institution…</option>
                        {UZ_INSTITUTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Degree
                    </label>
                    <select
                      className="w-full rounded-lg border px-3 py-2"
                      value={e.degree}
                      onChange={(ev) =>
                        updateEdu(e.id, { degree: ev.target.value })
                      }
                    >
                      <option value="">Select degree…</option>
                      {UZ_DEGREES.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <LabeledInput
                    label="Major"
                    value={e.major ?? ""}
                    onChange={(v) => updateEdu(e.id, { major: v })}
                    placeholder="e.g. Computer Science"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <LabeledInput
                      label="Start date"
                      type="date"
                      value={e.start}
                      onChange={(v) => updateEdu(e.id, { start: v })}
                    />
                    <div>
                      <label className="mb-1 block text-xs font-medium">
                        End date
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          disabled={e.current}
                          className="w-full rounded-lg border px-3 py-2 disabled:opacity-60"
                          value={e.end ?? ""}
                          onChange={(ev) =>
                            updateEdu(e.id, { end: ev.target.value })
                          }
                        />
                        <label className="inline-flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={Boolean(e.current)}
                            onChange={(ev) =>
                              updateEdu(e.id, { current: ev.target.checked })
                            }
                          />
                          Current
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <button
                    className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => removeEdu(e.id)}
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            ))}
            {!edu.length && (
              <div className="rounded-xl border p-4 text-sm text-muted-foreground">
                Belum ada pendidikan.
              </div>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <div className="mb-2 flex items-center justify-between">
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
                    label="Title/Name *"
                    value={c.title}
                    onChange={(v) => updateCert(c.id, { title: v })}
                    placeholder="e.g. AWS Certified Solutions Architect"
                  />
                  <LabeledInput
                    label="Issuer *"
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

                {/* File */}
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
                        onChange={(e) => onCertFile(c.id, e.target.files?.[0])}
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
                Belum ada sertifikasi.
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onSave}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
          >
            Save Changes
          </button>
        </div>
      </section>

      {/* Save bar (global) */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/profile"
          className="rounded-lg border px-4 py-2 text-sm hover:bg-accent"
        >
          Cancel
        </Link>
        <button
          onClick={onSave}
          className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Save Changes
        </button>
      </div>
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium">{label}</label>
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
function Select({
  value,
  onChange,
  options,
  placeholder = "Select…",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        className="w-full appearance-none rounded-lg border px-3 py-2 pr-8"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {/* caret */}
      <svg
        className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 011.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

/** Upload form for Resume */
function UploadResume({
  onAdd,
}: {
  onAdd: (file: File, title: string) => void;
}) {
  const [file, setFile] = React.useState<File | null>(null);
  const [title, setTitle] = React.useState("");

  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border p-3 md:grid-cols-[1fr,1fr,auto]">
      <div>
        <label className="mb-1 block text-xs font-medium">Upload PDF</label>
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
      <div>
        <label className="mb-1 block text-xs font-medium">Title *</label>
        <input
          className="w-full rounded-lg border px-3 py-2"
          placeholder="e.g. Professional Resume"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex items-end">
        <button
          className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 md:w-auto"
          onClick={() => {
            if (!file) return alert("Choose a PDF file");
            onAdd(file, title);
            setFile(null);
            setTitle("");
          }}
        >
          Add Resume
        </button>
      </div>
    </div>
  );
}
