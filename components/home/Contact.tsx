import ScrollReveal from "@/components/ScrollReveal";
import { AMAZON_STORE_URL, whatsAppUrl } from "@/data/coffees";

export default function Contact() {
  return (
    <section className="w-full max-w-xl px-6 py-24 text-center sm:py-32">
      <ScrollReveal>
        <h2 className="font-heading text-2xl text-forest sm:text-3xl">
          Contact
        </h2>
        <p className="mt-8 text-base leading-8 text-dark-gray">
          For availability, pre-orders, or questions, reach us directly.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={whatsAppUrl("Altura")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full bg-forest px-9 py-4 text-sm tracking-wide text-cream transition-all duration-300 ease-out hover:bg-forest/90 sm:w-auto"
          >
            WhatsApp
          </a>
          <a
            href={AMAZON_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full border border-forest px-9 py-4 text-sm tracking-wide text-forest transition-all duration-300 ease-out hover:bg-forest/5 sm:w-auto"
          >
            Amazon Store
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}
