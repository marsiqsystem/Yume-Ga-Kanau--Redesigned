"use client";

import { useState } from "react";
import { SENSEI_EMAIL, WHATSAPP } from "@/lib/seo";
import { BLANK, dateVal, humanDate, val, type DocValues } from "@/lib/documents";
import {
  Body,
  Card,
  DocBody,
  DocFooter,
  DocTitle,
  Eyebrow,
  FONT_BODY,
  FONT_SERIF,
  GoldPanel,
  Grid,
  Hint,
  Label,
  Masthead,
  ReadOnly,
  Rule,
  Seal,
  SectionTitle,
} from "./DocParts";

/* The admission form, as the student sees it.

   The values Sensei signed into the link (form number, date, and the office-use
   batch details if she has decided them) are rendered read-only. Everything else
   is a live field. On submit the whole thing goes to /api/admission, which mails
   Sensei — the student's answers are never stored anywhere else.

   The declaration is the part to be careful with. The design is explicit that a
   handwritten signature is impossible here — students are in four countries —
   so agreement is three separately ticked statements plus a typed name and the
   email address the student enrols from. All four are required, and the button
   stays disabled until they are, so nobody submits a form that has not actually
   agreed to anything. */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const PROGRAMMES = [
  { v: "Stage 1 · JLPT N5", label: "Stage 1 · ", level: "JLPT N5" },
  { v: "Stage 2 · JLPT N4", label: "Stage 2 · ", level: "JLPT N4" },
  { v: "Stage 3 · JLPT N3", label: "Stage 3 · ", level: "JLPT N3" },
  { v: "Stage 4 · JLPT N2", label: "Stage 4 · ", level: "JLPT N2" },
  { v: "Conversational Japanese (Kaiwa)", label: "Conversational Japanese (Kaiwa)" },
  { v: "Business Japanese", label: "Business Japanese" },
] as const;

const REASONS = [
  "JLPT exam",
  "Work",
  "Travel",
  "Study in Japan",
  "Personal interest",
  "Anime and media",
] as const;

const DECLARATIONS = [
  <>
    I understand that <strong style={{ color: "#F7F3EA" }}>fees are non-refundable once a batch begins</strong>.
    If I face unforeseen circumstances, I may request to pause my enrolment or transfer to a future batch.
  </>,
  <>
    I understand that <strong style={{ color: "#F7F3EA" }}>no JLPT result is guaranteed</strong>. The institute
    prepares me for the examination and is not affiliated with the Japan Foundation or JEES, who administer
    the JLPT.
  </>,
  <>The information I have given in this form is true to the best of my knowledge.</>,
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Toggles one value in a list — used by every checkbox group on the form. */
function toggle(list: string[], v: string) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

function CheckRow({
  checked,
  onChange,
  children,
  align = "center",
}: {
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
  align?: "center" | "flex-start";
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: align,
        gap: 11,
        font: `600 14px/1.4 ${FONT_BODY}`,
        color: "#F5F0E6",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={align === "flex-start" ? { marginTop: 2 } : undefined}
      />
      <span>{children}</span>
    </label>
  );
}

function RadioRow({
  name,
  value,
  current,
  onChange,
  children,
}: {
  name: string;
  value: string;
  current: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 11,
        font: `600 14px/1.3 ${FONT_BODY}`,
        color: "#F5F0E6",
        cursor: "pointer",
      }}
    >
      <input
        type="radio"
        name={name}
        checked={current === value}
        onChange={() => onChange(value)}
      />
      <span>{children}</span>
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
  required,
}: {
  label: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label>
        {label}
        {required && <span style={{ color: "#E2103C", fontWeight: 800 }}> *</span>}
      </Label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <Hint>{hint}</Hint>}
    </div>
  );
}

