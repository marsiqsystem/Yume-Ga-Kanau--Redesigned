import { SENSEI_EMAIL, WHATSAPP } from "@/lib/seo";
import { dateVal, val, type DocValues } from "@/lib/documents";
import {
  Card,
  DocBody,
  DocFooter,
  DocTitle,
  Eyebrow,
  FONT_BODY,
  FONT_JA,
  IssuedBy,
  Label,
  Masthead,
  Rule,
} from "./DocParts";

/* The enrolment confirmation letter.

   Letterhead style, and warm rather than transactional — the brief is explicit
   that this must read as something Sensei wrote, not a system notice. The
   student's details are read back to them so they can catch a wrong spelling or
   a wrong time zone before the first class rather than after it. */

function DetailRow({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div style={wide ? { gridColumn: "1 / -1" } : undefined}>
      <Label mb={7}>{label}</Label>
      <div style={{ font: `700 15px/1.5 ${FONT_BODY}`, color: "#F7F3EA" }}>{value}</div>
    </div>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ font: `400 14px/1.85 ${FONT_BODY}`, color: "#C3CAE4", marginTop: 16 }}>{children}</div>
  );
}

export default function ConfirmationLetter({ v }: { v: DocValues }) {
  const name = val(v, "studentName");

  return (
    <div className="pack-sheet">
      <Masthead
        tagline="none"
        aside={
          <div style={{ font: `400 12px/1.9 ${FONT_BODY}`, color: "#9BA5C6", textAlign: "right" }}>
            yumegakanau.in
            <br />
            {SENSEI_EMAIL}
            <br />
            WhatsApp {WHATSAPP.display}
          </div>
        }
      />

      <DocBody>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <Eyebrow>Confirmation</Eyebrow>
            <DocTitle size={42}>YOU&rsquo;RE ENROLLED</DocTitle>
            <Rule mb={0} />
          </div>
          <div style={{ font: `400 12.5px/1.9 ${FONT_BODY}`, color: "#9BA5C6", textAlign: "right" }}>
            Date: <span style={{ color: "#F5F0E6" }}>{dateVal(v, "letterDate")}</span>
            <br />
            Reference: <span style={{ color: "#F5F0E6" }}>{val(v, "reference")}</span>
          </div>
        </div>

        <Card watermark="夢" mt={30}>
          <div style={{ font: `700 17px/1.5 ${FONT_BODY}`, color: "#F7F3EA" }}>Dear {name},</div>
          <Para>
            Welcome. I am glad to confirm your place in my class at{" "}
            <strong style={{ color: "#F7F3EA" }}>Yume Ga Kanau</strong>, and I am looking forward to
            teaching you.
          </Para>
          <Para>Here are your details. Please check them and tell me straight away if anything is wrong.</Para>

          <div
            style={{
              marginTop: 24,
              borderRadius: 14,
              border: "1px solid rgba(217,162,75,.22)",
              background: "rgba(217,162,75,.07)",
              padding: "26px 24px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
          >
            <DetailRow label="Student name" value={name} />
            <DetailRow label="Stage joined" value={val(v, "stageJoined")} />
            <DetailRow label="Batch code" value={val(v, "batchCode")} />
            <DetailRow label="Start date" value={dateVal(v, "startDate")} />
            <DetailRow wide label="Class days & times — in your time zone" value={val(v, "classDaysTimes")} />
          </div>

          <Para>
            <strong style={{ color: "#F7F3EA" }}>What happens next.</strong> Before your first class I will
            add you to the official batch WhatsApp group. Your joining link is shared there, along with
            every handout, kanji workbook, vocabulary list and practice test. Come to the first class with
            something to write with; there is no textbook to buy.
          </Para>
          <Para>
            If you have a question between classes, send it in the group or message me directly — I answer
            every one myself.
          </Para>
          <Para>
            I teach in small batches so that no one becomes a face in a crowd. Take the classes seriously,
            study a little every day, and the rest follows.
          </Para>
          <Para>
            <span style={{ fontFamily: FONT_JA, color: "#F5F0E6" }}>日本語を一緒に楽しみましょう。</span>
            <span style={{ color: "#9BA5C6" }}> Let&rsquo;s enjoy Japanese together.</span>
          </Para>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 26 }}>
          <Card mt={0} pad="30px 28px">
            <IssuedBy />
          </Card>
          <Card mt={0} pad="30px 28px">
            <Label mb={16}>Direct contact</Label>
            <div style={{ font: `400 13.5px/2.1 ${FONT_BODY}`, color: "#C3CAE4" }}>
              WhatsApp {WHATSAPP.display}
              <br />
              {SENSEI_EMAIL}
              <br />
              @yumegakanau_institute
              <br />
              yumegakanau.in
            </div>
          </Card>
        </div>

        <DocFooter />
      </DocBody>
    </div>
  );
}
