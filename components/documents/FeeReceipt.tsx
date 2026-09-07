import { BLANK, dateVal, opt, val, type DocValues } from "@/lib/documents";
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
} from "./DocParts";

/* The fee receipt. Everything on it is supplied by Sensei in the admin console
   and signed into the link, so this component only renders — there is nothing
   for a reader to fill in or submit.

   The amount appears in figures AND in words, which is the thing that makes a
   receipt hard to alter, and the optional blocks (outstanding balance, GSTIN)
   disappear entirely when she leaves them empty rather than printing an empty
   promise of a number she does not have. */

const CELL = `400 13.5px/1.5 ${FONT_BODY}`;

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
        gridTemplateColumns: "2.4fr 1fr 1.4fr 1.1fr",
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
                : CELL,
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
  /* Only rows that actually carry something are printed. An empty row on a
     receipt looks like a mistake, or like room to add one later. */
  const rows: Array<[string, string, string, string]> = [1, 2, 3]
    .map((n) => [opt(v, `d${n}`), opt(v, `l${n}`), opt(v, `p${n}`), opt(v, `a${n}`)] as const)
    .filter((r) => r.some((cell) => cell !== ""))
    .map((r) => [r[0] || "—", r[1] || "—", r[2] || "—", r[3] || "—"]);

  if (rows.length === 0) rows.push([BLANK, BLANK, BLANK, BLANK]);

  const method = opt(v, "payMethod");
  const methodText = method === "Other" ? `Other — ${opt(v, "payOther") || BLANK}` : method || BLANK;

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
            <Row strong cells={["Total received", "", "", val(v, "total")]} />
          </div>

          {/* Amount in words — the anti-tampering line */}
          <div style={{ marginTop: 22 }}>
            <Label>Amount in words</Label>
            <div className="pack-locked">{val(v, "amountWords")}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginTop: 22 }}>
            <ReadOnly label="Payment method" value={methodText} />
            <ReadOnly label="Transaction reference" value={val(v, "txnRef")} />
            <ReadOnly label="Payment date" value={dateVal(v, "payDate")} />
          </div>

          {hasBalance && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 22 }}>
              <ReadOnly label="Balance outstanding" value={val(v, "balance")} />
              <ReadOnly label="Due date for balance" value={dateVal(v, "balanceDue")} />
            </div>
          )}
        </Card>

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