export default function AdmissionForm({ office, token }: { office: DocValues; token: string }) {
  /* One object rather than thirty useStates: the payload posted to the API is
     the same shape, so there is nothing to assemble at submit time. */
  const [f, setF] = useState({
    fullName: "",
    certName: "",
    dob: "",
    email: "",
    whatsapp: "",
    city: "",
    country: "",
    timezone: "",
    occupation: "",
    prevStudy: "",
    jlptHistory: "",
    kana: "",
    kanji: "",
    speaking: "",
    programme: "",
    format: "",
    reasons: [] as string[],
    reasonText: "",
    days: [] as string[],
    timeWindow: "",
    timezone2: "",
    decl: [] as string[],
    signName: "",
    signEmail: "",
    signDate: "",
    guardianAgreed: false,
    guardianName: "",
    guardianEmail: "",
    guardianDate: "",
    /* Honeypot. A real person never sees this, so anything in it is a bot. */
    company: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) =>
    setF((prev) => ({ ...prev, [k]: v }));

  /* The button is disabled until the form is actually submittable, so the
     student is never told off after the fact for something they could have been
     shown up front. The server checks all of this again — the client check is a
     courtesy, that one is the rule. */
  const ready =
    f.fullName.trim() !== "" &&
    EMAIL_RE.test(f.email.trim()) &&
    f.timezone.trim() !== "" &&
    f.programme !== "" &&
    f.decl.length === DECLARATIONS.length &&
    f.signName.trim() !== "" &&
    EMAIL_RE.test(f.signEmail.trim());

  async function submit() {
    if (!ready || status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/admission", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...f, token }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setStatus("sent");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setStatus("idle");
        setError(data.error || "That did not go through. Please try again.");
      }
    } catch {
      setStatus("idle");
      setError(`That did not go through. Please email ${SENSEI_EMAIL} instead.`);
    }
  }

  if (status === "sent") {
    return (
      <div className="pack-sheet">
        <Masthead />
        <DocBody>
          <Eyebrow>Received</Eyebrow>
          <DocTitle>THANK YOU</DocTitle>
          <Rule />
          <Card watermark="夢">
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
              <Seal />
              <div style={{ font: `700 18px/1.5 ${FONT_BODY}`, color: "#F7F3EA" }}>
                Your form has reached Parveen Kaur Sensei.
              </div>
            </div>
            <Body size={14}>
              She reads every form herself. You will get a reply by email at{" "}
              <strong style={{ color: "#F7F3EA" }}>{f.signEmail.trim()}</strong>, and once your place is
              confirmed you will be added to your batch WhatsApp group — that is where joining links,
              handouts, kanji workbooks, vocabulary lists and practice tests are shared.
            </Body>
            <Body size={14} mt={14}>
              If anything you entered was wrong, or you have not heard back, message her directly on
              WhatsApp at <strong style={{ color: "#F7F3EA" }}>{WHATSAPP.display}</strong> or email{" "}
              <strong style={{ color: "#F7F3EA" }}>{SENSEI_EMAIL}</strong>.
            </Body>
          </Card>
          <DocFooter />
        </DocBody>
      </div>
    );
  }

  return (
    <div className="pack-sheet">
      <Masthead
        aside={
          <>
            <div>
              <Label>Form no.</Label>
              <div className="pack-locked">{val(office, "formNo")}</div>
            </div>
            <div>
              <Label>Date</Label>
              <div className="pack-locked">{dateVal(office, "issueDate")}</div>
            </div>
          </>
        }
      />

      <DocBody>
        <Eyebrow>Enrolment</Eyebrow>
        <DocTitle>ADMISSION FORM</DocTitle>
        <Rule />
        <Body size={13.5}>
          Completed online. All classes are live and online, taught in English and Hindi by Parveen Kaur
          Sensei. Nothing here needs to be printed.
        </Body>

        {/* Honeypot. Hidden from people, catnip for bots. */}
        <input
          type="text"
          name="company"
          value={f.company}
          onChange={(e) => set("company", e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />

        {/* ── Student details ── */}
        <Card watermark="夢" mt={34}>
          <SectionTitle>STUDENT DETAILS</SectionTitle>
          <Rule mb={22} />
          <div style={{ display: "grid", gap: 18 }}>
            <Field
              label="Full name"
              placeholder="As it appears on your ID"
              value={f.fullName}
              onChange={(v) => set("fullName", v)}
              required
            />
            <Field
              label="Name as it should appear on the certificate"
              placeholder="Exactly as you want it written"
              value={f.certName}
              onChange={(v) => set("certName", v)}
            />
            <Grid>
              <Field label="Date of birth" type="date" value={f.dob} onChange={(v) => set("dob", v)} />
              <Field
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={f.email}
                onChange={(v) => set("email", v)}
                required
              />
            </Grid>
            <Field
              label="WhatsApp number (with country code)"
              type="tel"
              placeholder="+91 00000 00000"
              value={f.whatsapp}
              onChange={(v) => set("whatsapp", v)}
            />
            <Grid>
              <Field label="City" placeholder="City" value={f.city} onChange={(v) => set("city", v)} />
              <Field
                label="Country"
                placeholder="Country"
                value={f.country}
                onChange={(v) => set("country", v)}
              />
            </Grid>
            <Field
              label="Time zone"
              placeholder="e.g. IST / GMT / EST / JST"
              value={f.timezone}
              onChange={(v) => set("timezone", v)}
              hint="Students are in India, the UK, the USA and Japan. Your class time is set from this."
              required
            />
            <Field
              label="Occupation / student status"
              placeholder="Working professional, student, other"
              value={f.occupation}
              onChange={(v) => set("occupation", v)}
            />
          </div>
        </Card>

        {/* ── Language background ── */}
        <Card>
          <SectionTitle>LANGUAGE BACKGROUND</SectionTitle>
          <Rule mb={22} />
          <div style={{ display: "grid", gap: 18 }}>
            <Field
              label="Previous Japanese study (where / how long)"
              placeholder="Self-study, school, none"
              value={f.prevStudy}
              onChange={(v) => set("prevStudy", v)}
            />
            <Field
              label="JLPT levels attempted / passed, with year"
              placeholder="e.g. N5 attempted 2025"
              value={f.jlptHistory}
              onChange={(v) => set("jlptHistory", v)}
            />
            <div>
              <Label>Can you read hiragana and katakana?</Label>
              <div style={{ display: "flex", gap: 26, flexWrap: "wrap", paddingTop: 4 }}>
                {["Both", "Hiragana only", "Neither yet"].map((o) => (
                  <RadioRow key={o} name="kana" value={o} current={f.kana} onChange={(v) => set("kana", v)}>
                    {o}
                  </RadioRow>
                ))}
              </div>
            </div>
            <Grid>
              <Field
                label="Kanji known (approx.)"
                placeholder="0, 50, 300…"
                value={f.kanji}
                onChange={(v) => set("kanji", v)}
              />
              <div>
                <Label>Speaking confidence</Label>
                <select value={f.speaking} onChange={(e) => set("speaking", e.target.value)}>
                  <option value="">Choose…</option>
                  <option>1 — none at all</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5 — comfortable</option>
                </select>
              </div>
            </Grid>
          </div>
        </Card>

        {/* ── Programme ── */}
        <Card>
          <SectionTitle>PROGRAMME SELECTION</SectionTitle>
          <Rule mb={22} />
          <Label mb={14}>
            Choose one programme<span style={{ color: "#E2103C", fontWeight: 800 }}> *</span>
          </Label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
            {PROGRAMMES.map((p) => (
              <RadioRow
                key={p.v}
                name="prog"
                value={p.v}
                current={f.programme}
                onChange={(v) => set("programme", v)}
              >
                {p.label}
                {"level" in p && p.level && (
                  <span style={{ fontFamily: FONT_SERIF, fontWeight: 700, color: "#F7F3EA" }}>
                    {p.level}
                  </span>
                )}
              </RadioRow>
            ))}
          </div>

          <div
            style={{ height: 1, background: "rgba(245,240,230,.08)", margin: "26px 0 22px" }}
            aria-hidden="true"
          />

          <Label mb={14}>Format</Label>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {["Small batch", "1-on-1 coaching"].map((o) => (
              <RadioRow key={o} name="fmt" value={o} current={f.format} onChange={(v) => set("format", v)}>
                {o}
              </RadioRow>
            ))}
          </div>
        </Card>

        {/* ── Why ── */}
        <Card>
          <SectionTitle>WHY ARE YOU LEARNING JAPANESE?</SectionTitle>
          <Rule mb={22} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {REASONS.map((r) => (
              <CheckRow
                key={r}
                checked={f.reasons.includes(r)}
                onChange={() => set("reasons", toggle(f.reasons, r))}
              >
                {r}
              </CheckRow>
            ))}
          </div>
          <div style={{ marginTop: 22 }}>
            <Label>In your own words</Label>
            <textarea
              value={f.reasonText}
              placeholder="Tell me why you want to learn Japanese."
              onChange={(e) => set("reasonText", e.target.value)}
            />
          </div>
        </Card>

        {/* ── Scheduling ── */}
        <Card>
          <SectionTitle>SCHEDULING</SectionTitle>
          <Rule mb={22} />
          <Label mb={14}>Preferred days</Label>
          <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
            {DAYS.map((d) => (
              <CheckRow key={d} checked={f.days.includes(d)} onChange={() => set("days", toggle(f.days, d))}>
                {d}
              </CheckRow>
            ))}
          </div>
          <div style={{ marginTop: 22 }}>
            <Grid>
              <Field
                label="Preferred time window"
                placeholder="e.g. 7:00 pm – 9:00 pm"
                value={f.timeWindow}
                onChange={(v) => set("timeWindow", v)}
              />
              <Field
                label="Your time zone (repeat for clarity)"
                placeholder="e.g. IST / GMT / EST / JST"
                value={f.timezone2}
                onChange={(v) => set("timezone2", v)}
              />
            </Grid>
          </div>
        </Card>

        {/* ── Office use: filled by Sensei when she made this link, never editable here ── */}
        <GoldPanel mt={26} pad="26px 24px">
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div
              style={{
                font: `700 11px/1 ${FONT_BODY}`,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "#D9A24B",
              }}
            >
              For office use only
            </div>
            <div
              style={{
                flex: 1,
                height: 1,
                background: "linear-gradient(90deg,rgba(217,162,75,.42),transparent)",
              }}
              aria-hidden="true"
            />
            <div style={{ font: `400 11.5px/1 ${FONT_BODY}`, color: "#9BA5C6" }}>
              Completed by Parveen Kaur Sensei
            </div>
          </div>
          <Grid cols={3}>
            <ReadOnly label="Batch assigned" value={val(office, "batchAssigned")} />
            <ReadOnly label="Start date" value={dateVal(office, "startDate")} />
            <ReadOnly label="Class days & time" value={val(office, "classDaysTime")} />
          </Grid>
          {val(office, "batchAssigned") === BLANK && (
            <Hint>
              Your batch is not assigned yet. Sensei confirms it by email once she has read your form.
            </Hint>
          )}
        </GoldPanel>

        {/* ── Declaration ── */}
        <Card mt={26}>
          <SectionTitle>DECLARATION &amp; ELECTRONIC AGREEMENT</SectionTitle>
          <Rule mb={22} />
          <div style={{ display: "grid", gap: 16 }}>
            {DECLARATIONS.map((d, i) => (
              <CheckRow
                key={i}
                align="flex-start"
                checked={f.decl.includes(String(i))}
                onChange={() => set("decl", toggle(f.decl, String(i)))}
              >
                <span style={{ fontWeight: 400, lineHeight: 1.7, color: "#C3CAE4" }}>{d}</span>
              </CheckRow>
            ))}
          </div>

          <div style={{ marginTop: 26, display: "grid", gap: 18 }}>
            <Field
              label="Full name (typing your name here acts as your signature)"
              placeholder="Type your full name"
              value={f.signName}
              onChange={(v) => set("signName", v)}
              required
            />
            <Grid>
              <Field
                label="Email address used to enrol"
                type="email"
                placeholder="you@example.com"
                value={f.signEmail}
                onChange={(v) => set("signEmail", v)}
                required
              />
              <Field label="Date" type="date" value={f.signDate} onChange={(v) => set("signDate", v)} />
            </Grid>
          </div>

          <div style={{ font: `600 12.5px/1.6 ${FONT_BODY}`, color: "#9BA5C6", marginTop: 16 }}>
            Agreed electronically on {f.signDate ? humanDate(f.signDate) : BLANK}
          </div>
          <div style={{ font: `400 12px/1.7 ${FONT_BODY}`, color: "#8F99BB", marginTop: 8 }}>
            This form is completed and submitted online. A typed name, submitted from your own email
            address, stands in place of a handwritten signature.
          </div>

          {/* ── Guardian, for a student under 18 ── */}
          <div
            style={{
              marginTop: 26,
              borderRadius: 14,
              border: "1px solid rgba(245,240,230,.10)",
              background: "rgba(6,12,36,.34)",
              padding: "24px 22px",
            }}
          >
            <Label mb={16}>If the student is under 18 — parent or guardian</Label>
            <CheckRow
              align="flex-start"
              checked={f.guardianAgreed}
              onChange={() => set("guardianAgreed", !f.guardianAgreed)}
            >
              <span style={{ fontWeight: 400, lineHeight: 1.7, color: "#C3CAE4" }}>
                As parent or guardian, I agree to the three statements above on behalf of the student.
              </span>
            </CheckRow>
            <div style={{ marginTop: 20, display: "grid", gap: 18 }}>
              <Field
                label="Guardian full name (acts as signature)"
                placeholder="Type guardian’s full name"
                value={f.guardianName}
                onChange={(v) => set("guardianName", v)}
              />
              <Grid>
                <Field
                  label="Guardian’s own email address"
                  type="email"
                  placeholder="guardian@example.com"
                  value={f.guardianEmail}
                  onChange={(v) => set("guardianEmail", v)}
                />
                <Field
                  label="Date"
                  type="date"
                  value={f.guardianDate}
                  onChange={(v) => set("guardianDate", v)}
                />
              </Grid>
            </div>
            <div style={{ font: `600 12.5px/1.6 ${FONT_BODY}`, color: "#9BA5C6", marginTop: 16 }}>
              Agreed electronically on {f.guardianDate ? humanDate(f.guardianDate) : BLANK}
            </div>
          </div>

          {/* ── Submit ── */}
          <div style={{ marginTop: 30, textAlign: "center" }}>
            {error && (
              <div
                role="alert"
                style={{
                  font: `600 13px/1.6 ${FONT_BODY}`,
                  color: "#EFB3C1",
                  marginBottom: 16,
                }}
              >
                {error}
              </div>
            )}
            <button type="button" className="pack-btn" onClick={submit} disabled={!ready || status === "sending"}>
              {status === "sending" ? "Sending…" : "Submit enrolment form"}
            </button>
            <div style={{ font: `400 12px/1.7 ${FONT_BODY}`, color: "#8F99BB", marginTop: 14 }}>
              {ready
                ? "You will receive a confirmation by email and be added to your batch WhatsApp group."
                : "Fill in your name, email, time zone and programme, then tick all three declaration boxes and type your name to submit."}
            </div>
          </div>
        </Card>

        <DocFooter />
      </DocBody>
    </div>
  );
}
