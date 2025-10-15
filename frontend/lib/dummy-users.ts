import axios from "axios";

export type User = {
  id: string;
  name: string;
  email: string;
  // DEMO ONLY: password plaintext (jangan pernah begini di produksi)
  password: string;
  username: string;
  role: "worker" | "recruiter";
};

/** Data user yang aman untuk disimpan di session / dikirim ke client */
export type PublicUser = Pick<User, "id" | "name" | "email" | "role">;

/** Utility: ubah User -> PublicUser (tanpa password) */
export function toPublicUser(u: User): PublicUser {
  const { id, name, email, role } = u;
  return { id, name, email, role };
}

/* ========================================================================== */
/* SEED Dummy Users                                                           */
/* ========================================================================== */

export const USERS: User[] = [
  {
    id: "u1",
    name: "Nizam Karimov",
    email: "nizam@example.com",
    password: "secret123",
    username: "nizam",
    role: "worker",
  },
  {
    id: "u2",
    name: "Aisha Dev",
    email: "aisha@example.com",
    password: "password",
    username: "aisha",
    role: "recruiter",
  },
  {
    id: "u3",
    name: "Admin Demo",
    email: "admin@example.com",
    password: "admin123",
    username: "admin",
    role: "worker",
  },
  // Akun demo cepat (samakan dengan default di form login)
  {
    id: "u4",
    name: "Demo User",
    email: "demo@user.com",
    password: "password",
    username: "demo",
    role: "worker",
  },
];

/* ========================================================================== */
/* Query helpers                                                              */
/* ========================================================================== */

export function findUserByEmail(email: string) {
  return USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function emailExists(email: string) {
  return Boolean(findUserByEmail(email));
}

export function isEmailAvailable(email: string) {
  return !emailExists(email);
}

/* ========================================================================== */
/* Auth helpers (DEMO)                                                        */
/* ========================================================================== */

/** Verifikasi user dengan plaintext password (DEMO ONLY) */
export function verifyUser(email: string, password: string) {
  const u = findUserByEmail(email);
  if (!u) return null;
  return u.password === password ? u : null;
}

/* Placeholder hashing—biar gampang migrasi nanti (tidak dipakai default) */
export function hashPasswordDemo(plain: string) {
  return `demo:${plain}`;
}
export function comparePasswordDemo(plain: string, hashed: string) {
  return hashed === `demo:${plain}`;
}
/** Versi verify jika suatu saat menyimpan "hash demo" (opsional, tidak dipakai) */
export function verifyUserHashed(email: string, password: string) {
  const u = findUserByEmail(email);
  if (!u) return null;
  return comparePasswordDemo(password, u.password) ? u : null;
}

/* ========================================================================== */
/* Mutations                                                                  */
/* ========================================================================== */

let idSeq = 1000;

/** Buat user baru (validasi ringan + normalisasi) */
export function createUser(input: {
  name: string;
  email: string;
  password: string;
  username: string;
  role?: User["role"];
}): User {
  const name = (input.name ?? "").trim();
  const email = (input.email ?? "").trim().toLowerCase();
  const password = input.password ?? "";
  const username = (input.username ?? "").trim();
  const role = input.role ?? "worker";

  if (!name || name.length < 2) {
    throw new Error("Name is too short");
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  if (!name || name.length < 6) {
    throw new Error("Username is too short");
  }
  if (findUserByEmail(email)) {
    throw new Error("Email already registered");
  }

  // NOTE: produksi => simpan hash password (bcrypt/argon2). Ini DEMO.
  const user: User = {
    id: `u${idSeq++}`,
    name,
    email,
    password,
    username, // DEMO ONLY
    role,
  };
  USERS.push(user);
  return user;
}

/** Dummy reset password (no-op). Return true jika email terdaftar. */
export function requestPasswordReset(email: string) {
  return emailExists(email);
}
