import { BATCH_CODES, PAYMENT } from "./business";
import { parseAmount, sumAmounts } from "./money";

/* The documents in the Enrolment & Payment Pack, described as data.

   This file is the single source of truth for what Sensei can fill in. The
   admin console builds its forms from it, the generate route validates against
   it, and each document component reads the values back out by the same keys.
   Adding a field here makes it appear in the console automatically — there is
   no second list to keep in step.

   Values Sensei does NOT supply are left genuinely blank and render as "[ ... ]",
   per the design brief: never a plausible-looking placeholder that could be
   mistaken for a real value. */

export type FieldKind = "text" | "date" | "select" | "money" | "combo" | "textarea";

export type Field = {
  key: string;
  label: string;
  kind?: FieldKind;
  placeholder?: string;
  /* Fixed choices for "select"; suggestions for "combo", where anything may
     still be typed. */
  options?: readonly string[];
  hint?: string;
  /* Lay two of these side by side in the console. Cosmetic only. */
  half?: boolean;
  /* A starting value, put in the box the first time the console opens the
     document. Used for the things that are the same on nearly every document —
     the bank details, the list of stages — so Sensei edits rather than types.
     A seeded value is an ordinary value: she can change or clear any of them. */
  seed?: string;
  /* Overrides MAX_VALUE for this one field. Only worth raising for a genuine
     paragraph, since everything typed ends up inside the URL. */
  maxLen?: number;
};

/* A group whose rows Sensei adds and removes herself.

   The columns describe ONE row. The real field keys are the column key with the
   row number stuck on the end — `d1`, `d2`, `d3` — which is why the receipt's
   long-standing d1/l1/p1/a1 keys still work unchanged: links issued before this
   existed open exactly as they did.

   `max` is a hard cap, not a suggestion: every possible key up to it is
   whitelisted by the generate route, and each row costs URL length. */
export type RepeatSpec = {
  columns: readonly Field[];
  /* Singular noun for the row, used in the console's buttons: "Add a line". */
  rowNoun: string;
  /* Rows that cannot be removed — the document would be meaningless without
     them. */
  min: number;
  /* Rows shown the first time the group is opened. */
  start: number;
  max: number;
  /* Column widths for one row, as a CSS grid template. Collapses to a single
     column on a narrow screen, like every other grid in the pack. */
  grid?: string;
  /* Initial rows. Index 0 seeds row 1. Fewer seeds than `start` is fine — the
     remaining rows simply open empty. */
  seed?: readonly Record<string, string>[];
};

export type FieldGroup = {
  title: string;
  note?: string;
  /* A group is either a fixed list of fields or a repeating one. */
  fields?: readonly Field[];
  repeat?: RepeatSpec;
};

export type DocDef = {
  id: string;
  label: string;
  /* One line in the console explaining when Sensei would send this. */
  blurb: string;
  /* True only for the admission form: the generated page carries student inputs
     and a Submit button that mails Sensei. The other documents are ones the
     student reads, not forms they fill. */
  interactive: boolean;
  /* Shown on the generated page's browser tab. */
  title: string;
  groups: readonly FieldGroup[];
};

/* Longest value we will sign into a link. Generous for a batch description,
   short enough that nobody can push a novel through the admin console and make
   an unshareable URL. */
export const MAX_VALUE = 300;

const DATE = { kind: "date" as const, half: true };

/* Every batch field on every document uses this, so the codes are written once,
   in lib/business, and offered everywhere. It stays a text box — Sensei's note
   says each batch gets its own code, so the list suggests, it does not
   restrict. */
const BATCH = {
  kind: "combo" as const,
  options: BATCH_CODES,
  placeholder: "e.g. N5 jan-july27A",
  half: true,
};

/* ── Repeating groups ─────────────────────────────────────────────────────── */

/* Money lines on a receipt or an invoice. */
const LINE_ITEMS: RepeatSpec = {
  rowNoun: "line",
  min: 1,
  start: 2,
  max: 12,
  grid: "2.2fr 1fr 1.4fr 1.1fr",
  columns: [
    { key: "d", label: "Description", placeholder: "Tuition fee" },
    { key: "l", label: "Level / stage", placeholder: "N5" },
    { key: "p", label: "Period covered", placeholder: "Jan–Apr 2026" },
    { key: "a", label: "Amount", kind: "money", placeholder: "12,500" },
  ],
};

