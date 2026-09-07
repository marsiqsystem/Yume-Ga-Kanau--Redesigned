import React from "react";
import { SENSEI_EMAIL, SITE, WHATSAPP } from "@/lib/seo";

/* The pieces every document in the pack is built from.

   The design specifies exact values for all of this — the heading-plus-gradient
   rule, the glass card, the gold "office use" panel, the crimson 夢 seal. They
   are captured once here so five documents cannot drift apart, which is the
   whole point of the pack reading as one family.

   Styles are inline because that is how the handoff expresses them and it keeps
   each value next to the thing it describes. Only the states CSS can express
   (:hover, :focus, :checked) live in documents.css. */

export const FONT_DISPLAY = "'Komika Axis', Impact, 'Arial Black', sans-serif";
export const FONT_BODY = "var(--font-nunito), 'Nunito Sans', sans-serif";
export const FONT_SERIF = "var(--font-mincho), 'Zen Old Mincho', serif";
export const FONT_JA = "var(--font-kaku), 'Zen Kaku Gothic New', sans-serif";

/* A short uppercase gold label that sits above a title. */
export function Eyebrow({ children, mb = 14 }: { children: React.ReactNode; mb?: number }) {
  return (
    <div
      style={{
        font: `700 11px/1 ${FONT_BODY}`,
        letterSpacing: ".22em",
        textTransform: "uppercase",
        color: "#D9A24B",
        marginBottom: mb,
      }}
    >
      {children}
    </div>
  );
}

/* The 62x3 gradient bar. The design calls this the single most recognisable
   thing on the site, so every title and every major section heading carries one. */
export function Rule({ mt = 14, mb = 26 }: { mt?: number; mb?: number }) {
  return (
    <div
      style={{
        width: 62,
        height: 3,
        borderRadius: 2,
        background: "linear-gradient(90deg,#C4082E,#E0632F)",
        margin: `${mt}px 0 ${mb}px`,
      }}
    />
  );
}

export function DocTitle({ children, size = 46 }: { children: React.ReactNode; size?: number }) {
  return (
    <h1
      style={{
        margin: 0,
        font: `700 ${size}px/1.16 ${FONT_DISPLAY}`,
        letterSpacing: ".01em",
        color: "#F7F3EA",
        textShadow: "0 2px 24px rgba(0,4,18,.75)",
      }}
    >
      {children}
    </h1>
  );
}

export function SectionTitle({ children, size = 22 }: { children: React.ReactNode; size?: number }) {
  return (
    <h2 style={{ margin: 0, font: `700 ${size}px/1.16 ${FONT_DISPLAY}`, color: "#F7F3EA" }}>
      {children}
    </h2>
  );
}

/* The website's glass card. `watermark` drops a large low-opacity kanji off the
   bottom-right corner — the design asks for it on one card per document, not
   every card, so it is opt-in. */
export function Card({
  children,
  watermark,
  mt = 26,
  pad = "38px 32px",
}: {
  children: React.ReactNode;
  watermark?: string;
  mt?: number;
  pad?: string;
}) {
  return (
    <div
      style={{
        marginTop: mt,
        borderRadius: 16,
        background: "linear-gradient(150deg,rgba(255,255,255,.058),rgba(255,255,255,.018))",
        border: "1px solid rgba(245,240,230,.10)",
        boxShadow: "0 12px 36px rgba(0,3,16,.34), inset 0 1px 0 rgba(255,255,255,.08)",
        backdropFilter: "blur(10px)",
        padding: pad,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {watermark && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: -18,
            bottom: -46,
            font: `700 130px/1 ${FONT_SERIF}`,
            color: "rgba(226,16,60,.10)",
            pointerEvents: "none",
          }}
        >
          {watermark}
        </div>
      )}
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}

/* The gold-tinted panel the site uses for summary boxes, and which the design
   reuses for "for office use only". */
export function GoldPanel({
  children,
  mt = 26,
  pad = "30px 28px",
}: {
  children: React.ReactNode;
  mt?: number;
  pad?: string;
}) {
  return (
    <div
      style={{
        marginTop: mt,
        borderRadius: 16,
        border: "1px solid rgba(217,162,75,.22)",
        background: "rgba(217,162,75,.07)",
        padding: pad,
      }}
    >
      {children}
    </div>
  );
}

/* An uppercase field label. Used above real inputs and above read-only values
   alike, so a document reads the same whether a value was typed by the student
   or signed into the link by Sensei. */
export function Label({ children, mb = 9 }: { children: React.ReactNode; mb?: number }) {
  return (
    <div
      style={{
        font: `700 10.5px/1.4 ${FONT_BODY}`,
        letterSpacing: ".16em",
        textTransform: "uppercase",
        color: "#9BA5C6",
        marginBottom: mb,
      }}
    >
      {children}
    </div>
  );
}

export function Hint({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ font: `400 12px/1.6 ${FONT_BODY}`, color: "#8F99BB", marginTop: 8 }}>
      {children}
    </div>
  );
}

export function Body({
  children,
  size = 13.5,
  color = "#C3CAE4",
  mt = 0,
}: {
  children: React.ReactNode;
  size?: number;
  color?: string;
  mt?: number;
}) {
  return <div style={{ font: `400 ${size}px/1.8 ${FONT_BODY}`, color, marginTop: mt }}>{children}</div>;
}

/* A label with a read-only value beneath it, in the same visual slot a field
   would occupy. This is how everything Sensei signed into the link is shown. */
