import ScrollReveal from "@/components/ScrollReveal";
import { WHY_INFINITE } from "@/data/site";

export default function WhyInfinite() {
  return (
    <section className="w-full max-w-4xl px-6 py-28 text-center sm:py-36">
      <ScrollReveal>
        <h2 className="font-heading text-2xl text-forest sm:text-3xl">
          Why Infinite?
        </h2>
      </ScrollReveal>

      <div className="mt-14 grid gap-8 sm:grid-cols-3">
        {WHY_INFINITE.map((item, i) => (
          <ScrollReveal key={item.title} delayMs={i * 120}>
            <div className="h-full rounded-lg border border-gold/25 px-8 py-12">
              <h3 className="font-heading text-lg text-forest">
                {item.title}
              </h3>
              <p className="mt-5 text-sm leading-7 text-dark-gray">
                {item.body}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