/* The programmes on the fee sheet. Seeded with the four stages plus kaiwa and
   business Japanese, because that is what the sheet has always listed — but
   every one of them is now an ordinary row Sensei can rename, reprice or
   delete, and she can add as many more as she runs. */
const PROGRAMMES: RepeatSpec = {
  rowNoun: "programme",
  min: 1,
  start: 6,
  max: 14,
  grid: "1fr .7fr 1fr 1.5fr 1.2fr",
  columns: [
    { key: "pst", label: "Stage", placeholder: "Stage 1" },
    { key: "plv", label: "Level", placeholder: "N5" },
    { key: "pdu", label: "Duration", placeholder: "4 months" },
    { key: "pfm", label: "Format", placeholder: "Small batch, live online" },
    { key: "pfe", label: "Fee", kind: "money", placeholder: "Blank reads as “ask me”" },
  ],
  seed: [
    { pst: "Stage 1", plv: "N5", pfm: "Small batch, live online" },
    { pst: "Stage 2", plv: "N4", pfm: "Small batch, live online" },
    { pst: "Stage 3", plv: "N3", pfm: "Small batch, live online" },
    { pst: "Stage 4", plv: "N2", pfm: "Small batch, live online" },
    { pst: "Kaiwa", plv: "Any", pfm: "Conversational Japanese" },
    { pst: "Business", plv: "Any", pfm: "Business Japanese" },
  ],
};

/* The 1-on-1 block under the programme table. Its own repeating group because
   its fees genuinely differ from group fees and the design separates it. */
const PRIVATE_RATES: RepeatSpec = {
  rowNoun: "rate",
  min: 1,
  start: 2,
  max: 8,
  grid: "1fr 1.5fr 1.2fr",
  columns: [
    { key: "ru", label: "Charged", placeholder: "Per hour" },
    { key: "rd", label: "Description", placeholder: "Private, scheduled with you" },
    { key: "rf", label: "Fee", kind: "money" },
  ],
  seed: [
    { ru: "Per hour", rd: "Private, scheduled with you" },
    { ru: "Per module", rd: "Private, scheduled with you" },
  ],
};

/* ── The payment block ────────────────────────────────────────────────────── */

/* Seeded from lib/business so the real details are already in the boxes and a
   document cannot go out with last year's account number on it. Still editable
   per document, because a one-off transfer to a different account happens. */
const PAY_TO: readonly Field[] = [
  { key: "upiId", label: "UPI ID", half: true, seed: PAYMENT.upiId },
  { key: "accountName", label: "Account name", half: true, seed: PAYMENT.accountName },
  { key: "accountNo", label: "Account number", half: true, seed: PAYMENT.accountNo },
  { key: "ifsc", label: "IFSC", half: true, seed: PAYMENT.ifsc },
  { key: "bankName", label: "Bank name", half: true, seed: PAYMENT.bankName },
];

