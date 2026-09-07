import { WHATSAPP, SENSEI_EMAIL } from "@/lib/seo";
import { BLANK, opt, repeatRows, repeatSpec, val, type DocValues } from "@/lib/documents";
import { tidyAmount } from "@/lib/money";
import {
  Body,
  Card,
  DocBody,
  DocFooter,
  DocTitle,
  Eyebrow,
  FONT_BODY,
  FONT_SERIF,
  Masthead,
  Rule,
  SectionTitle,
} from "./DocParts";
import UpiQr from "./UpiQr";

/* The fee structure sheet.

   The website deliberately publishes no prices, so this is where they live —
   which makes it the one persuasive document in the pack, and the design lets
   it carry more of the brand artwork than the others.

   The programme rows are Sensei's own: she names, prices, adds and deletes them
   in the console. Any fee she leaves blank stays blank and shows as [ ... ].
   That is deliberate on her side too — a blank cell reads as "ask me", and
   inventing a number here would be worse than showing nothing. */

const PROGRAMMES = repeatSpec("fees", "Programmes & fees");
const RATES = repeatSpec("fees", "1-on-1 coaching");

const INCLUDED = [
  "Live online classes in small batches",
  "PDF handouts for every lesson",
  "Custom kanji workbooks",
  "Vocabulary lists and practice tests",
  "Questions answered between classes in the batch WhatsApp group",
  "Teaching in English and Hindi",
] as const;

const GRID = "1fr .7fr 1fr 1.5fr 1.2fr";

/* Sheets issued before the rows became editable carried one fixed key per
   stage. Those links are in students' chat histories and must keep opening as
   the sheet they were, so an old-shaped link is read back into the new rows
   rather than rendering as an empty table. */
const LEGACY = [
  { pst: "Stage 1", plv: "N5", dur: "durN5", fee: "feeN5", pfm: "Small batch, live online" },
  { pst: "Stage 2", plv: "N4", dur: "durN4", fee: "feeN4", pfm: "Small batch, live online" },
  { pst: "Stage 3", plv: "N3", dur: "durN3", fee: "feeN3", pfm: "Small batch, live online" },
  { pst: "Stage 4", plv: "N2", dur: "durN2", fee: "feeN2", pfm: "Small batch, live online" },
  { pst: "Kaiwa", plv: "Any", dur: "durKaiwa", fee: "feeKaiwa", pfm: "Conversational Japanese" },
  { pst: "Business", plv: "Any", dur: "durBiz", fee: "feeBiz", pfm: "Business Japanese" },
] as const;

function legacyProgrammes(v: DocValues): DocValues[] {
  return LEGACY.map((r) => ({
    pst: r.pst,
    plv: r.plv,
    pdu: opt(v, r.dur),
    pfm: r.pfm,
    pfe: opt(v, r.fee),
  }));
}

function legacyRates(v: DocValues): DocValues[] {
  return [
    { ru: "Per hour", rd: "Private, scheduled with you", rf: opt(v, "fee1v1Hour") },
    { ru: "Per module", rd: "Private, scheduled with you", rf: opt(v, "fee1v1Module") },
  ];
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 10, font: `400 13.5px/1.7 ${FONT_BODY}`, color: "#C3CAE4" }}>
      <span style={{ color: "#D9A24B", fontWeight: 800 }} aria-hidden="true">
        ·
      </span>
      <span>{children}</span>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ font: `400 13.5px/2 ${FONT_BODY}`, color: "#9BA5C6" }}>
      {label}: <span style={{ color: "#F5F0E6", fontWeight: 700 }}>{value}</span>
    </div>
  );
}

/* A cell that shows a blank marker rather than collapsing, because a gap in a
   priced table reads as a missing row rather than as "ask me". */
function cell(value: string): string {
  return value || BLANK;
}

