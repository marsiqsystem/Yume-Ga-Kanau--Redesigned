import { BUSINESS } from "@/lib/business";
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
import { SENSEI_EMAIL, SITE, WHATSAPP } from "@/lib/seo";
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

/* The invoice: a request for payment, sent before the money arrives.

   It is the receipt's mirror image and deliberately looks like its sibling —
   same masthead, same itemised table, same seal — so a student who has had one
   recognises the other immediately. The differences are the ones that matter:
   it states what is still owed rather than what was received, it carries a due
   date, and it carries a UPI QR code for the exact amount due.

   That code is the point of the document. A student scanning it gets Sensei's
   UPI ID, the figure and the invoice number already filled in, so the two
   mistakes that cost the most time — paying the wrong amount, and a payment
   nobody can match to a student — cannot happen by typo.

   Everything is worked out from the lines: subtotal, discount, what has already
   been paid, and what is left. Sensei can override the total when the
   arithmetic is not what she means to charge, but she never has to add up. */

const SPEC = repeatSpec("invoice", "What is being charged");
const GRID = "2.4fr 1fr 1.4fr 1.1fr";

function Row({
  cells,
  head = false,
}: {
  cells: [string, string, string, string];
  head?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: GRID,
        gap: 10,
        padding: "14px 15px",
        borderTop: head ? "none" : "1px solid rgba(245,240,230,.10)",
        alignItems: "center",
      }}
    >
      {cells.map((c, i) => (
        <div
          key={i}
          style={{
            font: head ? `700 10.5px/1.4 ${FONT_BODY}` : `400 13.5px/1.5 ${FONT_BODY}`,
            letterSpacing: head ? ".16em" : undefined,
            textTransform: head ? "uppercase" : undefined,
            color: head ? "#9BA5C6" : "#F5F0E6",
            textAlign: i === 3 ? "right" : "left",
          }}
        >
          {c}
        </div>
      ))}
    </div>
  );
}

/* One line of the totals stack. `weight` marks the line that is the answer —
   the amount due — so the eye lands on it and not on the subtotal above it. */
function TotalLine({
  label,
  value,
  strong = false,
  muted = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 18,
        padding: strong ? "14px 0 0" : "7px 0",
        borderTop: strong ? "1px solid rgba(217,162,75,.34)" : undefined,
        marginTop: strong ? 10 : 0,
      }}
    >
      <div
        style={{
          font: strong ? `800 13px/1.4 ${FONT_BODY}` : `400 13px/1.4 ${FONT_BODY}`,
          letterSpacing: strong ? ".08em" : undefined,
          textTransform: strong ? "uppercase" : undefined,
          color: strong ? "#D9A24B" : muted ? "#8F99BB" : "#9BA5C6",
        }}
      >
        {label}
      </div>
      <div
        style={{
          font: strong ? `800 22px/1.2 ${FONT_BODY}` : `700 14px/1.4 ${FONT_BODY}`,
          color: strong ? "#F7F3EA" : muted ? "#9BA5C6" : "#F5F0E6",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ font: `400 13px/1.9 ${FONT_BODY}`, color: "#9BA5C6" }}>
      {label}: <span style={{ color: "#F5F0E6", fontWeight: 700 }}>{value}</span>
    </div>
  );
}

