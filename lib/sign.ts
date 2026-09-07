import crypto from "node:crypto";
import zlib from "node:zlib";

/* Signed, self-contained document links.

   There is no database. Everything Sensei types into the admin console is
   packed into the link itself: deflated, base64url-encoded, and stamped with an
   HMAC so the values cannot be edited by whoever holds the link. A student who
   changes one character in the URL gets "link not valid" rather than a document
   with a different fee on it.

   The trade-off, chosen deliberately: links never expire on their own and there
   is no server-side list of what was issued. Rotating FORM_SIGNING_SECRET is
   what invalidates every link at once.

   Node-only (node:crypto, node:zlib), so every route that imports this must run
   on the Node runtime, not the Edge. */

const SEP = ".";

/* The signing key. A dedicated secret is preferred so that changing the admin
   password does not silently break every link Sensei has already shared; if it
   is not set we fall back to ADMIN_TOKEN so the feature still works with one
   variable configured. */
function secret(): string | null {
  return process.env.FORM_SIGNING_SECRET || process.env.ADMIN_TOKEN || null;
}

export function signingConfigured() {
  return secret() !== null;
}

function b64url(buf: Buffer) {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string) {
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

function hmac(data: string, key: string) {
  return b64url(crypto.createHmac("sha256", key).update(data).digest());
}

/* Compares two strings without leaking, through timing, how much of a guess was
   correct. timingSafeEqual throws on a length mismatch, so lengths are checked
   first and a false is returned rather than an exception. */
export function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/* Packs a payload into a URL-safe token.

   Deflate runs before base64 because the payloads are JSON with repeated key
   names, which compresses well — it keeps a fully filled fee-structure link
   comfortably inside the length any browser or WhatsApp preview will handle. */
export function sign(payload: unknown): string {
  const key = secret();
  if (!key) throw new Error("FORM_SIGNING_SECRET / ADMIN_TOKEN is not set");
  const data = b64url(zlib.deflateRawSync(Buffer.from(JSON.stringify(payload), "utf8")));
  return `${data}${SEP}${hmac(data, key)}`;
}

/* Reverses sign(). Returns null for anything that is not a token this server
   issued: wrong shape, edited payload, wrong secret, or corrupt compression.
   Callers treat null as "this link is not valid" — they never distinguish the
   reasons, since telling an attacker which part failed is free information. */
export function unsign<T = unknown>(token: string): T | null {
  const key = secret();
  if (!key) return null;

  const cut = token.lastIndexOf(SEP);
  if (cut < 1) return null;

  const data = token.slice(0, cut);
  const mac = token.slice(cut + 1);
  if (!safeEqual(mac, hmac(data, key))) return null;

  try {
    return JSON.parse(zlib.inflateRawSync(fromB64url(data)).toString("utf8")) as T;
  } catch {
    return null;
  }
}

/* ── Admin session ──────────────────────────────────────────────────────────
   The login cookie is not the password. It is a signed "this browser logged in,
   and the session expires at <time>" note, so the password itself is never
   stored in the browser and a stolen cookie stops working on its own. */

const SESSION_DAYS = 30;
export const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60;
export const SESSION_COOKIE = "ygk_admin";

export function issueSession(): string {
  return sign({ s: "admin", exp: Date.now() + SESSION_MAX_AGE * 1000 });
}

export function sessionValid(cookie: string | undefined): boolean {
  if (!cookie) return false;
  const claim = unsign<{ s?: string; exp?: number }>(cookie);
  return !!claim && claim.s === "admin" && typeof claim.exp === "number" && claim.exp > Date.now();
}

/* Checks a typed password against ADMIN_TOKEN. Returns false when the variable
   is unset, so a misconfigured deployment locks the console rather than
   opening it to everyone. */
export function passwordValid(input: string): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  return safeEqual(input, expected);
}
