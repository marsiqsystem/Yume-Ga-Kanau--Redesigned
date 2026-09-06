"use client";

import { useEffect } from "react";

/* Off-screen animation gate.

   The artwork authors ~25 `infinite` keyframe animations — falling petals,
   drifting clouds, spinning seals. Each one keeps compositing and burning CPU
   while its section is far off screen, which is most of what made scrolling
   feel heavy on phones.

   Ported from the original build with the runtime workarounds removed: there is
   no re-render that wipes the page out from under us any more, so a single scan
   after mount replaces the MutationObserver-driven rescan loop. */
export default function AnimationGate() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          (entry.target as HTMLElement).style.animationPlayState = entry.isIntersecting
            ? "running"
            : "paused";
        }
      },
      { rootMargin: "200px 0px" },
    );

    const scan = () => {
      for (const el of Array.from(document.querySelectorAll<HTMLElement>("body *"))) {
        const cs = getComputedStyle(el);
        if (!cs.animationName || cs.animationName === "none") continue;
        if (!cs.animationIterationCount.includes("infinite")) continue;
        io.observe(el);
      }
    };

    // getComputedStyle on every element is not cheap; do it when the browser is idle.
    // requestIdleCallback is still missing in Safari, hence the timeout fallback.
    const idle = typeof window.requestIdleCallback === "function";
    const handle = idle
      ? window.requestIdleCallback(scan, { timeout: 500 })
      : window.setTimeout(scan, 200);

    return () => {
      if (idle) window.cancelIdleCallback(handle);
      else clearTimeout(handle);
      io.disconnect();
    };
  }, []);

  return null;
}