export const DOCS: readonly DocDef[] = [
  {
    id: "admission",
    label: "Admission form",
    title: "Admission Form",
    blurb:
      "The form a new student fills in. Set the form number and, if you already know it, the batch — then share the link.",
    interactive: true,
    groups: [
      {
        title: "Top of the form",
        fields: [
          { key: "formNo", label: "Form no.", placeholder: "e.g. YGK-2026-014", half: true },
          { key: "issueDate", label: "Date", ...DATE },
        ],
      },
      {
        title: "For office use only",
        note:
          "Leave these blank if the batch is not decided yet — they show as [ ... ] on the student's form and you can send an updated link later.",
        fields: [
          { key: "batchAssigned", label: "Batch assigned", ...BATCH },
          { key: "startDate", label: "Start date", ...DATE },
          { key: "classDaysTime", label: "Class days & time", placeholder: "e.g. Tue & Thu, 7:00–8:30 pm IST" },
        ],
      },
    ],
  },

  {
    id: "invoice",
    label: "Invoice",
    title: "Invoice",
    blurb:
      "A request for payment, sent before the money arrives. It carries a UPI QR code for the exact amount — the student scans it and pays without typing a figure. Once they have paid, a button on it emails you to ask for their receipt.",
    interactive: false,
    groups: [
      {
        title: "Invoice header",
        fields: [
          { key: "invoiceNo", label: "Invoice no.", placeholder: "e.g. INV-2026-014", half: true },
          { key: "issueDate", label: "Date of issue", ...DATE },
          { key: "dueDate", label: "Payment due by", ...DATE },
          {
            key: "status",
            label: "Status",
            kind: "select",
            options: ["Unpaid", "Partly paid", "Paid in full"],
            half: true,
            hint: "“Paid in full” replaces the QR code with a paid stamp.",
          },
        ],
      },
      {
        title: "Billed to",
        fields: [
          { key: "studentName", label: "Student name", placeholder: "As they wrote it on the form", half: true },
          { key: "batch", label: "Batch", ...BATCH },
          { key: "email", label: "Email", placeholder: "Optional", half: true },
          { key: "phone", label: "Phone", placeholder: "Optional", half: true },
          {
            key: "billAddress",
            label: "Address",
            placeholder: "Optional — only if they need it to claim the fee back",
          },
        ],
      },
      {
        title: "What is being charged",
        note: "Add a line for each item. The amounts are added up for you, so you never total them by hand.",
        repeat: LINE_ITEMS,
      },
      {
        title: "Adjustments",
        note:
          "Both optional. A discount comes off the total; anything already paid comes off what is still due — and it is the amount still due that the QR code asks for.",
        fields: [
          { key: "discount", label: "Discount", kind: "money", half: true },
          { key: "discountNote", label: "Discount is for", placeholder: "e.g. Early payment", half: true },
          { key: "paidAlready", label: "Already paid / advance", kind: "money", half: true },
          { key: "paidAlreadyDate", label: "Date that was paid", ...DATE },
        ],
      },
      {
        title: "Total",
        note:
          "Leave these blank and they are worked out from the lines above — the figure, and the amount in words. Fill them in only to override the arithmetic.",
        fields: [
          {
            key: "totalOverride",
            label: "Total payable — override",
            kind: "money",
            half: true,
            hint: "Only if the sum above is not the figure you want to charge.",
          },
          {
            key: "amountWords",
            label: "Amount in words — override",
            placeholder: "Written out for you if left blank",
          },
        ],
      },
      {
        title: "How to pay",
        note: "Already filled in with your details. Change them only for a one-off.",
        fields: PAY_TO,
      },
      {
        title: "Notes & registration",
        note: "Leave the registration numbers blank and that line does not appear at all.",
        fields: [
          {
            key: "terms",
            label: "Note to the student",
            kind: "textarea",
            maxLen: 600,
            placeholder:
              "e.g. Please send the payment screenshot on WhatsApp once you have paid, and your receipt will follow.",
          },
          { key: "gstin", label: "GSTIN", half: true },
          { key: "regNo", label: "Business registration no.", half: true },
        ],
      },
    ],
  },

  {
    id: "receipt",
    label: "Fee receipt",
    title: "Fee Receipt",
    blurb: "Issued after a payment lands. You fill everything; the student only reads it.",
    interactive: false,
    groups: [
      {
        title: "Receipt header",
        fields: [
          { key: "receiptNo", label: "Receipt no.", placeholder: "e.g. R-2026-031", half: true },
          { key: "issueDate", label: "Date of issue", ...DATE },
          { key: "studentName", label: "Received with thanks from", placeholder: "Student name", half: true },
          { key: "batch", label: "Batch", ...BATCH },
        ],
      },
      {
        title: "What was paid for",
        note: "Add a line for each item. Anything left empty is kept off the receipt.",
        repeat: LINE_ITEMS,
      },
      {
        title: "Total",
        note:
          "Leave these blank and they are worked out from the lines above. The amount in words is what makes a receipt hard to alter, so it is written out for you.",
        fields: [
          { key: "total", label: "Total received — override", kind: "money" },
          {
            key: "amountWords",
            label: "Amount in words — override",
            placeholder: "Written out for you if left blank",
          },
        ],
      },
      {
        title: "How it was paid",
        fields: [
          {
            key: "payMethod",
            label: "Payment method",
            kind: "select",
            options: ["UPI", "Bank transfer", "Other"],
            half: true,
          },
          { key: "payOther", label: "If other, what?", placeholder: "Only if you chose Other", half: true },
          { key: "txnRef", label: "Transaction reference", placeholder: "UTR / UPI ref", half: true },
          { key: "payDate", label: "Payment date", ...DATE },
        ],
      },
      {
        title: "Anything still outstanding",
        note:
          "Leave these blank if the fee is settled in full — the block is then left off the receipt. Put a balance in and the receipt carries a QR code for exactly that amount.",
        fields: [
          { key: "balance", label: "Balance outstanding", kind: "money", half: true },
          { key: "balanceDue", label: "Due date for balance", ...DATE },
        ],
      },
      {
        title: "Business registration (optional)",
        note: "Leave both blank and this block does not appear at all. Never put a number here you do not have.",
        fields: [
          { key: "gstin", label: "GSTIN", half: true },
          { key: "regNo", label: "Business registration no.", half: true },
        ],
      },
    ],
  },

  {
    id: "fees",
    label: "Fee structure sheet",
    title: "Fee Structure",
    blurb:
      "What things cost. The website publishes no prices, so this sheet is where they live — send it to someone deciding whether to enrol.",
    interactive: false,
    groups: [
      {
        title: "Programmes & fees",
        note:
          "These are your rows: rename them, reprice them, delete the ones you are not running and add any you are. A fee left blank stays blank on the sheet, which is intentional — it reads as “ask me”.",
        repeat: PROGRAMMES,
      },
      {
        title: "1-on-1 coaching",
        note: "The private rates, shown in their own band under the table.",
        repeat: PRIVATE_RATES,
      },
      {
        title: "How to pay",
        note: "Already filled in with your details. These appear on the sheet exactly as typed.",
        fields: PAY_TO,
      },
    ],
  },

  {
    id: "confirmation",
    label: "Enrolment confirmation letter",
    title: "Enrolment Confirmation",
    blurb: "The warm “you’re enrolled” letter, sent once their place is confirmed.",
    interactive: false,
    groups: [
      {
        title: "Letter reference",
        fields: [
          { key: "letterDate", label: "Date", ...DATE },
          { key: "reference", label: "Reference", placeholder: "e.g. YGK-2026-014", half: true },
        ],
      },
      {
        title: "The student’s details",
        note: "These are read back to the student so they can check them — get the spelling right.",
        fields: [
          { key: "studentName", label: "Student name", placeholder: "As they wrote it on the form" },
          { key: "stageJoined", label: "Stage joined", placeholder: "e.g. Stage 1 · JLPT N5", half: true },
          { key: "batchCode", label: "Batch code", ...BATCH },
          { key: "startDate", label: "Start date", ...DATE },
          {
            key: "classDaysTimes",
            label: "Class days & times — in the student’s time zone",
            placeholder: "e.g. Tue & Thu, 7:00–8:30 pm IST",
            hint: "Write it in THEIR time zone, not yours. This is the line students get wrong most often.",
          },
        ],
      },
    ],
  },

  {
    id: "welcome",
    label: "Batch welcome pack",
    title: "Batch Welcome Pack",
    blurb: "Given to every student on day one. Only three things change per batch.",
    interactive: false,
    groups: [
      {
        title: "This batch",
        fields: [
          { key: "batch", label: "Batch", ...BATCH },
          { key: "startDate", label: "Start date", ...DATE },
          {
            key: "platform",
            label: "Platform classes run on",
            placeholder: "e.g. Google Meet",
            hint: "Fills the “Classes are live and online on [ ... ]” line.",
          },
        ],
      },
    ],
  },
] as const;

