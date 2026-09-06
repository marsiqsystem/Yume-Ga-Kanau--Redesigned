"use client";

import { useEffect } from "react";

/* [data-scroll="some-id"] jumps to that section.

   This used to live inside <HomeInteractions>, which only the home route mounts —
   so the Explore hero's "Take the stage test" / "See the four stages" buttons and
   the course cards' "See the stages" links had no handler at all and did nothing.
   It is its own component now, mounted by every route that authors [data-scroll]. */
export default function ScrollLinks() {
  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      const t = (ev.target as Element | null)?.closest?.("[data-scroll]");
      if (!t) return;
      document
        .getElementById(t.getAttribute("data-scroll") ?? "")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
