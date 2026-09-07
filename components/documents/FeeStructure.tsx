import { WHATSAPP, SENSEI_EMAIL } from "@/lib/seo";
import { val, type DocValues } from "@/lib/documents";
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

/* The fee structure sheet.

   The website deliberately publishes no prices, so this is where they live —
   which makes it the one persuasive document in the pack, and the design lets it
   carry more of the brand artwork than the others.

   Any fee Sensei leaves blank stays blank and shows as [ ... ]. That is
   deliberate on her side too: a blank cell reads as "ask me", and inventing a
   number here would be worse than showing nothing. */

const ROWS = [
  { stage: "Stage 1", level: "N5", dur: "durN5", fee: "feeN5", fmt: "Small batch, live online" },
  { stage: "Stage 2", level: "N4", dur: "durN4", fee: "feeN4", fmt: "Small batch, live online" },
  { stage: "Stage 3", level: "N3", dur: "durN3", fee: "feeN3", fmt: "Small batch, live online" },
  { stage: "Stage 4", level: "N2", dur: "durN2", fee: "feeN2", fmt: "Small batch, live online" },
  { stage: "Kaiwa", level: "Any", dur: "durKaiwa", fee: "feeKaiwa", fmt: "Conversational Japanese" },
  { stage: "Business", level: "Any", dur: "durBiz", fee: "feeBiz", fmt: "Business Japanese" },
] as const;

const INCLUDED = [
  "Live online classes in small batches",
  "PDF handouts for every lesson",
  "Custom kanji workbooks",
  "Vocabulary lists and practice tests",
  "Questions answered between classes in the batch WhatsApp group",
  "Teaching in English and Hindi",
] as const;

const GRID = "1fr .7fr 1fr 1.5fr 1.2fr";

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

export default function FeeStructure({ v }: { v: DocValues }) {
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

            {ROWS.map((r) => (
              <div
                key={r.stage + r.level}
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
                <div style={{ font: `700 14px/1.3 ${FONT_BODY}`, color: "#F5F0E6" }}>{r.stage}</div>
                <div style={{ font: `700 18px/1 ${FONT_SERIF}`, color: "#E2103C" }}>{r.level}</div>
                <div>{val(v, r.dur)}</div>
                <div>{r.fmt}</div>
                <div style={{ textAlign: "right", font: `800 14px/1.3 ${FONT_BODY}`, color: "#F7F3EA" }}>
                  {val(v, r.fee)}
                </div>
              </div>
            ))}

            {/* 1-on-1 sits in its own group: the design separates it, and its
                fees genuinely differ from group fees. */}
            {[
              { unit: "Per hour", key: "fee1v1Hour" },
              { unit: "Per module", key: "fee1v1Module" },
            ].map((r) => (
              <div
                key={r.key}
                style={{
                  display: "grid",
                  gridTemplateColumns: GRID,
                  alignItems: "center",
                  borderTop: "1px solid rgba(245,240,230,.18)",
                  background: "rgba(217,162,75,.07)",
                  padding: "14px 15px",
                  font: `400 13.5px/1.5 ${FONT_BODY}`,
                  color: "#C3CAE4",
                }}
              >
                <div style={{ font: `700 14px/1.3 ${FONT_BODY}`, color: "#F5F0E6" }}>1-on-1 coaching</div>
                <div style={{ font: `600 13px/1.3 ${FONT_BODY}`, color: "#D9A24B" }}>{r.unit}</div>
                <div style={{ gridColumn: "span 2" }}>Private, scheduled with you</div>
                <div style={{ textAlign: "right", font: `800 14px/1.3 ${FONT_BODY}`, color: "#F7F3EA" }}>
                  {val(v, r.key)}
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
            <Detail label="Bank / account name" value={val(v, "bankName")} />
            <Detail label="Account number" value={val(v, "accountNo")} />
            <Detail label="IFSC" value={val(v, "ifsc")} />
            <div style={{ font: `400 12px/1.7 ${FONT_BODY}`, color: "#8F99BB", marginTop: 14 }}>
              Send the payment screenshot on WhatsApp to receive your receipt. Fees are non-refundable once
              a batch begins; a pause or transfer may be requested in case of unforeseen circumstances.
            </div>
          </Card>
        </div>

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
