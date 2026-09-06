"use client";

import { useEffect } from "react";

/* Adds the two entrance-animation classes the stylesheets key off:
   `.fs-anim` marks a section as animated, `.fs-in` means it is on screen.

   Every route uses the same pair, so the observer lives here and each page
   passes the ids it owns. The original build re-asserted these on a 400ms timer
   because the design-canvas runtime kept wiping className; React owns the tree
   now, so a plain IntersectionObserver is enough. */
export default function RevealSections({ ids }: { ids: string[] }) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          // A pinned stage is several screens tall, so a ratio of it is a poor
          // cue - 12% of a four-screen section is already half a viewport. For
          // those, measure how much of the viewport it fills instead.
          const tall = e.boundingClientRect.height > window.innerHeight * 1.6;
          const v = tall ? e.intersectionRect.height / window.innerHeight : e.intersectionRatio;
          if (e.isIntersecting && v > (tall ? 0.3 : 0.12)) el.classList.add("fs-in");
          else if (v < (tall ? 0.08 : 0.04)) el.classList.remove("fs-in");
        }
      },
      { threshold: [0, 0.02, 0.04, 0.08, 0.12, 0.3, 0.6] },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      el.classList.add("fs-anim");
      io.observe(el);
    }
    return () => io.disconnect();
    // `ids` is a literal array at every call site, so compare by content rather
    // than identity or the observer would be torn down on every render.
  }, [ids.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
