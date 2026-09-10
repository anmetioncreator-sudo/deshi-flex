import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/admin", "/admin/", "/api/"],
    },
    sitemap: "https://www.deshiflex.shop/sitemap.xml",
  };
}
