import ScrollReveal from "@/components/ScrollReveal";

// Answers restate copy that already exists elsewhere on the site
// (harvest page, passport section, contact). Do not add new claims here.
const FAQS = [
  {
    q: "Is the coffee roasted?",
    a: "No. It is sold green and unroasted, so you decide how it\u2019s roasted \u2014 in a popcorn popper, a skillet, or a home drum roaster.",
  },
  {
    q: "Does it cost anything to join the waitlist?",
    a: "No. The harvest waitlist is free to join, with no payment now.",
  },
  {
    q: "When will it ship?",
    a: "The ship date will be announced later. We\u2019ll email the waitlist once it\u2019s set.",
  },
  {
    q: "What is the Infinite Coffee Passport\u2122?",
    a: "A permanent, traceable record of where each coffee came from and how it was grown. Look yours up with the Passport Number printed on your bag.",
  },
  {
    q: "How do I reach you?",
    a: "For availability or questions, reach us directly on WhatsApp.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="w-full max-w-2xl px-6 py-24 sm:py-32">
      <ScrollReveal>
        <h2 className="text-center font-heading text-2xl text-forest sm:text-3xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-12 divide-y divide-gold/30 border-y border-gold/30">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-2">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 font-heading text-base text-forest [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="text-xl text-gold transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="pb-4 text-sm leading-7 text-dark-gray">{f.a}</p>
            </details>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
