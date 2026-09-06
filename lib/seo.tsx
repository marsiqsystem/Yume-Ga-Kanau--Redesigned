/* One place for the facts that structured data and metadata repeat.

   NOTE: SITE.url must be the real production domain before launch — canonical
   URLs, OG images and the sitemap are all resolved against it. Set
   NEXT_PUBLIC_SITE_URL in the Vercel project and this follows. */

export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://yumegakanau.com",
  name: "Yume Ga Kanau™",
  legalName: "Yume Ga Kanau Japanese Learning Institute",
  email: "yumegakanau22@gmail.com",
  founded: "2025-12",
  tagline: "Don't just learn Japanese, feel it!",
} as const;

/* The WhatsApp number lives here and nowhere else. It shipped as the placeholder
   91XXXXXXXXXX in four separate places once and was broken for every visitor until
   someone noticed — one constant makes that impossible to repeat. */
export const SENSEI_EMAIL = "yumegakanau22@gmail.com";

const WA_NUMBER = "919891196802";
const WA_TEXT =
  "Hello Sensei! I found Yume Ga Kanau online and I’d like to know more about " +
  "your Japanese classes and the free trial.";

export const WHATSAPP = {
  number: WA_NUMBER,
  display: "+91 98911 96802",
  numberHref: `https://wa.me/${WA_NUMBER}`,
  href: `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_TEXT)}`,
} as const;

/* Profiles the institute actually controls. `sameAs` is how a search engine or
   an answer engine decides that this site, that Instagram account and any
   mention elsewhere are ONE entity rather than three — it is the single
   highest-leverage field for being recognised as a real organisation.

   Only add a URL here once the profile exists and is genuinely the school's.
   A wrong or dead entry weakens the entity instead of strengthening it. */
export const PROFILES = [
  "https://www.instagram.com/yumegakanau_institute/",
] as const;

/* The stable @id every node points at, so Organization, WebSite, Course,
   Person and the page nodes resolve to one graph instead of repeating an
   unlinked copy of the school on each route. */
export const ORG_ID = `${SITE.url}/#organization`;
export const SITE_ID = `${SITE.url}/#website`;
export const PERSON_ID = `${SITE.url}/about#sensei`;

/* A short reference to the organisation for nodes that only need to point at
   it. `@id` does the linking; repeating name/url keeps it readable to parsers
   that do not resolve references. */
const orgRef = { "@id": ORG_ID, "@type": "EducationalOrganization", name: SITE.name, url: SITE.url };

/* Answer-engine visibility leans on this far more than classic SEO does:
   ChatGPT, Claude and Perplexity read the raw HTML, and JSON-LD is the most
   machine-legible thing on the page. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": ORG_ID,
    name: SITE.name,
    alternateName: ["Yume Ga Kanau", "夢が叶う", SITE.legalName],
    legalName: SITE.legalName,
    url: SITE.url,
    email: SITE.email,
    foundingDate: SITE.founded,
    slogan: SITE.tagline,
    description:
      "Online Japanese language institute offering JLPT N5–N2 preparation, conversational Japanese (Kaiwa) and Business Japanese in small batches and 1-on-1 coaching.",
    logo: {
      "@type": "ImageObject",
      url: `${SITE.url}/assets/nav%20bar/N-logo.webp`,
      caption: `${SITE.name} emblem`,
    },
    image: `${SITE.url}${OG_IMAGE.url}`,
    founder: { "@id": PERSON_ID },
    employee: [{ "@id": PERSON_ID }],
    // Instagram and the rest of the entity's known profiles.
    sameAs: [...PROFILES],
    /* How to actually reach the school. WhatsApp is the channel that gets used,
       so it is named as such rather than hidden behind a generic "telephone". */
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "Admissions",
        email: SITE.email,
        telephone: `+${WA_NUMBER}`,
        url: `${SITE.url}/contact`,
        availableLanguage: ["English", "Hindi", "Japanese"],
        areaServed: "Worldwide",
      },
    ],
    areaServed: "Worldwide",
    knowsLanguage: ["ja", "en", "hi"],
    knowsAbout: [
      "Japanese language",
      "JLPT N5",
      "JLPT N4",
      "JLPT N3",
      "JLPT N2",
      "Hiragana",
      "Katakana",
      "Kanji",
      "Keigo",
      "Business Japanese",
      "Japanese conversation (Kaiwa)",
    ],
    /* The three ways a student can actually study here. An OfferCatalog is what
       lets an answer engine say what the school sells without inferring it from
       marketing prose. */
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Japanese language programmes",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "JLPT preparation (N5–N2)",
            description:
              "Four guided stages from kana to N2, with exam strategy and full practice tests.",
            serviceType: "Japanese language course",
            provider: orgRef,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Conversational Japanese (Kaiwa)",
            description:
              "Speaking-led classes for learners who want to hold real conversations rather than sit an exam.",
            serviceType: "Japanese language course",
            provider: orgRef,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Business Japanese",
            description:
              "Keigo, workplace register, email and meeting Japanese for professionals.",
            serviceType: "Japanese language course",
            provider: orgRef,
          },
        },
      ],
    },
  };
}

