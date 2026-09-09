import type { Metadata, Viewport } from "next";
import { Zen_Old_Mincho, Zen_Kaku_Gothic_New, Nunito_Sans } from "next/font/google";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppFab from "@/components/WhatsAppFab";
import AnimationGate from "@/components/AnimationGate";
import { SITE, organizationJsonLd, webSiteJsonLd, personJsonLd, JsonLd } from "@/lib/seo";
import "./globals.css";

/* next/font self-hosts these at build time. The original pulled them from
   fonts.googleapis.com with a render-blocking <link>, which cost a round trip
   to a third party before the first paint.

   preload:false on the two Zen families is not an optimisation detail — it is
   the difference between the site opening and the site hanging on a phone.
   Google splits Japanese fonts into ~120 unicode-range subsets per weight, so
   four weights of two families is roughly a thousand woff2 files. next/font
   preloads every subset of every declared weight by default, which put 717
   <link rel="preload" as="font"> tags — 12.5 MB — in the head of every page,
   ahead of the stylesheet and the hero image in the request queue. On desktop
   broadband that is absorbed; on mobile data it starves everything behind it,
   which is exactly the blank navy hero students were reporting.

   With preload off the @font-face rules and their unicode-ranges still ship,
   so the browser fetches only the handful of subsets whose glyphs actually
   appear on the page — the fonts still self-host, and nothing looks different.
   Nunito Sans keeps its preload: it is latin-only and 27 files, not 490. */
const mincho = Zen_Old_Mincho({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mincho",
  display: "swap",
  preload: false,
});
const kaku = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-kaku",
  display: "swap",
  preload: false,
});
const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

/* themeColor lives on `viewport`, not `metadata` — Next warns and drops it if
   it is set on the wrong export. It paints the phone browser's chrome navy to
   match the hero instead of leaving a white bar above it. */
export const viewport: Viewport = {
  themeColor: "#0A1130",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Yume Ga Kanau™ | Japanese Learning Institute",
    template: "%s | Yume Ga Kanau™",
  },
  description:
    "Online Japanese classes for JLPT N5–N2, conversational Japanese (Kaiwa) and Business Japanese. Small batches and 1-on-1 coaching with Parveen Kaur Sensei.",
  applicationName: "Yume Ga Kanau",
  keywords: [
    "Japanese classes online",
    "JLPT N5 N4 N3 N2 preparation",
    "learn Japanese online",
    "Kaiwa conversation classes",
    "Business Japanese",
    "1-on-1 Japanese coaching",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Yume Ga Kanau™",
    title: "Yume Ga Kanau™ | Japanese Learning Institute",
    description:
      "Don't just learn Japanese, feel it. Online JLPT N5–N2 preparation, conversation and Business Japanese in small batches.",
    url: "/",
    locale: "en_IN",
    images: [{ url: "/assets/og-banner.jpg", width: 1200, height: 675, alt: "Yume Ga Kanau™ Japanese Learning Institute" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yume Ga Kanau™ | Japanese Learning Institute",
    description:
      "Online JLPT N5–N2 preparation, conversation and Business Japanese in small batches.",
    images: ["/assets/og-banner.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    // max-snippet:-1 and max-image-preview:large let Google show a full-length
    // snippet and a real thumbnail rather than a clipped one - and they are also
    // what most AI overviews respect when deciding how much they may quote.
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  authors: [{ name: "Parveen Kaur" }],
  creator: "Parveen Kaur",
  publisher: SITE.name,
  category: "education",
  // Set GOOGLE_SITE_VERIFICATION in Vercel to the token Search Console gives you,
  // and the meta tag appears on every page. Nothing to paste into the markup.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mincho.variable} ${kaku.variable} ${nunito.variable}`}>
      <body>
        {/* Organisation data is site-wide, so it belongs on every route. Page-specific
            schema (Course, FAQPage) is emitted by the route that owns it. */}
        <JsonLd data={[organizationJsonLd(), webSiteJsonLd(), personJsonLd()]} />
        <SiteNav />
        {children}
        <SiteFooter />
        <WhatsAppFab />
        <AnimationGate />
      </body>
    </html>
  );
}
