import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import { CellarProvider } from "@/components/CellarProvider";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://infinitepanamacoffee.com"),
  title: {
    default: "Infinite Panama Coffee",
    template: "%s | Infinite Panama Coffee",
  },
  description:
    "Specialty green coffee beans from Boquete, Panama. Selected with care by Infinite Panama Coffee, a member of The Infinite Companies.",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Infinite Panama Coffee",
  alternateName: "Infinite Panama Coffee™",
  url: "https://infinitepanamacoffee.com",
  logo: "https://infinitepanamacoffee.com/images/infinite-panama-coffee-logo.png",
  description:
    "Specialty green coffee beans from Boquete, Panama. Selected with care by Infinite Panama Coffee, a member of The Infinite Companies.",
  founder: {
    "@type": "Person",
    name: "Jon Flink",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-charcoal">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <CellarProvider>{children}</CellarProvider>
      </body>
    </html>
  );
}
