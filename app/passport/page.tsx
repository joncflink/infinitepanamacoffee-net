import type { Metadata } from "next";
import PassportLookupForm from "@/components/PassportLookupForm";
import SiteFooter from "@/components/home/SiteFooter";

export const metadata: Metadata = {
  title: "Find Your Coffee Passport™",
  description:
    "Enter the Passport Number printed on your coffee to explore its origin, harvest, process, and permanent provenance record.",
};

export default function PassportLookupPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-2xl px-6 py-24 text-center sm:py-32">
        <h1 className="font-heading text-3xl text-forest sm:text-4xl">
          Find Your Coffee Passport™
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-dark-gray">
          Enter the Passport Number printed on your coffee to explore its
          origin, harvest, process, and permanent provenance record.
        </p>

        <PassportLookupForm className="mx-auto mt-12 max-w-md" source="passport_page" />
      </main>
      <SiteFooter />
    </>
  );
}
