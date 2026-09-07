import { cookies } from "next/headers";
import { DOCS } from "@/lib/documents";
import { SESSION_COOKIE, sessionValid, signingConfigured } from "@/lib/sign";
import AdminConsole from "./AdminConsole";
import SignIn from "./SignIn";

/* The admin console at /admin.

   The gate is here, on the server, not in the browser: an unauthenticated
   request never receives the console's markup at all, so there is nothing to
   reveal by reading the page source. The generate route checks the same cookie
   again, because a page that renders is not an authorisation.

   Node runtime for node:crypto; force-dynamic because the answer depends on a
   cookie and must never be cached. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const configured = signingConfigured();
  const jar = await cookies();
  const signedIn = configured && sessionValid(jar.get(SESSION_COOKIE)?.value);

  if (!signedIn) return <SignIn configured={configured} />;

  /* DOCS is `as const`, which the client component does not need — it only
     reads. Passed through JSON as plain data. */
  return <AdminConsole docs={JSON.parse(JSON.stringify(DOCS))} />;
}
