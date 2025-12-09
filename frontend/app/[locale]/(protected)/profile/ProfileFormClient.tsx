"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Upload,
  Calendar,
  Link as LinkIcon,
  User2,
  MapPin,
  BadgeCheck,
  BriefcaseBusiness,
  GraduationCap,
  Award,
  FileText,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

/* ====================== Types ====================== */
type Edu = {
  school: string;
  degree: string;
  field: string;
  start: string; // yyyy-mm
  end: string; // yyyy-mm atau ""
};
type Work = {
  company: string;
  title: string;
  start: string; // yyyy-mm
  end: string; // yyyy-mm atau "" (current)
  desc: string;
};
type Cert = { name: string; issuer: string; year: string };
type AwardT = { name: string; issuer: string; year: string };
type Org = {
  org: string;
  role: string;
  start: string;
  end: string;
  desc: string;
};
type LinkItem = { label: string; url: string };

/* ====================== Helper ====================== */
function ymToDate(ym: string) {
  // "2022-03" -> Date(2022, 2)
  if (!ym) return null;
  const [y, m] = ym.split("-").map(Number);
  if (!y || !m) return null;
  return new Date(y, m - 1, 1);
}
function diffYears(a: Date, b: Date) {
  const ms = Math.max(0, b.getTime() - a.getTime());
  return ms / (1000 * 60 * 60 * 24 * 365.25);
}

