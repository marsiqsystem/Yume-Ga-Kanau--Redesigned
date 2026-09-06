import type { Metadata } from "next";
import Link from "next/link";
import TrialForm from "@/components/TrialForm";
import RevealSections from "@/components/RevealSections";
import { SITE, ORG_ID, breadcrumbJsonLd, JsonLd, pageMeta, pageJsonLd } from "@/lib/seo";
import "../contact.css";

export const metadata: Metadata = pageMeta({
  title: "Contact & Free Trial Class",
  description:
    "Request a free trial Japanese class with Parveen Kaur Sensei. Tell her your level and timezone and she will arrange a slot around your day.",
  path: "/contact",
  ogDescription:
    "Request a free trial Japanese class — no payment, no commitment, just a real lesson.",
});

/* The Contact route. Everything except the request card is static markup; the
   card is <TrialForm>, which owns its own validation and delivery. */
export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          pageJsonLd({
            type: "ContactPage",
            name: "Contact & Free Trial Class",
            description:
              "Request a free trial Japanese class with Parveen Kaur Sensei — no payment and no commitment.",
            path: "/contact",
          }),
          /* The free trial stated as an actual offer with a price of zero.
             "Free trial" in prose is marketing copy a crawler may or may not
             believe; price: 0 is a claim it can repeat. */
          {
            "@context": "https://schema.org",
            "@type": "Offer",
            "@id": `${SITE.url}/contact#trial`,
            name: "Free trial Japanese class",
            description:
              "A full introductory lesson with the instructor, used to assess level and demonstrate the teaching approach. No payment and no commitment.",
            price: 0,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: `${SITE.url}/contact`,
            offeredBy: { "@id": ORG_ID },
            category: "Trial class",
          },
          breadcrumbJsonLd([{ name: "Contact", path: "/contact" }]),
        ]}
      />
      <div id="contact-page">
  
  
        <div id="contact-hero">
          <div className="ct-scrim" aria-hidden="true"></div>
          <div className="ct-foot" aria-hidden="true"></div>
          <div className="ct-inner">
            <div className="ct-copy">
              <div className="ct-eyebrow">Contact · お問い合わせ</div>
              <h1 className="ct-h1">Let&rsquo;s <em>begin.</em> <span>はじめましょう。</span></h1>
              <div className="ct-brush"></div>
              <p className="ct-p">Tell us where you are on your Japanese journey and what you want from it. Sensei replies personally, usually within one working day.</p>
              <div className="ct-meta">
                <div className="ct-item">
                  <i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6.5h18v11H3z" /><path d="m3.6 7 8.4 6 8.4-6" /></svg></i>
                  <span>A personal reply from sensei</span>
                </div>
                <div className="ct-item">
                  <i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5.2l3.4 2" /></svg></i>
                  <span>Usually within one working day</span>
                </div>
                <div className="ct-item">
                  <i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16v11H8l-4 3.5V5Z" /></svg></i>
                  <span>No obligation, ever</span>
                </div>
              </div>
            </div>
          </div>
        </div>

  
  

        <div id="contact-body">
          <div className="cb-wrap cb-grid">
            <div className="cb-l cb-card cb-form">
              <TrialForm />
            </div>

            <div className="cb-aside">
              <div className="cb-l cb-card cb-pad">
                <div className="cb-sub">Reach us directly</div>
                <div className="cb-reach">
                  <a href="mailto:yumegakanau22@gmail.com">
                    <span className="cb-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6.5h18v11H3z" /><path d="m3.6 7 8.4 6 8.4-6" /></svg></span>
                    <div><div className="k">Email</div><div className="v">yumegakanau22@gmail.com</div></div>
                  </a>
                  <a href="https://www.instagram.com/yumegakanau_institute/" target="_blank" rel="noopener noreferrer">
                    <span className="cb-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="3.5" width={17} height={17} rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" /></svg></span>
                    <div><div className="k">Instagram</div><div className="v">@yumegakanau_institute</div></div>
                  </a>
                  <a data-wa href="https://wa.me/919891196802" target="_blank" rel="noopener noreferrer">
                    <span className="cb-ic"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" /><path d="M12.04 2.5C6.79 2.5 2.53 6.76 2.53 12.01c0 1.68.44 3.32 1.28 4.77L2.5 21.5l4.85-1.27a9.46 9.46 0 0 0 4.69 1.23h.01c5.24 0 9.5-4.26 9.5-9.51 0-2.54-.99-4.93-2.78-6.72a9.44 9.44 0 0 0-6.73-2.79Zm5.55 15.05a7.87 7.87 0 0 1-5.55 2.3h-.01a7.9 7.9 0 0 1-4.02-1.1l-.29-.17-2.98.78.8-2.91-.19-.3a7.85 7.85 0 0 1-1.21-4.19c0-4.36 3.55-7.9 7.91-7.9a7.85 7.85 0 0 1 5.59 2.32 7.85 7.85 0 0 1 2.31 5.59c0 4.36-3.55 7.9-7.9 7.9Z" /></svg></span>
                    <div><div className="k">WhatsApp</div><div className="v" data-wa-txt>Message Sensei directly</div></div>
                  </a>
                  <div>
                    <span className="cb-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="4.5" width={19} height={12} rx="2" /><path d="M8 20h8" /></svg></span>
                    <div><div className="k">Class mode</div><div className="v">Online · live sessions</div></div>
                  </div>
                </div>
                <span className="cb-kanji" aria-hidden="true">連</span>
              </div>

              <div className="cb-l cb-card cb-pad">
                <div className="cb-sub">Class timings</div>
                <div className="cb-times">
                  <div><span>Weekday batches</span><b>Mon &ndash; Fri</b></div>
                  <div><span>Weekend batches</span><b>Sat &amp; Sun</b></div>
                  <div><span>1-on-1 slots</span><b>Flexible, by timezone</b></div>
                </div>
                <p>Students currently join from India, the UK, the USA and Japan &mdash; timings are arranged around your day, not ours.</p>
                <span className="cb-kanji" aria-hidden="true">時</span>
              </div>

              <div className="cb-l cb-card cb-pad cb-nudge">
                <h3>Not sure which stage fits you?</h3>
                <p>Take the one-minute stage test first &mdash; then mention your result in the form.</p>
                <Link href="/explore" className="cb-link">Find your stage <span>&rarr;</span></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RevealSections ids={["contact-body"]} />
    </>
  );
}
