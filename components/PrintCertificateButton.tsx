"use client";

export default function PrintCertificateButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="text-sm text-forest underline underline-offset-4 transition-colors duration-300 hover:text-forest/80"
    >
      Print Certificate of Provenance
    </button>
  );
}
