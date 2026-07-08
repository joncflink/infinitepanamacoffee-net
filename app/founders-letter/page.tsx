import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "A Letter from the Founder",
  description:
    "Why Infinite Panama Coffee exists — a letter from founder Jon Flink on stewardship, traceability, and building a company meant to last generations.",
};

function Epigraph() {
  return (
    <p className="text-center text-sm italic tracking-wide text-forest">
      Selected with patience. Built for generations.
    </p>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-14 border-l-2 border-gold py-2 pl-8 font-heading text-xl leading-relaxed text-forest sm:text-2xl">
      {children}
    </blockquote>
  );
}

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jon Flink",
  jobTitle: "Founder",
  worksFor: {
    "@type": "Organization",
    name: "Infinite Panama Coffee",
  },
  url: "https://infinitepanamacoffee.com/founders-letter",
};

export default function FoundersLetterPage() {
  return (
    <main className="mx-auto w-full max-w-[700px] px-6 py-24 sm:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <header className="text-center">
        <h1 className="font-heading text-3xl text-forest sm:text-4xl">
          A Letter from the Founder
        </h1>
        <div className="mx-auto mt-8 h-px w-24 bg-gold" />
        <div className="mt-8">
          <Epigraph />
        </div>
      </header>

      <div className="mt-20 sm:flex sm:items-start sm:gap-12">
        <div className="relative mx-auto mb-12 aspect-[3/4] w-44 shrink-0 overflow-hidden rounded-xl shadow-[0_10px_40px_rgba(31,77,58,0.14)] sm:mx-0 sm:mb-0 sm:w-52">
          <Image
            src="/images/founder-jon.jpg"
            alt="Jon Flink, Founder of Infinite Panama Coffee"
            fill
            sizes="208px"
            className="object-cover"
          />
        </div>

        <div className="space-y-7 text-base leading-9 text-dark-gray">
          <p>Welcome,</p>
          <p>If you&rsquo;re reading this, thank you.</p>
          <p>
            Whether you&rsquo;re a coffee roaster, café owner, importer, or
            simply someone who believes extraordinary products begin with
            extraordinary people, I&rsquo;m grateful you&rsquo;ve found us.
          </p>
          <p>
            Infinite Panama Coffee was never meant to be just another coffee
            company.
          </p>
          <p>
            It began with a simple conviction: the finest coffee in the world
            deserves more than a transaction. It deserves stewardship.
          </p>
        </div>
      </div>

      <div className="mt-7 space-y-7 text-base leading-9 text-dark-gray">
        <p>
          After relocating to Boquete, Panama, I found myself surrounded by
          one of the world&rsquo;s most remarkable coffee-growing regions.
          Beyond the mountains and volcanic soil, what impressed me most were
          the people. Families who have devoted generations to perfecting
          their craft. Producers who understand that exceptional coffee is
          earned through patience, discipline, and respect for the land.
        </p>
        <p>
          Their work inspired a question that became the foundation of this
          company:
        </p>

        <PullQuote>
          What if every bag of coffee honored not only the harvest, but also
          the people and the journey behind it?
        </PullQuote>

        <p>That question became Infinite Panama Coffee.</p>

        <div className="space-y-6 py-6 text-center sm:text-left">
          <p className="italic text-forest">We are intentionally small.</p>
          <p className="italic text-forest">We are intentionally selective.</p>
        </div>

        <p>
          We choose relationships over volume, transparency over marketing,
          and long-term trust over short-term growth.
        </p>
        <p>
          Every coffee we offer is selected because we believe it deserves to
          represent the Infinite name.
        </p>
        <p>
          We believe traceability should be the standard, not the exception.
          Every lot has a story. Every harvest reflects a season of work,
          weather, and care. Every producer deserves recognition for the
          craftsmanship that brought the coffee into existence.
        </p>
        <p>
          That is why every bag is connected to its own Infinite Coffee
          Passport™&mdash;a living record of origin, harvest, process, and
          journey. We want every customer to understand not only what they
          are buying, but where it came from and why it matters.
        </p>
        <p>
          But Infinite Panama Coffee is about something larger than coffee.
        </p>
        <p>
          It is one member of The Infinite Companies™, an organization built
          around a single enduring belief:
        </p>

        <PullQuote>Create things that become more valuable with time.</PullQuote>

        <div className="space-y-6 py-6 text-center sm:text-left">
          <p className="italic text-forest">
            In a world that often rewards speed, we choose patience.
          </p>
          <p className="italic text-forest">
            In a world focused on scale, we choose craftsmanship.
          </p>
          <p className="italic text-forest">
            In a world chasing trends, we choose permanence.
          </p>
        </div>

        <p>We are not building a company for the next season.</p>
        <p>
          We are building a company that we hope will still be earning trust
          a century from now.
        </p>
        <p>
          That ambition influences every decision we make&mdash;from the
          relationships we build with producers, to the care we put into our
          packaging, to the transparency we promise every customer.
        </p>
        <p>
          If we succeed, people will remember us not because we claimed to
          have the best coffee, but because we consistently honored the
          people, the place, and the principles behind every bag.
        </p>
        <p>Thank you for becoming part of this journey.</p>
        <p>
          I hope every cup reminds you that remarkable things are rarely
          rushed.
        </p>
        <p>They are selected with patience.</p>
        <p>They are built for generations.</p>
      </div>

      <div className="mt-16">
        <p className="text-base leading-9 text-dark-gray">Warm regards,</p>
        <p
          aria-hidden="true"
          className="mt-6 font-heading text-3xl italic tracking-wide text-forest/80"
        >
          Jon Flink
        </p>
        <p className="mt-5 font-heading text-lg text-forest">Jon Flink</p>
        <p className="mt-2 text-sm text-dark-gray">Founder</p>
        <p className="mt-1 text-sm text-dark-gray">Infinite Panama Coffee™</p>
        <p className="mt-4 text-xs tracking-wide text-dark-gray/80">
          A Member of The Infinite Companies™
        </p>
      </div>

      <div className="mx-auto mt-20 h-px w-24 bg-gold" />
      <div className="mt-10">
        <Epigraph />
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/passport/IPC-ALT-001#passport"
          className="inline-block rounded-full bg-forest px-9 py-[1.1rem] text-sm tracking-wide text-cream transition-all duration-300 ease-out hover:bg-forest/90 hover:-translate-y-0.5"
        >
          Explore the Infinite Coffee Passport™
        </Link>
      </div>
    </main>
  );
}
