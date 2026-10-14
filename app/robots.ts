import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/labels", "/inventory", "/qr-test", "/cellar"] },
    sitemap: "https://infinitepanamacoffee.com/sitemap.xml",
  };
}
