"use client";

import { useState } from "react";
import { SENSEI_EMAIL, WHATSAPP } from "@/lib/seo";
import { Body, Card, FONT_BODY, Hint, Label, Rule, Seal, SectionTitle } from "./DocParts";

/* "I have paid — please send my receipt."

   The invoice is the one document a student holds while money is moving, and
   until now the last step was left to chat: pay, then remember to tell Sensei,
   who then has to work out which invoice the message is about. This panel is
   that message, sent from inside the invoice itself, so what reaches her
   already carries the invoice number, the batch and the figure the invoice was
   asking for — none of it typed by the student, all of it read back out of the
   signed link on the server.

   It deliberately does not mark anything paid. Nothing here is stored, no
   document changes, and no receipt is generated: pressing the button sends
   Sensei an email and nothing else. She checks the money has actually arrived,
   then issues the receipt link herself from the admin console. A student
   cannot, by filling this in, produce a document that says they have paid.

   Hidden when printing (.pack-noprint) — a button is meaningless on paper or
   in a saved PDF. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const METHODS = ["UPI", "Bank transfer", "Something else"] as const;

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

export default function ReceiptRequest({
  token,
  studentName,
  email,
  phone,
  amountDue,
  settled,
}: {
  token: string;
  /* Prefills, from the invoice itself. All of them are editable — the person
     paying is not always the person the invoice is addressed to, and the
     address Sensei has on file may not be the one they read email at. */
  studentName: string;
  email: string;
  phone: string;
  /* The figure the invoice is asking for, already formatted. Prefilled so the
     usual case — paid exactly what was asked — needs no typing. */
  amountDue: string;
  /* A settled invoice can still need a receipt; only the wording changes. */
  settled: boolean;
}) {
  const [f, setF] = useState({
    name: studentName,
    email,
    whatsapp: phone,
    amount: amountDue,
    paidDate: "",
    method: "UPI" as string,
    reference: "",
    note: "",
    /* Honeypot. A real person never sees this, so anything in it is a bot. */
    company: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) =>
    setF((prev) => ({ ...prev, [k]: v }));

  /* Enough to reply to, and nothing more. Everything that identifies the
     invoice comes from the link, so the student is only ever asked for what
     Sensei does not already know. The server checks this again. */
  const ready = f.name.trim() !== "" && EMAIL_RE.test(f.email.trim());

  async function submit() {
    if (!ready || status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/receipt-request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...f, token }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setStatus("sent");
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
      <Card mt={26} pad="34px 28px">
        <div className="pack-noprint">
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 18 }}>
            <Seal />
            <div style={{ font: `700 17px/1.5 ${FONT_BODY}`, color: "#F7F3EA" }}>
              Your request has reached Parveen Kaur Sensei.
            </div>
          </div>
          <Body size={13.5}>
            She will check the payment against this invoice and email your receipt to{" "}
            <strong style={{ color: "#F7F3EA" }}>{f.email.trim()}</strong> as a link you can open and
            save. Receipts are issued by hand, so please allow a little time.
          </Body>
          <Body size={13} mt={14} color="#8F99BB">
            Nothing on this invoice has changed — it still shows what was charged. If you need to reach
            her sooner, WhatsApp <strong style={{ color: "#C3CAE4" }}>{WHATSAPP.display}</strong> or
            email <strong style={{ color: "#C3CAE4" }}>{SENSEI_EMAIL}</strong>.
          </Body>
        </div>
      </Card>
    );
  }

  return (
    <Card mt={26} pad="34px 28px">
      <div className="pack-noprint">
        <SectionTitle size={20}>
          {settled ? "NEED YOUR RECEIPT?" : "PAID? ASK FOR YOUR RECEIPT"}
        </SectionTitle>
        <Rule mb={18} />
        <Body size={13.5}>
          {settled
            ? "This invoice is settled. If you have not been sent the matching receipt, or you need another copy of it, ask for one here."
            : "Once your payment has gone through, tell Sensei here. She checks it against this invoice and sends your receipt back as a link. Pressing the button does not mark the invoice paid by itself — the receipt comes from her."}
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

        <div style={{ marginTop: 22, display: "grid", gap: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <Field
              label="Your name"
              placeholder="As it should appear on the receipt"
              value={f.name}
              onChange={(v) => set("name", v)}
              required
            />
            <Field
              label="Email for the receipt"
              type="email"
              placeholder="you@example.com"
              value={f.email}
              onChange={(v) => set("email", v)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <Field
              label="Amount you paid"
              placeholder="e.g. 12,500"
              value={f.amount}
              onChange={(v) => set("amount", v)}
              hint="Change it if you paid only a part of the total."
            />
            <Field
              label="Date you paid"
              type="date"
              value={f.paidDate}
              onChange={(v) => set("paidDate", v)}
            />
          </div>

          <div>
            <Label mb={12}>How you paid</Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              {METHODS.map((m) => (
                <label
                  key={m}
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
                    name="ygk-receipt-method"
                    checked={f.method === m}
                    onChange={() => set("method", m)}
                  />
                  <span>{m}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <Field
              label="Reference or transaction ID"
              placeholder="From your UPI app or bank"
              value={f.reference}
              onChange={(v) => set("reference", v)}
              hint="Optional, but it is what lets her find your payment fastest."
            />
            <Field
              label="WhatsApp"
              placeholder="Optional"
              value={f.whatsapp}
              onChange={(v) => set("whatsapp", v)}
            />
          </div>

          <div>
            <Label>Anything she should know</Label>
            <textarea
              rows={3}
              maxLength={800}
              placeholder="Optional — for example, paid from a parent’s account, or the name on the receipt should be different."
              value={f.note}
              onChange={(e) => set("note", e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginTop: 26, textAlign: "center" }}>
          {error && (
            <div
              role="alert"
              style={{ font: `600 13px/1.6 ${FONT_BODY}`, color: "#EFB3C1", marginBottom: 16 }}
            >
              {error}
            </div>
          )}
          <button
            type="button"
            className="pack-btn"
            onClick={submit}
            disabled={!ready || status === "sending"}
          >
            {status === "sending" ? "Sending…" : "I have paid — request my receipt"}
          </button>
          <div style={{ font: `400 12px/1.7 ${FONT_BODY}`, color: "#8F99BB", marginTop: 14 }}>
            {ready
              ? "Sends Sensei an email carrying this invoice number and what you have entered. Please press it once."
              : "Add your name and an email address she can send the receipt to."}
          </div>
        </div>
      </div>
    </Card>
  );
}
