/* The business's own details, as supplied by Parveen Kaur Sensei.

   These are the facts that belong to the institute rather than to any one
   student: the registered name, where it is registered, and where money is
   sent. They live here so an invoice, a receipt and a fee sheet cannot quote
   three different account numbers — and so that changing a bank is one edit.

   Nothing here is secret. A UPI ID and an account number are what you hand a
   payer; they are on every invoice by design. Do not put anything here that
   would be dangerous on a document a student holds — no PIN, no password, no
   token. Those belong in environment variables. */

export const BUSINESS = {
  registeredName: "Yume ga kanau",
  /* The longer trading name used in the footer and structured data lives in
     lib/seo as SITE.legalName. Both are correct; this is the registered one. */
  address: "New Delhi, India",
  city: "New Delhi",
  country: "India",
} as const;

/* Where fees are paid. The UPI ID is what the QR code on an invoice encodes,
   so a typo here is a payment sent to a stranger — check it against the app
   before changing it. */
export const PAYMENT = {
  upiId: "9891196802-2@ybl",
  /* The name a payer sees in their UPI app when they scan. Kept short: some
     apps truncate it, and banks match on the ID, not on this. */
  upiPayeeName: "Yume ga kanau",
  accountName: "Ms. Parveen Kaur",
  accountNo: "10196660264",
  ifsc: "IDFB0020143",
  bankName: "IDFC FIRST",
} as const;

/* Batch codes.

   Sensei's note says the code "will be different for each batch", so these are
   not a fixed list to choose from — they are the shapes a code takes, offered
   as suggestions in the console. Every batch field is a plain text box that
   happens to have a dropdown of these attached: pick one, or type anything.

   The season part (jan-july27A) changes every intake. When it does, edit the
   strings here and the whole console updates; nothing else reads them. */
export const BATCH_CODES = [
  /* Group batches */
  "N5 jan-july27A",
  "N4 jan-july27A",
  "N3 jan-july27A",
  "N2 jan-july27A",
  /* Individual (1-on-1) batches */
  "Indv. N5 jan-july27A",
  "Indv. N4 jan-july27A",
  "Indv. N3 jan-july27A",
  "Indv. N2 jan-july27A",
  /* Conversation (kaiwa) batches */
  "N5 jan kaiwa",
  "N4 jan kaiwa",
  "N3 jan kaiwa",
  "N2 jan kaiwa",
  "Business kaiwa-A",
] as const;
