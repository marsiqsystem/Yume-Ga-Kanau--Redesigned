import { SENSEI_EMAIL, WHATSAPP } from "@/lib/seo";
import { dateVal, val, type DocValues } from "@/lib/documents";
import {
  Body,
  Card,
  DocBody,
  DocFooter,
  DocTitle,
  Eyebrow,
  FONT_BODY,
  FONT_SERIF,
  Label,
  Masthead,
  Rule,
  Seal,
  SectionTitle,
} from "./DocParts";

/* The batch welcome / joining pack, handed to every student on day one.

   Almost all of it is fixed policy text, which is the point — the refund, pause
   and transfer, and group-to-1-on-1 rules are worded identically here and on the
   admission form, so a student can never find two versions of the same rule.
   Only three things change per batch: the batch code, the start date, and the
   platform classes run on. */

const MATERIALS = [
  "PDF handouts",
  "Custom kanji workbooks",
  "Vocabulary lists",
  "Practice tests",
] as const;

const STUDY = [
  {
    n: "15",
    unit: "Minutes daily",
    text: "Review the last lesson’s vocabulary list out loud. Reading it silently is not the same thing.",
  },
  {
    n: "10",
    unit: "Minutes of kanji",
    text: "Write, don’t just look. Use the workbook page for the current lesson and keep the stroke order.",
  },
  {
    n: "1",
    unit: "Handout per week",
    text: "Finish the week’s handout before the next class and bring one question from it.",
  },
] as const;

const POLICIES = [
  { title: "Refunds", text: "Fees are non-refundable once a batch has begun." },
  {
    title: "Pause and transfer",
    text: "A student facing unforeseen circumstances may request to pause their enrolment or transfer to a future batch. Ask me as early as you can.",
  },
  {
    title: "Moving from a group to 1-on-1",
    text: "Switching depends on slot availability. Finish your current level with your group; you may move to 1-on-1 at the next level. 1-on-1 fees differ from group fees.",
  },
  {
    title: "Exam results",
    text: "The institute prepares you for the JLPT but guarantees no result, and is not affiliated with the Japan Foundation or JEES, who administer the examination.",
  },
] as const;

function Rule2({ children, lead }: { children: React.ReactNode; lead: string }) {
  return (
    <div style={{ font: `400 13.5px/1.85 ${FONT_BODY}`, color: "#C3CAE4" }}>
      <strong style={{ color: "#F7F3EA" }}>{lead}</strong> {children}
    </div>
  );
}

