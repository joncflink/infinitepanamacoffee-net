export const PRIMARY_NAV = [
  { href: "/#story", label: "Our Story" },
  { href: "/#origin", label: "Origin" },
  { href: "/#coffee", label: "The Coffee" },
  { href: "/passport", label: "Passport" },
  { href: "/#faq", label: "FAQ" },
];

export const WAITLIST_CTA = { href: "/harvest", label: "Join the Harvest Waitlist" };

/** Internal / admin routes: reachable by URL, never in public chrome or search. */
export const INTERNAL_PREFIXES = ["/labels", "/inventory", "/qr-test"];

export function isInternalPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return INTERNAL_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
