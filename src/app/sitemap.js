import { caseStudies } from "../data/caseStudies";

/* ---------------------------------------------------------------------------
 * XML sitemap (served at /sitemap.xml). Lists every indexable route so search
 * engines discover and crawl them. Dynamic case-study pages are generated from
 * the data file, so new case studies appear automatically.
 * Keep `MAINTENANCE_PATHS` / noindex routes (e.g. /maintenance) OUT of here.
 * ------------------------------------------------------------------------- */

const siteUrl = "https://smoovelylogistics.com";

export default function sitemap() {
  const staticRoutes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/quote", priority: 0.9, changeFrequency: "monthly" },
    { path: "/solutions", priority: 0.9, changeFrequency: "monthly" },
    { path: "/industries", priority: 0.7, changeFrequency: "monthly" },
    { path: "/case-studies", priority: 0.7, changeFrequency: "monthly" },
    { path: "/resources", priority: 0.6, changeFrequency: "weekly" },
    { path: "/careers", priority: 0.5, changeFrequency: "monthly" },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/services", priority: 0.7, changeFrequency: "monthly" },
  ].map((r) => ({
    url: `${siteUrl}${r.path}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const caseStudyRoutes = caseStudies.map((cs) => ({
    url: `${siteUrl}/case-studies/${cs.slug}`,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...caseStudyRoutes];
}
