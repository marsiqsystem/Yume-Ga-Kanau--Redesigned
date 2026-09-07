import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

/* Next builds this into /robots.txt.

   Everything is crawlable except three things:

     /api/    the mail endpoints. Nothing to index; they only answer POST.
     /admin   Sensei's private console.
     /d/      generated document links. Each one is meant for exactly one
              student, and a fee receipt carrying a name and an amount should
              never turn up in a search result.

   The last two also carry `noindex` in their own page metadata, which is
   deliberate belt and braces: robots.txt stops a crawl, the meta tag stops a
   link that someone pastes somewhere public from being indexed anyway.

   The sitemap line is what points crawlers at the full list of pages without
   them having to discover each one by following links. */

/* The crawlers behind AI search and chat answers. A blanket `User-agent: *`
   already permits them, but two of these are opt-OUT gates that publishers are
   widely assumed to have shut, so naming them settles the question:

     Google-Extended    controls whether the site may inform Gemini and the AI
                        answers in Google Search. It is not a fetcher of its own
                        and does not affect ordinary Google ranking either way.
     Applebot-Extended  the same gate, for Apple Intelligence.

   The rest are real fetchers: OpenAI's index and its live browsing, the
   equivalents for Claude and Perplexity, and Meta's. Listing them makes the
   intent explicit — this school WANTS to be quoted by answer engines, because
   that is where a lot of "how do I start learning Japanese" now gets asked.

   To reverse any of this, move that agent into a rule with `disallow: "/"`.
   robots.txt is a request that well-behaved crawlers honour, not enforcement. */
const AI_AGENTS = [
  "Google-Extended",
  "Applebot-Extended",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "meta-externalagent",
  "Amazonbot",
  "cohere-ai",
  "DuckAssistBot",
  "MistralAI-User",
];

const PRIVATE = ["/api/", "/admin", "/d/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_AGENTS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
