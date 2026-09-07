/* Money: reading what Sensei typed, adding it up, and writing it back out.

   Amounts are typed by a human into a text box, so they arrive as "12,500",
   "₹ 12500", "12500.50" or "" — never as a number. Everything here starts by
   parsing that leniently, and everything that renders goes back through one
   formatter, so an invoice cannot show "12500" on one line and "12,500" on the
   next.

   Indian digit grouping throughout (1,23,456 — not 123,456), because every
   number on these documents is rupees and every reader of them is used to
   lakhs. */

/* Reads a typed amount. Returns null for anything that is not a number, which
   callers treat as "she left this blank", never as zero — a blank fee and a
   fee of zero are different statements and the documents must not conflate
   them. */
export function parseAmount(input: string | undefined | null): number | null {
  if (input == null) return null;
  /* Strip everything a person might reasonably type around a number: the rupee
     sign, the word Rs, spaces, and the thousands commas. */
  const cleaned = input
    .replace(/[₹\s]/g, "")
    .replace(/^(rs\.?|inr)/i, "")
    .replace(/,/g, "")
    .trim();
  if (!cleaned) return null;
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  return n;
}

/* Indian grouping: the last three digits, then twos. 123456 -> 1,23,456. */
function groupIndian(digits: string): string {
  if (digits.length <= 3) return digits;
  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3);
  return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3;
}

/* The one way a number becomes text on a document. Paise are shown only when
   there are any — "12,500" reads better than "12,500.00", and a receipt with a
   trailing .00 on every line looks machine-made. */
export function formatAmount(n: number): string {
  const neg = n < 0;
  const abs = Math.abs(n);
  const rounded = Math.round(abs * 100) / 100;
  const whole = Math.floor(rounded);
  const paise = Math.round((rounded - whole) * 100);
  const body = groupIndian(String(whole)) + (paise ? `.${String(paise).padStart(2, "0")}` : "");
  return (neg ? "-" : "") + body;
}

/* With the rupee sign, for the places a document states a price rather than
   filling a column that is already headed "Amount". */
export function formatRupees(n: number): string {
  return `₹${formatAmount(n)}`;
}

/* Re-formats a typed string if it parses, and otherwise hands back exactly what
   was typed. That second half matters: Sensei may legitimately write "As
   agreed" or "12,500 + GST" in an amount box, and silently blanking it because
   it is not a number would lose information from a document she is about to
   send. */
export function tidyAmount(input: string | undefined | null): string {
  const raw = (input ?? "").trim();
  if (!raw) return "";
  const n = parseAmount(raw);
  return n === null ? raw : formatAmount(n);
}

/* Sums the amounts that are genuinely numbers. Rows carrying free text are
   skipped rather than treated as zero; `skipped` lets the caller say so on the
   document instead of quietly showing a total that is short. */
export function sumAmounts(inputs: readonly (string | undefined)[]): {
  total: number;
  counted: number;
  skipped: number;
} {
  let total = 0;
  let counted = 0;
  let skipped = 0;
  for (const i of inputs) {
    const raw = (i ?? "").trim();
    if (!raw) continue;
    const n = parseAmount(raw);
    if (n === null) skipped += 1;
    else {
      total += n;
      counted += 1;
    }
  }
  /* Float addition of 12500.10 + 0.20 lands on ...30000000004; money is only
     ever shown to two places, so it is rounded once here rather than at every
     call site. */
  return { total: Math.round(total * 100) / 100, counted, skipped };
}

const ONES = [
  "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

/* 0-99 */
function underHundred(n: number): string {
  if (n < 20) return ONES[n];
  const t = TENS[Math.floor(n / 10)];
  const o = ONES[n % 10];
  return o ? `${t}-${o}` : t;
}

/* 0-999 */
function underThousand(n: number): string {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  if (!h) return underHundred(rest);
  const head = `${ONES[h]} hundred`;
  return rest ? `${head} and ${underHundred(rest)}` : head;
}

/* The Indian scale, largest first. Anything at or above one crore is written in
   crores rather than switching to millions. */
function wholeInWords(n: number): string {
  if (n === 0) return "zero";
  const parts: string[] = [];
  const scales: Array<[number, string]> = [
    [10000000, "crore"],
    [100000, "lakh"],
    [1000, "thousand"],
  ];
  let rest = n;
  for (const [size, name] of scales) {
    const count = Math.floor(rest / size);
    if (count) {
      /* A crore count can itself exceed 999 (100 crore and up), so it recurses
         rather than assuming it fits in three digits. */
      parts.push(`${count > 999 ? wholeInWords(count) : underThousand(count)} ${name}`);
      rest %= size;
    }
  }
  if (rest) parts.push(underThousand(rest));
  return parts.join(" ");
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* The amount-in-words line. This is the thing that makes a receipt hard to
   alter — a figure can have a digit added to it, a sentence cannot — so it is
   generated from the same number the figure came from and always ends in
   "only", which is what closes the line off.

   Returns "" for a number that is not there, so the caller can fall back to
   whatever Sensei typed by hand. */
export function amountInWords(n: number | null): string {
  if (n === null || !Number.isFinite(n) || n < 0) return "";
  const rounded = Math.round(n * 100) / 100;
  const whole = Math.floor(rounded);
  const paise = Math.round((rounded - whole) * 100);

  const rupees = `${wholeInWords(whole)} rupee${whole === 1 ? "" : "s"}`;
  if (!paise) return capitalise(`${rupees} only`);
  return capitalise(`${rupees} and ${underHundred(paise)} paise only`);
}

/* The exact string a UPI app expects in `am=`: plain digits, a dot, two
   decimals, no grouping and no currency sign. Anything else and some apps open
   with an empty amount box, which defeats the whole point of the QR. */
export function upiAmount(n: number): string {
  return (Math.round(n * 100) / 100).toFixed(2);
}
