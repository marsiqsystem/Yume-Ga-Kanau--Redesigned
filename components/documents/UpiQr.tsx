import { PAYMENT } from "@/lib/business";
import { formatRupees } from "@/lib/money";
import { qrModules, qrPath, upiUri } from "@/lib/upi";
import { FONT_BODY } from "./DocParts";

/* The scan-to-pay block.

   One rule overrides the house style here: the code sits on white. Every other
   panel in the pack is dark glass, but a phone camera needs dark modules on a
   light ground to lock on, and a QR that looks on-brand and does not scan is
   worth nothing. It is set in a rounded white card with a gold hairline so it
   still reads as part of the sheet rather than something pasted onto it.

   The amount is drawn as text beneath the code as well as encoded inside it —
   a payer should be able to see what they are about to send before they scan,
   not only after. */

export default function UpiQr({
  amount,
  note,
  upiId,
  size = 190,
  compact = false,
}: {
  /* Null renders a QR with no amount in it: the payer's app opens with the ID
     filled and the figure left to them. */
  amount: number | null;
  note?: string;
  /* Overrides the institute's UPI ID — a document may carry a one-off. The
     code and the ID printed under it always come from the same value, so a
     reader can check one against the other. */
  upiId?: string;
  size?: number;
  compact?: boolean;
}) {
  const payee = upiId || PAYMENT.upiId;
  const uri = upiUri({ pa: payee, amount, note });
  const grid = qrModules(uri);
  const n = grid.length;
  /* One module of quiet zone on each side is the minimum a decoder needs; four
     is the specification. Four is used — the card is white anyway, so the
     margin costs nothing but a little size. */
  const quiet = 4;
  const span = n + quiet * 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 14,
          padding: 12,
          border: "1px solid rgba(217,162,75,.55)",
          boxShadow: "0 10px 30px rgba(0,3,16,.38)",
          lineHeight: 0,
          flex: "none",
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${span} ${span}`}
          role="img"
          aria-label={
            amount != null && amount > 0
              ? `UPI payment code for ${formatRupees(amount)} to ${payee}`
              : `UPI payment code for ${payee}`
          }
          shapeRendering="crispEdges"
        >
          <rect width={span} height={span} fill="#FFFFFF" />
          <g transform={`translate(${quiet},${quiet})`}>
            <path d={qrPath(grid)} fill="#0A1130" />
          </g>
        </svg>
      </div>

      <div style={{ textAlign: "center" }}>
        {amount != null && amount > 0 && (
          <div style={{ font: `800 17px/1.2 ${FONT_BODY}`, color: "#F7F3EA" }}>
            {formatRupees(amount)}
          </div>
        )}
        <div
          style={{
            font: `700 11px/1.5 ${FONT_BODY}`,
            letterSpacing: ".1em",
            color: "#D9A24B",
            marginTop: amount != null && amount > 0 ? 6 : 0,
            wordBreak: "break-all",
          }}
        >
          {payee}
        </div>
        {!compact && (
          <div style={{ font: `400 11.5px/1.7 ${FONT_BODY}`, color: "#8F99BB", marginTop: 8 }}>
            {amount != null && amount > 0
              ? "Scan with any UPI app — GPay, PhonePe, Paytm, BHIM. The amount fills in by itself; please do not change it."
              : "Scan with any UPI app and enter the amount you were quoted."}
          </div>
        )}
      </div>

      {/* On a phone the sheet is being read on the same device that holds the
          UPI app, so there is no second camera to scan with. The link opens the
          app directly. It does nothing on a desktop, so it is quiet, not a
          primary button, and never replaces the code. */}
      <a className="pack-btn-quiet pack-noprint" href={uri} style={{ textDecoration: "none" }}>
        Open in a UPI app
      </a>
    </div>
  );
}
