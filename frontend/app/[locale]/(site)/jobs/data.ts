/* ========================= Types ========================= */
export type Job = {
  id: string;
  recruiter_id: string;
  company_name: string;
  avatar_url: string;
  title: string;
  description: string;
  location: string;
  employment_type: string;
  experience_level: string;
  salary_type: string;
  salary_min: string;
  salary_max: string;
  currency: string;
  status_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  policy: string;
  tags: [];
  colorKeys?: { type: string; policy: string; exp: string };
};

/* ============ Province → City → District ============ */
const CITY_BANK = [
  {
    city: "Tashkent City",
    province: "Tashkent",
    districts: ["Mirabad", "Yunusabad"],
  },
  {
    city: "Samarkand City",
    province: "Samarkand",
    districts: ["Registan", "Siab"],
  },
  {
    city: "Bukhara City",
    province: "Bukhara",
    districts: ["Shofirkon", "Romitan"],
  },
  {
    city: "Fergana City",
    province: "Fergana",
    districts: ["Yangiobod", "Kokand"],
  },
  {
    city: "Andijan City",
    province: "Andijan",
    districts: ["Khodjaobod", "Asaka"],
  },
  { city: "Nukus", province: "Karakalpakstan", districts: ["Amir Temur"] },
  { city: "Jizzakh City", province: "Jizzakh", districts: ["Zafar"] },
  { city: "Karshi", province: "Kashkadarya", districts: ["Shurtan"] },
  { city: "Gulistan", province: "Syrdarya", districts: ["Yangiyer"] },
  { city: "Urgench", province: "Khorezm", districts: ["Khonqa"] },
  { city: "Termez", province: "Surxondaryo", districts: ["Denov"] },
  { city: "Navoi City", province: "Navoi", districts: ["Zarafshan"] },
] as const;

const TYPES: Job["employment_type"][] = [
  "fulltime",
  "parttime",
  "contract",
  "internship",
  "volunteer",
];
const POLICIES: Job["policy"][] = ["wfh", "wfo", "hybrid"];
const EXPS: Job["experience_level"][] = [
  "noexp",
  "fresh",
  "1-2",
  "3-5",
  "6-10",
  "10+",
];

const TITLES = [
  "Software Engineer",
  "Frontend Engineer",
  "Backend Developer",
  "Full-stack Developer",
  "Data Analyst",
  "Data Engineer",
  "Data Scientist",
  "Product Manager",
  "Project Manager",
  "UX/UI Designer",
  "QA Engineer",
  "DevOps Engineer",
  "Site Reliability Engineer",
  "iOS Developer",
  "Android Developer",
  "Graphic Designer",
  "Marketing Specialist",
  "Content Writer",
  "HR Generalist",
  "Finance Analyst",
];

const COMP_SUFFIX = [
  "Tech",
  "Labs",
  "Systems",
  "Group",
  "Digital",
  "Studio",
  "Solutions",
  "Holdings",
  "Works",
  "Global",
];

/* ============ Helper: salary range per experience ============ */
function salaryByExp(exp: Job["experience_level"]): [number, number] {
  switch (exp) {
    case "noexp":
      return [3, 5]; // UZS ~3–5M
    case "fresh":
      return [4, 6];
    case "1-2":
      return [6, 10];
    case "3-5":
      return [10, 16];
    case "6-10":
      return [16, 24];
    case "10+":
      return [22, 32];
  }
}

/* ============ Generator: 120 deterministic jobs ============ */
const AGO = [
  "today",
  "yesterday",
  "2 days ago",
  "3 days ago",
  "4 days ago",
  "5 days ago",
  "6 days ago",
  "1 week ago",
];

export const JOBS: Job[] = Array.from({ length: 120 }, (_, idx) => {
  const i = idx + 1;

  const cityObj = CITY_BANK[idx % CITY_BANK.length];
  const district = cityObj.districts[idx % cityObj.districts.length];

  const type = TYPES[idx % TYPES.length];
  const policy = POLICIES[idx % POLICIES.length];
  const exp = EXPS[idx % EXPS.length];

  const [minM, maxM] = salaryByExp(exp);
  // variasi kecil agar tidak seragam (deterministik)
  const tweak = (i % 3) - 1; // -1, 0, +1
  const salaryMinM = Math.max(
    exp === "noexp" ? 2 : 3,
    minM + (tweak === -1 ? -1 : 0)
  );
  const salaryMaxM = Math.max(salaryMinM + 1, maxM + (tweak === 1 ? 1 : 0));

  const title = TITLES[idx % TITLES.length];
  const company = `${cityObj.city.split(" ")[0]} ${
    COMP_SUFFIX[idx % COMP_SUFFIX.length]
  }`;

  return {
    id: String(i),
    title,
    company,
    type,
    policy,
    exp,
    salaryMinM,
    salaryMaxM,
    postedAgo: AGO[idx % AGO.length],
    province: cityObj.province,
    region: cityObj.city, // konsisten dg JobsClient
    district,
    colorKeys: { type: "blue", policy: "emerald", exp: "indigo" }, // optional, aman utk tema
  } as Job;
});

/* ============ Finder ============ */
export const findJobById = (id: string) => JOBS.find((j) => j.id === id);
