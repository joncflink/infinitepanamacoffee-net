"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PRIMARY_NAV, WAITLIST_CTA } from "./nav";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold/30 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="font-heading text-base tracking-wide text-forest sm:text-lg" aria-label="Infinite Panama Coffee home">
          Infinite Panama Coffee<span aria-hidden="true">™</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-sm text-dark-gray">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="py-2 transition-colors hover:text-forest aria-[current=page]:text-forest aria-[current=page]:underline aria-[current=page]:underline-offset-8"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={WAITLIST_CTA.href}
            className="hidden rounded-full bg-forest px-5 py-2.5 text-sm tracking-wide text-cream transition-colors hover:bg-forest/90 sm:inline-block"
          >
            {WAITLIST_CTA.label}
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-forest lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-gold/30 bg-cream px-5 pb-8 pt-4 lg:hidden">
          <ul className="flex flex-col divide-y divide-gold/20">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)} className="block py-4 font-heading text-lg text-forest">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={WAITLIST_CTA.href}
            onClick={() => setOpen(false)}
            className="mt-6 block rounded-full bg-forest px-6 py-4 text-center text-sm tracking-wide text-cream"
          >
            {WAITLIST_CTA.label}
          </Link>
        </nav>
      )}
    </header>
  );
}
