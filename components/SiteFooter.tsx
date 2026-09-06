import { WHATSAPP } from "@/lib/seo";
import Link from "next/link";
import "../app/footer.css";

/* Site footer. Static markup, so it stays a server component — the whole thing
   ships as HTML with no JavaScript needed to read it. */
export default function SiteFooter() {
  return (
    <footer id="ygk-foot">
      <div className="ft-inner">
        <div className="ft-grid">

          <div className="ft-brand">
            <div className="ft-lock">
              <img className="ft-emb" src="/assets/nav%20bar/N-logo.webp" alt="Yume Ga Kanau emblem" />
              <div>
                <div className="ft-word">
                  <img src="/assets/nav%20bar/N-word.webp" alt="Yume Ga Kanau" />
                  <span className="ft-ja">夢が叶う</span>
                </div>
                <div className="ft-inst">JAPANESE LEARNING INSTITUTE</div>
              </div>
            </div>
            <p className="ft-tag">Don&rsquo;t just learn Japanese, feel it!</p>
            <p className="ft-desc">Founded December 2025. Offering online Japanese classes for JLPT N5&ndash;N2, conversational Japanese, and optional personalized 1-on-1 coaching.</p>

            <div className="ft-socs">
              <a className="ft-soc" href="https://www.instagram.com/yumegakanau_institute/" target="_blank" rel="noopener noreferrer" aria-label="Yume Ga Kanau on Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.25.07 1.62.07 4.81s-.01 3.56-.07 4.81c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.25.06-1.62.07-4.85.07s-3.6-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.21 15.56 2.2 15.19 2.2 12s.01-3.56.07-4.81c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.44 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.5.01-4.74.07-.9.04-1.39.19-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.32-.28.81-.32 1.71C3.42 8.9 3.4 9.26 3.4 12s.02 3.1.08 4.15c.4.9.19 1.39.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.13.81.28 1.71.32 1.24.06 1.6.07 4.74.07s3.5-.01 4.74-.07c.9-.04 1.39-.19 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.32.28-.81.32-1.71.06-1.05.08-1.41.08-4.15s-.02-3.1-.08-4.15c-.04-.9-.19-1.39-.32-1.71a2.85 2.85 0 0 0-.69-1.06 2.85 2.85 0 0 0-1.06-.69c-.32-.13-.81-.28-1.71-.32C15.5 4.01 15.14 4 12 4Z" /><path d="M12 7.15A4.85 4.85 0 1 0 12 16.85 4.85 4.85 0 0 0 12 7.15Zm0 8A3.15 3.15 0 1 1 12 8.85a3.15 3.15 0 0 1 0 6.3Z" /><circle cx="17.05" cy="6.95" r="1.15" /></svg></a>
              <a className="ft-soc" href={WHATSAPP.numberHref} target="_blank" rel="noopener noreferrer" aria-label="Message Parveen Sensei on WhatsApp"><svg viewBox="0 0 24 24"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" /><path d="M12.04 2.5C6.79 2.5 2.53 6.76 2.53 12.01c0 1.68.44 3.32 1.28 4.77L2.5 21.5l4.85-1.27a9.46 9.46 0 0 0 4.69 1.23h.01c5.24 0 9.5-4.26 9.5-9.51 0-2.54-.99-4.93-2.78-6.72a9.44 9.44 0 0 0-6.73-2.79Zm5.55 15.05a7.87 7.87 0 0 1-5.55 2.3h-.01a7.9 7.9 0 0 1-4.02-1.1l-.29-.17-2.98.78.8-2.91-.19-.3a7.85 7.85 0 0 1-1.21-4.19c0-4.36 3.55-7.9 7.91-7.9a7.85 7.85 0 0 1 5.59 2.32 7.85 7.85 0 0 1 2.31 5.59c0 4.36-3.55 7.9-7.9 7.9Z" /></svg></a>
              <a className="ft-soc" href="mailto:yumegakanau22@gmail.com" aria-label="Email yumegakanau22@gmail.com"><svg viewBox="0 0 24 24"><path d="M3.4 5.5h17.2c.83 0 1.5.67 1.5 1.5v10c0 .83-.67 1.5-1.5 1.5H3.4c-.83 0-1.5-.67-1.5-1.5V7c0-.83.67-1.5 1.5-1.5Zm.35 1.8v.72l8.25 5.06 8.25-5.06V7.3H3.75Zm16.5 2.83-7.78 4.77a.9.9 0 0 1-.94 0L3.75 10.13v6.57h16.5v-6.57Z" /></svg></a>
            </div>

            <div className="ft-dream">
              <span className="ft-slash" aria-hidden="true"></span>
              <div>
                <b>夢が叶う</b>
                <span>DREAMS COME TRUE</span>
              </div>
            </div>
          </div>

          <nav className="ft-col">
            <div className="ft-lab"><b>PAGES</b><i></i></div>
            <div className="ft-list">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/explore">Explore</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/#faq">FAQs</Link>
            </div>
          </nav>

          <nav className="ft-col">
            <div className="ft-lab"><b>COURSES</b><i></i></div>
            <div className="ft-list">
              <Link href="/explore#stage-1">JLPT N5 &middot; Stage 1</Link>
              <Link href="/explore#stage-2">JLPT N4 &middot; Stage 2</Link>
              <Link href="/explore#stage-3">JLPT N3 &middot; Stage 3</Link>
              <Link href="/explore#stage-4">JLPT N2 &middot; Stage 4</Link>
              <Link href="/explore">Conversation Classes (Kaiwa) &middot; N5&ndash;N2</Link>
              <Link href="/explore">Business Japanese</Link>
            </div>
          </nav>

          <div className="ft-col ft-demo">
            <div className="ft-lab"><b>BOOK A DEMO CLASS</b><i></i></div>
            <p>Sit in on a real lesson before you decide. Tell Sensei your level and timezone and she&rsquo;ll arrange a free demo class around your day.</p>
            <Link href="/contact#form" className="ft-cta">Book a demo class <span aria-hidden="true">&rarr;</span></Link>
            <div className="ft-note">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5.5c0 4.2-2.9 7.9-7 9.5-4.1-1.6-7-5.3-7-9.5V6l7-3Z" strokeLinejoin="round" /><path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span>No payment, no commitment &mdash; just a real class.</span>
            </div>
          </div>

        </div>

        <div className="ft-bar">
          <span>&copy; 2025 YUME GA KANAU&trade; &middot; Est. December 2025 &middot; All rights reserved.</span>
          {/* These three had no href in the original build and still have no page
              behind them. Rendered as plain text rather than dead links so nothing
              looks clickable that is not — add routes and turn them into <Link>s
              when the pages exist. */}
          <div className="ft-legal">
            <span>Privacy Policy</span><span>|</span>
            <span>Terms of Service</span><span>|</span>
            <span>Cookie Policy</span>
          </div>
          <span className="ft-cc">夢が叶う &middot; Dreams come true</span>
        </div>
      </div>
    </footer>
  );
}
