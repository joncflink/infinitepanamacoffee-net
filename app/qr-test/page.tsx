import type { Metadata } from "next";
import { coffees, getFullName } from "@/data/coffees";

export const metadata: Metadata = {
  title: "QR Test",
  robots: { index: false, follow: false },
};

export default function QrTestPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-dark-gray">
      <p className="text-xs tracking-[0.3em] text-soft-gray">
        INTERNAL VALIDATION ONLY
      </p>
      <h1 className="mt-3 font-heading text-2xl text-forest">
        QR Code Test Page
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-charcoal">
        Not linked from site navigation, not indexed by search engines. Use
        this page to visually check and physically test-scan each coffee&rsquo;s
        QR codes before sending anything to a printer.
      </p>

      <div className="mt-6 rounded-lg border border-gold/40 bg-gold/10 px-5 py-4 text-sm leading-6 text-charcoal">
        <strong className="font-heading text-forest">
          Print and test at 20mm, 25mm, and 30mm before production labels.
        </strong>{" "}
        Scan each printed size with multiple phone cameras/QR apps and confirm
        it opens the exact Passport URL shown below, with no redirect
        warnings.
      </div>

      <div className="mt-4 rounded-lg border border-gold/25 px-5 py-4 text-xs leading-6 text-soft-gray">
        For passports whose labels are already printed, the un-suffixed
        (&ldquo;plain&rdquo;) file may be identical to the live printed design
        rather than a fresh, icon-free fallback — see{" "}
        <code>/public/qr/README.md</code> for the exact story on each file.
      </div>

      <div className="mt-12 space-y-16">
        {coffees.map((coffee) => {
          const passportUrl = `https://infinitepanamacoffee.com/passport/${coffee.passportNumber}`;
          const plainSvg = `/qr/${coffee.passportNumber}.svg`;
          const plainPng = `/qr/${coffee.passportNumber}-1024.png`;
          const brandedSvg = `/qr/${coffee.passportNumber}-branded.svg`;
          const brandedPng = `/qr/${coffee.passportNumber}-branded-1024.png`;

          return (
            <section key={coffee.passportNumber} className="border-t border-gold/25 pt-10">
              <h2 className="font-heading text-lg text-forest">
                {getFullName(coffee)}
              </h2>
              <dl className="mt-2 space-y-1 text-sm">
                <div>
                  <dt className="inline text-soft-gray">Passport No.: </dt>
                  <dd className="inline font-medium">{coffee.passportNumber}</dd>
                </div>
                <div>
                  <dt className="inline text-soft-gray">Passport URL: </dt>
                  <dd className="inline">
                    <a
                      href={passportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-forest underline underline-offset-4"
                    >
                      {passportUrl}
                    </a>
                  </dd>
                </div>
              </dl>

              <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-forest">Plain QR</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={plainSvg}
                    alt={`Plain QR code for ${coffee.passportNumber}`}
                    width={220}
                    height={220}
                    className="mt-3 h-[220px] w-[220px] border border-gold/25"
                  />
                  <div className="mt-3 flex gap-4 text-xs">
                    <a href={plainSvg} download className="text-forest underline underline-offset-4">
                      Download SVG
                    </a>
                    <a href={plainPng} download className="text-forest underline underline-offset-4">
                      Download PNG
                    </a>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-forest">Branded QR</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={brandedSvg}
                    alt={`Branded QR code for ${coffee.passportNumber}`}
                    width={220}
                    height={220}
                    className="mt-3 h-[220px] w-[220px] border border-gold/25"
                  />
                  <div className="mt-3 flex gap-4 text-xs">
                    <a href={brandedSvg} download className="text-forest underline underline-offset-4">
                      Download SVG
                    </a>
                    <a href={brandedPng} download className="text-forest underline underline-offset-4">
                      Download PNG
                    </a>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-16 border-t border-gold/25 pt-8 text-sm leading-6 text-charcoal">
        <h2 className="font-heading text-base text-forest">
          Test Scan Instructions
        </h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5">
          <li>Print each code at 20mm, 25mm, and 30mm on the actual label stock.</li>
          <li>
            Scan with at least two different phones and both the native camera
            app and a dedicated QR scanner app.
          </li>
          <li>Confirm the destination matches the Passport URL shown above exactly.</li>
          <li>Confirm there is no browser warning, redirect prompt, or delay.</li>
          <li>Test in normal indoor light and in dim light.</li>
          <li>Only approve for print once every size and scanner combination succeeds.</li>
        </ol>
      </div>
    </main>
  );
}
