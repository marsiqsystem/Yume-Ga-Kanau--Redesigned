"use client";

import { useCallback, useMemo, useState } from "react";
import type { DocDef, Field, FieldGroup, RepeatSpec } from "@/lib/documents";
import { rowKey } from "@/lib/documents";
import { formatRupees, sumAmounts } from "@/lib/money";
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

   Three steps, in order: pick a document, fill in the parts only she knows, get
   a link. Everything is driven off the definitions in lib/documents, so this
   component never needs editing when a field is added.

   The values are held per document, not globally — switching from the receipt
   to the fee sheet and back does not lose what was already typed, which matters
   when she is working through a batch of students in one sitting.

   Groups come in two shapes. A plain group is a fixed list of boxes. A
   repeating group is a list of rows she controls: every one has a Remove
   button, and there is an Add button underneath. No document assumes a fixed
   number of lines any more — she decides how many there are. */

type Props = { docs: DocDef[] };

type Values = Record<string, Record<string, string>>;
/* How many rows of each repeating group are on screen, per document, keyed by
   the group's title. */
type Counts = Record<string, Record<string, number>>;

/* The values a document starts with the first time it is opened: the seeds on
   its fixed fields, and the seed rows of its repeating groups. The bank details
   and the list of stages are already typed for her; she edits rather than
   retypes, and everything seeded is an ordinary value she can clear. */
function seedFor(doc: DocDef): Record<string, string> {
  const out: Record<string, string> = {};
  for (const g of doc.groups) {
    for (const f of g.fields ?? []) if (f.seed) out[f.key] = f.seed;
    if (g.repeat?.seed) {
      g.repeat.seed.forEach((row, i) => {
        for (const [col, value] of Object.entries(row)) out[rowKey(col, i + 1)] = value;
      });
    }
  }
  return out;
}

function startingCounts(doc: DocDef): Record<string, number> {
  const out: Record<string, number> = {};
  for (const g of doc.groups) {
    if (g.repeat) out[g.title] = Math.max(g.repeat.min, g.repeat.start);
  }
  return out;
}

