import { api } from "@/lib/axios";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: { id: number; name: string; email: string };
}

async function handleLogin() {
  const payload: LoginPayload = {
    email: "user@example.com",
    password: "password123",
  };

  const res = await api.post<LoginResponse>("/users/login", payload);
  console.log(res.user.name); // ✅ aman & auto-type
}
