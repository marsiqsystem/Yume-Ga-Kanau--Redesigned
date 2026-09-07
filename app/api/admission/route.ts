import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { SENSEI_EMAIL } from "@/lib/seo";
import { BLANK, humanDate, type DocValues } from "@/lib/documents";
import { unsign } from "@/lib/sign";

/* A completed admission form -> Sensei's inbox.

   Same shape as the trial-class route it sits beside: Nodemailer over Gmail
   SMTP, credentials from the environment, Node runtime because Nodemailer needs
   real net/tls.

   What is different here is provenance. The student controls every field they
   filled in, but the form number and the office-use batch details come out of
   the signed link instead of the request body — so the email Sensei opens shows
   the form number SHE issued, not one a student could have typed. If the token
   does not verify, the submission is refused outright rather than arriving
   detached from any form she recognises. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Per-field caps. Generous for a real answer, small enough that nobody can post
   a megabyte through a form that ends up in a mailbox. */
const LIMITS: Record<string, number> = {
  fullName: 120,
  certName: 120,
  dob: 40,
  email: 200,
  whatsapp: 40,
  city: 80,
  country: 80,
  timezone: 80,
  occupation: 120,
  prevStudy: 300,
  jlptHistory: 300,
  kana: 40,
  kanji: 40,
  speaking: 40,
  programme: 80,
  format: 40,
  reasonText: 2000,
  timeWindow: 120,
  timezone2: 80,
  signName: 120,
  signEmail: 200,
  signDate: 40,
  guardianName: 120,
  guardianEmail: 200,
  guardianDate: 40,
};

function clean(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/* Checkbox groups arrive as arrays. Capped in both directions: at most 20
   entries, each at most 80 characters. */
function cleanList(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is string => typeof x === "string")
    .slice(0, 20)
    .map((x) => x.trim().slice(0, 80))
    .filter(Boolean);
}

/* The student controls every value, so nothing reaches the HTML email
   unescaped — otherwise a submission could inject markup into the message
   Sensei opens. */
function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* Header injection guard: a newline inside a header value can append headers of
   the sender's choosing. Subject and Reply-To are built from student input. */
function oneLine(s: string) {
  return s.replace(/[\r\n]+/g, " ").trim();
}

function dash(s: string) {
  return s || "—";
}

/* yyyy-mm-dd renders as "12 January 2026" — students are in four countries and
   a numeric date means two different days depending on where you read it. */
