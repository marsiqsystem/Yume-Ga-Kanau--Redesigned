"use client";

import { useMemo, useState } from "react";
import type { DocDef, Field } from "@/lib/documents";
import {
  Body,
  Card,
  DocBody,
  DocFooter,
  DocTitle,
  Eyebrow,
  FONT_BODY,
  FONT_DISPLAY,
  Hint,
  Label,
  Masthead,
  Rule,
  SectionTitle,
} from "@/components/documents/DocParts";

/* Sensei's console.

   Three steps, in order, and only one of them is ever on screen: pick a
   document, fill in the parts only she knows, get a link. Everything is driven
   off the definitions in lib/documents, so this component never needs editing
   when a field is added.

   The values are held per document, not globally — switching from the receipt
   to the fee sheet and back does not lose what was already typed, which matters
   when she is working through a batch of students in one sitting. */

type Props = { docs: DocDef[] };

type Values = Record<string, Record<string, string>>;

function inputFor(f: Field, value: string, onChange: (v: string) => void) {
  if (f.kind === "select") {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Choose…</option>
        {(f.options ?? []).map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }
  return (
    <input
      type={f.kind === "date" ? "date" : "text"}
      value={value}
      placeholder={f.placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default function AdminConsole({ docs }: Props) {
  const [activeId, setActive] = useState<string | null>(null);
  const [values, setValues] = useState<Values>({});
  const [link, setLink] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const doc = useMemo(() => docs.find((d) => d.id === activeId) ?? null, [docs, activeId]);
  const v = (activeId && values[activeId]) || {};

  function set(key: string, value: string) {
    if (!activeId) return;
    setValues((prev) => ({ ...prev, [activeId]: { ...(prev[activeId] ?? {}), [key]: value } }));
    // Any edit invalidates the link that was made from the old values.
    setLink(null);
    setCopied(false);
  }

  function choose(id: string) {
    setActive(id);
    setLink(null);
    setError("");
    setCopied(false);
  }

  async function generate() {
    if (!doc || busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: doc.id, values: v }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        path?: string;
        error?: string;
      };
      if (res.ok && data.ok && data.path) {
        setLink(new URL(data.path, window.location.origin).toString());
      } else {
        setError(data.error || "Could not make the link. Please try again.");
      }
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard access can be refused (an insecure origin, or a browser
      // setting). The link is on screen and selectable, so say so rather than
      // failing silently.
      setError("Could not copy automatically — select the link and copy it by hand.");
    }
  }

  async function signOut() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.reload();
  }

  return (
    <div className="pack-sheet">
      <Masthead
        tagline="lockup"
        aside={
          <button type="button" className="pack-btn-quiet" onClick={signOut}>
            Sign out
          </button>
        }
      />

      <DocBody>
        <Eyebrow>Private</Eyebrow>
        <DocTitle size={40}>SENSEI&rsquo;S DESK</DocTitle>
        <Rule />
        <Body size={14}>
          Pick a document, fill in the parts only you know, and you get a link to share. Nothing is saved
          on the website — the link itself carries what you typed, so keep a copy of any link you will
          need again.
        </Body>

        {/* ── Step 1: pick a document ── */}
        <Card mt={32} watermark="夢">
          <SectionTitle>1 · CHOOSE A DOCUMENT</SectionTitle>
          <Rule mb={22} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
            {docs.map((d) => {
              const on = d.id === activeId;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => choose(d.id)}
                  style={{
                    textAlign: "left",
                    cursor: "pointer",
                    borderRadius: 14,
                    padding: "20px 20px",
                    background: on ? "rgba(196,8,46,.14)" : "rgba(6,12,36,.34)",
                    border: `1px solid ${on ? "#C4082E" : "rgba(245,240,230,.10)"}`,
                    color: "#F5F0E6",
                    transition: "border-color .16s, background .16s",
                  }}
                >
                  <div style={{ font: `700 16px/1.3 ${FONT_BODY}`, color: "#F7F3EA" }}>{d.label}</div>
                  <div style={{ font: `400 12.5px/1.7 ${FONT_BODY}`, color: "#9BA5C6", marginTop: 8 }}>
                    {d.blurb}
                  </div>
                  {d.interactive && (
                    <div
                      style={{
                        font: `700 10px/1 ${FONT_BODY}`,
                        letterSpacing: ".16em",
                        textTransform: "uppercase",
                        color: "#D9A24B",
                        marginTop: 12,
                      }}
                    >
                      The student fills this one in
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* ── Step 2: fill in her parts ── */}
        {doc && (
          <Card mt={26}>
            <SectionTitle>2 · FILL IN YOUR PART</SectionTitle>
            <Rule mb={22} />
            <Body size={13.5}>
              {doc.interactive
                ? "Everything else on this form is filled in by the student. Anything you leave blank shows as [ ... ]."
                : "You fill in all of this — the student only reads the finished document. Anything you leave blank shows as [ ... ]."}
            </Body>

            {doc.groups.map((g) => (
              <div key={g.title} style={{ marginTop: 28 }}>
                <div
                  style={{
                    font: `700 11px/1 ${FONT_BODY}`,
                    letterSpacing: ".16em",
                    textTransform: "uppercase",
                    color: "#D9A24B",
                    marginBottom: g.note ? 10 : 18,
                  }}
                >
                  {g.title}
                </div>
                {g.note && (
                  <div
                    style={{ font: `400 12px/1.7 ${FONT_BODY}`, color: "#8F99BB", marginBottom: 18 }}
                  >
                    {g.note}
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  {g.fields.map((f) => (
                    <div key={f.key} style={f.half ? undefined : { gridColumn: "1 / -1" }}>
                      <Label>{f.label}</Label>
                      {inputFor(f, v[f.key] ?? "", (val) => set(f.key, val))}
                      {f.hint && <Hint>{f.hint}</Hint>}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
              <button type="button" className="pack-btn" onClick={generate} disabled={busy}>
                {busy ? "Making the link…" : "Generate link"}
              </button>
              <div style={{ font: `400 12.5px/1.7 ${FONT_BODY}`, color: "#8F99BB", flex: 1, minWidth: 220 }}>
                You can preview it before you send it — the link opens exactly what the student will see.
              </div>
            </div>

            {error && (
              <div
                role="alert"
                style={{ font: `600 13px/1.6 ${FONT_BODY}`, color: "#EFB3C1", marginTop: 16 }}
              >
                {error}
              </div>
            )}
          </Card>
        )}

        {/* ── Step 3: the link ── */}
        {link && (
          <Card mt={26}>
            <SectionTitle>3 · SHARE IT</SectionTitle>
            <Rule mb={22} />
            <div
              style={{
                borderRadius: 12,
                border: "1px solid rgba(217,162,75,.22)",
                background: "rgba(217,162,75,.07)",
                padding: "16px 18px",
                font: `400 13px/1.7 ui-monospace, SFMono-Regular, Menlo, monospace`,
                color: "#F5F0E6",
                wordBreak: "break-all",
                userSelect: "all",
              }}
            >
              {link}
            </div>

            <div style={{ marginTop: 20, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button type="button" className="pack-btn" onClick={copy}>
                {copied ? "Copied ✓" : "Copy link"}
              </button>
              <a className="pack-btn-quiet" href={link} target="_blank" rel="noopener noreferrer">
                Preview
              </a>
              <a
                className="pack-btn-quiet"
                href={`https://wa.me/?text=${encodeURIComponent(link)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Send on WhatsApp
              </a>
            </div>

            <div style={{ font: `400 12.5px/1.8 ${FONT_BODY}`, color: "#8F99BB", marginTop: 20 }}>
              Send the whole link — some chat apps cut long ones in half, and a half link will not open.
              {doc?.interactive
                ? " When the student submits the form, it arrives in your inbox with this form number on it."
                : " This link only shows the document. There is nothing for the student to submit."}
            </div>
          </Card>
        )}

        {!doc && (
          <div
            style={{
              font: `700 13px/1.6 ${FONT_DISPLAY}`,
              color: "#8F99BB",
              textAlign: "center",
              marginTop: 40,
              letterSpacing: ".02em",
            }}
          >
            CHOOSE A DOCUMENT ABOVE TO BEGIN
          </div>
        )}

        <DocFooter />
      </DocBody>
    </div>
  );
}
