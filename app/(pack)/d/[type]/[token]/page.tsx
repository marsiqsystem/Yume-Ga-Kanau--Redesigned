import type { Metadata } from "next";
import { SENSEI_EMAIL, WHATSAPP } from "@/lib/seo";
import { docById, type DocValues } from "@/lib/documents";
import { unsign } from "@/lib/sign";
import AdmissionForm from "@/components/documents/AdmissionForm";
import ConfirmationLetter from "@/components/documents/ConfirmationLetter";
import FeeReceipt from "@/components/documents/FeeReceipt";
import FeeStructure from "@/components/documents/FeeStructure";
import Invoice from "@/components/documents/Invoice";
import WelcomePack from "@/components/documents/WelcomePack";
import { DocBody, DocFooter, DocTitle, Eyebrow, Masthead, Rule, Body, Card } from "@/components/documents/DocParts";

/* A generated document link: /d/<type>/<signed token>.

   Everything the page needs is inside the token — there is no database to look
   the link up in. unsign() returns null for anything this server did not issue,
   so a tampered or truncated link lands on the "not valid" panel rather than a
   half-rendered document.

   Node runtime, because verifying the signature uses node:crypto. force-dynamic
   because the content comes from the URL and must never be cached as a static
   shell — two students' links are two different documents. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ type: string; token: string }> };

type Payload = { t?: string; v?: DocValues };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { type } = await params;
  const doc = docById(type);
  return {
    title: doc ? `${doc.title} | Yume Ga Kanau™` : "Document | Yume Ga Kanau™",
    robots: { index: false, follow: false },
  };
}

/* Shown when a link cannot be trusted. Deliberately vague about why — telling
   whoever is holding it which part failed is free information — but it always
   gives a way to reach a human, because the likeliest cause by far is an
   innocent one: a link truncated by a chat app, or one issued before the
   signing secret was rotated. */
function NotValid({ reason }: { reason: string }) {
  return (
    <div className="pack-sheet">
      <Masthead tagline="lockup" />
      <DocBody>
        <Eyebrow>Link problem</Eyebrow>
        <DocTitle size={40}>THIS LINK DOES NOT OPEN</DocTitle>
        <Rule />
        <Card mt={26}>
          <Body size={14}>{reason}</Body>
          <Body size={14} mt={16}>
            Ask Parveen Kaur Sensei for a fresh link — WhatsApp{" "}
            <strong style={{ color: "#F7F3EA" }}>{WHATSAPP.display}</strong> or email{" "}
            <strong style={{ color: "#F7F3EA" }}>{SENSEI_EMAIL}</strong>. Copying the whole address,
            including everything after the last slash, usually fixes it: some chat apps cut long links in
            half.
          </Body>
        </Card>
        <DocFooter />
      </DocBody>
    </div>
  );
}

export default async function DocumentPage({ params }: Params) {
  const { type, token } = await params;

  const doc = docById(type);
  if (!doc) return <NotValid reason="That address does not match any document." />;

  const payload = unsign<Payload>(token);
  if (!payload) {
    return (
      <NotValid reason="This link is incomplete or is no longer valid, so the document behind it cannot be shown." />
    );
  }

  /* The type is in the path for readability and in the signed payload for
     truth. If they disagree the link has been hand-edited, so it is refused. */
  if (payload.t !== type) return <NotValid reason="This link does not match the document it points to." />;

  const v: DocValues = payload.v && typeof payload.v === "object" ? payload.v : {};

  switch (type) {
    case "admission":
      return <AdmissionForm office={v} token={token} />;
    case "invoice":
      return <Invoice v={v} />;
    case "receipt":
      return <FeeReceipt v={v} />;
    case "fees":
      return <FeeStructure v={v} />;
    case "confirmation":
      return <ConfirmationLetter v={v} />;
    case "welcome":
      return <WelcomePack v={v} />;
    default:
      return <NotValid reason="That address does not match any document." />;
  }
}
