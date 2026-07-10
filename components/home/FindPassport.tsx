import ScrollReveal from "@/components/ScrollReveal";
import PassportLookupForm from "@/components/PassportLookupForm";

/**
 * Homepage entry point for customers who don't reach a passport page via a
 * QR code — deliberately placed right after Hero (not inside it) so it's
 * prominent without competing with the hero's own CTAs. See AMAZON_LABEL_ID_MODE
 * in components/labels/constants.ts for why a QR-free path matters here.
 */
export default function FindPassport() {
  return (
    <section className="w-full max-w-2xl px-6 py-16 text-center sm:py-20">
      <ScrollReveal>
        <h2 className="font-heading text-2xl text-forest sm:text-3xl">
          Find Your Coffee Passport™
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-dark-gray">
          Enter the Passport Number printed on your coffee to explore its
          origin, harvest, process, and permanent provenance record.
        </p>
        <PassportLookupForm className="mx-auto mt-8 max-w-md" source="homepage" />
      </ScrollReveal>
    </section>
  );
}
