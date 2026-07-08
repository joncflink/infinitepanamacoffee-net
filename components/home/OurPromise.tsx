import ScrollReveal from "@/components/ScrollReveal";
import { OUR_PROMISE } from "@/data/site";

export default function OurPromise() {
  return (
    <section className="w-full max-w-2xl px-6 py-28 text-center sm:py-36">
      <ScrollReveal>
        <h2 className="font-heading text-2xl text-forest sm:text-3xl">
          Our Promise
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-dark-gray">
          {OUR_PROMISE}
        </p>
      </ScrollReveal>
    </section>
  );
}
