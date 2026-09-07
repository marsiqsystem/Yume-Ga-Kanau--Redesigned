"use client";

import { useState } from "react";
import {
  Body,
  Card,
  DocBody,
  DocFooter,
  DocTitle,
  Eyebrow,
  FONT_BODY,
  Label,
  Masthead,
  Rule,
} from "@/components/documents/DocParts";

/* The access-token gate.

   One field, because there is one person and one token. It is a password input
   so it does not sit in plain sight on a shared screen, and the token itself is
   never stored in the browser — a successful sign-in returns an httpOnly
   session cookie instead. */
export default function SignIn({ configured }: { configured: boolean }) {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "checking">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim() || status === "checking") return;
    setStatus("checking");
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        // A full reload, not a router push: the page's own server component is
        // what reads the new cookie and decides to render the console.
        window.location.reload();
        return;
      }
      setStatus("idle");
      setError(data.error || "That access token is not right.");
    } catch {
      setStatus("idle");
      setError("Could not reach the server. Check your connection and try again.");
    }
  }

  return (
    <div className="pack-sheet" style={{ maxWidth: 620 }}>
      <Masthead tagline="lockup" />
      <DocBody>
        <Eyebrow>Private</Eyebrow>
        <DocTitle size={38}>SENSEI&rsquo;S DESK</DocTitle>
        <Rule />

        {!configured ? (
          <Card mt={24}>
            <Body size={14}>
              This console is not switched on for this deployment yet. Someone needs to set{" "}
              <strong style={{ color: "#F7F3EA" }}>ADMIN_TOKEN</strong> (and ideally{" "}
              <strong style={{ color: "#F7F3EA" }}>FORM_SIGNING_SECRET</strong>) in the Vercel project
              settings, then redeploy.
            </Body>
          </Card>
        ) : (
          <Card mt={24}>
            <Body size={14}>
              Enter your access token to make and share admission forms, receipts, fee sheets, confirmation
              letters and welcome packs.
            </Body>
            <form onSubmit={submit} style={{ marginTop: 24 }}>
              <Label>Access token</Label>
              <input
                type="password"
                value={token}
                autoFocus
                autoComplete="current-password"
                placeholder="Paste your access token"
                onChange={(e) => setToken(e.target.value)}
              />
              {error && (
                <div
                  role="alert"
                  style={{ font: `600 13px/1.6 ${FONT_BODY}`, color: "#EFB3C1", marginTop: 14 }}
                >
                  {error}
                </div>
              )}
              <div style={{ marginTop: 22 }}>
                <button type="submit" className="pack-btn" disabled={!token.trim() || status === "checking"}>
                  {status === "checking" ? "Checking…" : "Sign in"}
                </button>
              </div>
            </form>
            <div style={{ font: `400 12px/1.7 ${FONT_BODY}`, color: "#8F99BB", marginTop: 20 }}>
              You stay signed in on this device for 30 days. If you ever think someone else has the token,
              change ADMIN_TOKEN in the Vercel settings — that signs everyone out at once.
            </div>
          </Card>
        )}

        <DocFooter />
      </DocBody>
    </div>
  );
}