function inputFor(f: Field, id: string, value: string, onChange: (v: string) => void) {
  if (f.kind === "select") {
    return (
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Choose…</option>
        {(f.options ?? []).map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }

  if (f.kind === "textarea") {
    return (
      <textarea
        id={id}
        value={value}
        placeholder={f.placeholder}
        maxLength={f.maxLen}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  /* A combo is a plain text box with a list of suggestions attached. The batch
     codes use it: Sensei's note says every batch gets its own code, so the list
     has to suggest without restricting — a <select> would make a code she has
     not used before impossible to enter. */
  if (f.kind === "combo") {
    const listId = `${id}-list`;
    return (
      <>
        <input
          id={id}
          type="text"
          list={listId}
          value={value}
          placeholder={f.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        <datalist id={listId}>
          {(f.options ?? []).map((o) => (
            <option key={o} value={o} />
          ))}
        </datalist>
      </>
    );
  }

  return (
    <input
      id={id}
      type={f.kind === "date" ? "date" : "text"}
      value={value}
      placeholder={f.placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/* One cell: its label, its box, and its hint. Used by both kinds of group, so a
   cell of a table and a standalone field look and behave identically. */
function Cell({
  f,
  id,
  value,
  onChange,
  showHint = true,
}: {
  f: Field;
  id: string;
  value: string;
  onChange: (v: string) => void;
  showHint?: boolean;
}) {
  return (
    <div>
      <Label>
        <label htmlFor={id}>{f.label}</label>
      </Label>
      {inputFor(f, id, value, onChange)}
      {showHint && f.hint && <Hint>{f.hint}</Hint>}
    </div>
  );
}

function GroupHeading({ g }: { g: FieldGroup }) {
  return (
    <>
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
        <div style={{ font: `400 12px/1.7 ${FONT_BODY}`, color: "#8F99BB", marginBottom: 18 }}>
          {g.note}
        </div>
      )}
    </>
  );
}

/* A repeating group: rows Sensei adds and removes.

   Removing a row closes the gap rather than blanking it — the values below
   shift up one. That keeps "Line 2" meaning the second line of the finished
   document, which is what she is looking at when she decides to delete one. */
function RepeatGroup({
  spec,
  count,
  get,
  setMany,
  setCount,
  idBase,
}: {
  spec: RepeatSpec;
  count: number;
  get: (key: string) => string;
  setMany: (patch: Record<string, string>) => void;
  setCount: (n: number) => void;
  idBase: string;
}) {
  const canRemove = count > spec.min;
  const canAdd = count < spec.max;

  function removeRow(row: number) {
    if (!canRemove) return;
    const patch: Record<string, string> = {};
    for (let n = row; n < count; n += 1) {
      for (const c of spec.columns) patch[rowKey(c.key, n)] = get(rowKey(c.key, n + 1));
    }
    for (const c of spec.columns) patch[rowKey(c.key, count)] = "";
    setMany(patch);
    setCount(count - 1);
  }

  /* A running total is only worth showing when a row has exactly one money
     column — with two it is not obvious which one is being added up, and a
     total that adds up the wrong column is worse than no total at all. */
  const moneyCols = spec.columns.filter((c) => c.kind === "money");
  const running =
    moneyCols.length === 1
      ? sumAmounts(Array.from({ length: count }, (_, i) => get(rowKey(moneyCols[0].key, i + 1))))
      : null;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
        <div key={n} className="pack-row">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                font: `700 10.5px/1 ${FONT_BODY}`,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "#9BA5C6",
              }}
            >
              {spec.rowNoun} {n}
            </div>
            <button
              type="button"
              className="pack-row-remove"
              onClick={() => removeRow(n)}
              disabled={!canRemove}
              title={canRemove ? `Remove ${spec.rowNoun} ${n}` : `At least one ${spec.rowNoun} is needed`}
            >
              Remove
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: spec.grid ?? `repeat(${spec.columns.length},1fr)`,
              gap: 14,
              alignItems: "start",
            }}
          >
            {spec.columns.map((c) => {
              const key = rowKey(c.key, n);
              return (
                <Cell
                  key={c.key}
                  f={c}
                  id={`${idBase}-${key}`}
                  value={get(key)}
                  onChange={(value) => setMany({ [key]: value })}
                  /* A hint repeated on every row is noise; it appears on the
                     first one only. */
                  showHint={n === 1}
                />
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginTop: 2 }}>
        <button
          type="button"
          className="pack-row-add"
          onClick={() => canAdd && setCount(count + 1)}
          disabled={!canAdd}
        >
          + Add a {spec.rowNoun}
        </button>
        <div style={{ font: `400 12px/1.6 ${FONT_BODY}`, color: "#8F99BB" }}>
          {canAdd
            ? `${count} ${spec.rowNoun}${count === 1 ? "" : "s"} · up to ${spec.max}`
            : `That is the most (${spec.max}) this document can hold.`}
        </div>
        {running && running.counted > 0 && (
          <div style={{ font: `800 13px/1.6 ${FONT_BODY}`, color: "#D9A24B", marginLeft: "auto" }}>
            Adds up to {formatRupees(running.total)}
            {running.skipped > 0 && (
              <span style={{ font: `400 12px/1.6 ${FONT_BODY}`, color: "#8F99BB" }}>
                {" "}
                ({running.skipped} not a number, left out)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminConsole({ docs }: Props) {
  const [activeId, setActive] = useState<string | null>(null);
  const [values, setValues] = useState<Values>({});
  const [counts, setCounts] = useState<Counts>({});
  const [link, setLink] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const doc = useMemo(() => docs.find((d) => d.id === activeId) ?? null, [docs, activeId]);
  const v = (activeId && values[activeId]) || {};
  const c = (activeId && counts[activeId]) || {};

  /* Any edit invalidates the link made from the old values — a stale link next
     to changed boxes is how the wrong fee gets sent. */
  const invalidate = useCallback(() => {
    setLink(null);
    setCopied(false);
  }, []);

  const setMany = useCallback(
    (patch: Record<string, string>) => {
      if (!activeId) return;
      setValues((prev) => ({ ...prev, [activeId]: { ...(prev[activeId] ?? {}), ...patch } }));
      invalidate();
    },
    [activeId, invalidate],
  );

  const setCount = useCallback(
    (group: string, n: number) => {
      if (!activeId) return;
      setCounts((prev) => ({ ...prev, [activeId]: { ...(prev[activeId] ?? {}), [group]: n } }));
      invalidate();
    },
    [activeId, invalidate],
  );

  function choose(id: string) {
    setActive(id);
    setError("");
    invalidate();
    const chosen = docs.find((d) => d.id === id);
    if (!chosen) return;
    /* Seeded once, on first open. Coming back to a document she has already
       started shows what she typed, not the seeds again. */
    setValues((prev) => (prev[id] ? prev : { ...prev, [id]: seedFor(chosen) }));
    setCounts((prev) => (prev[id] ? prev : { ...prev, [id]: startingCounts(chosen) }));
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
                <GroupHeading g={g} />

                {g.repeat ? (
                  <RepeatGroup
                    spec={g.repeat}
                    count={c[g.title] ?? Math.max(g.repeat.min, g.repeat.start)}
                    get={(key) => v[key] ?? ""}
                    setMany={setMany}
                    setCount={(n) => setCount(g.title, n)}
                    idBase={doc.id}
                  />
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                    {(g.fields ?? []).map((f) => (
                      <div key={f.key} style={f.half ? undefined : { gridColumn: "1 / -1" }}>
                        <Cell
                          f={f}
                          id={`${doc.id}-${f.key}`}
                          value={v[f.key] ?? ""}
                          onChange={(value) => setMany({ [f.key]: value })}
                        />
                      </div>
                    ))}
                  </div>
                )}
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
