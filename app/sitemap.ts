import type { MetadataRoute } from "next";

const BASE = "https://infinitepanamacoffee.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/harvest", "/passport", "/founders-letter", "/privacy", "/terms"].map((p) => ({ url: `${BASE}${p}` }));
}
