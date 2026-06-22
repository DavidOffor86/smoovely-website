/* ---------------------------------------------------------------------------
 * robots.txt (served at /robots.txt). Allows crawling of the whole site except
 * API routes and the maintenance page, and points crawlers at the sitemap.
 * ------------------------------------------------------------------------- */

const siteUrl = "https://smoovelylogistics.com";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/maintenance"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
