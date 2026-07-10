import type { Metadata } from "next";
import CellarView from "@/components/CellarView";
import SiteFooter from "@/components/home/SiteFooter";

export const metadata: Metadata = {
  title: "My Infinite Cellar™",
  description:
    "Your saved Infinite Panama Coffee lots — reserved, reordered, and collected over time.",
};

export default function CellarPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-2xl px-6 py-24 text-center sm:py-32">
        <h1 className="font-heading text-3xl text-forest sm:text-4xl">
          My Infinite Cellar™
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-dark-gray">
          Every coffee you reserve or reorder can be added here, so your
          collection is easy to find again.
        </p>

        <div className="mt-14">
          <CellarView />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