export default function FeeStructure({ v }: { v: DocValues }) {
  const typed = repeatRows(v, PROGRAMMES);
  const programmes = typed.length > 0 ? typed : legacyProgrammes(v);

  const typedRates = repeatRows(v, RATES);
  const rates =
    typedRates.length > 0
      ? typedRates
      : opt(v, "fee1v1Hour") || opt(v, "fee1v1Module")
        ? legacyRates(v)
        : [];

  /* Older sheets had a single "Bank / account name" box. Whichever of the two
     an old link carries is shown as the account name, so nothing that was
     already sent loses a line. */
  const accountName = opt(v, "accountName") || opt(v, "bankName");

  return (
    <div className="pack-sheet">
      {/* This sheet's masthead carries the large crest as a watermark — the one
          document the design allows extra artwork on. */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/documents/emblem-large.png"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            right: -60,
            top: -80,
            width: 340,
            opacity: 0.07,
            pointerEvents: "none",
          }}
        />
        <Masthead />
      </div>

      <DocBody>
        <Eyebrow>Programmes &amp; fees</Eyebrow>
        <DocTitle>FEE STRUCTURE</DocTitle>
        <Rule />
        <Body size={14}>
          Four stages take a complete beginner to{" "}
          <span style={{ fontFamily: FONT_SERIF, fontWeight: 700, color: "#F7F3EA" }}>N2</span>. Every
          stage is taught live and online by Parveen Kaur Sensei in small batches, with optional 1-on-1
          coaching.
        </Body>

        <Card watermark="語" mt={30} pad="32px 28px">
          <div
            style={{
              borderRadius: 14,
              border: "1px solid rgba(245,240,230,.10)",
              background: "rgba(6,12,36,.34)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: GRID,
                alignItems: "center",
                padding: "14px 15px",
                font: `700 10.5px/1.4 ${FONT_BODY}`,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "#9BA5C6",
              }}
            >
              <div>Stage</div>
              <div>Level</div>
              <div>Duration</div>
              <div>Format</div>
              <div style={{ textAlign: "right" }}>Fee</div>
            </div>

            {programmes.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: GRID,
                  alignItems: "center",
                  borderTop: "1px solid rgba(245,240,230,.08)",
                  padding: "14px 15px",
                  font: `400 13.5px/1.5 ${FONT_BODY}`,
                  color: "#C3CAE4",
                }}
              >
                <div style={{ font: `700 14px/1.3 ${FONT_BODY}`, color: "#F5F0E6" }}>{cell(r.pst)}</div>
                <div style={{ font: `700 18px/1 ${FONT_SERIF}`, color: "#E2103C" }}>{r.plv}</div>
                <div>{cell(r.pdu)}</div>
                <div>{r.pfm}</div>
                <div style={{ textAlign: "right", font: `800 14px/1.3 ${FONT_BODY}`, color: "#F7F3EA" }}>
                  {r.pfe ? tidyAmount(r.pfe) : BLANK}
                </div>
              </div>
            ))}

            {/* 1-on-1 sits in its own band: the design separates it, and its
                fees genuinely differ from group fees. */}
            {rates.map((r, i) => (
              <div
                key={`rate-${i}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: GRID,
                  alignItems: "center",
                  borderTop: `1px solid rgba(245,240,230,${i === 0 ? ".18" : ".08"})`,
                  background: "rgba(217,162,75,.07)",
                  padding: "14px 15px",
                  font: `400 13.5px/1.5 ${FONT_BODY}`,
                  color: "#C3CAE4",
                }}
              >
                <div style={{ font: `700 14px/1.3 ${FONT_BODY}`, color: "#F5F0E6" }}>1-on-1 coaching</div>
                <div style={{ font: `600 13px/1.3 ${FONT_BODY}`, color: "#D9A24B" }}>{cell(r.ru)}</div>
                <div style={{ gridColumn: "span 2" }}>{cell(r.rd)}</div>
                <div style={{ textAlign: "right", font: `800 14px/1.3 ${FONT_BODY}`, color: "#F7F3EA" }}>
                  {r.rf ? tidyAmount(r.rf) : BLANK}
                </div>
              </div>
            ))}
          </div>

          <div style={{ font: `400 12px/1.7 ${FONT_BODY}`, color: "#8F99BB", marginTop: 14 }}>
            Blank fee cells are deliberate. Current fees are confirmed in writing before enrolment. 1-on-1
            fees differ from group fees.
          </div>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 26 }}>
          <Card mt={0} pad="30px 28px">
            <SectionTitle size={20}>FREE TRIAL CLASS</SectionTitle>
            <Rule mb={18} />
            <Body>
              A free trial class is offered before enrolment. No payment, no commitment — sit in, ask
              questions, and decide afterwards.
            </Body>
          </Card>
          <Card mt={0} pad="30px 28px">
            <SectionTitle size={20}>MATERIALS INCLUDED</SectionTitle>
            <Rule mb={18} />
            <Body>
              All study materials are included: PDF handouts, custom kanji workbooks, vocabulary lists and
              practice tests. No separate textbook purchase is required.
            </Body>
          </Card>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
          <Card mt={0} pad="30px 28px">
            <SectionTitle size={20}>WHAT&rsquo;S INCLUDED</SectionTitle>
            <Rule mb={18} />
            <div style={{ display: "grid", gap: 8 }}>
              {INCLUDED.map((i) => (
                <Bullet key={i}>{i}</Bullet>
              ))}
            </div>
          </Card>
          <Card mt={0} pad="30px 28px">
            <SectionTitle size={20}>HOW TO PAY</SectionTitle>
            <Rule mb={18} />
            <Detail label="UPI ID" value={val(v, "upiId")} />
            <Detail label="Account name" value={accountName || BLANK} />
            <Detail label="Account number" value={val(v, "accountNo")} />
            <Detail label="IFSC" value={val(v, "ifsc")} />
            <Detail label="Bank" value={val(v, "bankName")} />
            <div style={{ font: `400 12px/1.7 ${FONT_BODY}`, color: "#8F99BB", marginTop: 14 }}>
              Send the payment screenshot on WhatsApp to receive your receipt. Fees are non-refundable once
              a batch begins; a pause or transfer may be requested in case of unforeseen circumstances.
            </div>
          </Card>
        </div>

        {/* No amount on this one: the sheet quotes several fees and the reader
            has not chosen yet, so the code opens their UPI app on the right ID
            and lets them type the figure they were quoted. */}
        <Card mt={24} pad="30px 28px">
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 28, alignItems: "center" }}>
            <div>
              <SectionTitle size={20}>PAY BY UPI</SectionTitle>
              <Rule mb={18} />
              <Body>
                Scan with any UPI app — GPay, PhonePe, Paytm, BHIM — and enter the fee for the stage you
                are joining. Send the screenshot on WhatsApp and your receipt follows.
              </Body>
            </div>
            <UpiQr amount={null} upiId={opt(v, "upiId") || undefined} note="Course fee" size={160} compact />
          </div>
        </Card>

        <div style={{ textAlign: "center", marginTop: 34 }}>
          <a className="pack-btn" style={{ display: "inline-block" }} href={WHATSAPP.href}>
            Book a free trial class
          </a>
          <div style={{ font: `400 12.5px/1.8 ${FONT_BODY}`, color: "#9BA5C6", marginTop: 14 }}>
            WhatsApp {WHATSAPP.display} · {SENSEI_EMAIL} · @yumegakanau_institute
          </div>
        </div>

        <DocFooter />
      </DocBody>
    </div>
  );
}
