"use client";

import { useEffect } from "react";

/* #explore-stages is a pinned four-screen stage: the frame sticks while the page
   scrolls past it and each stage takes over in turn. The active index lives on
   the children as .on/.done/.lit/.past classes, which the stylesheet animates.

   Scroll fractions carried over from the original build. EX_IN is where a stage
   takes over on the way down and EX_OUT is the hysteresis on the way back up, so
   the scene does not flicker on the seam; EX_AT is where a rail ring or an
   N5…N2 dot scrolls to. */
const EX_IN = [0, 0.235, 0.485, 0.735];
const EX_OUT = [0, 0.2, 0.45, 0.7];
const EX_AT = [0.06, 0.31, 0.56, 0.81];

export default function ExploreStages() {
  useEffect(() => {
    const el = document.getElementById("explore-stages");
    if (!el) return;

    let idx = -1;
    let ticking = false;

    const paint = (i: number) => {
      el.querySelectorAll(".ex-stage").forEach((n, j) => n.classList.toggle("on", j === i));
      el.querySelectorAll(".ex-node").forEach((n, j) => {
        n.classList.toggle("on", j === i);
        n.classList.toggle("done", j < i);
      });
      el.querySelectorAll(".ex-link").forEach((n, j) => n.classList.toggle("lit", j < i));
      el.querySelectorAll(".ex-dot").forEach((n, j) => {
        n.classList.toggle("on", j === i);
        n.classList.toggle("past", j < i);
      });
      const cue = el.querySelector(".ex-cue span");
      const label = i < 3 ? "Scroll to continue" : "Keep scrolling";
      if (cue && cue.textContent !== label) cue.textContent = label;
    };

    // Below the pin breakpoint the frame is not sticky and all four stages are
    // simply laid out one after another, so the index must stay at 0.
    const pinned = () => {
      const f = el.querySelector(".ex-frame");
      return !!f && getComputedStyle(f).position === "sticky";
    };

    const phase = () => {
      ticking = false;
      const track = el.offsetHeight - window.innerHeight;
      if (track <= 0 || !pinned()) {
        if (idx !== 0) paint((idx = 0));
        return;
      }
      const p = -el.getBoundingClientRect().top / track;
      let i = 0;
      for (let k = 1; k < 4; k++) if (p > (idx >= k ? EX_OUT[k] : EX_IN[k])) i = k;
      if (i !== idx) paint((idx = i));
      // the dashed fill under N5…N2 tracks scroll continuously, not the stage index
      const e = (p - EX_AT[0]) / (EX_AT[3] - EX_AT[0]);
      el.style.setProperty("--exp", Math.min(1, Math.max(0, e)).toFixed(4));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(phase);
    };

    // A rail ring or an N5…N2 dot jumps the page to its stage.
    const onClick = (ev: MouseEvent) => {
      const t = (ev.target as Element | null)?.closest?.("[data-go]");
      if (!t) return;
      const track = el.offsetHeight - window.innerHeight;
      if (track <= 0) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: top + track * EX_AT[Number(t.getAttribute("data-go")) || 0],
        behavior: "smooth",
      });
    };

    el.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    phase();

    return () => {
      el.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* /explore#stage-3 parks the pin on that stage. Read once on mount, after the
     section exists and can be measured; the browser's own hash handling would
     land on the sticky frame rather than inside its scroll range. */
  useEffect(() => {
    const m = /^#stage-([1-4])$/.exec(window.location.hash);
    if (!m) return;
    const el = document.getElementById("explore-stages");
    if (!el) return;
    const i = Number(m[1]) - 1;
    const t = window.setTimeout(() => {
      const track = el.offsetHeight - window.innerHeight;
      const f = el.querySelector(".ex-frame");
      const isPinned = !!f && getComputedStyle(f).position === "sticky";
      if (track <= 0 || !isPinned) {
        (el.querySelectorAll(".ex-stage")[i] ?? el).scrollIntoView();
      } else {
        window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + track * EX_AT[i]);
      }
    }, 120);
    return () => clearTimeout(t);
  }, []);

  return null;
}