/* ====================== Component ====================== */
export default function ProfileFormClient({
  defaultName,
  defaultEmail,
}: {
  defaultName: string;
  defaultEmail: string;
}) {
  /* ---- Identitas dasar ---- */
  const [name, setName] = React.useState(defaultName);
  const [email] = React.useState(defaultEmail);
  const [phone, setPhone] = React.useState("");
  const [telegram, setTelegram] = React.useState("");
  const [gender, setGender] = React.useState<"male" | "female" | "other" | "">(
    ""
  );
  const [age, setAge] = React.useState<number | "">("");
  const [location, setLocation] = React.useState("");
  const [about, setAbout] = React.useState("");

  /* ---- Foto profil ---- */
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [photoURL, setPhotoURL] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!photoFile) return setPhotoURL(null);
    const url = URL.createObjectURL(photoFile);
    setPhotoURL(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  /* ---- CV ---- */
  const [cvFile, setCvFile] = React.useState<File | null>(null);

  /* ---- Skills (tag input) ---- */
  const [skillInput, setSkillInput] = React.useState("");
  const [skills, setSkills] = React.useState<string[]>([]);
  const addSkill = () => {
    const v = skillInput.trim();
    if (!v) return;
    if (skills.includes(v)) return;
    setSkills((s) => [...s, v]);
    setSkillInput("");
  };
  const removeSkill = (i: number) =>
    setSkills((s) => s.filter((_, idx) => idx !== i));

  /* ---- Pendidikan / Pengalaman / Sertifikat / Penghargaan / Organisasi ---- */
  const [edus, setEdus] = React.useState<Edu[]>([]);
  const [works, setWorks] = React.useState<Work[]>([]);
  const [certs, setCerts] = React.useState<Cert[]>([]);
  const [awards, setAwards] = React.useState<AwardT[]>([]);
  const [orgs, setOrgs] = React.useState<Org[]>([]);
  const [links, setLinks] = React.useState<LinkItem[]>([]);

  /* ---- Total pengalaman (dihitung dari works) ---- */
  const totalExpYears = React.useMemo(() => {
    const now = new Date();
    const sum = works.reduce((acc, w) => {
      const s = ymToDate(w.start);
      const e = w.end ? ymToDate(w.end) : now;
      if (!s || !e) return acc;
      return acc + diffYears(s, e);
    }, 0);
    return Math.round(sum * 10) / 10; // 0.1 precision
  }, [works]);

  /* ---- Submit (simulasi) ---- */
  const [saving, setSaving] = React.useState(false);
  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Simulasi kirim ke server
    await new Promise((r) => setTimeout(r, 900));

    // Data yang akan dikirim
    const payload = {
      name,
      email,
      phone,
      telegram,
      gender,
      age,
      location,
      about,
      skills,
      edus,
      works,
      certs,
      awards,
      orgs,
      links,
      totalExpYears,
      cv: cvFile?.name ?? null,
      photo: photoFile?.name ?? null,
    };
    console.log("PROFILE PAYLOAD", payload);

    toast.success("Profile saved!");
    setSaving(false);
  };

  return (
    <form onSubmit={onSave} className="space-y-6">
      {/* ====== Header ringkas (foto, nama, summary) ====== */}
      <section className="rounded-xl border bg-card p-5">
        <div className="flex items-start gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border bg-muted">
            {photoURL ? (
              <Image
                src={photoURL}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">
                <User2 className="h-6 w-6" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextField label="Email" value={email} readOnly />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <TextField
                label="WhatsApp"
                placeholder="+998…"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <TextField
                label="Telegram"
                placeholder="@username"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
              />
              <TextField
                label="Location"
                placeholder="Tashkent, Uzbekistan"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                leftIcon={<MapPin className="h-4 w-4 text-muted-foreground" />}
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <SelectField
                label="Gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                options={[
                  { label: "Select", value: "" },
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Other", value: "other" },
                ]}
              />
              <TextField
                label="Age"
                type="number"
                min={15}
                max={80}
                value={age}
                onChange={(e) =>
                  setAge(e.target.value ? Number(e.target.value) : "")
                }
              />
              <ReadOnlyField
                label="Total Experience"
                value={`${totalExpYears} years`}
                leftIcon={
                  <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
                }
              />
            </div>
          </div>

          <div className="shrink-0">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent">
              <Upload className="h-4 w-4" />
              Upload Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium">About Me</label>
          <textarea
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            rows={4}
            placeholder="Ceritakan singkat tentang dirimu, keahlian, dan minat karier…"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </div>
      </section>

      {/* ====== Skills ====== */}
      <section className="rounded-xl border bg-card p-5">
        <SectionTitle
          icon={<BadgeCheck className="h-4 w-4" />}
          title="Skills"
        />
        <div className="mt-3 flex gap-2">
          <input
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="Tambah skill (Enter)…"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
          />
          <Button type="button" onClick={addSkill} variant="secondary">
            Add
          </Button>
        </div>
        {!!skills.length && (
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs"
              >
                {s}
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => removeSkill(i)}
                  aria-label="Remove skill"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ====== Upload CV ====== */}
      <section className="rounded-xl border bg-card p-5">
        <SectionTitle
          icon={<FileText className="h-4 w-4" />}
          title="Curriculum Vitae (CV)"
        />
        <div className="mt-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Format PDF/DOCX, maksimal ±5MB. CV membantu rekruter memahami profil
            kamu.
          </p>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent">
            <Upload className="h-4 w-4" />
            {cvFile ? "Change CV" : "Upload CV"}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => setCvFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>
        {cvFile && (
          <p className="mt-2 text-sm">
            Current file: <b>{cvFile.name}</b>
          </p>
        )}
      </section>

      {/* ====== Education ====== */}
      <DynamicList<Edu>
        title="Education"
        icon={<GraduationCap className="h-4 w-4" />}
        items={edus}
        setItems={setEdus}
        renderItem={(ed, idx, update, remove) => (
          <TwoCol>
            <TextField
              label="School / University"
              value={ed.school}
              onChange={(e) => update({ school: e.target.value })}
            />
            <TextField
              label="Degree"
              placeholder="B.Sc / M.Sc / Diploma"
              value={ed.degree}
              onChange={(e) => update({ degree: e.target.value })}
            />
            <TextField
              label="Field of Study"
              value={ed.field}
              onChange={(e) => update({ field: e.target.value })}
            />
            <DateRange
              start={ed.start}
              end={ed.end}
              onChange={(p) => update(p)}
            />
            <RemoveRow onClick={remove} />
          </TwoCol>
        )}
        blank={() => ({
          school: "",
          degree: "",
          field: "",
          start: "",
          end: "",
        })}
      />

      {/* ====== Work Experience ====== */}
      <DynamicList<Work>
        title="Work Experience"
        icon={<BriefcaseBusiness className="h-4 w-4" />}
        items={works}
        setItems={setWorks}
        renderItem={(w, idx, update, remove) => (
          <TwoCol>
            <TextField
              label="Company"
              value={w.company}
              onChange={(e) => update({ company: e.target.value })}
            />
            <TextField
              label="Job Title"
              value={w.title}
              onChange={(e) => update({ title: e.target.value })}
            />
            <DateRange
              start={w.start}
              end={w.end}
              onChange={(p) => update(p)}
            />
            <TextAreaField
              label="Description / Achievements"
              rows={3}
              value={w.desc}
              onChange={(e) => update({ desc: e.target.value })}
            />
            <RemoveRow onClick={remove} />
          </TwoCol>
        )}
        blank={() => ({ company: "", title: "", start: "", end: "", desc: "" })}
        footerExtra={
          <p className="text-xs text-muted-foreground">
            Total pengalaman terhitung otomatis: <b>{totalExpYears} tahun</b>
          </p>
        }
      />

      {/* ====== Organizations & Volunteer ====== */}
      <DynamicList<Org>
        title="Organizations & Volunteer"
        icon={<HeartHandshake className="h-4 w-4" />}
        items={orgs}
        setItems={setOrgs}
        renderItem={(o, idx, update, remove) => (
          <TwoCol>
            <TextField
              label="Organization"
              value={o.org}
              onChange={(e) => update({ org: e.target.value })}
            />
            <TextField
              label="Role"
              value={o.role}
              onChange={(e) => update({ role: e.target.value })}
            />
            <DateRange
              start={o.start}
              end={o.end}
              onChange={(p) => update(p)}
            />
            <TextAreaField
              label="Description"
              rows={3}
              value={o.desc}
              onChange={(e) => update({ desc: e.target.value })}
            />
            <RemoveRow onClick={remove} />
          </TwoCol>
        )}
        blank={() => ({ org: "", role: "", start: "", end: "", desc: "" })}
      />

      {/* ====== Certificates ====== */}
      <DynamicList<Cert>
        title="Certificates"
        icon={<FileText className="h-4 w-4" />}
        items={certs}
        setItems={setCerts}
        renderItem={(c, idx, update, remove) => (
          <TwoCol>
            <TextField
              label="Certificate"
              value={c.name}
              onChange={(e) => update({ name: e.target.value })}
            />
            <TextField
              label="Issuer"
              value={c.issuer}
              onChange={(e) => update({ issuer: e.target.value })}
            />
            <TextField
              label="Year"
              type="number"
              min={1990}
              max={2100}
              value={c.year}
              onChange={(e) => update({ year: e.target.value })}
            />
            <RemoveRow onClick={remove} />
          </TwoCol>
        )}
        blank={() => ({ name: "", issuer: "", year: "" })}
      />

      {/* ====== Awards ====== */}
      <DynamicList<AwardT>
        title="Awards"
        icon={<Award className="h-4 w-4" />}
        items={awards}
        setItems={setAwards}
        renderItem={(a, idx, update, remove) => (
          <TwoCol>
            <TextField
              label="Award"
              value={a.name}
              onChange={(e) => update({ name: e.target.value })}
            />
            <TextField
              label="Issuer"
              value={a.issuer}
              onChange={(e) => update({ issuer: e.target.value })}
            />
            <TextField
              label="Year"
              type="number"
              min={1990}
              max={2100}
              value={a.year}
              onChange={(e) => update({ year: e.target.value })}
            />
            <RemoveRow onClick={remove} />
          </TwoCol>
        )}
        blank={() => ({ name: "", issuer: "", year: "" })}
      />

      {/* ====== Portofolio / Social / Dokumen ====== */}
      <DynamicList<LinkItem>
        title="Links (Portfolio / Social / Docs)"
        icon={<LinkIcon className="h-4 w-4" />}
        items={links}
        setItems={setLinks}
        renderItem={(l, idx, update, remove) => (
          <TwoCol>
            <TextField
              label="Label"
              placeholder="Portfolio / LinkedIn / GitHub / Google Drive"
              value={l.label}
              onChange={(e) => update({ label: e.target.value })}
            />
            <TextField
              label="URL"
              placeholder="https://…"
              value={l.url}
              onChange={(e) => update({ url: e.target.value })}
            />
            <RemoveRow onClick={remove} />
          </TwoCol>
        )}
        blank={() => ({ label: "", url: "" })}
      />

      {/* ====== Save ====== */}
      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            // reset ringan (tidak termasuk email & nama)
            setPhone("");
            setTelegram("");
            setGender("");
            setAge("");
            setLocation("");
            setAbout("");
            setSkills([]);
            setEdus([]);
            setWorks([]);
            setCerts([]);
            setAwards([]);
            setOrgs([]);
            setLinks([]);
            setCvFile(null);
            setPhotoFile(null);
            toast("Form reset");
          }}
        >
          Reset
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

