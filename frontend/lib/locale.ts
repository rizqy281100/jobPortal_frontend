export function makeHref(locale: string, href: string) {
  if (!locale) return href; // fallback aman

  if (href === "/") return `/${locale}`;

  return `/${locale}${href}`;
}