export default function Invoice({ v }: { v: DocValues }) {
  const items = repeatRows(v, SPEC);

  const rows: Array<[string, string, string, string]> = items.map((r) => [
    r.d || "—",
    r.l || "—",
    r.p || "—",
    r.a ? tidyAmount(r.a) : "—",
  ]);
  if (rows.length === 0) rows.push([BLANK, BLANK, BLANK, BLANK]);

  const summed = sumAmounts(items.map((r) => r.a));
  const subtotal = summed.counted > 0 ? summed.total : null;

  const discount = parseAmount(opt(v, "discount"));
  const override = parseAmount(opt(v, "totalOverride"));
  /* The override is the final figure, discount included — that is what it is
     for. Otherwise the total is the lines less any discount. */
  const total =
    override ?? (subtotal !== null ? subtotal - (discount ?? 0) : null);

  const paid = parseAmount(opt(v, "paidAlready"));
  const status = opt(v, "status");
  const settled = status === "Paid in full";

  /* What the QR asks for. A settled invoice asks for nothing; so does one where
     the arithmetic has already reached zero. */
  const dueRaw = total !== null ? total - (paid ?? 0) : null;
  const due = settled ? 0 : dueRaw;

  /* Marked paid, or the arithmetic has already reached zero. Both mean the same
     thing to a reader, so they are one condition rather than two. */
  const nothingDue = settled || (due !== null && due <= 0);

  /* The words describe the figure the document is about: what is still owed
     while something is, and what was charged once nothing is. "Zero rupees
     only" on a settled invoice is technically true and completely useless. */
  const words =
    opt(v, "amountWords") || amountInWords(nothingDue ? total : due) || BLANK;

  const hasReg = opt(v, "gstin") !== "" || opt(v, "regNo") !== "";
  const upiId = opt(v, "upiId");
  const invoiceNo = opt(v, "invoiceNo");

  return (
    <div className="pack-sheet">
      <Masthead
        tagline="lockup"
        aside={
          <>
            <div>
              <Label>Invoice no.</Label>
              <div className="pack-locked">{val(v, "invoiceNo")}</div>
            </div>
            <div>
              <Label>Date of issue</Label>
              <div className="pack-locked">{dateVal(v, "issueDate")}</div>
            </div>
          </>
        }
      />

      <DocBody>
        <Eyebrow>{nothingDue ? "Payment received" : "Request for payment"}</Eyebrow>
        <DocTitle>INVOICE</DocTitle>
        <Rule />
        <Body size={14}>
          {nothingDue
            ? "This invoice has been settled in full. It is kept here as a record of what was charged."
            : "This is what is due, what it is for, and how to pay it. Scan the code further down with any UPI app and the amount fills in by itself."}
        </Body>

        {/* Who to, and from whom */}
        <Card watermark="夢" mt={26}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
            <div>
              <Label mb={12}>From</Label>
              <div style={{ font: `700 15px/1.5 ${FONT_BODY}`, color: "#F7F3EA" }}>
                {BUSINESS.registeredName}
              </div>
              <div style={{ font: `400 13px/1.9 ${FONT_BODY}`, color: "#9BA5C6", marginTop: 4 }}>
                {SITE.legalName}
                <br />
                {BUSINESS.address}
                <br />
                {SENSEI_EMAIL}
                <br />
                WhatsApp {WHATSAPP.display}
              </div>
            </div>
            <div>
              <Label mb={12}>Billed to</Label>
              <div style={{ font: `700 15px/1.5 ${FONT_BODY}`, color: "#F7F3EA" }}>
                {val(v, "studentName")}
              </div>
              <div style={{ font: `400 13px/1.9 ${FONT_BODY}`, color: "#9BA5C6", marginTop: 4 }}>
                Batch: {val(v, "batch")}
                {opt(v, "email") && (
                  <>
                    <br />
                    {opt(v, "email")}
                  </>
                )}
                {opt(v, "phone") && (
                  <>
                    <br />
                    {opt(v, "phone")}
                  </>
                )}
                {opt(v, "billAddress") && (
                  <>
                    <br />
                    {opt(v, "billAddress")}
                  </>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 24 }}>
            <ReadOnly label="Payment due by" value={dateVal(v, "dueDate")} />
            <ReadOnly label="Status" value={status || (due !== null && due <= 0 ? "Paid in full" : "Unpaid")} />
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
          </div>

          {summed.skipped > 0 && (
            <div style={{ font: `400 12px/1.7 ${FONT_BODY}`, color: "#8F99BB", marginTop: 12 }}>
              {summed.skipped} line{summed.skipped === 1 ? " is" : "s are"} written in words rather than
              as a figure, so {summed.skipped === 1 ? "it is" : "they are"} not counted in the totals
              below.
            </div>
          )}

          {/* The totals stack sits to the right, the way an invoice is read. */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26, marginTop: 24 }}>
            <div>
              <Label>{nothingDue ? "Amount in words" : "Amount due, in words"}</Label>
              <div className="pack-locked">{words}</div>
            </div>
            <div>
              <TotalLine
                label="Subtotal"
                value={subtotal !== null ? formatAmount(subtotal) : BLANK}
              />
              {discount !== null && discount !== 0 && (
                <TotalLine
                  label={opt(v, "discountNote") ? `Discount — ${opt(v, "discountNote")}` : "Discount"}
                  value={`− ${formatAmount(Math.abs(discount))}`}
                  muted
                />
              )}
              <TotalLine
                label="Total payable"
                value={total !== null ? formatAmount(total) : BLANK}
              />
              {paid !== null && paid !== 0 && (
                <TotalLine
                  label={
                    opt(v, "paidAlreadyDate")
                      ? `Already paid — ${dateVal(v, "paidAlreadyDate")}`
                      : "Already paid"
                  }
                  value={`− ${formatAmount(Math.abs(paid))}`}
                  muted
                />
              )}
              <TotalLine
                label={nothingDue ? "Amount due" : "Amount due now"}
                value={due !== null ? formatAmount(due) : BLANK}
                strong
              />
            </div>
          </div>
        </Card>

        {/* Scan to pay — or, on a settled invoice, the stamp instead. A QR code
            asking for money on an invoice that has been paid is how a student
            pays twice. */}
        <Card mt={26} pad="34px 28px">
          {nothingDue ? (
            <div style={{ textAlign: "center" }}>
              <div className="pack-stamp">PAID IN FULL</div>
              <Body size={13.5} mt={20}>
                Nothing is outstanding on this invoice. Thank you.
              </Body>
            </div>
          ) : (
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center" }}
            >
              <div>
                <SectionTitle size={20}>SCAN TO PAY</SectionTitle>
                <Rule mb={18} />
                <Body size={13.5}>
                  Open any UPI app — GPay, PhonePe, Paytm, BHIM — point it at this code, and the payee and
                  the amount are already filled in. Please do not change the amount.
                </Body>
                <div style={{ marginTop: 18 }}>
                  <Detail label="UPI ID" value={upiId || BLANK} />
                  <Detail label="Account name" value={val(v, "accountName")} />
                  <Detail label="Account number" value={val(v, "accountNo")} />
                  <Detail label="IFSC" value={val(v, "ifsc")} />
                  <Detail label="Bank" value={val(v, "bankName")} />
                </div>
                <Body size={12.5} mt={14} color="#8F99BB">
                  {`Paying by bank transfer instead is fine — use the details above and quote ${
                    invoiceNo || "the invoice number"
                  } as the reference, so the payment can be matched to you.`}
                </Body>
              </div>
              <UpiQr
                amount={due !== null && due > 0 ? due : null}
                upiId={upiId || undefined}
                note={invoiceNo || "Course fee"}
                size={200}
              />
            </div>
          )}
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, marginTop: 26 }}>
          <Card mt={0} pad="30px 28px">
            <Label mb={12}>{opt(v, "terms") ? "A note from Sensei" : "Small print"}</Label>
            {opt(v, "terms") && (
              <Body size={13} mt={0}>
                {opt(v, "terms")}
              </Body>
            )}
            <Body size={12.5} mt={opt(v, "terms") ? 14 : 0}>
              Fees are non-refundable once a batch begins. A student facing unforeseen circumstances may
              request to pause enrolment or transfer to a future batch. No JLPT result is guaranteed. A
              receipt is issued once payment is received.
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
            <IssuedBy note="Invoices are issued digitally. The seal and typed name identify the issuer." />
          </Card>
        </div>

        <DocFooter />
      </DocBody>
    </div>
  );
}
