import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { SENSEI_EMAIL, pageMeta } from "@/lib/seo";
import "../legal.css";

/* This page makes a strong, checkable claim: the site sets no cookies at all.
   That was verified two ways before it was written — the codebase contains no
   document.cookie, localStorage, sessionStorage or IndexedDB use and no
   analytics or third-party scripts, and the live deployment returns no
   Set-Cookie header on any route. Fonts are self-hosted by next/font, so no
   request goes out to Google Fonts either.

   If anything ever adds a cookie — analytics, an embedded video, a consent
   tool, a payment widget — this page stops being true and must be rewritten in
   the same commit, and the site will need a consent banner it currently does
   not require. */

const TITLE = "Cookie Policy";
const DESC =
  "This website sets no cookies and runs no analytics or tracking. What that means, and the few places where leaving the site is different.";

export const metadata: Metadata = pageMeta({
  title: TITLE,
  description: DESC,
  path: "/cookies",
  ogDescription: "No cookies, no analytics, no tracking. Here is exactly what that means.",
});

export default function CookiesPage() {
  return (
    <LegalPage
      eyebrow="Cookies · クッキー"
      title="Cookie Policy"
      standfirst="Most cookie policies exist to explain a long list of trackers. This one is short, because this website does not use any."
      summary={
        <>
          <p>
            <strong>This website sets no cookies.</strong> It runs no analytics, no
            advertising pixels and no third-party tracking scripts, and it stores nothing
            in your browser.
          </p>
          <p>
            That is also why you have not been shown a cookie banner: there is nothing to
            consent to.
          </p>
        </>
      }
      path="/cookies"
      metaTitle={TITLE}
      metaDescription={DESC}
    >
      <section id="what-are-cookies">
        <h2>
          <span className="lg-n">01</span>What a cookie is
        </h2>
        <p>
          A cookie is a small file a website asks your browser to keep, so it can
          recognise you on a later visit. Cookies are how sites keep you logged in — and
          also how advertising networks follow people between sites to build a profile of
          them.
        </p>
      </section>

      <section id="what-we-use">
        <h2>
          <span className="lg-n">02</span>What this site uses
        </h2>
        <p>Nothing. To be specific, this website does not:</p>
        <ul>
          <li>set any cookie, of any kind, including &ldquo;essential&rdquo; ones;</li>
          <li>
            store anything in your browser&rsquo;s local storage, session storage or
            other on-device storage;
          </li>
          <li>
            load Google Analytics, Meta Pixel, or any other analytics or advertising
            script — we do not measure visits at all;
          </li>
          <li>embed third-party widgets, comment systems or chat popups;</li>
          <li>
            fetch fonts from an external service. The typefaces are served from this
            site&rsquo;s own domain, so loading a page does not tell anyone else you were
            here.
          </li>
        </ul>
        <p>
          You can check this yourself: open your browser&rsquo;s developer tools, look
          under Application → Cookies, and you will find the list empty on every page of
          this site.
        </p>
      </section>

      <section id="why-no-banner">
        <h2>
          <span className="lg-n">03</span>Why there is no cookie banner
        </h2>
        <p>
          Consent banners are required when a site stores or reads information on your
          device beyond what is strictly necessary. This one does neither, so a banner
          would be theatre — a box asking your permission for something that is not
          happening. If we ever add anything that genuinely requires consent, we will ask
          properly before it runs, and rewrite this page.
        </p>
      </section>

      <section id="server-logs">
        <h2>
          <span className="lg-n">04</span>What still happens, in fairness
        </h2>
        <p>
          Not tracking you is not the same as knowing nothing. Any web server, including
          the one that serves this site, necessarily handles your IP address and browser
          type in order to send you a page, and our host keeps short-lived operational
          logs for security and reliability. That is a normal part of how the web works
          rather than a tracking choice, and those logs are not used to profile you or
          combined with anything else. Our host is named in the{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </section>

      <section id="leaving">
        <h2>
          <span className="lg-n">05</span>When you leave this site
        </h2>
        <p>
          Two buttons here take you somewhere else, and this policy stops at that
          boundary:
        </p>
        <dl className="lg-defs">
          <dt>WhatsApp</dt>
          <dd>
            The WhatsApp button opens a chat with our number, on WhatsApp&rsquo;s own
            service. What happens there is governed by Meta&rsquo;s policies, not this
            one. Until you tap it, nothing is loaded from WhatsApp.
          </dd>
          <dt>Instagram</dt>
          <dd>
            The Instagram link in the footer is an ordinary link. There is no embedded
            Instagram feed on this site, so Instagram is not contacted at all unless you
            click through.
          </dd>
        </dl>
      </section>

      <section id="control">
        <h2>
          <span className="lg-n">06</span>Controlling cookies generally
        </h2>
        <p>
          You do not need to change any setting for this site, but every major browser
          lets you view and delete cookies and block third-party ones, usually under
          Settings → Privacy. Blocking cookies entirely will not affect anything here,
          because there is nothing here to block.
        </p>
        <p>
          If you have a question about this policy, write to{" "}
          <a href={`mailto:${SENSEI_EMAIL}`}>{SENSEI_EMAIL}</a>.
        </p>
      </section>
    </LegalPage>
  );
}
