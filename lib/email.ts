import { SENSEI_EMAIL, SITE, WHATSAPP } from "./seo";

/* The house style for every email the website sends.

   Three routes send mail — a trial-class enquiry, a completed admission form,
   and a request for a receipt — and they used to each build their own HTML.
   They now describe what they are saying (an eyebrow, a title, some sections of
   labelled rows) and this file turns that into the email. One place to change
   how the mail looks, and three emails that arrive looking like they come from
   the same institute.

   ── Why it is built the way it is ─────────────────────────────────────────

   An email client is not a browser, and almost nothing the site's CSS relies on
   survives the trip. The rules this file follows, all of them the reason
   something here looks more old-fashioned than it needs to:

   - **Tables, not flex or grid.** Outlook renders through Word, which has never
     supported either.
   - **Every style inline.** A <style> block is stripped outright by several
     clients and partially by others, so a stylesheet cannot be trusted to
     arrive.
   - **No gradients.** The site's signature gradient rule is faked with three
     solid cells stepping crimson → orange, which every client can draw.
   - **No web fonts.** Komika Axis is a self-hosted TTF and cannot follow the
     mail out, and Google fonts do not load in most clients either. The display
     lines fall back the same way the site does (Impact, Arial Black); body text
     is the ordinary system stack.
   - **No images at all.** Most clients hide remote images until the reader
     clicks "display images", so anything carried by a picture is invisible on
     first read — and this mail is read on a phone, once, to find out what a
     student said. The brand is therefore made of type and colour: the hanko is
     a crimson cell with 夢 in it, not a logo file. It also keeps the mail a few
     kilobytes, which is why Gmail never clips it.

   Dark ground on purpose: it is the brand, and it is also the one choice a
   phone's dark mode leaves alone rather than inverting into something nobody
   designed. */

/* ── Palette ────────────────────────────────────────────────────────────────
   The site's values, spelled out as flat hex because an email cannot carry
   custom properties and rgba() over a background is unreliable in Outlook. */
const C = {
  ground: "#070E28",
  card: "#101733",
  panel: "#0A1130",
  border: "#232C55",
  hairline: "#1B2447",
  crimson: "#C4082E",
  crimsonMid: "#D2402F",
  orange: "#E0632F",
  gold: "#D9A24B",
  heading: "#F7F3EA",
  text: "#F5F0E6",
  muted: "#C3CAE4",
  label: "#9BA5C6",
  dim: "#8F99BB",
} as const;

const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";
/* Komika Axis cannot travel, so the display lines land on the same fallback the
   site declares for it. */
const FONT_DISPLAY = "Impact,'Arial Black','Helvetica Neue',Helvetica,sans-serif";
const FONT_SERIF = "'Zen Old Mincho',Georgia,'Times New Roman',serif";

/* Nothing user-supplied reaches the HTML without going through this. Every
   value in an email from this site was typed by a stranger. */
export function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type Row = [label: string, value: string];

export type Section = {
  title: string;
  rows: Row[];
};

export type EmailDoc = {
  /* Small gold line above the title — what kind of thing this is. */
  eyebrow: string;
  title: string;
  /* The line under the title: which form, which invoice, where it came from. */
  subtitle?: string;
  /* The one fact worth reading if the reader reads nothing else. */
  highlight?: { label: string; value: string };
  sections: Section[];
  /* The closing note, in smaller type under a rule. Plain text; it is escaped. */
  footNote?: string;
};

/* ── Pieces ─────────────────────────────────────────────────────────────── */

/* The gradient rule under a title, which is the site's most recognisable
   device. Three solid cells rather than a CSS gradient — see the note above. */
function rule() {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:14px 0 0">
      <tr>
        <td width="22" height="3" bgcolor="${C.crimson}" style="line-height:3px;font-size:0">&nbsp;</td>
        <td width="21" height="3" bgcolor="${C.crimsonMid}" style="line-height:3px;font-size:0">&nbsp;</td>
        <td width="21" height="3" bgcolor="${C.orange}" style="line-height:3px;font-size:0">&nbsp;</td>
      </tr>
    </table>`;
}

/* The hanko. On the site it is a seal carrying 夢; here it is a crimson cell
   with the character in it, which every client can draw and no reader has to
   turn images on to see. */
function seal(size = 42) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${size}" style="border-collapse:collapse">
      <tr>
        <td width="${size}" height="${size}" bgcolor="${C.crimson}" align="center" valign="middle"
            style="border-radius:8px;font-family:${FONT_SERIF};font-size:${Math.round(size * 0.52)}px;line-height:${size}px;color:#FFF6F2;text-align:center">
          夢
        </td>
      </tr>
    </table>`;
}

/* One labelled value.

   The label column is a fixed width rather than one that fits its contents, so
   that the answers line up down the whole email instead of stepping in and out
   section by section — each section is its own table, and a table sizes its own
   columns. Labels wrap rather than push the column wider, and the small
   padding difference on the label puts the two type sizes on the same
   baseline. */
const LABEL_W = 152;

function row([k, v]: Row) {
  return `
    <tr>
      <td valign="top" width="${LABEL_W}" style="width:${LABEL_W}px;padding:9px 18px 7px 0;font-family:${FONT};font-size:12px;line-height:1.5;color:${C.label}">${esc(k)}</td>
      <td valign="top" style="padding:7px 0;font-family:${FONT};font-size:14px;line-height:1.6;color:${C.text};white-space:pre-wrap">${esc(v)}</td>
    </tr>`;
}

