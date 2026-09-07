/* The five documents from the Enrolment & Payment Pack, described as data.

   This file is the single source of truth for what Sensei can fill in. The
   admin console builds its forms from it, the generate route validates against
   it, and each document component reads the values back out by the same keys.
   Adding a field here makes it appear in the console automatically — there is
   no second list to keep in step.

   Values Sensei does NOT supply are left genuinely blank and render as "[ ... ]",
   per the design brief: never a plausible-looking placeholder that could be
   mistaken for a real value. */

export type FieldKind = "text" | "date" | "select" | "money";

export type Field = {
  key: string;
  label: string;
  kind?: FieldKind;
  placeholder?: string;
  options?: readonly string[];
  hint?: string;
  /* Lay two of these side by side in the console. Cosmetic only. */
  half?: boolean;
};

export type FieldGroup = {
  title: string;
  note?: string;
  fields: readonly Field[];
};

export type DocDef = {
  id: string;
  label: string;
  /* One line in the console explaining when Sensei would send this. */
  blurb: string;
  /* True only for the admission form: the generated page carries student inputs
     and a Submit button that mails Sensei. The other four are documents the
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
          { key: "batchAssigned", label: "Batch assigned", placeholder: "e.g. N5-JAN26-A", half: true },
          { key: "startDate", label: "Start date", ...DATE },
          { key: "classDaysTime", label: "Class days & time", placeholder: "e.g. Tue & Thu, 7:00–8:30 pm IST" },
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
          { key: "batch", label: "Batch", placeholder: "e.g. N5-JAN26-A", half: true },
        ],
      },
      {
        title: "What was paid for",
        note: "Fill the first row at least. Empty rows are left out of the receipt.",
        fields: [
          { key: "d1", label: "Row 1 — description", placeholder: "Tuition fee", half: true },
          { key: "l1", label: "Row 1 — level / stage", placeholder: "N5", half: true },
          { key: "p1", label: "Row 1 — period covered", placeholder: "Jan–Apr 2026", half: true },
          { key: "a1", label: "Row 1 — amount", kind: "money", placeholder: "12,500", half: true },
          { key: "d2", label: "Row 2 — description", half: true },
          { key: "l2", label: "Row 2 — level / stage", half: true },
          { key: "p2", label: "Row 2 — period covered", half: true },
          { key: "a2", label: "Row 2 — amount", kind: "money", half: true },
          { key: "d3", label: "Row 3 — description", half: true },
          { key: "l3", label: "Row 3 — level / stage", half: true },
          { key: "p3", label: "Row 3 — period covered", half: true },
          { key: "a3", label: "Row 3 — amount", kind: "money", half: true },
        ],
      },
      {
        title: "Total",
        note:
          "The amount in words is what makes a receipt hard to alter. Write it out and end the line with “only”.",
        fields: [
          { key: "total", label: "Total received", kind: "money", placeholder: "12,500" },
          {
            key: "amountWords",
            label: "Amount in words",
            placeholder: "Twelve thousand five hundred rupees only",
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
        note: "Leave both blank if the fee is settled in full — the block is then left off the receipt.",
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
        title: "Stage fees",
        note: "Any cell you leave blank stays blank on the sheet, which is intentional — it reads as “ask me”.",
        fields: [
          { key: "durN5", label: "Stage 1 · N5 — duration", placeholder: "e.g. 4 months", half: true },
          { key: "feeN5", label: "Stage 1 · N5 — fee", kind: "money", half: true },
          { key: "durN4", label: "Stage 2 · N4 — duration", half: true },
          { key: "feeN4", label: "Stage 2 · N4 — fee", kind: "money", half: true },
          { key: "durN3", label: "Stage 3 · N3 — duration", half: true },
          { key: "feeN3", label: "Stage 3 · N3 — fee", kind: "money", half: true },
          { key: "durN2", label: "Stage 4 · N2 — duration", half: true },
          { key: "feeN2", label: "Stage 4 · N2 — fee", kind: "money", half: true },
          { key: "durKaiwa", label: "Kaiwa — duration", half: true },
          { key: "feeKaiwa", label: "Kaiwa — fee", kind: "money", half: true },
          { key: "durBiz", label: "Business Japanese — duration", half: true },
          { key: "feeBiz", label: "Business Japanese — fee", kind: "money", half: true },
        ],
      },
      {
        title: "1-on-1 coaching",
        fields: [
          { key: "fee1v1Hour", label: "Per hour", kind: "money", half: true },
          { key: "fee1v1Module", label: "Per module", kind: "money", half: true },
        ],
      },
      {
        title: "How to pay",
        note: "These appear on the sheet exactly as typed. Blank ones show as [ ... ].",
        fields: [
          { key: "upiId", label: "UPI ID", half: true },
          { key: "bankName", label: "Bank / account name", half: true },
          { key: "accountNo", label: "Account number", half: true },
          { key: "ifsc", label: "IFSC", half: true },
        ],
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
          { key: "batchCode", label: "Batch code", placeholder: "e.g. N5-JAN26-A", half: true },
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
          { key: "batch", label: "Batch", placeholder: "e.g. N5-JAN26-A", half: true },
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

/* Every key a given document is allowed to carry. The generate route uses this
   to drop anything else before signing, so a tampered console request cannot
   smuggle extra keys into a link. */
export function keysFor(doc: DocDef): string[] {
  return doc.groups.flatMap((g) => g.fields.map((f) => f.key));
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
