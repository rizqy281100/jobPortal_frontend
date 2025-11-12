import axios from "axios";

const baseApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // ✅ otomatis ke http://localhost:5000/api/v1
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // ⚠️ ubah ke false, biar gak kirim cookie cross-origin
});

console.log("✅ BASE URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

export default baseApi;
