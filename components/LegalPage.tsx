import Link from "next/link";
import { SITE, SENSEI_EMAIL, WHATSAPP, breadcrumbJsonLd, JsonLd, pageJsonLd } from "@/lib/seo";

/* The shell the three legal documents share: masthead, plain-language summary,
   body, contact block and links to the sibling documents.

   They are one component rather than three copies so the "last reviewed" date,
   the contact details and the sibling links cannot drift apart between them —
   which is the usual way legal pages end up contradicting each other. */

/* Bump this whenever the substance of any of the three changes. It is shown on
   the page and used as dateModified in the structured data. */
export const LEGAL_UPDATED = "2026-09-07";
export const LEGAL_UPDATED_LABEL = "7 September 2026";

const DOCS = [
  { path: "/privacy", label: "Privacy Policy" },
  { path: "/terms", label: "Terms of Service" },
  { path: "/cookies", label: "Cookie Policy" },
] as const;

export function LegalContact() {
  return (
    <div className="lg-contact">
      <h2>Questions about this document?</h2>
      <p>
        Write to{" "}
        <a href={`mailto:${SENSEI_EMAIL}`}>{SENSEI_EMAIL}</a> or message{" "}
        <a href={WHATSAPP.numberHref} target="_blank" rel="noopener noreferrer">
          {WHATSAPP.display}
        </a>{" "}
        on WhatsApp. Enquiries reach Parveen Kaur Sensei directly, and are usually
        answered within one working day.
      </p>
    </div>
  );
}

export default function LegalPage({
  eyebrow,
  title,
  standfirst,
  summary,
  path,
  metaTitle,
  metaDescription,
  children,
}: {
  eyebrow: string;
  title: string;
  standfirst: string;
  summary: React.ReactNode;
  path: string;
  metaTitle: string;
  metaDescription: string;
  children: React.ReactNode;
}) {
  const siblings = DOCS.filter((d) => d.path !== path);

  return (
    <>
      <JsonLd
        data={[
          {
            ...pageJsonLd({ name: metaTitle, description: metaDescription, path }),
            dateModified: LEGAL_UPDATED,
          },
          breadcrumbJsonLd([{ name: title, path }]),
        ]}
      />
      <div id="legal-page">
        <div className="lg-inner">
          <p className="lg-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <div className="lg-rule" />
          <p className="lg-standfirst">{standfirst}</p>

          <div className="lg-meta">
            <span>
              Last reviewed: <b>{LEGAL_UPDATED_LABEL}</b>
            </span>
            <span>
              Applies to: <b>{SITE.url.replace(/^https?:\/\//, "")}</b>
            </span>
          </div>

          {/* Every one of these opens with the same thing in plain words. Someone
              who reads only this box should still come away with the truth. */}
          <div className="lg-tldr">
            <h2>In short</h2>
            {summary}
          </div>

          {children}

          <LegalContact />

          <div className="lg-siblings">
            {siblings.map((d) => (
              <Link key={d.path} href={d.path}>
                {d.label}
              </Link>
            ))}
          </div>

          <Link className="lg-back" href="/">
            &larr; Back to the site
          </Link>
        </div>
      </div>
    </>
  );
}
