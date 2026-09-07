import Link from "next/link";
import HomeInteractions from "@/components/HomeInteractions";
import { faqJsonLd } from "@/lib/faq";
import { JsonLd, pageJsonLd } from "@/lib/seo";
import "./home.css";

/* The home route. Markup ported from the original single-file build, which was
   already React under the hood — the runtime compiled this same tree with
   React.createElement. The difference is that it now renders on the server, so
   the HTML is complete before any JavaScript runs.

   Navigation that used to be runtime handlers (onClick={{ goExplore }}) is now
   real <Link> elements, so the routes are crawlable and each has its own URL. */
export default function HomePage() {
  return (
    <>
      {/* The five answers below are also the ones the page shows, which is what
          lets them appear as rich results and be quoted by answer engines. */}
      <JsonLd
        data={[
          pageJsonLd({
            name: "Yume Ga Kanau — Japanese Learning Institute",
            description:
              "Online Japanese classes for JLPT N5–N2, conversation and Business Japanese, in small batches and 1-on-1.",
            path: "/",
          }),
          faqJsonLd(),
        ]}
      />
      {/* hero-bg.webp is a CSS background, so the browser cannot even see it
          until it has downloaded and parsed home.css — on a phone that is most
          of a second of empty navy. Preloading starts the fetch with the HTML.
          React hoists these into <head>. */}
      <link rel="preload" as="image" href="/assets/hero-bg.webp" fetchPriority="high" />
      <link rel="preload" as="image" href="/assets/H-emblem.webp" fetchPriority="high" />

      <div>
        {/* ══ Hero — client's night-lake plate as a full-bleed ground ══ */}

        <div id="ygk-hero">
        <div className="hr-bg" aria-hidden="true"></div>
        <div className="hr-scrim" aria-hidden="true"></div>
        <div className="hr-foot" aria-hidden="true"></div>
        <div className="hr-inner">
          <div className="hr-copy">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(217,162,75,0.35)', borderRadius: '2px', padding: '7px 13px', marginBottom: '26px' }}>
              <span style={{ width: '6px', height: '6px', background: '#D9A24B', borderRadius: '50%' }}></span>
              <span style={{ fontSize: '11px', letterSpacing: '0.18em', color: '#D9A24B' }}>ONLINE CLASSES</span>
            </div>
            <h1 style={{ fontFamily: "'Komika Axis',Impact,'Arial Black',sans-serif", fontSize: 'clamp(33px,7.2vw,60px)', lineHeight: '1.15', fontWeight: '700', color: '#F5F0E6', margin: '0 0 22px', letterSpacing: '0.02em', textWrap: 'pretty' }}>Learn Japanese.<br /><span style={{ color: '#E2103C' }}>Live your dream.</span></h1>
            <p style={{ fontSize: '16.5px', lineHeight: '1.8', color: '#C3CAE4', margin: '0 0 34px', maxWidth: '520px', textWrap: 'pretty' }}>An online institute built for learners who want more than rote memorisation. Four guided stages take you from your very first kana to N2 fluency — with interactive lessons, exam strategy, and a teacher who answers every question.</p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '38px' }}>
              <Link href="/explore" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#C4082E', color: '#FFF6F2', fontSize: '14px', fontWeight: '700', letterSpacing: '0.04em', padding: '15px 28px', borderRadius: '2px', cursor: 'pointer' }}>FIND YOUR STAGE →</Link>
              <Link href="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(245,240,230,0.3)', color: '#F5F0E6', fontSize: '14px', fontWeight: '700', letterSpacing: '0.04em', padding: '15px 28px', borderRadius: '2px', cursor: 'pointer' }}>MEET SENSEI</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '18px', borderTop: '1px solid rgba(245,240,230,0.12)', paddingTop: '24px', maxWidth: '560px' }}>
              <div>
                <div style={{ fontFamily: "'Zen Old Mincho',serif", fontSize: 'clamp(21px,3vw,26px)', color: '#D9A24B' }}>N5–N2</div>
                <div style={{ fontSize: '11px', letterSpacing: '0.09em', color: '#9BA5C6', marginTop: '4px' }}>JLPT LEVELS</div>
              </div>
              <div>
                <div style={{ fontFamily: "'Zen Old Mincho',serif", fontSize: 'clamp(21px,3vw,26px)', color: '#D9A24B' }}>3+ yrs</div>
                <div style={{ fontSize: '11px', letterSpacing: '0.09em', color: '#9BA5C6', marginTop: '4px' }}>TEACHING</div>
              </div>
              <div>
                <div style={{ fontFamily: "'Zen Old Mincho',serif", fontSize: 'clamp(21px,3vw,26px)', color: '#D9A24B' }}>Global</div>
                <div style={{ fontSize: '11px', letterSpacing: '0.09em', color: '#9BA5C6', marginTop: '4px' }}>STUDENT BASE</div>
              </div>
              <div>
                <div style={{ fontFamily: "'Zen Old Mincho',serif", fontSize: 'clamp(21px,3vw,26px)', color: '#D9A24B' }}>Small Batch</div>
                <div style={{ fontSize: '11px', letterSpacing: '0.09em', color: '#9BA5C6', marginTop: '4px' }}>&amp; 1-ON-1</div>
              </div>
            </div>
          </div>
          <div className="hr-art" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '480px', overflow: 'hidden', contain: 'paint' }}>
            <div style={{ position: 'absolute', width: 'min(528px,92vw)', height: 'min(528px,92vw)', borderRadius: '50%', background: 'radial-gradient(circle,rgba(196,8,46,0.30),rgba(16,23,51,0) 68%)' }}></div>
            {/* H-emblem.png: assets/yumega.webp with its flat #1C223C plate flood-filled away and
                 cut to ink bounds (604x720). No drop-shadow — it read as a cut edge under the art.
                 The old separate gold ring is gone; this artwork carries its own. */}
            {/* The hero emblem is the Largest Contentful Paint on this page, and
                LCP is a ranking signal. fetchPriority="high" moves it to the front
                of the request queue; without it the browser treats it as an
                ordinary image and discovers it after the CSS. */}
            <img src="/assets/H-emblem.webp" alt="Yume Ga Kanau" fetchPriority="high" decoding="async" width={480} height={572} style={{ position: 'relative', width: 'min(480px,84vw)', height: 'auto', objectFit: 'contain', animation: 'ygkFloat 9s ease-in-out infinite' }} />
          </div>
        </div>
        </div>

        <div id="students-section" style={{ position: 'relative' }}>
          <img src="/assets/flower.webp" alt="" style={{ position: 'absolute', top: '-20px', right: '-20px', width: 'min(480px, 40vw)', pointerEvents: 'none', zIndex: '0', opacity: '0.9' }} />

          <div id="students-grid" style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(36px,5vw,60px) 28px', display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 'clamp(24px,3vw,40px)', alignItems: 'start', position: 'relative', zIndex: '1' }}>
            {/* ── Left: Text + Map Video ── */}
            <div id="students-left" className="sf-text-hidden" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                {/* Decorative Japanese text */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '8px', height: '8px', background: '#C4082E', borderRadius: '50%' }}></div>
                  <div style={{ fontFamily: "'Zen Old Mincho',serif", fontSize: '12px', color: '#9BA5C6', letterSpacing: '0.08em' }}>世界中の学生 · Global Learners</div>
                </div>
                {/* Sub heading */}
                <div style={{ fontFamily: "'Nunito Sans',sans-serif", fontSize: 'clamp(16px,2vw,22px)', fontWeight: '700', color: '#FFFFFF', letterSpacing: '0.15em', marginBottom: '-4px' }}>A COMMUNITY <span style={{ color: '#6A7292', fontWeight: '400' }}>OF</span></div>
                {/* Main Heading */}
                <h2 style={{ fontFamily: "'Komika Axis',Impact,'Arial Black',sans-serif", fontWeight: '700', fontSize: 'clamp(36px,5.5vw,56px)', margin: '0 0 8px 0', letterSpacing: '0.02em', lineHeight: '1.1', textTransform: 'uppercase' }}><span style={{ color: '#FFFFFF' }}>GLOBAL</span> <span style={{ color: '#C4082E' }}>LEARNERS</span></h2>
                {/* Decorative divider */}
                <div style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg,#C4082E,#D9A24B)', borderRadius: '2px', marginBottom: '16px' }}></div>
                {/* Paragraph */}
                <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#AEB7D6', margin: '0', maxWidth: '420px', textWrap: 'pretty' }}>From different countries, one goal — to master Japanese and achieve their dreams with YUME GA KANAU.</p>
              </div>

              <div className="map-container">
                {/* Video element — provide map-transition.mp4 in assets/ to activate.
                     The clip is decorative, so the browser's hover overlay (picture-in-picture,
                     cast, playback-rate) is suppressed and pointer events are dropped — without
                     this that toolbar floats over the map whenever the cursor crosses it. */}
                <video id="map-video" muted={true} playsInline={true} preload="none" disablePictureInPicture
                       disableRemotePlayback controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                       tabIndex={-1} style={{ display: 'none', pointerEvents: 'none' }}>
                  <source src="/assets/map-transition.webm" type="video/webm" />
                  <source src="/assets/map-transition.mp4" type="video/mp4" />
                </video>
                {/* Placeholder shown until video is provided */}
                <div id="map-placeholder" style={{ position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at center, rgba(24,33,68,1) 0%, rgba(13,19,42,1) 100%)' }}>
                  {/* Decorative world map dots */}
                  <svg viewBox="0 0 800 500" style={{ width: '100%', height: '100%', opacity: '0.12' }} preserveAspectRatio="xMidYMid meet">
                    <circle cx="600" cy="180" r="3" fill="#D9A24B" /><circle cx="615" cy="175" r="2.5" fill="#D9A24B" /><circle cx="630" cy="185" r="2" fill="#D9A24B" />
                    <circle cx="590" cy="195" r="2.5" fill="#D9A24B" /><circle cx="610" cy="200" r="2" fill="#D9A24B" /><circle cx="625" cy="195" r="3" fill="#D9A24B" />
                    <circle cx="580" cy="210" r="2" fill="#D9A24B" /><circle cx="600" cy="215" r="2.5" fill="#D9A24B" /><circle cx="620" cy="210" r="2" fill="#D9A24B" />
                    <circle cx="400" cy="140" r="2.5" fill="#D9A24B" /><circle cx="415" cy="135" r="2" fill="#D9A24B" /><circle cx="430" cy="145" r="2.5" fill="#D9A24B" />
                    <circle cx="395" cy="155" r="2" fill="#D9A24B" /><circle cx="410" cy="160" r="3" fill="#D9A24B" /><circle cx="425" cy="155" r="2" fill="#D9A24B" />
                    <circle cx="200" cy="160" r="2.5" fill="#D9A24B" /><circle cx="215" cy="155" r="2" fill="#D9A24B" /><circle cx="190" cy="175" r="3" fill="#D9A24B" />
                    <circle cx="205" cy="180" r="2" fill="#D9A24B" /><circle cx="220" cy="170" r="2.5" fill="#D9A24B" />
                    <circle cx="230" cy="280" r="2.5" fill="#D9A24B" /><circle cx="245" cy="290" r="2" fill="#D9A24B" /><circle cx="235" cy="300" r="3" fill="#D9A24B" />
                  </svg>
                  {/* Highlighted country markers */}
                  <div style={{ position: 'absolute', inset: '0' }}>
                    <div style={{ position: 'absolute', left: '68%', top: '52%', transform: 'translate(-50%,-50%)' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#C4082E', boxShadow: '0 0 16px rgba(196,8,46,0.6),0 0 32px rgba(196,8,46,0.3)', animation: 'flagPulse 2.5s ease-in-out infinite' }}></div>
                      <div style={{ position: 'absolute', top: '18px', left: '50%', transform: 'translateX(-50%)', fontFamily: "'Nunito Sans',sans-serif", fontSize: '10px', color: 'rgba(245,240,230,0.5)', whiteSpace: 'nowrap', letterSpacing: '0.08em' }}>INDIA</div>
                    </div>
                    <div style={{ position: 'absolute', left: '45%', top: '28%', transform: 'translate(-50%,-50%)' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#C4082E', boxShadow: '0 0 16px rgba(196,8,46,0.6),0 0 32px rgba(196,8,46,0.3)', animation: 'flagPulse 2.5s ease-in-out infinite 0.4s' }}></div>
                      <div style={{ position: 'absolute', top: '18px', left: '50%', transform: 'translateX(-50%)', fontFamily: "'Nunito Sans',sans-serif", fontSize: '10px', color: 'rgba(245,240,230,0.5)', whiteSpace: 'nowrap', letterSpacing: '0.08em' }}>UK</div>
                    </div>
                    <div style={{ position: 'absolute', left: '22%', top: '36%', transform: 'translate(-50%,-50%)' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#C4082E', boxShadow: '0 0 16px rgba(196,8,46,0.6),0 0 32px rgba(196,8,46,0.3)', animation: 'flagPulse 2.5s ease-in-out infinite 0.8s' }}></div>
                      <div style={{ position: 'absolute', top: '18px', left: '50%', transform: 'translateX(-50%)', fontFamily: "'Nunito Sans',sans-serif", fontSize: '10px', color: 'rgba(245,240,230,0.5)', whiteSpace: 'nowrap', letterSpacing: '0.08em' }}>USA</div>
                    </div>
                    <div style={{ position: 'absolute', left: '82%', top: '34%', transform: 'translate(-50%,-50%)' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#C4082E', boxShadow: '0 0 16px rgba(196,8,46,0.6),0 0 32px rgba(196,8,46,0.3)', animation: 'flagPulse 2.5s ease-in-out infinite 1.2s' }}></div>
                      <div style={{ position: 'absolute', top: '18px', left: '50%', transform: 'translateX(-50%)', fontFamily: "'Nunito Sans',sans-serif", fontSize: '10px', color: 'rgba(245,240,230,0.5)', whiteSpace: 'nowrap', letterSpacing: '0.08em' }}>JAPAN</div>
                    </div>
                  </div>
                  {/* Connecting flight-path arcs */}
                  <svg style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M22,36 Q45,10 68,52" stroke="rgba(196,8,46,0.15)" strokeWidth="0.3" fill="none" strokeDasharray="1.5,1.5" />
                    <path d="M45,28 Q60,15 82,34" stroke="rgba(196,8,46,0.15)" strokeWidth="0.3" fill="none" strokeDasharray="1.5,1.5" />
                    <path d="M68,52 Q76,40 82,34" stroke="rgba(196,8,46,0.15)" strokeWidth="0.3" fill="none" strokeDasharray="1.5,1.5" />
                    <path d="M22,36 Q35,20 45,28" stroke="rgba(196,8,46,0.15)" strokeWidth="0.3" fill="none" strokeDasharray="1.5,1.5" />
                  </svg>
                </div>
              </div>

              {/* New Stats Bar */}
              <div className="st-stats" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(90deg, rgba(20,28,60,0.95), rgba(16,23,51,0.9))', borderRadius: '10px', padding: '16px 20px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05),0 8px 20px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid rgba(196,8,46,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C4082E' }}>
                     <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1' }}>4+</div>
                    <div style={{ fontSize: '10px', color: '#8B95B6', marginTop: '3px' }}>Countries<br />Global Community</div>
                  </div>
                </div>
                <div className="st-stats-div" style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.06)' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid rgba(196,8,46,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C4082E' }}>
                     <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"></path></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1' }}>3+</div>
                    <div style={{ fontSize: '10px', color: '#8B95B6', marginTop: '3px' }}>Years of Teaching<br />Experience</div>
                  </div>
                </div>
                <div className="st-stats-div" style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.06)' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid rgba(196,8,46,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C4082E' }}>
                     <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1' }}>High</div>
                    <div style={{ fontSize: '10px', color: '#8B95B6', marginTop: '3px' }}>Student Success<br />Rate in JLPT</div>
                  </div>
                </div>
                <div className="st-stats-div" style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.06)' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid rgba(196,8,46,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C4082E' }}>
                     <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 14v-3a8 8 0 0116 0v3m-2 4h-2a2 2 0 01-2-2v-4a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2zM6 18H4a2 2 0 01-2-2v-4a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2z"></path></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1' }}>1:1</div>
                    <div style={{ fontSize: '10px', color: '#8B95B6', marginTop: '3px' }}>Personalized<br />Guidance</div>
                  </div>
                </div>
              </div>

              {/* New Quote Box */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'linear-gradient(90deg, #151D3E, #182144)', border: '1px solid rgba(217,162,75,0.15)', borderRadius: '10px', padding: '16px 20px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid rgba(217,162,75,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D9A24B', flexShrink: '0' }}>
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path></svg>
                </div>
                <div style={{ fontSize: '13px', color: '#AEB7D6', lineHeight: '1.5' }}>
                  Different places. Different cultures. Same dream.<br />
                  To speak <span style={{ color: '#D9A24B', fontWeight: '700' }}>Japanese with confidence.</span>
                </div>
              </div>

            </div>

            {/* ── Right: Students From Text ── */}
            <div id="students-text" className="sf-text-hidden">
              <div id="students-text-inner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: 'clamp(40px, 12vw, 165px)' }}>

                {/* Main Heading */}
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                   <div style={{ position: 'absolute', left: '0', top: '-30px', fontSize: '56px', fontFamily: "'Zen Old Mincho',serif", color: 'rgba(196,8,46,0.06)', whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none', lineHeight: '1' }}>繋がり</div>
                   <h2 style={{ fontFamily: "'Nunito Sans',sans-serif", color: '#C4082E', fontWeight: '800', fontSize: '18px', margin: '0', letterSpacing: '0.05em', lineHeight: '1', textTransform: 'uppercase', position: 'relative' }}>Students From</h2>
                </div>

                {/* Country cards column */}
                <div className="country-cards-col" style={{ width: '100%' }}>
                  {/* India */}
                  <div className="country-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: '1' }}>
                      <div className="flag-ring"><img loading="lazy" decoding="async" src="/assets/india.webp" alt="India flag" /></div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="country-name">INDIA</span>
                        <span style={{ fontSize: '12px', color: '#8B95B6' }}>Our largest community</span>
                      </div>
                    </div>
                    <img loading="lazy" decoding="async" src="/assets/india side.webp" alt="" style={{ position: 'absolute', right: '75px', bottom: '0', height: '85%', opacity: '0.85', zIndex: '0', objectFit: 'contain', objectPosition: 'center bottom', transform: 'translateX(50%)' }} />
                  </div>
                  {/* UK */}
                  <div className="country-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: '1' }}>
                      <div className="flag-ring"><img loading="lazy" decoding="async" src="/assets/uk.webp" alt="UK flag" /></div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="country-name">THE UK</span>
                        <span style={{ fontSize: '12px', color: '#8B95B6' }}>Passionate Japanese learners</span>
                      </div>
                    </div>
                    <img loading="lazy" decoding="async" src="/assets/uk side.webp" alt="" style={{ position: 'absolute', right: '75px', bottom: '0', height: '85%', opacity: '0.85', zIndex: '0', objectFit: 'contain', objectPosition: 'center bottom', transform: 'translateX(50%)' }} />
                  </div>
                  {/* USA */}
                  <div className="country-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: '1' }}>
                      <div className="flag-ring"><img loading="lazy" decoding="async" src="/assets/sua.webp" alt="USA flag" /></div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="country-name">THE USA</span>
                        <span style={{ fontSize: '12px', color: '#8B95B6' }}>Achieving new milestones</span>
                      </div>
                    </div>
                    <img loading="lazy" decoding="async" src="/assets/usa side.webp" alt="" style={{ position: 'absolute', right: '75px', bottom: '0', height: '85%', opacity: '0.85', zIndex: '0', objectFit: 'contain', objectPosition: 'center bottom', transform: 'translateX(50%)' }} />
                  </div>
                  {/* Japan */}
                  <div className="country-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: '1' }}>
                      <div className="flag-ring"><img loading="lazy" decoding="async" src="/assets/japan.webp" alt="Japan flag" /></div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="country-name">JAPAN</span>
                        <span style={{ fontSize: '12px', color: '#8B95B6' }}>Learning from the heart of Japan</span>
                      </div>
                    </div>
                    <img loading="lazy" decoding="async" src="/assets/japan side.webp" alt="" style={{ position: 'absolute', right: '75px', bottom: '0', height: '85%', opacity: '0.85', zIndex: '0', objectFit: 'contain', objectPosition: 'center bottom', transform: 'translateX(50%)' }} />
                  </div>
                </div>

                {/* One Mission box */}
                <div style={{ marginTop: '16px', width: '100%', borderRadius: '12px', background: 'linear-gradient(135deg,rgba(196,8,46,0.15) 0%,rgba(16,23,51,0.5) 100%)', border: '1px solid rgba(196,8,46,0.2)', padding: '26px 24px', display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(196,8,46,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6B8A', flexShrink: '0', zIndex: '1' }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>
                  </div>
                  <div style={{ zIndex: '1' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF', letterSpacing: '0.05em', marginBottom: '4px' }}>ONE MISSION. ONE FAMILY.</div>
                    <div style={{ fontSize: '12px', color: '#8B95B6', lineHeight: '1.4', maxWidth: '240px' }}>No matter where you are, you're part of the <span style={{ color: '#C4082E', fontWeight: '700' }}>YUME GA KANAU</span> family.</div>
                  </div>
                  <img loading="lazy" decoding="async" src="/assets/gate.webp" alt="" style={{ position: 'absolute', right: '24px', top: '0', height: '115%', opacity: '0.85', zIndex: '0', objectFit: 'contain', objectPosition: 'right top' }} />
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* ══ The Four Stages — immersive torii-path section (layered enter/exit anim) ══ */}

        <div id="four-stages">
          <div className="fs-canvas">
            <div className="fs-scene" aria-hidden="true">
              <img loading="lazy" decoding="async" className="fs-l fs-base" src="/assets/components/L-base.webp" alt="" />
              <img loading="lazy" decoding="async" className="fs-l fs-mountain" src="/assets/components/L-mountain.webp" alt="" />
              <img loading="lazy" decoding="async" className="fs-l fs-torii fs-torii-1" src="/assets/components/L-torii-1.webp" alt="" />
              <img loading="lazy" decoding="async" className="fs-l fs-torii fs-torii-2" src="/assets/components/L-torii-2.webp" alt="" />
              <img loading="lazy" decoding="async" className="fs-l fs-torii fs-torii-3" src="/assets/components/L-torii-3.webp" alt="" />
              <img loading="lazy" decoding="async" className="fs-l fs-torii fs-torii-4" src="/assets/components/L-torii-4.webp" alt="" />
              <img loading="lazy" decoding="async" className="fs-l fs-bar-img" src="/assets/components/L-bar.webp" alt="" />
              <img loading="lazy" decoding="async" className="fs-l fs-bloom" src="/assets/components/L-bloom.webp" alt="" />
              <img loading="lazy" decoding="async" className="fs-l fs-circ fs-circle-1" src="/assets/components/L-circle-1.webp" alt="" />
              <img loading="lazy" decoding="async" className="fs-l fs-circ fs-circle-2" src="/assets/components/L-circle-2.webp" alt="" />
              <img loading="lazy" decoding="async" className="fs-l fs-circ fs-circle-3" src="/assets/components/L-circle-3.webp" alt="" />
              <img loading="lazy" decoding="async" className="fs-l fs-circ fs-circle-4" src="/assets/components/L-circle-4.webp" alt="" />
            </div>
            <img loading="lazy" decoding="async" className="fs-bg-mobile" src="/assets/stages-bg.webp" alt="Four torii gates on a stone path across a lake, leading toward Mount Fuji at night" />
            <div className="fs-layer">
              <div className="fs-head">
                <div className="fs-eyebrow">The Four Stages · 4つのステージ</div>
                <h2 className="fs-title">A path, not a pile of lessons</h2>
                <div className="fs-rule"></div>
                <p className="fs-sub">A clear journey from your first &ldquo;あ&rdquo; to confident conversations. One step at a time.&nbsp; 一歩ずつ、着実に。</p>
              </div>

              <Link href="/explore" className="fs-curriculum">See full curriculum →</Link>

              <Link href="/explore#stage-1" className="fs-card fs-card1">
                <div className="lvl">Stage 1 · JLPT N5</div>
                <h3>Kana to first conversations</h3>
                <p>Hiragana, katakana, ~100 kanji and the phrases that carry a real self-introduction.</p>
                <div className="fs-btn">Explore stage <span>&rarr;</span></div>
              </Link>
              <Link href="/explore#stage-2" className="fs-card fs-card2">
                <div className="lvl">Stage 2 · JLPT N4</div>
                <h3>Grammar that connects</h3>
                <p>て-form, plain form, ~300 kanji &mdash; sentences finally start joining together.</p>
                <div className="fs-btn">Explore stage <span>&rarr;</span></div>
              </Link>
              <Link href="/explore#stage-3" className="fs-card fs-card3">
                <div className="lvl">Stage 3 · JLPT N3</div>
                <h3>Real-world Japanese</h3>
                <p>~650 kanji, natural listening, opinions &mdash; bridging intermediate fluency.</p>
                <div className="fs-btn">Explore stage <span>&rarr;</span></div>
              </Link>
              <Link href="/explore#stage-4" className="fs-card fs-card4">
                <div className="lvl">Stage 4 · JLPT N2</div>
                <h3>Fluency &amp; nuance</h3>
                <p>1000+ kanji, keigo, business register and proven exam strategies.</p>
                <div className="fs-btn">Explore stage <span>&rarr;</span></div>
              </Link>

              <div className="fs-bar">
                <div className="fs-bi fs-bi1"><b>Step by step</b><p>Each stage builds the skills you need for the next.</p></div>
                <div className="fs-bi fs-bi2"><b>Practical first</b><p>Real conversations, real situations.</p></div>
                <div className="fs-bi fs-bi3"><b>Built for JLPT</b><p>N5 &rarr; N2, aligned with exam goals.</p></div>
                <div className="fs-bi fs-bi4"><b>Guided always</b><p>Personalized support every step of the way.</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ Why Yume Ga Kanau — layered scene + glassmorphic cards ══ */}

        <div id="why-ygk">
          <div className="wy-scene" aria-hidden="true">
            <img loading="lazy" decoding="async" className="wy-l wy-bg" src="/assets/bg.webp" alt="" />
            <div className="wy-scrim"></div>
            <div className="wy-topfade"></div>
            <img loading="lazy" decoding="async" className="wy-l wy-bloom" src="/assets/bloom.webp" alt="" />
            <div className="wy-anchor"><img loading="lazy" decoding="async" className="wy-l wy-torii" src="/assets/tiro%20.webp" alt="" /></div>
            <div className="wy-veil"></div>
          </div>
          <div className="wy-inner">
            <div className="wy-left">
              <div className="wy-eyebrow">Why Yume Ga Kanau</div>
              <h2 className="wy-h2">Beyond rote learning</h2>
              <div className="wy-rule"></div>
              <p className="wy-p">Every class is built around the way the language is actually used — logic before lists, patterns before drills, and culture woven into both.</p>
              <div className="wy-quote">Zero pressure. Every question welcomed.</div>
            </div>
            <div className="wy-cards">
              <div className="wy-card">
                <div className="wy-ic"><img loading="lazy" decoding="async" src="/assets/components/icon-doubt.webp" alt="" /></div>
                <div>
                  <div className="wy-ja">質問対応</div>
                  <h3>Dedicated doubt-solving</h3>
                  <div className="wy-crule"></div>
                  <p>Small batches and 1-on-1 slots mean no question waits until next week.</p>
                </div>
              </div>
              <div className="wy-card">
                <div className="wy-ic"><img loading="lazy" decoding="async" src="/assets/components/icon-exam.webp" alt="" /></div>
                <div>
                  <div className="wy-ja">合格対策</div>
                  <h3>High-yield exam strategy</h3>
                  <div className="wy-crule"></div>
                  <p>JLPT-specific tactics for reading speed, listening focus and time control.</p>
                </div>
              </div>
              <div className="wy-card">
                <div className="wy-ic"><img loading="lazy" decoding="async" src="/assets/components/icon-speak.webp" alt="" /></div>
                <div>
                  <div className="wy-ja">会話実践</div>
                  <h3>Speaking from day one</h3>
                  <div className="wy-crule"></div>
                  <p>You practise out loud in every session — not only before an exam.</p>
                </div>
              </div>
              <div className="wy-card">
                <div className="wy-ic"><img loading="lazy" decoding="async" src="/assets/components/icon-culture.webp" alt="" /></div>
                <div>
                  <div className="wy-ja">文化理解</div>
                  <h3>Culture, not just syllabus</h3>
                  <div className="wy-crule"></div>
                  <p>Etiquette, nuance and context, so the language feels lived rather than learned.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="wy-seam" aria-hidden="true"></div>
        </div>

        {/* ══ Meet Your Sensei — layered light scene, rebuilt from "sensei comp" ══ */}

        <div id="meet-sensei">
         <div className="sn-pin">
          <div className="fq-deco" aria-hidden="true"><div className="fq-decoin">
            <img loading="lazy" decoding="async" className="fq-side" src="/assets/faq/F-side.webp" alt="" />
            <img loading="lazy" decoding="async" className="fq-p fq-p1" src="/assets/faq/F-petal-1.webp" alt="" />
            <img loading="lazy" decoding="async" className="fq-p fq-p2" src="/assets/faq/F-petal-2.webp" alt="" />
            <img loading="lazy" decoding="async" className="fq-p fq-p3" src="/assets/faq/F-petal-3.webp" alt="" />
            <img loading="lazy" decoding="async" className="fq-p fq-p4" src="/assets/faq/F-petal-4.webp" alt="" />
            <img loading="lazy" decoding="async" className="fq-bloom" src="/assets/faq/F-bloom.webp" alt="" />
          </div></div>
          <img loading="lazy" decoding="async" className="sn-l sn-scene" src="/assets/sensei%20comp/S-scene.webp" alt="" aria-hidden="true" />
          <div className="sn-canvas">
            <img loading="lazy" decoding="async" className="sn-l sn-cloud1" src="/assets/sensei%20comp/S-cloud.webp" alt="" aria-hidden="true" />
            <img loading="lazy" decoding="async" className="sn-l sn-cloud2" src="/assets/sensei%20comp/S-cloud.webp" alt="" aria-hidden="true" />
            <img loading="lazy" decoding="async" className="sn-l sn-cloud3" src="/assets/sensei%20comp/S-cloud.webp" alt="" aria-hidden="true" />
            <img loading="lazy" decoding="async" className="sn-l sn-petal1" src="/assets/sensei%20comp/S-petal-a.webp" alt="" aria-hidden="true" />
            <img loading="lazy" decoding="async" className="sn-l sn-petal2" src="/assets/sensei%20comp/S-petal-b.webp" alt="" aria-hidden="true" />

            <div className="sn-eyebrow">Meet Your Sensei <img loading="lazy" decoding="async" src="/assets/sensei%20comp/S-blossom-b.webp" alt="" /></div>
            <div className="sn-erule"></div>
            <h2 className="sn-h2">Guiding your journey<br />with experience and care.</h2>
            <p className="sn-sub">More than a teacher &mdash; a fellow learner,<br />cheering for your progress.</p>

            <div className="sn-flower sn-flower-l" aria-hidden="true"><img src="/assets/sensei%20comp/moving%20flower.webp" alt="" /></div>
            <div className="sn-flower sn-flower-r" aria-hidden="true"><span className="sn-fmirror"><img src="/assets/sensei%20comp/moving%20flower.webp" alt="" /></span></div>

            <div className="sn-photo"><img loading="lazy" decoding="async" src="/assets/sensei%20comp/sensei.webp" alt="Parveen Kaur Sensei" /></div>
            <div className="sn-badge"><img loading="lazy" decoding="async" src="/assets/sensei%20comp/S-blossom-b.webp" alt="" />Parveen Kaur Sensei</div>

            <img loading="lazy" decoding="async" className="sn-l sn-qmark" src="/assets/sensei%20comp/S-quote.webp" alt="" aria-hidden="true" />
            <p className="sn-quote">In our classes, every mistake is a step forward, every question is welcomed, and every milestone is celebrated. Let&rsquo;s make your dream of mastering Japanese come true together.</p>
            <div className="sn-name">Parveen Kaur Sensei &middot; 先生</div>
            <div className="sn-role">Founder &amp; Lead Instructor</div>

            <div className="sn-stat sn-s1"><img loading="lazy" decoding="async" src="/assets/sensei%20comp/S-ic-jlpt.webp" alt="" /><b>JLPT Expertise</b><p>Specialized in N5&ndash;N2 teaching &amp; exam strategies</p></div>
            <div className="sn-stat sn-s2"><img loading="lazy" decoding="async" src="/assets/sensei%20comp/S-ic-exp.webp" alt="" /><b>Experience</b><p>3+ years of teaching Japanese learners</p></div>
            <div className="sn-stat sn-s3"><img loading="lazy" decoding="async" src="/assets/sensei%20comp/S-ic-students.webp" alt="" /><b>Students Guided</b><p>Guided many students across the world</p></div>
            <div className="sn-stat sn-s4"><img loading="lazy" decoding="async" src="/assets/sensei%20comp/S-ic-heart.webp" alt="" /><b>Teaching Philosophy</b><p>Patient, supportive and focused on real progress</p></div>

            <div className="sn-panel"><span className="sn-pdiv sn-pd1"></span></div>
            <img loading="lazy" decoding="async" className="sn-l sn-pflower1" src="/assets/sensei%20comp/S-blossom-a.webp" alt="" aria-hidden="true" />
            <img loading="lazy" decoding="async" className="sn-l sn-pflower2" src="/assets/sensei%20comp/S-blossom-a.webp" alt="" aria-hidden="true" />
            <div className="sn-plabel sn-pl1">My Philosophy</div>
            <div className="sn-pl1rule"></div>
            <p className="sn-ptext">Language is more than words &mdash;<br />it&rsquo;s connection.<br />I focus on building confidence, clarity<br />and consistency so you can use Japanese<br />naturally in real life.</p>
            <img loading="lazy" decoding="async" className="sn-l sn-pq" src="/assets/sensei%20comp/S-petal-soft.webp" alt="" aria-hidden="true" />
            <p className="sn-pquote">Your effort today builds the fluency of tomorrow.</p>
          </div>
          <div className="rv-canvas">
            <div className="rv-eyebrow">Student Voices</div>
            <h2 className="rv-h2">Real journeys. Real progress.<br />Real people.</h2>
            <div className="rv-rule"></div>
            <p className="rv-sub">Every learner&rsquo;s path is unique.<br />Here&rsquo;s what our students have to say about their journey with us.</p>
            {/* Seven real student reviews (client's "HONEST REVIEW" cards, assets/reviews/*).
                 Four show at a time; the pager slides the track to cards 4-7. */}
            <div className="rv-cards" data-pg="0">
             <div className="rv-track">
              <div className="rv-card" data-rvi="0">
                <div className="rv-top">
                  <img loading="lazy" decoding="async" className="rv-qm" src="/assets/review%20page/S-rv-quote.webp" alt="" aria-hidden="true" />
                  <div className="rv-stars" aria-label="Rated 5 out of 5"><span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>
                </div>
                <p>You are kind, friendly and patient, and always motivated me to keep improving. Your teaching style makes even the difficult topics easy to understand.</p>
                <div className="rv-foot">
                  <img loading="lazy" decoding="async" className="rv-av" src="/assets/reviews/rv-charu.webp" alt="Charu Pawar" />
                  <div>
                    <b>Charu Pawar</b>
                    <span className="rv-loc"><img loading="lazy" decoding="async" src="/assets/review%20page/S-flag-in.webp" alt="" />New Delhi, India</span>
                    <span className="rv-st">JLPT N5</span>
                  </div>
                </div>
              </div>
              <div className="rv-card" data-rvi="1">
                <div className="rv-top">
                  <img loading="lazy" decoding="async" className="rv-qm" src="/assets/review%20page/S-rv-quote.webp" alt="" aria-hidden="true" />
                  <div className="rv-stars" aria-label="Rated 5 out of 5"><span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>
                </div>
                <p>I used to just memorise grammar patterns without really getting them &mdash; you&rsquo;ve taught me in a way that actually sticks. I&rsquo;d recommend you to anyone trying to clear N2.</p>
                <div className="rv-foot">
                  <img loading="lazy" decoding="async" className="rv-av" src="/assets/reviews/rv-amaan.webp" alt="Amaan Riaz" />
                  <div>
                    <b>Amaan Riaz</b>
                    <span className="rv-loc"><img loading="lazy" decoding="async" src="/assets/review%20page/S-flag-in.webp" alt="" /><img loading="lazy" decoding="async" src="/assets/review%20page/S-flag-jp.webp" alt="" />New Delhi &middot; Japan</span>
                    <span className="rv-st">JLPT N2</span>
                  </div>
                </div>
              </div>
              <div className="rv-card" data-rvi="2">
                <div className="rv-top">
                  <img loading="lazy" decoding="async" className="rv-qm" src="/assets/review%20page/S-rv-quote.webp" alt="" aria-hidden="true" />
                  <div className="rv-stars" aria-label="Rated 5 out of 5"><span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>
                </div>
                <p>I especially loved the way you explained the stories and the logic behind each kanji &mdash; it made learning so much more interesting and easier to remember.</p>
                <div className="rv-foot">
                  <img loading="lazy" decoding="async" className="rv-av" src="/assets/reviews/rv-priyanshu.webp" alt="Priyanshu Garg" />
                  <div>
                    <b>Priyanshu Garg</b>
                    <span className="rv-loc"><img loading="lazy" decoding="async" src="/assets/review%20page/S-flag-in.webp" alt="" />New Delhi, India</span>
                    <span className="rv-st">JLPT N4</span>
                  </div>
                </div>
              </div>
              <div className="rv-card" data-rvi="3">
                <div className="rv-top">
                  <img loading="lazy" decoding="async" className="rv-qm" src="/assets/review%20page/S-rv-quote.webp" alt="" aria-hidden="true" />
                  <div className="rv-stars" aria-label="Rated 5 out of 5"><span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>
                </div>
                <p>You explain every lesson clearly and make learning enjoyable. Whenever we have questions you help us with a smile and make sure everyone understands the topic.</p>
                <div className="rv-foot">
                  <img loading="lazy" decoding="async" className="rv-av" src="/assets/reviews/rv-shreya.webp" alt="Shreya Suman" />
                  <div>
                    <b>Shreya Suman</b>
                    <span className="rv-loc"><img loading="lazy" decoding="async" src="/assets/review%20page/S-flag-jp.webp" alt="" />Japan</span>
                    <span className="rv-st">JLPT N5</span>
                  </div>
                </div>
              </div>
              <div className="rv-card" data-rvi="4">
                <div className="rv-top">
                  <img loading="lazy" decoding="async" className="rv-qm" src="/assets/review%20page/S-rv-quote.webp" alt="" aria-hidden="true" />
                  <div className="rv-stars" aria-label="Rated 5 out of 5"><span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>
                </div>
                <p>Her teaching is clear, patient and engaging, and she puts a lot of effort into making sure every student understands the lesson. My Japanese has improved significantly.</p>
                <div className="rv-foot">
                  <img loading="lazy" decoding="async" className="rv-av" src="/assets/reviews/rv-preethi.webp" alt="M. Preethi" />
                  <div>
                    <b>M. Preethi</b>
                    <span className="rv-loc"><img loading="lazy" decoding="async" src="/assets/review%20page/S-flag-in.webp" alt="" />Tamil Nadu, India</span>
                    <span className="rv-st">JLPT N3</span>
                  </div>
                </div>
              </div>
              <div className="rv-card" data-rvi="5">
                <div className="rv-top">
                  <img loading="lazy" decoding="async" className="rv-qm" src="/assets/review%20page/S-rv-quote.webp" alt="" aria-hidden="true" />
                  <div className="rv-stars" aria-label="Rated 5 out of 5"><span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>
                </div>
                <p>You are one of the kindest, most humble and patient teachers I have ever met, and your teaching style makes even difficult things feel simple. &#31169;&#12398;&#22823;&#22909;&#12365;&#12394;&#20808;&#29983;</p>
                <div className="rv-foot">
                  <img loading="lazy" decoding="async" className="rv-av" src="/assets/reviews/rv-jaskiran.webp" alt="Jaskiran Kaur" />
                  <div>
                    <b>Jaskiran Kaur</b>
                    <span className="rv-loc"><img loading="lazy" decoding="async" src="/assets/review%20page/S-flag-in.webp" alt="" />New Delhi, India</span>
                    <span className="rv-st">JLPT N4</span>
                  </div>
                </div>
              </div>
              <div className="rv-card" data-rvi="6">
                <div className="rv-top">
                  <img loading="lazy" decoding="async" className="rv-qm" src="/assets/review%20page/S-rv-quote.webp" alt="" aria-hidden="true" />
                  <div className="rv-stars" aria-label="Rated 5 out of 5"><span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>
                </div>
                <p>I was weak even in N4, but you took me through a revision that made my base far firmer before N3. Your daily revision tests keep new kanji and vocab impossible to forget.</p>
                <div className="rv-foot">
                  <img loading="lazy" decoding="async" className="rv-av" src="/assets/reviews/rv-siddiquan.webp" alt="Siddiquan Jawaid" />
                  <div>
                    <b>Siddiquan Jawaid</b>
                    <span className="rv-loc"><img loading="lazy" decoding="async" src="/assets/review%20page/S-flag-in.webp" alt="" />Kolkata, India</span>
                    <span className="rv-st">JLPT N3</span>
                  </div>
                </div>
              </div>
             </div>
            </div>
            <div className="rv-pager">
              <span className="rv-count"><b className="rv-now">1&ndash;4</b> / 7</span>
              <div className="rv-dots">
                <button className="rv-dot on" type="button" data-rv="0" aria-label="Reviews 1 to 4"></button>
                <button className="rv-dot" type="button" data-rv="1" aria-label="Reviews 4 to 7"></button>
              </div>
              <button className="rv-arrow rv-prev" type="button" aria-label="Previous reviews" disabled><svg viewBox="0 0 24 24"><polyline points="15 5 8 12 15 19"></polyline></svg></button>
              <button className="rv-arrow rv-next" type="button" aria-label="More reviews"><svg viewBox="0 0 24 24"><polyline points="9 5 16 12 9 19"></polyline></svg></button>
            </div>
          </div>
          <div className="fq-canvas">
            <div className="fq-inner">
              <div className="fq-eyebrow">FAQ</div>
              <div className="fq-rule"></div>
              <h2 className="fq-h2">Got Questions?<br />We&rsquo;ve Got You.</h2>
              <p className="fq-sub">Here are some of the most common questions students ask. Still unsure? Feel free to reach out &mdash; we&rsquo;re always happy to help!</p>
              <div className="fq-flow">
                <div className="fq-list">
                <div className="fq-row">
                  <div className="fq-q"><img loading="lazy" decoding="async" src="/assets/faq/F-ic-trial.webp" alt="" aria-hidden="true" /><span>What happens in a trial class?</span><svg className="fq-chev" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9.5 12 15.5 18 9.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
                  <div className="fq-a"><div className="fq-ain"><p>In a free trial class, we assess your current Japanese level, introduce our interactive teaching methodology, and conduct a short live lesson. It&rsquo;s a great opportunity to experience the learning atmosphere, discuss your language goals, and ask Parveen Sensei any questions before enrolling.</p></div></div>
                </div>
                <div className="fq-row">
                  <div className="fq-q"><img loading="lazy" decoding="async" src="/assets/faq/F-ic-time.webp" alt="" aria-hidden="true" /><span>How are classes scheduled across time zones?</span><svg className="fq-chev" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9.5 12 15.5 18 9.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
                  <div className="fq-a"><div className="fq-ain"><p>We currently accommodate learners across multiple time zones, including India, the UK, and Japan. While scheduling depends on slot availability, we always do our best to manage and align batch timings based on student requirements wherever possible.</p></div></div>
                </div>
                <div className="fq-row">
                  <div className="fq-q"><img loading="lazy" decoding="async" src="/assets/faq/F-ic-books.webp" alt="" aria-hidden="true" /><span>Do I need to buy separate textbooks/materials?</span><svg className="fq-chev" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9.5 12 15.5 18 9.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
                  <div className="fq-a"><div className="fq-ain"><p>No separate purchases are required! We provide all essential study materials, including PDF handouts, custom Kanji workbooks, vocabulary lists, and practice tests, directly through your official batch WhatsApp group.</p></div></div>
                </div>
                <div className="fq-row">
                  <div className="fq-q"><img loading="lazy" decoding="async" src="/assets/faq/F-ic-refund.webp" alt="" aria-hidden="true" /><span>What&rsquo;s your refund/cancellation policy?</span><svg className="fq-chev" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9.5 12 15.5 18 9.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
                  <div className="fq-a"><div className="fq-ain"><p>We strive to deliver complete satisfaction. Fee payments are non-refundable once a course batch begins, but if you face unforeseen circumstances, you may request to pause your enrollment or transfer to a future batch.</p></div></div>
                </div>
                <div className="fq-row">
                  <div className="fq-q"><img loading="lazy" decoding="async" src="/assets/faq/F-ic-switch.webp" alt="" aria-hidden="true" /><span>Can I switch from group to 1-on-1 later?</span><svg className="fq-chev" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9.5 12 15.5 18 9.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
                  <div className="fq-a"><div className="fq-ain"><p>Yes, but with a few conditions. Since 1-on-1 coaching requires dedicated timing slots, switching depends on slot availability. Furthermore, if you are currently enrolled in a group batch for a specific level, you must complete that level with your group&mdash;you can only transition to 1-on-1 coaching when you start your next level. Please note that fee structures for 1-on-1 personalized classes differ from group batches.</p></div></div>
                </div>
                </div>
                <div className="fq-end">
                  <div className="fq-endic"><img loading="lazy" decoding="async" src="/assets/sensei%20comp/S-ic-exp.webp" alt="" aria-hidden="true" /></div>
                  <b>Still have a question?</b>
                  <p>We&rsquo;re happy to help! Reach out to us anytime.</p>
                  <Link href="/contact" className="fq-btn">Contact Us <span>&rarr;</span></Link>
                </div>
              </div>
            </div>
          </div>
         </div>
        </div>

        {/* ══ Stage-test CTA — light surround, dark scene card ══ */}

        <div id="stage-cta">
          <div className="cta-card">
            <img loading="lazy" decoding="async" className="cta-scene" src="/assets/S-card-scene.webp" alt="" aria-hidden="true" />
            <div className="cta-veil"></div>
            <img loading="lazy" decoding="async" className="cta-bloom" src="/assets/S-card-bloom.webp" alt="" aria-hidden="true" />

            <p className="cta-eyebrow">はじめましょう</p>
            <div className="cta-rule"></div>
            <h2 className="cta-h2">Not sure <em>where you stand?</em></h2>
            <p className="cta-sub">Answer six short questions and we&rsquo;ll tell you which of the four stages to start from &mdash; and exactly what your first month looks like.</p>

            <div className="cta-feats">
              <div className="cta-feat">
                <span className="cta-fi"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v5.2l3.2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                <span>Takes just<br />2 minutes</span>
              </div>
              <span className="cta-div"></span>
              <div className="cta-feat">
                <span className="cta-fi"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3.5l1.9 4.9 4.9 1.9-4.9 1.9L12 17.1l-1.9-4.9-4.9-1.9 4.9-1.9L12 3.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M18.6 15.4l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg></span>
                <span>Personalized<br />recommendation</span>
              </div>
              <span className="cta-div"></span>
              <div className="cta-feat">
                <span className="cta-fi"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19V13.5M12 19V8M19 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></span>
                <span>No obligation</span>
              </div>
            </div>

            <div className="cta-btnwrap">
              <Link href="/explore" className="cta-btn">TAKE THE STAGE TEST <span>&rarr;</span></Link>
              <p className="cta-note">Find your starting point today.</p>
            </div>
          </div>
        </div>
      </div>
      <HomeInteractions />
    </>
  );
}
