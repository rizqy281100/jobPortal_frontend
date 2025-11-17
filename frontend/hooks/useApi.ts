// hooks/useApi.ts
import { useEffect, useMemo } from "react";
import { axiosAuth } from "@/lib/axiosAuth";
import { useAppSelector } from "@/store/hooks";

/**
 * Custom hook untuk menggunakan axios dengan auto token injection
 * Token akan diambil dari Redux state
 */
export function useApi() {
  const { accessToken } = useAppSelector((state) => state.auth);

  // Update axios default header setiap kali accessToken berubah
  useEffect(() => {
    if (accessToken) {
      axiosAuth.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
    } else {
      delete axiosAuth.defaults.headers.common["Authorization"];
    }
  }, [accessToken]);

  // Return instance axios yang sudah dikonfigurasi
  return useMemo(() => axiosAuth, []);
}

/**
 * Contoh penggunaan:
 *
 * const api = useApi();
 * const response = await api.get('/jobs');
 * const jobs = response.data;
 */
