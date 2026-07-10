import Link from "next/link";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full max-w-3xl px-6 pb-16 pt-8 text-center text-sm text-dark-gray">
      <div className="mx-auto mb-12 h-px w-24 bg-gold/60" />
      <p className="font-heading text-forest">Infinite Panama Coffee™</p>
      <p className="mt-2">A Member of The Infinite Companies™</p>
      <p className="mt-6 text-xs text-dark-gray/80">
        &copy; {year} Infinite Panama Coffee. All rights reserved.
      </p>
      <nav className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs">
        <Link
          href="/founders-letter"
          className="py-1 transition-colors duration-300 hover:text-forest"
        >
          Founder&rsquo;s Letter
        </Link>
        <Link
          href="/passport"
          className="py-1 transition-colors duration-300 hover:text-forest"
        >
          Coffee Passport™
        </Link>
        <Link
          href="/cellar"
          className="py-1 transition-colors duration-300 hover:text-forest"
        >
          My Infinite Cellar™
        </Link>
        <Link
          href="/privacy"
          className="py-1 transition-colors duration-300 hover:text-forest"
        >
          Privacy
        </Link>
        <Link
          href="/terms"
          className="py-1 transition-colors duration-300 hover:text-forest"
        >
          Terms
        </Link>
      </nav>
    </footer>
  );
}
