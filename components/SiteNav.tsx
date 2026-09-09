"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/* The fixed header. Transparent at rest so the hero plate reads through;
   .is-stuck (added past 24px of scroll) frosts it. That behaviour was a plain
   script in the original build — it lives in the effect below now.

   The active-page mark used to come from the runtime's isHome/isAbout flags.
   It reads the real pathname now, which is also what makes these crawlable
   internal links rather than click handlers. */

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/explore", label: "Explore" },
  { href: "/contact", label: "Contact" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const rowRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const nav = document.getElementById("ygk-nav");
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* --navh is what every page's first band pads by to clear this fixed bar, and
     it used to be a constant in the stylesheet: 100px below 900px wide. That is
     a guess about how many rows the bar wraps into, and on a 360px phone it was
     the wrong guess — the brand and the CTA no longer fit on one line, the CTA
     took a third row, the bar grew to ~150px, and the hero's ONLINE CLASSES
     badge slid up underneath the links. Sensei and a student both sent that
     screenshot.

     The CSS below now keeps the bar to two rows, but a constant can only ever
     be right for the widths and fonts someone thought to check. Measuring it
     instead makes the whole class of bug impossible: whatever the bar actually
     is — three rows, a boosted font in an in-app browser, a longer CTA label
     later — the page clears exactly that. The stylesheet value stays as the
     server-render fallback for the first paint. */
  useEffect(() => {
    const nav = document.getElementById("ygk-nav");
    if (!nav || typeof ResizeObserver === "undefined") return;

    let last = 0;
    const publish = () => {
      const h = Math.round(nav.getBoundingClientRect().height);
      // sub-pixel jitter would otherwise write to the root on every frame
      if (!h || Math.abs(h - last) < 1) return;
      last = h;
      document.documentElement.style.setProperty("--navh", `${h}px`);
    };

    const ro = new ResizeObserver(publish);
    ro.observe(nav);
    publish();
    // the webfonts land after first paint and can re-wrap the bar
    if (document.fonts?.ready) document.fonts.ready.then(publish).catch(() => {});
    return () => ro.disconnect();
  }, []);

  /* The active-page underline: one .nv-slide that travels between the links.
     The stylesheet has always carried it, but nothing rendered or positioned it
     in the port, so the mark under the current page was simply missing.
     .nv-mark is the "which link is active" hook, exactly as before. */
  useEffect(() => {
    const row = rowRef.current;
    const el = slideRef.current;
    if (!row || !el) return;

    let first = true;

    const place = () => {
      if (!row.offsetParent) return; // header not laid out yet (or hidden)
      const mark = row.querySelector(".nv-mark");
      const link = mark?.closest<HTMLElement>(".nv-link");
      if (!link) {
        el.style.opacity = "0";
        return;
      }
      const pad = parseFloat(getComputedStyle(link).paddingLeft) || 0;
      const x = link.offsetLeft + pad;
      const w = link.offsetWidth - pad * 2;
      if (w <= 0) return;

      // the very first placement must not animate in from x=0
      if (first) el.style.transition = "none";
      el.style.opacity = "1";
      el.style.transform = `translateX(${x}px)`;
      el.style.width = `${w}px`;
      /* Follow the link's own baseline rather than sitting at the row's bottom
         edge. Identical while the links are on one line, and still correct on
         the narrow screens where the row is now allowed to wrap instead of
         running off the side of the phone. */
      el.style.top = `${link.offsetTop + link.offsetHeight - 2}px`;
      if (first) {
        void el.offsetWidth; // flush, so the next change does animate
        el.style.transition = "";
        first = false;
      }
    };

    place();
    // webfonts land after first paint and change the link widths
    if (document.fonts?.ready) document.fonts.ready.then(place).catch(() => {});
    window.addEventListener("resize", place, { passive: true });
    return () => window.removeEventListener("resize", place);
  }, [pathname]);

  return (
    <div id="ygk-nav">
      <div className="nv-inner">
        <Link className="nv-brand" href="/">
          <img
            className="nv-logo"
            src="/assets/nav%20bar/N-logo.webp"
            alt="Yume Ga Kanau emblem"
            width={56}
            height={56}
          />
          <span className="nv-word">
            <img src="/assets/nav%20bar/N-word.webp" alt="Yume Ga Kanau" />
            <span className="nv-ja">夢が叶う</span>
          </span>
        </Link>

        <div className="nv-links" ref={rowRef}>
          {LINKS.map(({ href, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                className="nv-link"
                href={href}
                aria-current={active ? "page" : undefined}
              >
                {label}
                {active && <span className="nv-mark" />}
              </Link>
            );
          })}
          <span className="nv-slide" ref={slideRef} aria-hidden="true" />
        </div>

        <div className="nv-tag">
          <b>日本語を学ぶだけでなく、感じてください</b>
          <i>Don&rsquo;t just learn Japanese, feel it!</i>
        </div>

        <Link className="nv-cta" href="/contact#form">
          Book a trial class <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
