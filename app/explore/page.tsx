import type { Metadata } from "next";
import Link from "next/link";
import ExploreStages from "@/components/ExploreStages";
import StageQuiz from "@/components/StageQuiz";
import RevealSections from "@/components/RevealSections";
import ScrollLinks from "@/components/ScrollLinks";
import {
  coursesJsonLd,
  stageTestJsonLd,
  breadcrumbJsonLd,
  JsonLd,
  pageMeta,
  pageJsonLd,
} from "@/lib/seo";
import "../explore.css";

export const metadata: Metadata = pageMeta({
  title: "Explore the Four Stages",
  description:
    "The four-stage path from your first kana to JLPT N2 — what each stage covers, and a six-question test that recommends where to start.",
  path: "/explore",
  ogDescription:
    "From your first kana to N2 fluency in four guided stages. Take the six-question test to find your starting point.",
});

/* The Explore route. #explore-stages is a pinned four-screen scroller driven by
   <ExploreStages>; "Find your stage" is <StageQuiz>, which holds the six answers
   and derives the recommendation. Everything else is static markup. */
export default function ExplorePage() {
  return (
    <>
      {/* The four stages as Course records, so they can surface as rich results
          and be quoted accurately rather than paraphrased. */}
      <JsonLd
        data={[
          {
            ...pageJsonLd({
              type: "CollectionPage",
              name: "Explore the Four Stages",
              description:
                "What each of the four JLPT stages covers, and a six-question test that recommends where to start.",
              path: "/explore",
            }),
            /* The stages named as an ORDERED list. Without this a crawler has to
               infer the sequence from the page layout, and answer engines
               routinely get such an order wrong when they do. */
            mainEntity: {
              "@type": "ItemList",
              name: "The four stages, N5 to N2",
              numberOfItems: 4,
              itemListOrder: "https://schema.org/ItemListOrderAscending",
              itemListElement: coursesJsonLd().map((c, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: c.name,
                item: { "@id": c["@id"] },
              })),
            },
          },
          ...coursesJsonLd(),
          stageTestJsonLd(),
          breadcrumbJsonLd([{ name: "Explore", path: "/explore" }]),
        ]}
      />
      <div>
  
  

        <div id="explore-hero">
          <div className="eh-scene" aria-hidden="true">
            <div className="eh-sky"></div>
            <img loading="lazy" decoding="async" className="eh-bg" src="/assets/bg.webp" alt="" />
            <div className="eh-glow"></div>
            <img loading="lazy" decoding="async" className="eh-branch" src="/assets/faq/F-branch.webp" alt="" />
            <img loading="lazy" decoding="async" className="eh-p eh-p1" src="/assets/faq/F-petal-1.webp" alt="" />
            <img loading="lazy" decoding="async" className="eh-p eh-p2" src="/assets/faq/F-petal-2.webp" alt="" />
            <img loading="lazy" decoding="async" className="eh-p eh-p3" src="/assets/faq/F-petal-3.webp" alt="" />
            <img loading="lazy" decoding="async" className="eh-p eh-p4" src="/assets/faq/F-petal-4.webp" alt="" />
            <div className="eh-veil"></div>
          </div>

          <div className="eh-inner">
            <div className="eh-copy">
              <div className="eh-eyebrow"><span></span>Explore · コース案内</div>
              <h1 className="eh-title">Courses, stages, <br className="eh-br" />and the fastest way <br className="eh-br" /><em>to find yours.</em></h1>
              <div className="eh-rule"></div>
              <p className="eh-sub">Four stages to climb, at your own pace. If you already know some Japanese, skip ahead to the stage test below — it takes about a minute.</p>
              <div className="eh-cta">
                <div className="eh-btn eh-solid" data-scroll="find-your-stage">Take the stage test <span>&rarr;</span></div>
                <div className="eh-btn eh-ghost" data-scroll="explore-stages">See the four stages <span>&rarr;</span></div>
              </div>
              <div className="eh-stats">
                <div><b>N5 &rarr; N2</b><i>Four stages</i></div>
                <div><b>Small batch</b><i>&amp; 1-on-1</i></div>
              </div>
            </div>

            <div className="eh-art" aria-hidden="true">
              <span className="eh-ring eh-ring-a"></span>
              <span className="eh-ring eh-ring-b"></span>
              <span className="eh-ring-c"></span>
              <span className="eh-kanji">道</span>
              <span className="eh-mark eh-m1"><b>試</b><i>JLPT対策</i></span>
              <span className="eh-mark eh-m2"><b>話</b><i>日常会話</i></span>
              <span className="eh-mark eh-m3"><b>個</b><i>個人指導</i></span>
            </div>
          </div>
        </div>

  
  

        <div id="explore-courses">
          <div className="ec-scene" aria-hidden="true">
            <div className="ec-glow ec-glow-a"></div>
            <div className="ec-glow ec-glow-b"></div>
            <img loading="lazy" decoding="async" className="ec-bloom" src="/assets/faq/F-bloom.webp" alt="" />
            <img loading="lazy" decoding="async" className="ec-p ec-p1" src="/assets/faq/F-petal-2.webp" alt="" />
            <img loading="lazy" decoding="async" className="ec-p ec-p2" src="/assets/faq/F-petal-3.webp" alt="" />
            <img loading="lazy" decoding="async" className="ec-p ec-p3" src="/assets/faq/F-petal-1.webp" alt="" />
          </div>

          <div className="ec-inner">
            <div className="ec-head">
              <div className="ec-eyebrow"><span></span>Courses · コース</div>
              <h2 className="ec-title">How you can <em>learn with us</em></h2>
              <div className="ec-rule"></div>
              <p className="ec-sub">Three routes through the same four stages. Pick the one that matches why you are learning — or combine them.</p>
            </div>

            <div className="ec-grid">
              <article className="ec-card ec-c1">
                <span className="ec-ghost">試</span>
                <div className="ec-top"><span className="ec-emblem">試</span><span className="ec-num">01</span></div>
                <div className="ec-ja">JLPT対策</div>
                <h3>JLPT Exam Prep</h3>
                <div className="ec-meta">N5 · N4 · N3 · N2</div>
                <p>Level-wise syllabus coverage, mock tests, reading-speed drills and listening practice with a clear week-by-week plan up to exam day.</p>
                <div className="ec-go" data-scroll="explore-stages">See the stages <span>&rarr;</span></div>
              </article>

              <article className="ec-card ec-c2">
                <span className="ec-ghost">話</span>
                <div className="ec-top"><span className="ec-emblem">話</span><span className="ec-num">02</span></div>
                <div className="ec-ja">日常会話</div>
                <h3>Conversational Japanese</h3>
                <div className="ec-meta">Speak from week one</div>
                <p>Everyday situations, natural phrasing, pitch and politeness levels — built for travel, work and talking with real people.</p>
                <div className="ec-go" data-scroll="explore-stages">See the stages <span>&rarr;</span></div>
              </article>

              <article className="ec-card ec-c3">
                <span className="ec-ghost">個</span>
                <div className="ec-top"><span className="ec-emblem">個</span><span className="ec-num">03</span></div>
                <div className="ec-ja">個人指導</div>
                <h3>1-on-1 Coaching</h3>
                <div className="ec-meta">Optional / fully personalised</div>
                <p>An optional, highly personalized 1-on-1 path designed around your specific pace, goals, and weak spots. Flexible scheduling across time zones and dedicated doubt-solving every session.</p>
                <div className="ec-go" data-scroll="find-your-stage">Find your stage <span>&rarr;</span></div>
              </article>
            </div>
          </div>
        </div>

  
        <div style={{ background: "#080D24" }}>
          <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "72px 28px 44px" }}>
            <h2 style={{ fontFamily: "'Komika Axis',Impact,'Arial Black',sans-serif", fontWeight: "400", fontSize: "clamp(26px,4.2vw,40px)", color: "#F5F0E6", margin: "0", lineHeight: "1.14", letterSpacing: ".01em" }}>What each stage covers</h2>
          </div>
        </div>

  
  

        <div id="explore-stages">
        <div className="ex-frame">
          <div className="ex-sky" aria-hidden="true"></div>
          <img loading="lazy" decoding="async" className="ex-bg" src="/assets/explore%20page/stage%201/bg.webp" alt="" aria-hidden="true" />
          <div className="ex-veil" aria-hidden="true"></div>
          <div className="ex-veil2" aria-hidden="true"></div>

          <div className="ex-head">
            <div className="ex-eyebrow">The Four Stages · 4つのステージ</div>
            <h2 className="ex-title">A path,<br />not a <em>pile of lessons</em></h2>
            <div className="ex-rule"></div>
            <p className="ex-sub">Four levels. One continuous journey toward confident Japanese.</p>
          </div>
          <Link href="/contact#form" className="ex-curric">See full curriculum →</Link>

          <div className="ex-rail">
            <div className="ex-node ex-n0" data-go="0"><span className="ex-ring"><img loading="lazy" decoding="async" className="ex-gly" src="/assets/explore/E-g1.webp" alt="" /></span><span className="ex-nlab"><b>01</b><i>N5</i></span></div>
            <span className="ex-link"></span>
            <div className="ex-node ex-n1x" data-go="1"><span className="ex-ring"><img loading="lazy" decoding="async" className="ex-gly" src="/assets/explore/E-g2.webp" alt="" /></span><span className="ex-nlab"><b>02</b><i>N4</i></span></div>
            <span className="ex-link"></span>
            <div className="ex-node ex-n2x" data-go="2"><span className="ex-ring"><img loading="lazy" decoding="async" className="ex-gly" src="/assets/explore/E-g3.webp" alt="" /></span><span className="ex-nlab"><b>03</b><i>N3</i></span></div>
            <span className="ex-link"></span>
            <div className="ex-node ex-n3x" data-go="3"><span className="ex-ring"><img loading="lazy" decoding="async" className="ex-gly" src="/assets/explore/E-g4.webp" alt="" /></span><span className="ex-nlab"><b>04</b><i>N2</i></span></div>
            <span className="ex-link"></span>
            <img loading="lazy" decoding="async" className="ex-seal" src="/assets/explore/E-seal.webp" alt="\u5922 \u2014 the goal at the end of the path" />
          </div>

    
          <div className="ex-stage ex-st1">
            <div className="ex-panel">
              <div className="ex-brush"><img loading="lazy" decoding="async" src="/assets/explore/E-brush-blank.webp" alt="" /><img loading="lazy" decoding="async" className="ex-bnum" src="/assets/explore/E-g1.webp" alt="" /></div>
              <div className="ex-lvl">Stage 01 · JLPT N5</div>
              <h3 className="ex-h3">Kana to first conversations</h3>
              <div className="ex-h3rule"></div>
              <p className="ex-desc">Hiragana, Katakana, ~100 Kanji and the phrases that carry a real self-introduction.</p>
              <div className="ex-icons">
                <div className="ex-ic"><span className="ex-icon red"><b>あ</b></span><span>Hiragana &amp; Katakana</span></div>
                <div className="ex-ic"><span className="ex-icon"><b>漢</b></span><span>~100 Kanji Essentials</span></div>
                <div className="ex-ic"><span className="ex-icon"><svg viewBox="0 1.3 24 24" aria-hidden="true"><path d="M20 12.4c0 3.6-3.6 6.4-8 6.4-.9 0-1.7-.1-2.5-.3L5 20.6l.8-3.2C4.7 16.2 4 14.4 4 12.4 4 8.9 7.6 6 12 6s8 2.9 8 6.4Z" /></svg></span><span>Basic Phrases &amp; Greetings</span></div>
                <div className="ex-ic"><span className="ex-icon"><svg viewBox="0 0.6 24 24" aria-hidden="true"><circle cx="12" cy="9" r="3.2" /><path d="M5.6 19.4c0-3.2 2.9-5.4 6.4-5.4s6.4 2.2 6.4 5.4" /></svg></span><span>Self Introduction &amp; Everyday Talk</span></div>
              </div>
            </div>
            <div className="ex-words">
              <div className="ex-kring"><div className="ex-spin">
                <svg className="ex-karc" viewBox="0 0 1024 1536" fill="none" aria-hidden="true"><path d="M849.9 682.3A340 340 0 0 1 700.2 888.3" /><polygon points="700.2,888.3 713.5,864.4 727.5,886.8" /><polygon points="849.9,682.3 856.9,708.7 831.3,702.3" /><path d="M543.7 939.2A340 340 0 0 1 301.5 860.5" /><polygon points="301.5,860.5 328.3,865.8 311.4,886.0" /><polygon points="543.7,939.2 520.7,954.0 518.9,927.7" /><path d="M204.8 727.4A340 340 0 0 1 204.8 472.6" /><polygon points="204.8,472.6 208.0,499.8 183.5,489.9" /><polygon points="204.8,727.4 183.5,710.1 208.0,700.2" /><path d="M301.5 339.5A340 340 0 0 1 543.7 260.8" /><polygon points="543.7,260.8 518.9,272.3 520.7,246.0" /><polygon points="301.5,339.5 311.4,314.0 328.3,334.2" /><path d="M700.2 311.7A340 340 0 0 1 849.9 517.7" /><polygon points="849.9,517.7 831.3,497.7 856.9,491.3" /><polygon points="700.2,311.7 727.5,313.2 713.5,335.6" /></svg>
                <span className="k k1">あ</span><span className="k k2">い</span><span className="k k3">う</span><span className="k k4">え</span><span className="k k5">お</span>
                <span className="ex-note ex-n1">Start with<em>characters.</em></span>
                <span className="ex-note ex-n2">Build<em>words.</em></span>
                <span className="ex-note ex-n3">Form<em>meaning.</em></span>
                <span className="ex-note ex-n4">Speak with<em>confidence.</em></span>
              </div></div>
              <div className="ex-phrases"><b>こんにちは</b><b>はじめまして</b><b>ありがとう</b></div>

            </div>
          </div>

    
          <div className="ex-stage ex-st2">
            <div className="ex-panel">
              <div className="ex-brush"><img loading="lazy" decoding="async" src="/assets/explore/E-brush-blank.webp" alt="" /><img loading="lazy" decoding="async" className="ex-bnum" src="/assets/explore/E-g2.webp" alt="" /></div>
              <div className="ex-lvl">Stage 02 · JLPT N4</div>
              <h3 className="ex-h3">Grammar that connects</h3>
              <div className="ex-h3rule"></div>
              <p className="ex-desc">て-form, plain form and conditionals — the stage where isolated phrases finally join into conversation.</p>
              <div className="ex-icons">
                <div className="ex-ic"><span className="ex-icon red"><b>て</b></span><span>Plain Form &amp; て-form</span></div>
                <div className="ex-ic"><span className="ex-icon"><b>漢</b></span><span>~300 Kanji · 1,500 Words</span></div>
                <div className="ex-ic"><span className="ex-icon"><svg viewBox="0.95 -0.2 24 24" aria-hidden="true"><path d="M15.4 13.6c0 2.5-2.6 4.5-5.7 4.5-.7 0-1.3-.1-1.9-.2L4.6 19.4l.7-2.5C4.2 16 3.7 14.9 3.7 13.6c0-2.5 2.6-4.5 5.8-4.5s5.9 2 5.9 4.5Z" /><path d="M10.4 7.5C11.2 5.6 13.5 4.2 16.3 4.2c3.3 0 5.9 2 5.9 4.5 0 1.3-.7 2.4-1.7 3.3l.7 2.5-2.9-1.1" /></svg></span><span>Past &amp; Casual Speech</span></div>
                <div className="ex-ic"><span className="ex-icon"><svg viewBox="0 0.5 24 24" aria-hidden="true"><path d="M12 7.6C10.6 6.2 8.6 5.6 4.2 5.6v11.8c4.4 0 6.4.6 7.8 2 1.4-1.4 3.4-2 7.8-2V5.6c-4.4 0-6.4.6-7.8 2Z" /><path d="M12 7.6v11.8" /></svg></span><span>Short Passages &amp; Listening</span></div>
              </div>
            </div>
            <div className="ex-words">
              <div className="ex-kring"><div className="ex-spin">
                <svg className="ex-karc" viewBox="0 0 1024 1536" fill="none" aria-hidden="true"><path d="M849.9 682.3A340 340 0 0 1 700.2 888.3" /><polygon points="700.2,888.3 713.5,864.4 727.5,886.8" /><polygon points="849.9,682.3 856.9,708.7 831.3,702.3" /><path d="M543.7 939.2A340 340 0 0 1 301.5 860.5" /><polygon points="301.5,860.5 328.3,865.8 311.4,886.0" /><polygon points="543.7,939.2 520.7,954.0 518.9,927.7" /><path d="M204.8 727.4A340 340 0 0 1 204.8 472.6" /><polygon points="204.8,472.6 208.0,499.8 183.5,489.9" /><polygon points="204.8,727.4 183.5,710.1 208.0,700.2" /><path d="M301.5 339.5A340 340 0 0 1 543.7 260.8" /><polygon points="543.7,260.8 518.9,272.3 520.7,246.0" /><polygon points="301.5,339.5 311.4,314.0 328.3,334.2" /><path d="M700.2 311.7A340 340 0 0 1 849.9 517.7" /><polygon points="849.9,517.7 831.3,497.7 856.9,491.3" /><polygon points="700.2,311.7 727.5,313.2 713.5,335.6" /></svg>
                <span className="k k1">て</span><span className="k k2">た</span><span className="k k3">ば</span><span className="k k4">ら</span><span className="k k5">の</span>
                <span className="ex-note ex-n1">Link<em>actions.</em></span>
                <span className="ex-note ex-n2">Place it in<em>time.</em></span>
                <span className="ex-note ex-n3">Suppose<em>and ask.</em></span>
                <span className="ex-note ex-n4">Speak<em>casually.</em></span>
              </div></div>
              <div className="ex-phrases"><b>たべてもいい？</b><b>いっしょに行こう</b><b>そう思います</b></div>

            </div>
          </div>

    
          <div className="ex-stage ex-st3">
            <div className="ex-panel">
              <div className="ex-brush"><img loading="lazy" decoding="async" src="/assets/explore/E-brush-blank.webp" alt="" /><img loading="lazy" decoding="async" className="ex-bnum" src="/assets/explore/E-g3.webp" alt="" /></div>
              <div className="ex-lvl">Stage 03 · JLPT N3</div>
              <h3 className="ex-h3">Real-world Japanese</h3>
              <div className="ex-h3rule"></div>
              <p className="ex-desc">The bridge level where most self-learners stall. We work on volume — reading longer texts, following natural speech, and expressing opinions with reasons rather than single words.</p>
              <div className="ex-icons">
                <div className="ex-ic"><span className="ex-icon red"><b>文</b></span><span>Transitivity, causative, passive</span></div>
                <div className="ex-ic"><span className="ex-icon"><b>漢</b></span><span>~650 Kanji · 3,700 Words</span></div>
                <div className="ex-ic"><span className="ex-icon"><b>敬</b></span><span>Keigo Foundations</span></div>
                <div className="ex-ic"><span className="ex-icon"><svg viewBox="0 1 24 24" aria-hidden="true"><path d="M4.6 16.2v-3a7.4 7.4 0 0 1 14.8 0v3" /><rect x="2.8" y="15" width={4} height={5.2} rx="1.6" /><rect x="17.2" y="15" width={4} height={5.2} rx="1.6" /></svg></span><span>Drama, news &amp; podcast listening</span></div>
              </div>
            </div>
            <div className="ex-words">
              <div className="ex-kring"><div className="ex-spin">
                <svg className="ex-karc" viewBox="0 0 1024 1536" fill="none" aria-hidden="true"><path d="M849.9 682.3A340 340 0 0 1 700.2 888.3" /><polygon points="700.2,888.3 713.5,864.4 727.5,886.8" /><polygon points="849.9,682.3 856.9,708.7 831.3,702.3" /><path d="M543.7 939.2A340 340 0 0 1 301.5 860.5" /><polygon points="301.5,860.5 328.3,865.8 311.4,886.0" /><polygon points="543.7,939.2 520.7,954.0 518.9,927.7" /><path d="M204.8 727.4A340 340 0 0 1 204.8 472.6" /><polygon points="204.8,472.6 208.0,499.8 183.5,489.9" /><polygon points="204.8,727.4 183.5,710.1 208.0,700.2" /><path d="M301.5 339.5A340 340 0 0 1 543.7 260.8" /><polygon points="543.7,260.8 518.9,272.3 520.7,246.0" /><polygon points="301.5,339.5 311.4,314.0 328.3,334.2" /><path d="M700.2 311.7A340 340 0 0 1 849.9 517.7" /><polygon points="849.9,517.7 831.3,497.7 856.9,491.3" /><polygon points="700.2,311.7 727.5,313.2 713.5,335.6" /></svg>
                <span className="k k1">読</span><span className="k k2">聞</span><span className="k k3">話</span><span className="k k4">考</span><span className="k k5">伝</span>
                <span className="ex-note ex-n1">Read<em>longer.</em></span>
                <span className="ex-note ex-n2">Listen<em>faster.</em></span>
                <span className="ex-note ex-n3">Say<em>why.</em></span>
                <span className="ex-note ex-n4">Sound<em>natural.</em></span>
              </div></div>
              <div className="ex-phrases"><b>どうしてですか</b><b>わたしの理由は</b><b>なるほど、確かに</b></div>

            </div>
          </div>

    
          <div className="ex-stage ex-st4">
            <div className="ex-panel">
              <div className="ex-brush"><img loading="lazy" decoding="async" src="/assets/explore/E-brush-blank.webp" alt="" /><img loading="lazy" decoding="async" className="ex-bnum" src="/assets/explore/E-g4.webp" alt="" /></div>
              <div className="ex-lvl">Stage 04 · JLPT N2</div>
              <h3 className="ex-h3">Fluency &amp; nuance</h3>
              <div className="ex-h3rule"></div>
              <p className="ex-desc">Advanced register, abstract topics and the precision employers look for. Exam work becomes strategy: time control, elimination, and reading for structure instead of every word.</p>
              <div className="ex-icons">
                <div className="ex-ic"><span className="ex-icon red"><b>礼</b></span><span>Business Japanese &amp; formal keigo</span></div>
                <div className="ex-ic"><span className="ex-icon"><b>漢</b></span><span>1,000+ kanji · ~6,000 words</span></div>
                <div className="ex-ic"><span className="ex-icon"><svg viewBox="0 0.85 24 24" aria-hidden="true"><path d="M4 6h12.4v13.4H5.5A1.5 1.5 0 0 1 4 17.9V6Z" /><path d="M16.4 9.4h3.6v8.5a1.8 1.8 0 0 1-3.6 0V9.4Z" /><path d="M6.6 9.4h7.2M6.6 12.4h7.2M6.6 15.4h4.6" /></svg></span><span>Editorials &amp; abstract discussion</span></div>
                <div className="ex-ic"><span className="ex-icon"><svg viewBox="0 -0.2 24 24" aria-hidden="true"><path d="M9.2 5.2H7.6A1.6 1.6 0 0 0 6 6.8v11.8a1.6 1.6 0 0 0 1.6 1.6h8.8a1.6 1.6 0 0 0 1.6-1.6V6.8a1.6 1.6 0 0 0-1.6-1.6h-1.6" /><rect x="9.2" y="3.4" width={5.6} height={3.2} rx="1.1" /><path d="M9.4 13.4l2 2 3.4-3.8" /></svg></span><span>Full JLPT strategy &amp; mocks</span></div>
              </div>
            </div>
            <div className="ex-words">
              <div className="ex-kring"><div className="ex-spin">
                <svg className="ex-karc" viewBox="0 0 1024 1536" fill="none" aria-hidden="true"><path d="M849.9 682.3A340 340 0 0 1 700.2 888.3" /><polygon points="700.2,888.3 713.5,864.4 727.5,886.8" /><polygon points="849.9,682.3 856.9,708.7 831.3,702.3" /><path d="M543.7 939.2A340 340 0 0 1 301.5 860.5" /><polygon points="301.5,860.5 328.3,865.8 311.4,886.0" /><polygon points="543.7,939.2 520.7,954.0 518.9,927.7" /><path d="M204.8 727.4A340 340 0 0 1 204.8 472.6" /><polygon points="204.8,472.6 208.0,499.8 183.5,489.9" /><polygon points="204.8,727.4 183.5,710.1 208.0,700.2" /><path d="M301.5 339.5A340 340 0 0 1 543.7 260.8" /><polygon points="543.7,260.8 518.9,272.3 520.7,246.0" /><polygon points="301.5,339.5 311.4,314.0 328.3,334.2" /><path d="M700.2 311.7A340 340 0 0 1 849.9 517.7" /><polygon points="849.9,517.7 831.3,497.7 856.9,491.3" /><polygon points="700.2,311.7 727.5,313.2 713.5,335.6" /></svg>
                <span className="k k1">敬</span><span className="k k2">語</span><span className="k k3">論</span><span className="k k4">説</span><span className="k k5">業</span>
                <span className="ex-note ex-n1">Speak<em>formally.</em></span>
                <span className="ex-note ex-n2">Argue<em>clearly.</em></span>
                <span className="ex-note ex-n3">Read<em>editorials.</em></span>
                <span className="ex-note ex-n4">Work<em>in Japanese.</em></span>
              </div></div>
              <div className="ex-phrases"><b>お世話になっております</b><b>ご確認いただけますか</b><b>恐れ入りますが</b></div>

            </div>
          </div>

          <div className="ex-prog">
            <div className="ex-track">
              <span className="ex-fill"></span>
              <button className="ex-dot" style={{ left: "0%" }} data-go="0" aria-label="Stage 1, JLPT N5"><i>N5</i></button>
              <button className="ex-dot" style={{ left: "33.333%" }} data-go="1" aria-label="Stage 2, JLPT N4"><i>N4</i></button>
              <button className="ex-dot" style={{ left: "66.666%" }} data-go="2" aria-label="Stage 3, JLPT N3"><i>N3</i></button>
              <button className="ex-dot" style={{ left: "100%" }} data-go="3" aria-label="Stage 4, JLPT N2"><i>N2</i></button>
            </div>
          </div>

          <div className="ex-cue"><span>Scroll to continue</span><img loading="lazy" decoding="async" src="/assets/explore/E-scroll.webp" alt="" /></div>
        </div>
        </div>

  
  

        <div id="find-your-stage">
          <div className="fy-scene" aria-hidden="true">
            <div className="fy-glow fy-glow-a"></div>
            <div className="fy-glow fy-glow-b"></div>
            <span className="fy-ghost">診</span>
            <img loading="lazy" decoding="async" className="fy-p fy-p1" src="/assets/faq/F-petal-3.webp" alt="" />
            <img loading="lazy" decoding="async" className="fy-p fy-p2" src="/assets/faq/F-petal-1.webp" alt="" />
          </div>

          <div className="fy-inner">
            <div className="fy-head">
              <div className="fy-eyebrow"><span></span>Find your stage · レベル診断</div>
              <h2 className="fy-title">Which stage should you <em>start from?</em></h2>
              <div className="fy-rule"></div>
              <p className="fy-sub">Six honest questions. No score, no judgement — just the right starting point so you neither repeat what you know nor drown in what you don’t.</p>
            </div>

      
            <StageQuiz />
      
          </div>
        </div>
      </div>
      <ExploreStages />
      <ScrollLinks />
      <RevealSections
        ids={["explore-hero", "explore-courses", "explore-stages", "find-your-stage"]}
      />
    </>
  );
}
