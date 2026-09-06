"use client";

import { useState } from "react";
import { SENSEI_EMAIL } from "@/lib/seo";

/* The trial-class request form.

   In the original build this was two pieces fighting each other: the runtime
   rendered the card and its button only flipped a "thank you" panel, so a
   listener on `document` had to intercept the click in the capture phase to
   actually send anything. Here the form owns its own state, so there is one
   code path and the panel cannot show unless delivery succeeded.

   Delivery is our own /api/contact route, which mails Sensei directly over
   Gmail SMTP - no third-party form service ever holds an enquiry. The
   credentials live only on the server; nothing secret reaches the browser. */

const LEVELS = [
  "Complete beginner",
  "Stage 1 · Around N5",
  "Stage 2 · Around N4",
  "Stage 3 · Around N3",
  "Stage 4 · Around N2",
  "Not sure — Help me decide",
];

const GOALS = [
  "JLPT preparation",
  "Conversational fluency",
  "1-on-1 personalised coaching",
  "Business Japanese conversation (N3 level required)",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Status = { msg: string; ok: boolean } | null;

export default function TrialForm() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [bad, setBad] = useState<{ name?: boolean; email?: boolean }>({});

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const data = new FormData(ev.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const name = get("name");
    const email = get("email");

    setBad({});
    if (!name) {
      setBad({ name: true });
      setStatus({ msg: "Please add your name so Sensei knows who is writing.", ok: false });
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setBad({ email: true });
      setStatus({
        msg: "That email does not look right — Sensei replies to this address.",
        ok: false,
      });
      return;
    }
    if (get("company")) return; // honeypot tripped: drop the bot without a word

    setBusy(true);
    setStatus({ msg: "Sending…", ok: true });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          level: get("level"),
          goal: get("goal"),
          notes: get("notes"),
          company: get("company"),
        }),
      });
      const body = await res.json().catch(() => ({ ok: false }));
      if (res.ok && body.ok) {
        setSent(true);
        setStatus(null);
      } else {
        setStatus({
          msg: body.error || `That did not go through. Please email ${SENSEI_EMAIL} directly.`,
          ok: false,
        });
      }
    } catch {
      setStatus({
        msg: `That did not go through — please check your connection, or email ${SENSEI_EMAIL} directly.`,
        ok: false,
      });
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="cb-sent">
        <div className="ja">ありがとう</div>
        <h2 className="cb-h2">
          Your request <em>is in.</em>
        </h2>
        <p>
          Sensei will reply personally, usually within one working day, with available trial
          slots for your timezone.
        </p>
        <button
          type="button"
          className="cb-again"
          onClick={() => {
            setSent(false);
            setStatus(null);
          }}
        >
          Send another
        </button>
        <span className="cb-kanji" aria-hidden="true">
          謝
        </span>
      </div>
    );
  }

  const badBorder = { borderColor: "rgba(233,80,106,.85)" };

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="cb-eye">Request a trial class</div>
      <h2 className="cb-h2">
        Tell sensei <em>where you are</em>
      </h2>
      <div className="cb-rule"></div>

      <div className="cb-row">
        <div className="cb-f">
          <label className="cb-lab" htmlFor="cb-name">
            Your name
          </label>
          <input
            id="cb-name"
            className="cb-in"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="e.g. Aiko Sharma"
            style={bad.name ? badBorder : undefined}
          />
        </div>
        <div className="cb-f">
          <label className="cb-lab" htmlFor="cb-email">
            Email
          </label>
          <input
            id="cb-email"
            className="cb-in"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            style={bad.email ? badBorder : undefined}
          />
        </div>
      </div>

      <div className="cb-row">
        <div className="cb-f">
          <label className="cb-lab" htmlFor="cb-level">
            Current level
          </label>
          <select id="cb-level" className="cb-in" name="level" defaultValue={LEVELS[0]}>
            {LEVELS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
        <div className="cb-f">
          <label className="cb-lab" htmlFor="cb-goal">
            What you want
          </label>
          <select id="cb-goal" className="cb-in" name="goal" defaultValue={GOALS[0]}>
            {GOALS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="cb-f">
        <label className="cb-lab" htmlFor="cb-notes">
          Anything else?
        </label>
        <textarea
          id="cb-notes"
          className="cb-in"
          name="notes"
          placeholder="Your timezone, preferred class timings, exam date, or what you find hardest right now."
        ></textarea>
      </div>

      {/* Honeypot: invisible to people, irresistible to bots. */}
      <input
        className="cb-hp"
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <button type="submit" className={`cb-send${busy ? " is-busy" : ""}`} disabled={busy}>
        Send to sensei <span>&rarr;</span>
      </button>

      <p className={`cb-status${status?.ok ? " is-ok" : ""}`} role="alert" hidden={!status}>
        {status?.msg ?? ""}
      </p>
      <p className="cb-note">
        No spam, no automated funnels. Your details go straight to Parveen Sensei.
      </p>
      <span className="cb-kanji" aria-hidden="true">
        始
      </span>
    </form>
  );
}
