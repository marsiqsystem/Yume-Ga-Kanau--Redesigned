"use client";

import { useEffect } from "react";
import RevealSections from "@/components/RevealSections";
import ScrollLinks from "@/components/ScrollLinks";

/* Behaviour for the home route. The markup is server-rendered; this only adds
   the state classes the stylesheet already reacts to, so the page is complete
   and readable before this ever runs.

   In the original build almost every function here was re-asserted on a 400ms
   timer and every listener was delegated off `document`, because the design-canvas
   runtime rebuilt the whole subtree at unpredictable moments and wiped className
   with it. None of that applies now — React owns the tree, so these are ordinary
   observers and listeners bound once. */
export default function HomeInteractions() {
  /* ── #meet-sensei: a pinned three-phase stage ──
     Sensei -> reviews (.sn-p2) -> FAQ (.sn-p3), then --fq travels the FAQ's
     taller inner block as the last of the pin is scrolled through. */
  useEffect(() => {
    const el = document.getElementById("meet-sensei");
    if (!el) return;

    // .fq-inner is taller than its frame, and how much taller depends on which
    // answer is open — so the travel distance is measured, not hard-coded.
    const measureFq = () => {
      const flow = el.querySelector<HTMLElement>(".fq-flow");
      const cv = el.querySelector<HTMLElement>(".fq-canvas");
      if (!flow || !cv || !cv.clientHeight) return;
      const content = flow.offsetTop + flow.offsetHeight + cv.clientHeight * 0.12;
      el.style.setProperty("--fqtravel", `${Math.max(0, content - cv.clientHeight).toFixed(1)}px`);
    };

    let p2 = false;
    let p3 = false;
    let ticking = false;

    const phase = () => {
      ticking = false;
      const track = el.offsetHeight - window.innerHeight;
      if (track <= 0) {
        // Below the pin breakpoint the three canvases are stacked and all visible.
        // The phase classes must come off here: they carry pointer-events:none for
        // the inactive canvas and outrank the stacked-layout rule, which once left
        // the reviews looking perfectly normal and taking no touches at all.
        if (p2 || p3) {
          p2 = p3 = false;
          el.classList.remove("sn-p2", "sn-p3");
        }
        return;
      }
      const p = -el.getBoundingClientRect().top / track;
      // hysteresis, so the class does not flicker on the seam
      const w2 = p2 ? p > 0.2 : p > 0.25;
      const w3 = p3 ? p > 0.44 : p > 0.49;
      if (w2 !== p2) el.classList.toggle("sn-p2", (p2 = w2));
      if (w3 !== p3) el.classList.toggle("sn-p3", (p3 = w3));
      const fq = Math.min(1, Math.max(0, (p - 0.56) / (0.97 - 0.56)));
      el.style.setProperty("--fq", fq.toFixed(4));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(phase);
    };

    // FAQ accordion — one row open at a time.
    const onClick = (ev: MouseEvent) => {
      const q = (ev.target as Element | null)?.closest?.(".fq-q");
      if (!q) return;
      const row = q.parentElement;
      if (!row || row.classList.contains("fq-noans")) return;
      const open = row.classList.contains("is-open");
      for (const r of Array.from(row.parentElement?.querySelectorAll(".fq-row") ?? []))
        r.classList.remove("is-open");
      if (!open) row.classList.add("is-open");
      measureFq();
      // again once the open/close transition has settled
      setTimeout(measureFq, 480);
    };

    const onResize = () => {
      measureFq();
      onScroll();
    };

    el.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    measureFq();
    phase();

    return () => {
      el.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* ── Student Voices pager ──
     Four of the seven cards show at a time; page 1 slides the track to 4-7.
     Below 880px the CSS turns this into a native scroll-snap row and hides the
     controls, so this simply never fires there. */
  useEffect(() => {
    const host = document.getElementById("meet-sensei");
    if (!host) return;
    const cards = host.querySelector<HTMLElement>(".rv-cards");
    if (!cards) return;

    const LAST = 1;
    let pg = 0;

    const paint = () => {
      cards.setAttribute("data-pg", String(pg));
      const dots = host.querySelectorAll<HTMLElement>(".rv-dot");
      dots.forEach((d, i) => d.classList.toggle("on", i === pg));
      const prev = host.querySelector<HTMLButtonElement>(".rv-prev");
      const next = host.querySelector<HTMLButtonElement>(".rv-next");
      const now = host.querySelector<HTMLElement>(".rv-now");
      if (prev) prev.disabled = pg === 0;
      if (next) next.disabled = pg === LAST;
      if (now) now.textContent = pg === 0 ? "1\u20134" : "4\u20137";
    };

    const goTo = (n: number) => {
      const clamped = Math.max(0, Math.min(LAST, n));
      if (clamped === pg) return;
      pg = clamped;
      paint();
    };

    const onClick = (ev: MouseEvent) => {
      const t = (ev.target as Element | null)?.closest?.(".rv-dot, .rv-arrow");
      if (!t) return;
      if (t.classList.contains("rv-dot")) goTo(Number(t.getAttribute("data-rv")) || 0);
      else if (t.classList.contains("rv-next")) goTo(pg + 1);
      else if (t.classList.contains("rv-prev")) goTo(pg - 1);
    };

    host.addEventListener("click", onClick);
    paint();
    return () => host.removeEventListener("click", onClick);
  }, []);

  /* ── #students-section: reveal the copy, and run the map clip ──
     Both copy columns are authored with .sf-text-hidden (opacity 0) and wait for
     this to swap them to .sf-text-visible — without it the whole band renders as
     an empty navy screen. Scrolling in also plays the first OPEN_END seconds of
     the India→Japan clip; scrolling out plays the remainder. Ported from the
     original build, minus its 250ms re-bind timer: React owns the tree now. */
  useEffect(() => {
    const OPEN_END = 3; // opening transition = 0s .. 3s

    const section = document.getElementById("students-section");
    const video = document.getElementById("map-video") as HTMLVideoElement | null;
    const textEl = document.getElementById("students-text");
    const textLeft = document.getElementById("students-left");
    const placeholder = document.getElementById("map-placeholder");
    if (!section || !video || !textEl || !textLeft) return;

    const copy = [textEl, textLeft];
    let isInView = false;
    let videoFailed = false;
    let segment: string | null = null;
    let guardRaf = 0;
    let exitTimer = 0;

    // Reveal the clip; the decorative placeholder stays only as an error fallback.
    video.style.display = "block";
    video.loop = false;
    video.muted = true;
    if (placeholder) placeholder.style.display = "none";

    const onError = () => {
      videoFailed = true;
      video.style.display = "none";
      if (placeholder) placeholder.style.display = "flex";
    };
    video.addEventListener("error", onError);

    // Play from `from` seconds and pause exactly at `to`.
    const playSegment = (from: number, to: number, name: string) => {
      if (videoFailed) return;
      segment = name;
      if (guardRaf) cancelAnimationFrame(guardRaf);
      guardRaf = 0;

      const begin = () => {
        if (segment !== name) return; // superseded by a newer request
        try {
          video.currentTime = from;
        } catch {}
        video.play()?.catch(() => {});

        const watch = () => {
          if (segment !== name) return;
          if (video.currentTime >= to - 0.03 || video.ended) {
            video.pause();
            if (!video.ended) {
              try {
                video.currentTime = to;
              } catch {}
            }
            guardRaf = 0;
            return;
          }
          guardRaf = requestAnimationFrame(watch);
        };
        watch();
      };

      if (video.readyState >= 1) begin(); // HAVE_METADATA -> safe to seek
      else {
        video.addEventListener("loadedmetadata", begin, { once: true });
        try {
          video.load();
        } catch {}
      }
    };

    // preload="none", so nothing is fetched until the band is within 600px of the
    // viewport — that keeps ~900 KB off the initial load.
    const prewarm = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        prewarm.disconnect();
        try {
          video.load();
        } catch {}
      },
      { rootMargin: "600px 0px" },
    );
    prewarm.observe(section);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !isInView) {
            // ── scroll in: opening transition, first 3s then freeze ──
            isInView = true;
            clearTimeout(exitTimer);
            for (const el of copy) {
              el.classList.remove("sf-text-hidden", "sf-text-exit");
              el.classList.add("sf-text-visible");
            }
            playSegment(0, OPEN_END, "open");
          } else if (!entry.isIntersecting && isInView) {
            // ── scroll out: closing transition, 3s .. end ──
            isInView = false;
            for (const el of copy) {
              el.classList.remove("sf-text-visible");
              el.classList.add("sf-text-exit");
            }
            exitTimer = window.setTimeout(() => {
              if (isInView) return;
              for (const el of copy) {
                el.classList.remove("sf-text-exit");
                el.classList.add("sf-text-hidden");
              }
            }, 600);

            const end = video.duration && isFinite(video.duration) ? video.duration : OPEN_END + 3;
            playSegment(OPEN_END, end, "close");
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(section);

    return () => {
      io.disconnect();
      prewarm.disconnect();
      video.removeEventListener("error", onError);
      segment = null; // stops any in-flight watch loop
      if (guardRaf) cancelAnimationFrame(guardRaf);
      clearTimeout(exitTimer);
    };
  }, []);

  return (
    <>
      <RevealSections ids={["four-stages", "why-ygk", "meet-sensei", "stage-cta"]} />
      <ScrollLinks />
    </>
  );
}
