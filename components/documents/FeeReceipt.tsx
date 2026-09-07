import {
  BLANK,
  dateVal,
  opt,
  repeatRows,
  repeatSpec,
  val,
  type DocValues,
} from "@/lib/documents";
import { amountInWords, formatAmount, parseAmount, sumAmounts, tidyAmount } from "@/lib/money";
import {
  Body,
  Card,
  DocBody,
  DocFooter,
  DocTitle,
  Eyebrow,
  FONT_BODY,
  IssuedBy,
  Label,
  Masthead,
  ReadOnly,
  Rule,
  SectionTitle,
} from "./DocParts";
import UpiQr from "./UpiQr";

/* The fee receipt. Everything on it is supplied by Sensei in the admin console
   and signed into the link, so this component only renders — there is nothing
   for a reader to fill in or submit.

   The lines are however many she added, not a fixed three. The total and the
   amount in words are worked out from those lines unless she overrode them, so
   the figure and the words cannot disagree — that disagreement is exactly the
   failure a hand-totalled receipt is prone to, and the reason the words are on
   it at all.

   The optional blocks — outstanding balance, GSTIN — disappear entirely when
   she leaves them empty, rather than printing an empty promise of a number she
   does not have. */

const SPEC = repeatSpec("receipt", "What was paid for");
const GRID = "2.4fr 1fr 1.4fr 1.1fr";

function Row({
  cells,
  head = false,
  strong = false,
}: {
  cells: [string, string, string, string];
  head?: boolean;
  strong?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: GRID,
        gap: 10,
        padding: "14px 15px",
        borderTop: head ? "none" : "1px solid rgba(245,240,230,.10)",
        background: strong ? "rgba(217,162,75,.07)" : undefined,
        alignItems: "center",
      }}
    >
      {cells.map((c, i) => (
        <div
          key={i}
          style={{
            font: head
              ? `700 10.5px/1.4 ${FONT_BODY}`
              : strong
                ? `800 14px/1.4 ${FONT_BODY}`
                : `400 13.5px/1.5 ${FONT_BODY}`,
            letterSpacing: head ? ".16em" : undefined,
            textTransform: head ? "uppercase" : undefined,
            color: head ? "#9BA5C6" : strong ? "#F7F3EA" : "#F5F0E6",
            textAlign: i === 3 ? "right" : "left",
          }}
        >
          {c}
        </div>
      ))}
    </div>
  );
}

