import type { Metadata } from "next";
import "./documents.css";

/* Route group for the enrolment document pack: the admin console at /admin and
   the generated documents at /d/... . A route group adds no path segment, so
   the URLs stay short — it exists purely so both branches share this layout and
   its stylesheet.

   Nothing here is for search engines. The admin console is private, and a
   document link is meant for exactly one student — a receipt with a name and an
   amount on it should never turn up in a search result. `noindex, nofollow`
   says so at the page level; app/robots.ts disallows the paths as well, and the
   two together are deliberate: robots.txt stops a crawl, the meta tag stops a
   link someone pastes in public from being indexed anyway. */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function PackLayout({ children }: { children: React.ReactNode }) {
  return <div className="pack">{children}</div>;
}
