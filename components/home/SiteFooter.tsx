import Link from "next/link";

const linkClass = "py-1 transition-colors duration-300 hover:text-forest";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gold/30 bg-cream text-sm text-dark-gray">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-3 sm:px-8">
        <div>
          <p className="font-heading text-forest">Infinite Panama Coffee™</p>
          <p className="mt-2">A Member of The Infinite Companies™</p>
          <Link href="/harvest" className="mt-6 inline-block rounded-full bg-forest px-6 py-3 text-xs tracking-wide text-cream hover:bg-forest/90">
            Join the Harvest Waitlist
          </Link>
        </div>
        <nav aria-label="Explore">
          <p className="font-heading text-xs tracking-[0.2em] text-forest">EXPLORE</p>
          <ul className="mt-4 space-y-2">
            <li><Link href="/harvest" className={linkClass}>Harvest Waitlist</Link></li>
            <li><Link href="/passport" className={linkClass}>Coffee Passport™</Link></li>
            <li><Link href="/founders-letter" className={linkClass}>Founder&rsquo;s Letter</Link></li>
            <li><Link href="/#faq" className={linkClass}>FAQ</Link></li>
          </ul>
        </nav>
        <nav aria-label="Legal">
          <p className="font-heading text-xs tracking-[0.2em] text-forest">LEGAL</p>
          <ul className="mt-4 space-y-2">
            <li><Link href="/privacy" className={linkClass}>Privacy</Link></li>
            <li><Link href="/terms" className={linkClass}>Terms</Link></li>
          </ul>
        </nav>
      </div>
      <p className="border-t border-gold/20 py-6 text-center text-xs text-dark-gray/80">
        &copy; {year} Infinite Panama Coffee. All rights reserved.
      </p>
    </footer>
  );
}