export default function FeeReceipt({ v }: { v: DocValues }) {
  /* Only lines that actually carry something are printed, however many she
     added. An empty line on a receipt looks like a mistake, or like room to add
     one later. */
  const items = repeatRows(v, SPEC);

  const rows: Array<[string, string, string, string]> = items.map((r) => [
    r.d || "—",
    r.l || "—",
    r.p || "—",
    r.a ? tidyAmount(r.a) : "—",
  ]);
  if (rows.length === 0) rows.push([BLANK, BLANK, BLANK, BLANK]);

  /* The total is the sum of the lines unless Sensei typed one over it. A line
     whose amount is not a number ("as agreed") cannot be added up, so it is
     counted as skipped and the receipt says so, rather than showing a total
     that is quietly short. */
  const summed = sumAmounts(items.map((r) => r.a));
  const override = parseAmount(opt(v, "total"));
  const totalNumber = override ?? (summed.counted > 0 ? summed.total : null);
  const totalText =
    totalNumber !== null ? formatAmount(totalNumber) : opt(v, "total") || BLANK;

  const words = opt(v, "amountWords") || amountInWords(totalNumber) || BLANK;

  const method = opt(v, "payMethod");
  const methodText = method === "Other" ? `Other — ${opt(v, "payOther") || BLANK}` : method || BLANK;

  const balanceNumber = parseAmount(opt(v, "balance"));
  const hasBalance = opt(v, "balance") !== "" || opt(v, "balanceDue") !== "";
  const hasReg = opt(v, "gstin") !== "" || opt(v, "regNo") !== "";

  return (
    <div className="pack-sheet">
      <Masthead
        tagline="lockup"
        aside={
          <>
            <div>
              <Label>Receipt no.</Label>
              <div className="pack-locked">{val(v, "receiptNo")}</div>
            </div>
            <div>
              <Label>Date of issue</Label>
              <div className="pack-locked">{dateVal(v, "issueDate")}</div>
            </div>
          </>
        }
      />

      <DocBody>
        <Eyebrow>Fee payment</Eyebrow>
        <DocTitle>RECEIPT</DocTitle>
        <Rule />

        <Card watermark="夢" mt={26}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <ReadOnly label="Received with thanks from" value={val(v, "studentName")} />
            <ReadOnly label="Batch" value={val(v, "batch")} />
          </div>

          {/* Itemised table */}
          <div
            style={{
              marginTop: 26,
              borderRadius: 14,
              border: "1px solid rgba(245,240,230,.10)",
              background: "rgba(6,12,36,.34)",
              overflow: "hidden",
            }}
          >
            <Row head cells={["Description", "Level / stage", "Period covered", "Amount"]} />
            {rows.map((r, i) => (
              <Row key={i} cells={r} />
            ))}
            <Row strong cells={["Total received", "", "", totalText]} />
          </div>

          {summed.skipped > 0 && (
            <div style={{ font: `400 12px/1.7 ${FONT_BODY}`, color: "#8F99BB", marginTop: 12 }}>
              {summed.skipped} line{summed.skipped === 1 ? " is" : "s are"} written in words rather than
              as a figure, so {summed.skipped === 1 ? "it is" : "they are"} not counted in the total
              above.
            </div>
          )}

          {/* Amount in words — the anti-tampering line */}
          <div style={{ marginTop: 22 }}>
            <Label>Amount in words</Label>
            <div className="pack-locked">{words}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginTop: 22 }}>
            <ReadOnly label="Payment method" value={methodText} />
            <ReadOnly label="Transaction reference" value={val(v, "txnRef")} />
            <ReadOnly label="Payment date" value={dateVal(v, "payDate")} />
          </div>

          {hasBalance && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 22 }}>
              <ReadOnly
                label="Balance outstanding"
                value={balanceNumber !== null ? formatAmount(balanceNumber) : val(v, "balance")}
              />
              <ReadOnly label="Due date for balance" value={dateVal(v, "balanceDue")} />
            </div>
          )}
        </Card>

        {/* A receipt with something still owed is also a request for the rest of
            it. The code carries that exact figure, so the student cannot pay the
            wrong amount by mistyping it. */}
        {balanceNumber !== null && balanceNumber > 0 && (
          <Card mt={26} pad="32px 28px">
            <SectionTitle size={20}>STILL TO PAY</SectionTitle>
            <Rule mb={20} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 28, alignItems: "center" }}>
              <div>
                {/* Built as one string rather than as JSX text with an
                    expression in the middle of it: JSX keeps the line breaks as
                    spaces, which puts a gap in front of the comma. */}
                <Body size={13.5}>
                  {`${formatAmount(balanceNumber)} is still outstanding on this enrolment${
                    opt(v, "balanceDue") ? `, due by ${dateVal(v, "balanceDue")}` : ""
                  }. Scan the code with any UPI app to settle it — the amount is already inside the code, so there is nothing to type.`}
                </Body>
                <Body size={12.5} mt={14} color="#8F99BB">
                  Paying by bank transfer instead? Ask for the account details on WhatsApp, and send the
                  screenshot once it is done.
                </Body>
              </div>
              <UpiQr
                amount={balanceNumber}
                note={opt(v, "receiptNo") ? `Balance ${opt(v, "receiptNo")}` : "Fee balance"}
                size={170}
                compact
              />
            </div>
          </Card>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, marginTop: 26 }}>
          <Card mt={0} pad="30px 28px">
            <Label mb={12}>Small print</Label>
            <Body size={12.5}>
              Fees are non-refundable once a batch begins. A student facing unforeseen circumstances may
              request to pause enrolment or transfer to a future batch. No JLPT result is guaranteed.
            </Body>
            {hasReg && (
              <div
                style={{
                  marginTop: 18,
                  paddingTop: 14,
                  borderTop: "1px solid rgba(245,240,230,.10)",
                  font: `400 12.5px/1.7 ${FONT_BODY}`,
                  color: "#9BA5C6",
                }}
              >
                {opt(v, "gstin") && (
                  <>
                    GSTIN: <span style={{ color: "#F5F0E6" }}>{opt(v, "gstin")}</span>
                    <br />
                  </>
                )}
                {opt(v, "regNo") && (
                  <>
                    Business registration no.:{" "}
                    <span style={{ color: "#F5F0E6" }}>{opt(v, "regNo")}</span>
                  </>
                )}
              </div>
            )}
          </Card>

          <Card mt={0} pad="30px 28px">
            <IssuedBy note="Receipts are issued digitally. The seal and typed name identify the issuer." />
          </Card>
        </div>

        <DocFooter />
      </DocBody>
    </div>
  );
}
