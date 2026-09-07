import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { docById, keysFor, limitsFor } from "@/lib/documents";
import { SESSION_COOKIE, sessionValid, sign, signingConfigured } from "@/lib/sign";

/* Turns what Sensei typed into a shareable link.

   The values are whitelisted against lib/documents before signing, so the link
   can only ever carry fields that document actually has — a tampered request
   from the console cannot smuggle extra keys into a signed payload that the
   renderer might one day trust. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const jar = await cookies();
  if (!sessionValid(jar.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: "Please sign in again." }, { status: 401 });
  }
  if (!signingConfigured()) {
    return NextResponse.json({ ok: false, error: "Link signing is not set up." }, { status: 503 });
  }

  let body: { type?: unknown; values?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const doc = typeof body.type === "string" ? docById(body.type) : undefined;
  if (!doc) return NextResponse.json({ ok: false, error: "Unknown document." }, { status: 400 });

  const raw = (body.values ?? {}) as Record<string, unknown>;
  const limits = limitsFor(doc);
  const values: Record<string, string> = {};
  for (const key of keysFor(doc)) {
    const v = raw[key];
    if (typeof v !== "string") continue;
    const trimmed = v.trim().slice(0, limits[key]);
    // Empty values are left out entirely so they render as [ ... ] and, just as
    // usefully, so the signed payload stays small enough for a tidy URL.
    if (trimmed) values[key] = trimmed;
  }

  const token = sign({ t: doc.id, v: values });
  return NextResponse.json({ ok: true, path: `/d/${doc.id}/${token}` });
}