export function docById(id: string): DocDef | undefined {
  return DOCS.find((d) => d.id === id);
}

/* The real key for one cell of a repeating group. Row numbers are 1-based
   because they are shown to Sensei as "Line 1". */
export function rowKey(column: string, row: number): string {
  return `${column}${row}`;
}

/* Every key a given document is allowed to carry, repeating groups expanded to
   their maximum. The generate route uses this to drop anything else before
   signing, so a tampered console request cannot smuggle extra keys into a
   link. */
export function keysFor(doc: DocDef): string[] {
  const out: string[] = [];
  for (const g of doc.groups) {
    for (const f of g.fields ?? []) out.push(f.key);
    if (g.repeat) {
      for (let n = 1; n <= g.repeat.max; n += 1) {
        for (const c of g.repeat.columns) out.push(rowKey(c.key, n));
      }
    }
  }
  return out;
}

/* Per-field length limits, for the same reason: a field that asked for a
   sentence must not be usable to push six hundred characters into every other
   box on the document. */
export function limitsFor(doc: DocDef): Record<string, number> {
  const out: Record<string, number> = {};
  for (const g of doc.groups) {
    for (const f of g.fields ?? []) out[f.key] = f.maxLen ?? MAX_VALUE;
    if (g.repeat) {
      for (let n = 1; n <= g.repeat.max; n += 1) {
        for (const c of g.repeat.columns) out[rowKey(c.key, n)] = c.maxLen ?? MAX_VALUE;
      }
    }
  }
  return out;
}

