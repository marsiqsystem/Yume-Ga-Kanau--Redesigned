import type { Metadata } from "next";
import Link from "next/link";
import RevealSections from "@/components/RevealSections";
import { breadcrumbJsonLd, JsonLd, pageMeta, pageJsonLd, PERSON_ID } from "@/lib/seo";
import "../about.css";

export const metadata: Metadata = pageMeta({
  title: "About the Institute",
  description:
    "An online Japanese institute founded in 2025 by Parveen Kaur Sensei — small-batch JLPT N5–N2 preparation, conversation and Business Japanese.",
  path: "/about",
  ogDescription:
    "Meet Parveen Kaur Sensei and the thinking behind Yume Ga Kanau’s small-batch Japanese classes.",
});

/* The founder's Person node used to be declared here as well as in the layout,
   with no @id on either — which left two unconnected Parveen Kaurs in the graph
   for a crawler to reconcile. There is one now, in lib/seo, carrying a stable
   @id that this page's AboutPage node points at. */

/* The About route. The sections carry the same ids the stylesheet keys its
   entrance animations off; <RevealSections> adds .fs-anim/.fs-in as they scroll
   into view, exactly as the home route does. */
export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          {
            ...pageJsonLd({
              type: "AboutPage",
              name: "About Yume Ga Kanau",
              description:
                "The institute, its four-stage method, and Parveen Kaur Sensei who teaches it.",
              path: "/about",
            }),
            // this page is the canonical page ABOUT the founder
            mainEntity: { "@id": PERSON_ID },
          },
          breadcrumbJsonLd([{ name: "About", path: "/about" }]),
        ]}
      />
      <div id="about-page">
  
  
        <div id="about-hero">
          <div className="ab-scrim" aria-hidden="true"></div>
          <div className="ab-vert" aria-hidden="true"><b>夢が叶う</b><span className="ab-seal">夢</span></div>
          <div className="ab-foot" aria-hidden="true"></div>
          <div className="ab-inner">
            <div className="ab-copy">
              <div className="ab-eyebrow">About the institute</div>
              <h1 className="ab-h1">A small institute with one large promise: <em>your dream comes true.</em></h1>
              <div className="ab-brush"></div>
              <p className="ab-p">YUME GA KANAU™ is a dedicated online language platform built to make authentic Japanese education accessible, engaging, and deeply impactful — specializing in interactive small-batch learning for JLPT prep (N5 to N2) and conversation, alongside flexible, optional 1-on-1 coaching.</p>
              <div className="ab-marks">
                <div className="ab-mark">
                  <i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4 2 9l10 5 10-5-10-5Z" /><path d="M6 11.5V16c0 1.3 2.7 2.5 6 2.5s6-1.2 6-2.5v-4.5" /></svg></i>
                  <span>Focused<br />Learning</span>
                </div>
                <div className="ab-mark">
                  <i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3" /><path d="M3 19a6 6 0 0 1 12 0" /><circle cx="17.5" cy="9.5" r="2.4" /><path d="M15.5 19a5.6 5.6 0 0 1 5.5-4.4" /></svg></i>
                  <span>Supportive<br />Community</span>
                </div>
                <div className="ab-mark">
                  <i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V13M9.3 20V9M14.7 20v-4.5M20 20V5" /><path d="M15.5 6.5 20 5v4" /></svg></i>
                  <span>Real<br />Progress</span>
                </div>
                <div className="ab-mark">
                  <i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z" /></svg></i>
                  <span>Your Dreams<br />Matter</span>
                </div>
              </div>
            </div>
          </div>
        </div>


  
  

        <div id="about-name">
          <div className="ab-wrap an-grid">
            <div className="ab-l">
              <div className="ab-eye">Foundation &amp; the name</div>
              <h2 className="ab-h2">Founded <em>December 2025</em></h2>
              <div className="ab-rule"></div>
              <p className="ab-body">夢が叶う literally translates to <em style={{ color: "#EFB3C1", fontStyle: "normal" }}>&ldquo;dreams come true.&rdquo;</em> The name holds a double meaning: building an independent institution was a dream realised for its founder &mdash; and it is a standing commitment to every learner who joins.</p>
              <p className="ab-body">For our students, choosing YUME GA KANAU&trade; means their dream of mastering the Japanese language &mdash; and connecting with its culture &mdash; will truly come to life.</p>
            </div>
            <div className="ab-l ab-l-r an-seal">
              <img className="an-banner" loading="lazy" decoding="async" width={1599} height={899} src="/assets/brand-banner.webp" alt="Yume Ga Kanau\u2122 Japanese Learning Institute \u2014 \u65e5\u672c\u8a9e\u3092\u5b66\u3076\u3060\u3051\u3067\u306a\u304f\u3001\u611f\u3058\u3066\u304f\u3060\u3055\u3044 \u00b7 Don\u2019t just learn Japanese, feel it!" />
            </div>
          </div>
        </div>

        <div id="about-vm">
          <div className="ab-wrap">
            <div className="ab-l">
              <div className="ab-eye">Vision &amp; goal · 展望と目標</div>
              <h2 className="ab-h2">Where we are going, <em>and why</em></h2>
            </div>
            <div className="av-grid">
              <div className="ab-l ab-l-r ab-card av-card">
                <div className="av-ja">展望</div>
                <h3>Vision</h3>
                <p>To be a premier global destination for Japanese language education &mdash; where students don&rsquo;t just learn Japanese to pass an exam, but gain the fluency, cultural understanding and confidence to connect naturally with the language and realise their personal and professional dreams.</p>
                <span className="ab-kanji" aria-hidden="true">展</span>
              </div>
              <div className="ab-l ab-l-r ab-card av-card">
                <div className="av-ja">目標</div>
                <h3>Goal</h3>
                <p>To empower every student with strong linguistic fundamentals, personalised guidance and proven exam strategies &mdash; nurturing confident speakers who express themselves naturally, in an encouraging, zero-pressure environment where no question goes unanswered.</p>
                <span className="ab-kanji" aria-hidden="true">標</span>
              </div>
            </div>
          </div>
        </div>

        <div id="about-wins">
          <div className="ab-wrap">
            <div className="ab-l">
              <div className="ab-eye">Achievements · 実績</div>
              <h2 className="ab-h2">What we&rsquo;ve <em>built so far</em></h2>
            </div>
            <div className="aw-grid">
              <div className="ab-l ab-l-r ab-card aw-card">
                <div className="aw-n">01</div><b>Global student base</b>
                <p>Learners mentored across India, the UK, the USA and Japan.</p>
              </div>
              <div className="ab-l ab-l-r ab-card aw-card">
                <div className="aw-n">02</div><b>Proven JLPT success</b>
                <p>A strong track record of helping learners clear N5 through N2 on solid foundations.</p>
              </div>
              <div className="ab-l ab-l-r ab-card aw-card">
                <div className="aw-n">03</div><b>Personalised mentorship</b>
                <p>Interactive small batches and optional 1-on-1 coaching with dedicated doubt-solving for every student.</p>
              </div>
              <div className="ab-l ab-l-r ab-card aw-card">
                <div className="aw-n">04</div><b>Teaching excellence</b>
                <p>Three to four years of hands-on experience in online Japanese instruction.</p>
              </div>
            </div>
          </div>
        </div>

        <div id="about-sensei">
          <div className="ab-wrap">
            <div className="ab-l">
              <div className="ab-eye">Meet sensei · 先生紹介</div>
              <h2 className="ab-h2">Taught by someone <em>still learning</em></h2>
            </div>
            <div className="as-grid">
              <div className="ab-l ab-l-r as-photo">
                <img loading="lazy" decoding="async" src="/assets/sensei.webp" alt="Parveen Kaur Sensei" />
                <div className="as-meta">
                  <div className="k">先生 · SENSEI</div>
                  <div className="n">Parveen Kaur</div>
                  <div className="r">Founder &amp; Lead Japanese Instructor<br />3+ years of dedicated Japanese instruction</div>
                </div>
              </div>
              <div className="ab-l">
                <p className="ab-body">As an advanced Japanese learner and experienced educator, Parveen Sensei knows firsthand what it feels like to navigate kanji, grammar patterns and real-world conversation. Over the past three to four years she has guided students across India &mdash; Delhi, Kolkata, Tamil Nadu &mdash; as well as international learners from the UK, the USA and Japan.</p>
                <p className="ab-body">Her journey as a continuous learner keeps her teaching practical, empathetic, and deeply aligned with what students actually need to succeed.</p>
                <div className="ab-card as-msg">
                  <div className="k">A message from sensei</div>
                  <p>&ldquo;Konnichiwa! Welcome to YUME GA KANAU&trade;. Learning a new language is one of the most rewarding journeys you will ever take, but I know it can sometimes feel overwhelming &mdash; especially when facing complex kanji or tricky grammar. My goal is to make Japanese feel approachable, logical and enjoyable for you.</p>
                  <p>Whether you are starting from zero with JLPT N5 or pushing your boundaries toward advanced fluency, you don&rsquo;t have to walk this path alone. In our classes, every mistake is a step forward, every question is welcomed, and every milestone is celebrated. Let&rsquo;s make your dream of mastering Japanese come true together!&rdquo;</p>
                  <div className="sig">&mdash; PARVEEN KAUR SENSEI 🌸</div>
                  <span className="ab-kanji" aria-hidden="true">先</span>
                </div>
                <div className="as-cta">
                  <Link href="/explore" className="as-btn p">EXPLORE THE STAGES &rarr;</Link>
                  <Link href="/contact#form" className="as-btn s">TALK TO SENSEI</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RevealSections ids={["about-name", "about-vm", "about-wins", "about-sensei"]} />
    </>
  );
}
