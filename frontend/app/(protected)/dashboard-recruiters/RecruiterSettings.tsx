"use client";

import * as React from "react";

/* ========================================================================
   Types
   ======================================================================== */

type RecruiterSettings = {
  companyName: string; // VARCHAR(150)
  companyWebsite?: string; // VARCHAR(255)
  contactName?: string; // VARCHAR(100)
  contactPhone?: string; // VARCHAR(30)
  companyAddress?: string; // TEXT
  industry?: string; // VARCHAR(100)
  description?: string; // TEXT
};

/* ========================================================================
   Constants & Helpers
   ======================================================================== */

const LS_KEY_RECRUITER = "recruiterSettings_v1";

function toPhone30(v: string) {
  // keep only digits, +, space, - and max length 30
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

  /** ===== Load from localStorage on mount ===== */
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY_RECRUITER);
      if (raw) {
        const obj = JSON.parse(raw) as RecruiterSettings;
        setSettings({
          companyName: obj.companyName ?? "",
          companyWebsite: obj.companyWebsite ?? "",
          contactName: obj.contactName ?? "",
          contactPhone: obj.contactPhone ?? "",
          companyAddress: obj.companyAddress ?? "",
          industry: obj.industry ?? "",
          description: obj.description ?? "",
        });
      }
    } catch {
      // ignore
    }
  }, []);

  /** ===== Persist helper ===== */
  const persist = React.useCallback(() => {
    localStorage.setItem(LS_KEY_RECRUITER, JSON.stringify(settings));
  }, [settings]);

  // Auto-persist on changes
  React.useEffect(() => {
    persist();
  }, [persist]);

  /** ===== Manual Save ===== */
  const onSave = () => {
    persist();
    alert(
      "Recruiter settings saved locally. Integrate your backend API to save this data to the server."
    );
  };

  /* -------------------------------------------------------------------- */
  /* View                                                                 */
  /* -------------------------------------------------------------------- */

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
            {/* 1. Company name (VARCHAR 150) */}
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

            {/* 2. Company website (VARCHAR 255) */}
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

            {/* 3. Contact name (VARCHAR 100) */}
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

            {/* 4. Contact phone (VARCHAR 30) */}
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

            {/* 5. Company address (TEXT) */}
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

            {/* 6. Industry (VARCHAR 100) */}
            <Field label="Industry">
              <input
                className="w-full rounded-lg border px-3 py-2"
                placeholder="e.g. Information Technology, FMCG, Banking..."
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

            {/* 7. Description (TEXT) */}
            <Field label="Company Description" full>
              <textarea
                rows={4}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Describe your company, culture, and work environment..."
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
