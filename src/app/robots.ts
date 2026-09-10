import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/admin", "/admin/", "/df-control-vault", "/df-control-vault/", "/api/"],
    },
    sitemap: "https://www.deshiflex.shop/sitemap.xml",
  };
}
