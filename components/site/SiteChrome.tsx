"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "./SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import { isInternalPath } from "./nav";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const internal = isInternalPath(usePathname());
  if (internal) return <>{children}</>;
  return (
    <>
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-forest focus:px-5 focus:py-3 focus:text-cream">
        Skip to content
      </a>
      <SiteHeader />
      <div id="content" className="flex flex-1 flex-col">{children}</div>
      <SiteFooter />
    </>
  );
}
