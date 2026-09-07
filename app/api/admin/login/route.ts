import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  issueSession,
  passwordValid,
  signingConfigured,
} from "@/lib/sign";

/* Admin sign-in and sign-out.

   One shared access token, held in ADMIN_TOKEN, because there is exactly one
   person who uses the console. What comes back is not the token but a signed,
   expiring session cookie — httpOnly, so page scripts cannot read it, and
   sameSite=lax, so another site cannot make a logged-in request on her behalf. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Guessing has to be slow enough to be pointless. There is no shared store on
   serverless to count attempts in, so every failure simply costs a fixed
   half-second — which is nothing to a person typing a password once, and turns
   an online brute-force attempt into something that would take longer than the
   universe against a long random token. Generate ADMIN_TOKEN accordingly; the
   .env.example says how. */
const FAIL_DELAY_MS = 500;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function POST(req: Request) {
  if (!signingConfigured()) {
    console.error("[admin] ADMIN_TOKEN is not set — the console cannot be opened");
    return NextResponse.json(
      { ok: false, error: "The admin console is not set up yet on this deployment." },
      { status: 503 },
    );
  }

  let body: { token?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const supplied = typeof body.token === "string" ? body.token : "";

  if (!passwordValid(supplied)) {
    await sleep(FAIL_DELAY_MS);
    return NextResponse.json({ ok: false, error: "That access token is not right." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, issueSession(), {
    httpOnly: true,
    sameSite: "lax",
    // Secure in production; omitted locally so the cookie still sets over http.
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}

/* Sign out. Clearing the cookie is enough — the session is not recorded
   anywhere on the server, so there is nothing else to revoke. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