export function ReadOnly({ label, value }: { label: React.ReactNode; value: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="pack-locked">{value}</div>
    </div>
  );
}

/* Rows of fields. The site's grid gap for these is 18px in both directions. */
export function Grid({
  children,
  cols = 2,
  gap = 18,
}: {
  children: React.ReactNode;
  cols?: number;
  gap?: number;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gap }}>{children}</div>
  );
}

/* The hanko. One per document, standing in for a handwritten signature —
   students are in four countries and will never be in the room to sign. */
export function Seal({ size = 64 }: { size?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        background: "#C4082E",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        font: `700 ${Math.round(size * 0.53)}px/1 ${FONT_SERIF}`,
        color: "#FFF6F2",
        transform: "rotate(-4deg)",
        boxShadow: "0 8px 24px rgba(120,4,26,.45)",
        flex: "none",
      }}
    >
      夢
    </div>
  );
}

/* The instructor's sign-off. Never a blank line to sign: the seal plus her typed
   name and title is the signature, with a marked slot a scanned image can drop
   into later if she wants one. */
export function IssuedBy({ note }: { note?: string }) {
  return (
    <div>
      <Label mb={16}>Issued by</Label>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Seal />
        <div style={{ font: `700 15px/1.5 ${FONT_BODY}`, color: "#F7F3EA" }}>
          Parveen Kaur Sensei
          <br />
          <span style={{ font: `400 12.5px/1.5 ${FONT_BODY}`, color: "#9BA5C6" }}>
            Founder &amp; Lead Instructor
          </span>
        </div>
      </div>
      <div
        style={{
          marginTop: 16,
          border: "1px dashed rgba(245,240,230,.16)",
          borderRadius: 10,
          padding: "14px 15px",
          font: `400 11.5px/1.5 ${FONT_BODY}`,
          color: "#8F99BB",
          textAlign: "center",
        }}
      >
        Slot for a scanned
        <br />
        signature image (optional)
      </div>
      {note && (
        <div style={{ font: `400 11.5px/1.6 ${FONT_BODY}`, color: "#8F99BB", marginTop: 12 }}>
          {note}
        </div>
      )}
    </div>
  );
}

/* ── Masthead ──────────────────────────────────────────────────────────────
   The wordmark is white with a crimson outline and only works on dark, which is
   why it sits inside the navy band and is never set on a light panel. The crest
   is the supplied artwork, never redrawn, and never smaller than ~40px. */

export function Masthead({
  aside,
  tagline = "full",
}: {
  aside?: React.ReactNode;
  tagline?: "full" | "lockup" | "none";
}) {
  return (
    <div
      className="pack-masthead pack-pad"
      style={{
        background: "linear-gradient(180deg,#0A1130 0%,rgba(10,17,48,0) 100%)",
        padding: "46px 70px 34px",
        display: "flex",
        alignItems: "center",
        gap: 26,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/documents/emblem.png"
        alt="Yume Ga Kanau crest"
        width={112}
        height={134}
        style={{ width: 112, height: 134, objectFit: "contain", flex: "none" }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, minWidth: 0 }}>
        <div
          style={{
            font: `700 11px/1 ${FONT_BODY}`,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: "#D9A24B",
          }}
        >
          Japanese Learning Institute
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/documents/wordmark.png"
            alt="Yume Ga Kanau"
            width={320}
            height={55}
            style={{ width: 320, maxWidth: "100%", height: 55, objectFit: "contain" }}
          />
          <span style={{ font: `700 12px/1 ${FONT_BODY}`, color: "#D9A24B", paddingTop: 5 }}>™</span>
        </div>
        {tagline === "full" && (
          <>
            <div style={{ font: `400 12.5px/1.5 ${FONT_JA}`, color: "#C3CAE4" }}>
              日本語を学ぶだけでなく、感じてください
            </div>
            <div style={{ font: `600 12.5px/1.4 ${FONT_BODY}`, color: "#9BA5C6" }}>
              Don&rsquo;t just learn Japanese, feel it!
            </div>
          </>
        )}
        {tagline === "lockup" && (
          <div style={{ font: `400 12.5px/1.4 ${FONT_SERIF}`, color: "#C3CAE4", letterSpacing: ".06em" }}>
            夢が叶う · DREAMS COME TRUE
          </div>
        )}
      </div>
      {aside && (
        <div
          className="pack-masthead-aside"
          style={{ display: "flex", flexDirection: "column", gap: 14, width: 210, flex: "none" }}
        >
          {aside}
        </div>
      )}
    </div>
  );
}

/* The footer every document carries. The contact details come from lib/seo so
   there is exactly one place the WhatsApp number lives. */
export function DocFooter() {
  return (
    <div
      style={{
        marginTop: 40,
        paddingTop: 18,
        borderTop: "1px solid rgba(245,240,230,.10)",
        font: `400 12px/1.7 ${FONT_BODY}`,
        color: "#8F99BB",
      }}
    >
      {SITE.legalName} · yumegakanau.in · {SENSEI_EMAIL} · WhatsApp {WHATSAPP.display}
      <br />
      Registered name: {SITE.legalName} · Founded December 2025 · Online only
    </div>
  );
}

/* The body of a sheet, inside the masthead's horizontal rhythm. */
export function DocBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="pack-pad" style={{ padding: "14px 70px 60px" }}>
      {children}
    </div>
  );
}
