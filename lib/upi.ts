import qrcode from "qrcode-generator";
import { PAYMENT } from "./business";
import { upiAmount } from "./money";

/* UPI payment links and the QR code that carries them.

   Scanning the QR on an invoice opens the payer's UPI app with Sensei's ID, the
   exact amount and the invoice number already filled in — they confirm and pay.
   That is the whole feature: the student never retypes an amount, so they never
   pay the wrong one.

   The link is a `upi://pay?...` deep link, the format every Indian UPI app
   understands (the NPCI common URL scheme). Only `pa` is truly required; the
   rest are what turn a blank payment screen into a prepared one. */

export type UpiParams = {
  /* Payee VPA. Defaults to the institute's. */
  pa?: string;
  /* Payee name shown in the app. */
  pn?: string;
  /* Amount in rupees. Omitted entirely when null — an amountless QR opens with
     an empty box for the payer to fill, which is right for a "pay what you were
     quoted" sheet and wrong for an invoice. */
  amount?: number | null;
  /* Transaction note. The invoice number goes here, which is how a payment in
     the bank statement is matched back to a document later. */
  note?: string;
};

/* Percent-encodes a value for the query string. `@` is deliberately left as
   itself: it is a legal query character, every UPI app in the wild is handed
   VPAs unencoded, and a few older ones fail to decode %40 back. */
function enc(v: string): string {
  return encodeURIComponent(v).replace(/%40/g, "@");
}

/* A UPI note is passed through to the bank, which is strict about it. Anything
   outside plain characters, and anything long, gets dropped or mangles the
   whole intent — so it is trimmed hard here rather than trusting the input. */
function tidyNote(note: string): string {
  return note
    .replace(/[^A-Za-z0-9 ./-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);
}

export function upiUri({ pa, pn, amount, note }: UpiParams = {}): string {
  const parts: string[] = [
    `pa=${enc(pa || PAYMENT.upiId)}`,
    `pn=${enc(pn || PAYMENT.upiPayeeName)}`,
    "cu=INR",
  ];
  /* A zero or negative amount is treated as "no amount": a QR that asks for ₹0
     is worse than one that asks the payer to type the figure. */
  if (amount != null && Number.isFinite(amount) && amount > 0) {
    parts.push(`am=${upiAmount(amount)}`);
  }
  const tn = tidyNote(note ?? "");
  if (tn) parts.push(`tn=${enc(tn)}`);
  return `upi://pay?${parts.join("&")}`;
}

/* The QR itself, as a square grid of true/false modules.

   Error-correction level M is the standard choice for a payment code: it
   survives a phone camera at an angle and a page printed on a home printer,
   without inflating the grid the way H would. Type 0 lets the library pick the
   smallest version the data fits in. */
export function qrModules(data: string): boolean[][] {
  const qr = qrcode(0, "M");
  qr.addData(data);
  qr.make();
  const n = qr.getModuleCount();
  const grid: boolean[][] = [];
  for (let r = 0; r < n; r += 1) {
    const row: boolean[] = [];
    for (let c = 0; c < n; c += 1) row.push(qr.isDark(r, c));
    grid.push(row);
  }
  return grid;
}

/* The modules as one SVG path `d` string, one rectangle per dark module.

   A single path rather than hundreds of <rect> elements: it renders identically
   and keeps the markup small enough that a fully itemised invoice link still
   loads as one tidy page. */
export function qrPath(grid: boolean[][]): string {
  const out: string[] = [];
  for (let r = 0; r < grid.length; r += 1) {
    for (let c = 0; c < grid.length; c += 1) {
      if (grid[r][c]) out.push(`M${c} ${r}h1v1h-1z`);
    }
  }
  return out.join("");
}
