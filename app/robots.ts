import type { MetadataRoute } from "next";

// Internal pages are kept out of search via per-page noindex/nofollow metadata,
// so they are intentionally not named here.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://infinitepanamacoffee.com/sitemap.xml",
  };
}
