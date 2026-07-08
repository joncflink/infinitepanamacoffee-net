import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-dark-gray">
      <h1 className="font-heading text-2xl text-forest">Terms of Use</h1>
      <p className="mt-6 text-sm leading-7">
        This page is a placeholder while our formal terms of use are
        finalized. This website and its content are provided by Infinite
        Panama Coffee, a member of The Infinite Companies™. Product orders
        are fulfilled through Amazon or arranged directly with us.
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
