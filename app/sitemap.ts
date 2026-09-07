import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

/* Next builds this into /sitemap.xml. Submit that URL once in Google Search
   Console; after that every deploy refreshes it automatically.

   `priority` and `changeFrequency` are hints Google largely ignores now, but
   they cost nothing and other crawlers still read them. */
/* lastModified used to be `new Date()`, which told Google all four pages had
   just changed on every deploy — including deploys that only touched a
   stylesheet. Google learns to distrust a lastModified that is always "now" and
   then ignores the field, which is the opposite of what it is for.

   These are real dates. Edit one when that page's CONTENT actually changes: a
   rewritten section counts, a typo fix or a styling tweak does not. */
const UPDATED = {
  home: "2026-09-07",
  explore: "2026-09-07",
  about: "2026-09-07",
  contact: "2026-09-07",
  legal: "2026-09-07",
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE.url}/`, lastModified: UPDATED.home, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.url}/explore`, lastModified: UPDATED.explore, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/about`, lastModified: UPDATED.about, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE.url}/contact`, lastModified: UPDATED.contact, changeFrequency: "yearly", priority: 0.8 },
    /* The legal documents are listed so they can be found and cited, but at low
       priority — they are not what anyone is searching for. */
    { url: `${SITE.url}/privacy`, lastModified: UPDATED.legal, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/terms`, lastModified: UPDATED.legal, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/cookies`, lastModified: UPDATED.legal, changeFrequency: "yearly", priority: 0.3 },
  ];
}