/* Parveen Kaur Sensei as a first-class entity with a stable @id, so the
   Organization, the About page and every Course all attribute the teaching to
   the same person rather than three unconnected mentions of a name. This is the
   E-E-A-T signal that matters most for a one-teacher institute. */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Parveen Kaur",
    alternateName: "Parveen Kaur Sensei",
    jobTitle: "Founder & Lead Instructor",
    description:
      "Founder of Yume Ga Kanau and its lead instructor, teaching JLPT N5–N2 preparation, conversational Japanese and Business Japanese online.",
    knowsLanguage: ["ja", "en", "hi"],
    knowsAbout: ["Japanese language teaching", "JLPT preparation", "Business Japanese"],
    worksFor: { "@id": ORG_ID },
    url: `${SITE.url}/about`,
    image: `${SITE.url}/assets/sensei.webp`,
  };
}

/* The four JLPT stages, described as Courses so they can surface as rich
   results and be quoted accurately by answer engines. */
export function coursesJsonLd() {
  const stages = [
    { level: "N5", stage: 1, name: "JLPT N5 · Stage 1", about: "Kana, first vocabulary and everyday sentence patterns." },
    { level: "N4", stage: 2, name: "JLPT N4 · Stage 2", about: "Core grammar, kanji growth and longer conversation." },
    { level: "N3", stage: 3, name: "JLPT N3 · Stage 3", about: "Bridging to fluency: nuance, reading speed and listening." },
    { level: "N2", stage: 4, name: "JLPT N2 · Stage 4", about: "Advanced grammar, keigo and exam strategy." },
  ];
  return stages.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${SITE.url}/explore#stage-${s.stage}`,
    name: s.name,
    description: s.about,
    url: `${SITE.url}/explore`,
    courseCode: `JLPT-${s.level}`,
    educationalLevel: `JLPT ${s.level}`,
    inLanguage: "en",
    teaches: "Japanese language",
    about: { "@type": "Thing", name: "Japanese language" },
    position: s.stage,
    provider: orgRef,
    /* Google's Course rich result needs an instance with a mode and either a
       schedule or a workload. Both mode and workload are facts about how the
       school actually runs, so they are safe to state. */
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "P4M",
      instructor: { "@id": PERSON_ID },
      inLanguage: "en",
      location: { "@type": "VirtualLocation", url: `${SITE.url}/contact` },
    },
    /* The free trial is the real, stated entry point, so it is described as a
       zero-price offer. No other price is published on the site, so none is
       claimed here — inventing one would be a lie the rich result repeats. */
    offers: {
      "@type": "Offer",
      category: "Free trial class",
      price: 0,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${SITE.url}/contact`,
    },
  }));
}

/* The stage-finder quiz, so the Explore page can be understood as a tool that
   answers "which level should I start at?" and not just another marketing page. */
export function stageTestJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${SITE.url}/explore#stage-test`,
    name: "Japanese stage-finder test",
    url: `${SITE.url}/explore`,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any (web browser)",
    description:
      "A six-question test that recommends which of the four JLPT stages (N5, N4, N3 or N2) a learner should start from.",
    inLanguage: "en",
    isAccessibleForFree: true,
    publisher: orgRef,
    offers: { "@type": "Offer", price: 0, priceCurrency: "INR" },
  };
}

/* A WebSite node ties the pages together under one name, and gives Google the
   sitelinks search box shape if a search page is ever added. */
export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: SITE.name,
    alternateName: "Yume Ga Kanau Japanese Learning Institute",
    url: SITE.url,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
    copyrightHolder: { "@id": ORG_ID },
  };
}

/* Breadcrumbs render as the path line under a Google result instead of a bare
   URL, and they tell answer engines how the pages relate. */
export function breadcrumbJsonLd(trail: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}

/* One <script type="application/ld+json"> per node. Kept here so every page
   emits them the same way. */
export function JsonLd({ data }: { data: object | object[] }) {
  const nodes = Array.isArray(data) ? data : [data];
  return (
    <>
      {nodes.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
    </>
  );
}

/* The share card every page uses. Defining `openGraph` on a route REPLACES the
   one in the layout rather than merging with it, so a page that sets its own
   title without repeating the image silently loses the preview picture - which
   is how /about, /explore and /contact ended up sharing to WhatsApp as a bare
   link. Build the block through this and that cannot happen. */
/* JPEG, not the WebP the site itself uses. X/Twitter, LinkedIn and several
   chat clients still refuse to render a WebP share card and fall back to a bare
   link, which is exactly the placement where the picture matters most. 1200x675
   is the size every one of them accepts. public/assets/og-banner.jpg is
   brand-banner.webp re-encoded — regenerate it if the banner artwork changes. */
export const OG_IMAGE = {
  url: "/assets/og-banner.jpg",
  width: 1200,
  height: 675,
  alt: "Yume Ga Kanau™ Japanese Learning Institute",
} as const;

/* A WebPage node per route, tied into the same graph. It is what lets an answer
   engine say "this page, on this site, published by this school, is about X"
   in one hop instead of inferring it. */
export function pageJsonLd({
  type = "WebPage",
  name,
  description,
  path,
}: {
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${SITE.url}${path}#webpage`,
    url: `${SITE.url}${path}`,
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    primaryImageOfPage: `${SITE.url}${OG_IMAGE.url}`,
  };
}

export function pageMeta({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
}: {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
}) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website" as const,
      siteName: SITE.name,
      locale: "en_IN",
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      url: path,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      images: [OG_IMAGE.url],
    },
  };
}
