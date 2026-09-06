import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { SENSEI_EMAIL } from "@/lib/seo";

/* Trial-class enquiries -> Sensei's inbox, over Gmail SMTP.

   Nodemailer needs real Node APIs (net/tls), so this route must not run on the
   Edge runtime, and it must never be statically prerendered.

   Credentials come from the environment and are never committed:
     GMAIL_USER          the Gmail address that sends (e.g. yumegakanau22@gmail.com)
     GMAIL_APP_PASSWORD  a 16-character Google App Password, NOT the account password
     CONTACT_TO          optional; where enquiries land, defaults to GMAIL_USER

   An App Password requires 2-Step Verification on the Google account; it is
   generated at myaccount.google.com/apppasswords and can be revoked on its own
   without touching the account password. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Generous caps that still stop someone pasting a novel into the form. */
const LIMITS = { name: 120, email: 200, level: 120, goal: 160, notes: 4000 } as const;

function clean(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/* The enquirer controls every value here, so nothing is interpolated into HTML
   without escaping — otherwise a submission could inject markup into the email
   Sensei opens. */
function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* Header injection guard: a newline in a header value can append headers of the
   attacker's choosing (a Bcc, say). Subject and Reply-To are built from user input. */
function oneLine(s: string) {
  return s.replace(/[\r\n]+/g, " ").trim();
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const level = clean(body.level, LIMITS.level);
  const goal = clean(body.goal, LIMITS.goal);
  const notes = clean(body.notes, LIMITS.notes);

  // Honeypot: a real person never sees this field, so anything in it is a bot.
  // Answer 200 so the bot believes it succeeded and does not retry.
  if (clean(body.company, 100)) return NextResponse.json({ ok: true });

  // Validated again here, not just in the browser: the client check is a courtesy,
  // this one is the actual rule.
  if (!name) {
    return NextResponse.json({ ok: false, error: "Please add your name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "That email address does not look right." },
      { status: 400 },
    );
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.CONTACT_TO || user;

  if (!user || !pass) {
    // Misconfiguration, not the visitor's fault - tell them how to reach Sensei anyway.
    console.error("[contact] GMAIL_USER / GMAIL_APP_PASSWORD are not set");
    return NextResponse.json(
      { ok: false, error: `Email is not connected yet. Please write to ${SENSEI_EMAIL}.` },
      { status: 503 },
    );
  }

  /* Gmail by default. SMTP_HOST/SMTP_PORT override it, which is how another
     provider gets swapped in later without touching this file - and how the
     route is exercised against a local mail catcher in testing. */
  const host = process.env.SMTP_HOST;
  const transporter = nodemailer.createTransport(
    host
      ? {
          host,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === "true",
          auth: process.env.SMTP_NOAUTH === "true" ? undefined : { user, pass },
          tls: { rejectUnauthorized: process.env.SMTP_INSECURE !== "true" },
        }
      : { service: "gmail", auth: { user, pass } },
  );

  const rows: Array<[string, string]> = [
    ["Name", name],
    ["Email", email],
    ["Current level", level || "—"],
    ["What they want", goal || "—"],
    ["Anything else", notes || "—"],
  ];

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6;color:#1a1a2e">
      <h2 style="margin:0 0 4px;font-size:18px">Trial class request</h2>
      <p style="margin:0 0 18px;color:#666;font-size:13px">From the Yume Ga Kanau website</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr>
                 <td style="padding:6px 16px 6px 0;color:#666;vertical-align:top;white-space:nowrap">${esc(k)}</td>
                 <td style="padding:6px 0;white-space:pre-wrap">${esc(v)}</td>
               </tr>`,
          )
          .join("")}
      </table>
      <p style="margin:20px 0 0;color:#666;font-size:13px">
        Reply straight to this email and it goes to ${esc(name)}.
      </p>
    </div>`;

  try {
    await transporter.sendMail({
      from: `"Yume Ga Kanau website" <${user}>`,
      to,
      // Reply goes to the enquirer, so Sensei can just hit Reply.
      replyTo: `"${oneLine(name).replace(/"/g, "")}" <${oneLine(email)}>`,
      subject: oneLine(`Trial class request — ${name}`),
      text,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Never log `pass`; the error object from nodemailer does not carry it, but
    // log only the message rather than the whole object to be sure.
    console.error("[contact] send failed:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, error: `That did not go through. Please write to ${SENSEI_EMAIL}.` },
      { status: 502 },
    );
  }
}
