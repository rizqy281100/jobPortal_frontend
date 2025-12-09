import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "ru", "uz"] as const; // ← tambahkan "uz"
export const defaultLocale = "en";

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  const currentLocale: Locale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  return {
    locale: currentLocale,
    messages: (await import(`./messages/${currentLocale}.json`)).default,
  };
});
