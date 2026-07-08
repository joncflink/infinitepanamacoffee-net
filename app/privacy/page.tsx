import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-dark-gray">
      <h1 className="font-heading text-2xl text-forest">Privacy Policy</h1>
      <p className="mt-6 text-sm leading-7">
        This page is a placeholder while our formal privacy policy is
        finalized. Infinite Panama Coffee does not currently collect personal
        information through this website. Pages on this site may embed
        third-party services (such as Google Maps), which are subject to
        that provider&rsquo;s own privacy policy.
      </p>
      <p className="mt-4 text-sm leading-7">
        For questions, contact us on WhatsApp at{" "}
        <a
          href="https://wa.me/12072335784"
          target="_blank"
          rel="noopener noreferrer"
          className="text-forest underline underline-offset-4"
        >
          +1 207-233-5784
        </a>
        .
      </p>
    </main>
  );
}