/* ====================== Reusable UI ====================== */
function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="rounded-md border p-1.5 text-muted-foreground">
        {icon}
      </span>
      <h2 className="text-base font-semibold">{title}</h2>
    </div>
  );
}
function TextField(
  props: React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    leftIcon?: React.ReactNode;
  }
) {
  const { label, leftIcon, className = "", ...rest } = props;
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-2 top-2.5">{leftIcon}</span>
        )}
        <input
          {...rest}
          className={`w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary ${
            leftIcon ? "pl-8" : ""
          } ${className}`}
        />
      </div>
    </div>
  );
}
function ReadOnlyField({
  label,
  value,
  leftIcon,
}: {
  label: string;
  value: string;
  leftIcon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-2 top-2.5">{leftIcon}</span>
        )}
        <div
          className={`w-full rounded-md border bg-muted px-3 py-2 text-sm ${
            leftIcon ? "pl-8" : ""
          }`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
function TextAreaField(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }
) {
  const { label, className = "", ...rest } = props;
  return (
    <div className="space-y-1.5 sm:col-span-2">
      <label className="text-sm font-medium">{label}</label>
      <textarea
        {...rest}
        className={`w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary ${className}`}
      />
    </div>
  );
}
function SelectField({
  label,
  options,
  ...rest
}: {
  label: string;
  options: { label: string; value: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <select
        {...rest}
        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
function DateRange({
  start,
  end,
  onChange,
}: {
  start: string;
  end: string;
  onChange: (patch: Partial<{ start: string; end: string }>) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField
        label="Start"
        type="month"
        value={start}
        onChange={(e) => onChange({ start: e.target.value })}
        leftIcon={<Calendar className="h-4 w-4 text-muted-foreground" />}
      />
      <TextField
        label="End (empty = current)"
        type="month"
        value={end}
        onChange={(e) => onChange({ end: e.target.value })}
        leftIcon={<Calendar className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
}
function TwoCol({ children }: React.PropsWithChildren) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
function RemoveRow({ onClick }: { onClick: () => void }) {
  return (
    <div className="sm:col-span-2">
      <div className="mt-2 flex justify-end">
        <Button
          type="button"
          variant="ghost"
          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
          onClick={onClick}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Remove
        </Button>
      </div>
      <Separator className="my-4" />
    </div>
  );
}

/* ======= Generic Dynamic List Section ======= */
function DynamicList<T>({
  title,
  icon,
  items,
  setItems,
  renderItem,
  blank,
  footerExtra,
}: {
  title: string;
  icon: React.ReactNode;
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  renderItem: (
    item: T,
    index: number,
    update: (patch: Partial<T>) => void,
    remove: () => void
  ) => React.ReactNode;
  blank: () => T;
  footerExtra?: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card p-5">
      <SectionTitle icon={icon} title={title} />
      <div className="mt-4">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Belum ada data. Tambahkan entri di bawah.
          </p>
        )}

        {items.map((it, i) => (
          <div key={i}>
            {renderItem(
              it,
              i,
              (patch) =>
                setItems((arr) =>
                  arr.map((row, idx) =>
                    idx === i ? { ...row, ...patch } : row
                  )
                ),
              () => setItems((arr) => arr.filter((_, idx) => idx !== i))
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        {footerExtra ?? <div />}
        <Button
          type="button"
          variant="secondary"
          className="gap-2"
          onClick={() => setItems((arr) => [...arr, blank()])}
        >
          <Plus className="h-4 w-4" />
          Add {title.slice(0, 1).toLowerCase() + title.slice(1)}
        </Button>
      </div>
    </section>
  );
}
