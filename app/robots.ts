import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Sayfaların kendi <meta robots> etiketi de noindex/nofollow veriyor;
      // burası taramanın en baştan olmaması için.
      disallow: ["/panel", "/panel/", "/etsy", "/etsy/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