function section(s: Section) {
  return `
    <tr>
      <td style="padding:26px 0 0">
        <div style="font-family:${FONT};font-size:11px;font-weight:bold;letter-spacing:0.16em;text-transform:uppercase;color:${C.gold}">${esc(s.title)}</div>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;margin-top:6px;border-top:1px solid ${C.hairline}">
          ${s.rows.map(row).join("")}
        </table>
      </td>
    </tr>`;
}

/* The one figure or fact the reader should not have to hunt for: the amount an
   invoice was asking for, the programme a student chose. */
function highlight(h: { label: string; value: string }) {
  return `
    <tr>
      <td style="padding:24px 0 0">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse">
          <tr>
            <td bgcolor="${C.panel}" style="padding:18px 20px;border:1px solid ${C.border};border-radius:12px">
              <div style="font-family:${FONT};font-size:11px;font-weight:bold;letter-spacing:0.14em;text-transform:uppercase;color:${C.gold}">${esc(h.label)}</div>
              <div style="font-family:${FONT};font-size:21px;font-weight:bold;line-height:1.3;color:${C.heading};padding-top:6px">${esc(h.value)}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

/* ── The email ──────────────────────────────────────────────────────────── */

export function renderEmail(doc: EmailDoc): string {
  /* The grey line a phone shows next to the subject. Without one, the client
     invents it out of the first words in the body, which here would be the
     institute's own name on every single email. */
  const preheader = doc.subtitle || doc.sections[0]?.rows[0]?.[1] || "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${esc(doc.title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${C.ground};">
<div style="display:none;font-size:1px;color:${C.ground};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">${esc(preheader)}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="${C.ground}" style="border-collapse:collapse;background-color:${C.ground}">
  <tr>
    <td align="center" style="padding:26px 12px 34px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="border-collapse:collapse;width:100%;max-width:600px">

        <!-- Masthead -->
        <tr>
          <td style="padding:0 4px 18px">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">
              <tr>
                <td valign="middle">${seal(42)}</td>
                <td valign="middle" style="padding-left:14px">
                  <div style="font-family:${FONT_DISPLAY};font-size:17px;letter-spacing:0.06em;color:${C.heading};line-height:1.2">YUME GA KANAU&trade;</div>
                  <div style="font-family:${FONT_SERIF};font-size:12px;color:${C.gold};line-height:1.6;padding-top:2px">夢が叶う &middot; ${esc(SITE.legalName)}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- The card -->
        <tr>
          <td bgcolor="${C.card}" style="background-color:${C.card};border:1px solid ${C.border};border-radius:16px;padding:32px 28px">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse">
              <tr>
                <td>
                  <div style="font-family:${FONT};font-size:11px;font-weight:bold;letter-spacing:0.2em;text-transform:uppercase;color:${C.gold}">${esc(doc.eyebrow)}</div>
                  <div style="font-family:${FONT_DISPLAY};font-size:27px;letter-spacing:0.02em;line-height:1.25;color:${C.heading};padding-top:10px">${esc(doc.title)}</div>
                  ${rule()}
                  ${
                    doc.subtitle
                      ? `<div style="font-family:${FONT};font-size:13px;line-height:1.7;color:${C.muted};padding-top:16px">${esc(doc.subtitle)}</div>`
                      : ""
                  }
                </td>
              </tr>
              ${doc.highlight ? highlight(doc.highlight) : ""}
              ${doc.sections.map(section).join("")}
              ${
                doc.footNote
                  ? `<tr>
                       <td style="padding:26px 0 0">
                         <div style="border-top:1px solid ${C.hairline};padding-top:16px;font-family:${FONT};font-size:12.5px;line-height:1.7;color:${C.dim}">${esc(doc.footNote)}</div>
                       </td>
                     </tr>`
                  : ""
              }
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 6px 0">
            <div style="font-family:${FONT};font-size:11.5px;line-height:1.8;color:${C.dim}">
              Sent by the Yume Ga Kanau website &middot; <a href="${SITE.url}" style="color:${C.label};text-decoration:none">${esc(SITE.url.replace(/^https?:\/\//, ""))}</a><br>
              ${esc(SENSEI_EMAIL)} &middot; WhatsApp ${esc(WHATSAPP.display)}
            </div>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

/* The plain-text half of the same message.

   Built from the same object as the HTML, so the two cannot drift apart — and
   they must not: a text part that disagrees with the HTML is what a spam filter
   scores against, quite apart from being wrong for anyone reading it. */
export function renderEmailText(doc: EmailDoc): string {
  const parts: string[] = [];

  parts.push(doc.title.toUpperCase());
  if (doc.subtitle) parts.push(doc.subtitle);
  if (doc.highlight) parts.push(`${doc.highlight.label}: ${doc.highlight.value}`);

  for (const s of doc.sections) {
    parts.push(`${s.title.toUpperCase()}\n${s.rows.map(([k, v]) => `  ${k}: ${v}`).join("\n")}`);
  }

  if (doc.footNote) parts.push(doc.footNote);
  parts.push(`— Sent by the Yume Ga Kanau website · ${SITE.url}\n  ${SENSEI_EMAIL} · WhatsApp ${WHATSAPP.display}`);

  return parts.join("\n\n");
}