function nice(s: string) {
  return s ? humanDate(s) : "";
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  // Honeypot: invisible to a person, so anything in it is a bot. Answer 200 so
  // the bot believes it worked and does not retry.
  if (clean(body.company, 100)) return NextResponse.json({ ok: true });

  /* Provenance. The link must be one this server issued, for this document. */
  const token = clean(body.token, 4000);
  const payload = unsign<{ t?: string; v?: DocValues }>(token);
  if (!payload || payload.t !== "admission") {
    return NextResponse.json(
      { ok: false, error: "This form link is no longer valid. Please ask Sensei for a fresh one." },
      { status: 400 },
    );
  }
  const office: DocValues = payload.v && typeof payload.v === "object" ? payload.v : {};

  const f: Record<string, string> = {};
  for (const [key, max] of Object.entries(LIMITS)) f[key] = clean(body[key], max);

  const reasons = cleanList(body.reasons);
  const days = cleanList(body.days);
  const decl = cleanList(body.decl);
  const guardianAgreed = body.guardianAgreed === true;

  /* Validated here, not only in the browser. The client disables the button as
     a courtesy; these are the actual rules — and the declaration ones matter,
     because the typed name is what stands in place of a signature. */
  if (!f.fullName) {
    return NextResponse.json({ ok: false, error: "Please add your full name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(f.email)) {
    return NextResponse.json(
      { ok: false, error: "That email address does not look right." },
      { status: 400 },
    );
  }
  if (!f.timezone) {
    return NextResponse.json(
      { ok: false, error: "Please add your time zone — your class time is set from it." },
      { status: 400 },
    );
  }
  if (!f.programme) {
    return NextResponse.json({ ok: false, error: "Please choose a programme." }, { status: 400 });
  }
  if (decl.length < 3) {
    return NextResponse.json(
      { ok: false, error: "Please tick all three declaration statements." },
      { status: 400 },
    );
  }
  if (!f.signName || !EMAIL_RE.test(f.signEmail)) {
    return NextResponse.json(
      { ok: false, error: "Please type your full name and the email address you are enrolling with." },
      { status: 400 },
    );
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.CONTACT_TO || user;

  if (!user || !pass) {
    console.error("[admission] GMAIL_USER / GMAIL_APP_PASSWORD are not set");
    return NextResponse.json(
      { ok: false, error: `Email is not connected yet. Please write to ${SENSEI_EMAIL}.` },
      { status: 503 },
    );
  }

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

  const formNo = office.formNo?.trim() || BLANK;

  /* Sections mirror the form's own order, so Sensei reads the email in the same
     sequence the student filled it in. */
  const sections: Array<[string, Array<[string, string]>]> = [
    [
      "This form",
      [
        ["Form no.", formNo],
        ["Form dated", dash(nice(office.issueDate?.trim() || ""))],
        ["Batch assigned", dash(office.batchAssigned?.trim() || "")],
        ["Start date", dash(nice(office.startDate?.trim() || ""))],
        ["Class days & time", dash(office.classDaysTime?.trim() || "")],
      ],
    ],
    [
      "Student",
      [
        ["Full name", f.fullName],
        ["Name for certificate", dash(f.certName)],
        ["Date of birth", dash(nice(f.dob))],
        ["Email", f.email],
        ["WhatsApp", dash(f.whatsapp)],
        ["City", dash(f.city)],
        ["Country", dash(f.country)],
        ["Time zone", f.timezone],
        ["Occupation", dash(f.occupation)],
      ],
    ],
    [
      "Language background",
      [
        ["Previous study", dash(f.prevStudy)],
        ["JLPT history", dash(f.jlptHistory)],
        ["Reads kana", dash(f.kana)],
        ["Kanji known", dash(f.kanji)],
        ["Speaking confidence", dash(f.speaking)],
      ],
    ],
    [
      "Programme",
      [
        ["Programme", f.programme],
        ["Format", dash(f.format)],
      ],
    ],
    [
      "Why they are learning",
      [
        ["Reasons", dash(reasons.join(", "))],
        ["In their own words", dash(f.reasonText)],
      ],
    ],
    [
      "Scheduling",
      [
        ["Preferred days", dash(days.join(", "))],
        ["Preferred time", dash(f.timeWindow)],
        ["Time zone (repeated)", dash(f.timezone2)],
      ],
    ],
    [
      "Electronic agreement",
      [
        ["All three statements ticked", decl.length >= 3 ? "Yes" : "No"],
        ["Typed name (signature)", f.signName],
        ["Email used to enrol", f.signEmail],
        ["Dated", dash(nice(f.signDate))],
      ],
    ],
  ];

  /* The guardian block only appears when there is something in it — an empty
     "guardian: —" block on every form would train Sensei to skip past it. */
  if (guardianAgreed || f.guardianName || f.guardianEmail) {
    sections.push([
      "Parent or guardian (student under 18)",
      [
        ["Agreed on the student's behalf", guardianAgreed ? "Yes" : "No"],
        ["Guardian name (signature)", dash(f.guardianName)],
        ["Guardian email", dash(f.guardianEmail)],
        ["Dated", dash(nice(f.guardianDate))],
      ],
    ]);
  }

  const text = sections
    .map(([title, rows]) => `${title.toUpperCase()}\n${rows.map(([k, v]) => `  ${k}: ${v}`).join("\n")}`)
    .join("\n\n");

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6;color:#1a1a2e">
      <h2 style="margin:0 0 4px;font-size:18px">Admission form — ${esc(f.fullName)}</h2>
      <p style="margin:0 0 20px;color:#666;font-size:13px">
        Form no. ${esc(formNo)} · submitted from the Yume Ga Kanau website
      </p>
      ${sections
        .map(
          ([title, rows]) => `
        <h3 style="margin:22px 0 8px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#8a8aa0">${esc(title)}</h3>
        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%">
          ${rows
            .map(
              ([k, v]) => `
            <tr>
              <td style="padding:5px 16px 5px 0;color:#666;vertical-align:top;white-space:nowrap;width:190px">${esc(k)}</td>
              <td style="padding:5px 0;white-space:pre-wrap">${esc(v)}</td>
            </tr>`,
            )
            .join("")}
        </table>`,
        )
        .join("")}
      <p style="margin:26px 0 0;padding-top:14px;border-top:1px solid #e3e3ec;color:#666;font-size:13px">
        A typed name submitted from the student's own email address stands in place of a handwritten
        signature. Reply straight to this email and it goes to ${esc(f.signName)}.
      </p>
    </div>`;

  try {
    await transporter.sendMail({
      from: `"Yume Ga Kanau website" <${user}>`,
      to,
      // Reply goes to the address the student actually enrolled with, so Sensei
      // can just hit Reply and be writing to the right person.
      replyTo: `"${oneLine(f.signName).replace(/"/g, "")}" <${oneLine(f.signEmail)}>`,
      subject: oneLine(`Admission form — ${f.fullName} — ${f.programme}`),
      text,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Log the message only, never the whole object: `pass` is not on it, but
    // this way it cannot become so by accident.
    console.error("[admission] send failed:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, error: `That did not go through. Please write to ${SENSEI_EMAIL}.` },
      { status: 502 },
    );
  }
}