export default function WelcomePack({ v }: { v: DocValues }) {
  return (
    <div className="pack-sheet">
      <Masthead
        aside={
          <>
            <div>
              <Label>Batch</Label>
              <div className="pack-locked">{val(v, "batch")}</div>
            </div>
            <div>
              <Label>Start date</Label>
              <div className="pack-locked">{dateVal(v, "startDate")}</div>
            </div>
          </>
        }
      />

      <DocBody>
        <Eyebrow>Joining pack</Eyebrow>
        <DocTitle size={44}>WELCOME TO YOUR BATCH</DocTitle>
        <Rule />
        <Body size={14}>
          Welcome to Yume Ga Kanau. From today you are part of a small group, not a lecture hall, and I
          will know your name and your weak points by the end of the first month. I teach every class
          myself and answer every question myself. Come regularly, do a little between lessons, and tell me
          when something is not clear — that last part matters more than most students expect.
        </Body>

        <Card watermark="夢" mt={30}>
          <SectionTitle>HOW CLASSES RUN</SectionTitle>
          <Rule mb={22} />
          <div style={{ display: "grid", gap: 14 }}>
            <Rule2 lead="Platform.">Classes are live and online on {val(v, "platform")}.</Rule2>
            <Rule2 lead="Joining links.">
              Shared in the official batch WhatsApp group before each class. They are not posted anywhere
              else.
            </Rule2>
            <Rule2 lead="Punctuality.">
              Join two or three minutes early. We start on time; latecomers miss the warm-up, which is
              where most of the speaking happens.
            </Rule2>
            <Rule2 lead="Camera and microphone.">
              Camera on where your connection allows — speaking practice needs faces. Microphone muted
              until you speak.
            </Rule2>
            <Rule2 lead="If you miss a class.">
              Tell me in the group beforehand if you can. Handouts and any recording arrangement for that
              lesson are shared in the group, and you may ask your questions about it in the next class.
            </Rule2>
          </div>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 26 }}>
          <Card mt={0} pad="30px 28px">
            <SectionTitle size={20}>WHERE YOUR MATERIALS COME FROM</SectionTitle>
            <Rule mb={18} />
            <Body>
              Everything comes from one place: the{" "}
              <strong style={{ color: "#F7F3EA" }}>official batch WhatsApp group</strong>. Nothing needs to
              be bought separately.
            </Body>
            <div style={{ display: "grid", gap: 8, marginTop: 16 }}>
              {MATERIALS.map((m) => (
                <div
                  key={m}
                  style={{ display: "flex", gap: 10, font: `400 13.5px/1.7 ${FONT_BODY}`, color: "#C3CAE4" }}
                >
                  <span style={{ color: "#D9A24B", fontWeight: 800 }} aria-hidden="true">
                    ·
                  </span>
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card mt={0} pad="30px 28px">
            <SectionTitle size={20}>ASKING QUESTIONS</SectionTitle>
            <Rule mb={18} />
            <Body>
              Post your question in the batch group — a photo of your notebook is often the fastest way to
              show me what went wrong. If it is personal, message me directly on WhatsApp at{" "}
              <strong style={{ color: "#F7F3EA" }}>{WHATSAPP.display}</strong> or email{" "}
              <strong style={{ color: "#F7F3EA" }}>{SENSEI_EMAIL}</strong>. Questions that come up often
              are answered again at the start of the next class, so nobody has to ask twice.
            </Body>
          </Card>
        </div>

        <Card mt={26}>
          <SectionTitle>HOW TO STUDY BETWEEN LESSONS</SectionTitle>
          <Rule mb={20} />
          <Body>
            Short and daily beats long and occasional. These are minimums, not targets — on a bad day, do
            the fifteen minutes anyway.
          </Body>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 22 }}>
            {STUDY.map((s) => (
              <div
                key={s.unit}
                style={{
                  borderRadius: 14,
                  border: "1px solid rgba(245,240,230,.10)",
                  background: "rgba(6,12,36,.34)",
                  padding: "24px 22px",
                }}
              >
                <div style={{ font: `700 40px/1 ${FONT_SERIF}`, color: "#E2103C" }}>{s.n}</div>
                <div
                  style={{
                    font: `700 10.5px/1.4 ${FONT_BODY}`,
                    letterSpacing: ".16em",
                    textTransform: "uppercase",
                    color: "#9BA5C6",
                    margin: "12px 0 10px",
                  }}
                >
                  {s.unit}
                </div>
                <div style={{ font: `400 13px/1.7 ${FONT_BODY}`, color: "#C3CAE4" }}>{s.text}</div>
              </div>
            ))}
          </div>
          <Body mt={20}>
            Speak whenever you get the chance, even to yourself. Ten sentences said badly teach you more
            than a page read perfectly.
          </Body>
        </Card>

        <Card mt={26}>
          <SectionTitle>POLICIES</SectionTitle>
          <Rule mb={22} />
          <div style={{ display: "grid", gap: 18 }}>
            {POLICIES.map((p) => (
              <div
                key={p.title}
                style={{
                  borderLeft: "2px solid rgba(217,162,75,.42)",
                  paddingLeft: 18,
                }}
              >
                <div style={{ font: `700 14px/1.4 ${FONT_BODY}`, color: "#F7F3EA", marginBottom: 6 }}>
                  {p.title}
                </div>
                <div style={{ font: `400 13.5px/1.8 ${FONT_BODY}`, color: "#C3CAE4" }}>{p.text}</div>
              </div>
            ))}
          </div>
        </Card>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginTop: 30,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 240, font: `400 13.5px/1.85 ${FONT_BODY}`, color: "#C3CAE4" }}>
            Keep this pack. Everything in it is the answer to a question students ask me in their first
            month.
            <br />
            <span style={{ color: "#9BA5C6", fontWeight: 700 }}>— Parveen Kaur Sensei</span>
          </div>
          <Seal size={60} />
        </div>

        <DocFooter />
      </DocBody>
    </div>
  );
}