/* What the documents render wherever Sensei supplied nothing. The brief is
   explicit that this must look like a blank, not like a value. */
export const BLANK = "[ ... ]";

export type DocValues = Record<string, string>;

export function val(values: DocValues, key: string): string {
  const v = values[key];
  return v && v.trim() ? v.trim() : BLANK;
}

/* Same, but for places where an empty value should collapse rather than show a
   blank marker — an unused receipt row, for instance. */
export function opt(values: DocValues, key: string): string {
  const v = values[key];
  return v && v.trim() ? v.trim() : "";
}

/* Reads a repeating group back out of a signed link.

   Only rows carrying something are returned, and they come back in order with
   the gaps closed up: if Sensei filled lines 1 and 3 and cleared 2, the
   document prints two lines, not two lines and a hole. An empty row on a
   receipt looks like a mistake, or like room to add one later. */
export function repeatRows(values: DocValues, spec: RepeatSpec): DocValues[] {
  const rows: DocValues[] = [];
  for (let n = 1; n <= spec.max; n += 1) {
    const row: DocValues = {};
    let filled = false;
    for (const c of spec.columns) {
      const v = opt(values, rowKey(c.key, n));
      row[c.key] = v;
      if (v) filled = true;
    }
    if (filled) rows.push(row);
  }
  return rows;
}

/* Finds a group by title within a document, so a renderer can ask for the same
   repeat spec the console filled in rather than keeping a second copy of the
   column keys that could drift out of step with it. */
export function repeatSpec(docId: string, groupTitle: string): RepeatSpec {
  const g = docById(docId)?.groups.find((x) => x.title === groupTitle);
  if (!g?.repeat) throw new Error(`No repeating group "${groupTitle}" on document "${docId}"`);
  return g.repeat;
}

/* Dates are stored as the browser's yyyy-mm-dd. Students are in India, the UK,
   the USA and Japan, so they are rendered in an unambiguous "12 January 2026"
   rather than a numeric order that means two different days on two continents.
   Parsed as UTC parts, never `new Date(string)`, which would shift the day for
   anyone west of Greenwich. */
export function humanDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return iso.trim();
  const [, y, mo, d] = m;
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const name = months[Number(mo) - 1];
  if (!name) return iso.trim();
  return `${Number(d)} ${name} ${y}`;
}

export function dateVal(values: DocValues, key: string): string {
  const v = opt(values, key);
  return v ? humanDate(v) : BLANK;
}

/* ── Invoice arithmetic ─────────────────────────────────────────────────────

   The invoice works out its own totals from the lines Sensei typed, and two
   places need the same answer: the document itself, and the receipt-request
   email, which tells Sensei what the invoice was asking for at the moment the
   student pressed the button. Two copies of this sum would eventually disagree
   — and disagreeing about money is the one thing these documents may not do —
   so it lives here once. */
export type InvoiceTotals = {
  rows: DocValues[];
  /* Lines written in words rather than as a figure, and so not summed. */
  skipped: number;
  subtotal: number | null;
  discount: number | null;
  total: number | null;
  paid: number | null;
  /* What is still owed — what the QR code asks for. */
  due: number | null;
  status: string;
  /* Marked "Paid in full", or the arithmetic has already reached zero. */
  nothingDue: boolean;
};

export function invoiceTotals(v: DocValues): InvoiceTotals {
  const rows = repeatRows(v, repeatSpec("invoice", "What is being charged"));

  const summed = sumAmounts(rows.map((r) => r.a));
  const subtotal = summed.counted > 0 ? summed.total : null;

  const discount = parseAmount(opt(v, "discount"));
  const override = parseAmount(opt(v, "totalOverride"));
  /* The override is the final figure, discount included — that is what it is
     for. Otherwise the total is the lines less any discount. */
  const total = override ?? (subtotal !== null ? subtotal - (discount ?? 0) : null);

  const paid = parseAmount(opt(v, "paidAlready"));
  const status = opt(v, "status");
  const settled = status === "Paid in full";

  /* A settled invoice asks for nothing; so does one where the arithmetic has
     already reached zero. */
  const dueRaw = total !== null ? total - (paid ?? 0) : null;
  const due = settled ? 0 : dueRaw;

  return {
    rows,
    skipped: summed.skipped,
    subtotal,
    discount,
    total,
    paid,
    due,
    status,
    nothingDue: settled || (due !== null && due <= 0),
  };
}
