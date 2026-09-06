/* The FAQ, lifted verbatim from what the home page actually shows.

   Google requires FAQPage structured data to match the visible answer word for
   word, so this file and the markup in app/page.tsx must not drift apart. If an
   answer is reworded on the page, reword it here in the same commit.

   This is the highest-value block on the site for answer engines: ChatGPT,
   Claude, Perplexity and Google's AI overviews quote question-and-answer pairs
   far more readily than prose. */
export const FAQ: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: "What happens in a trial class?",
    a: "In a free trial class, we assess your current Japanese level, introduce our interactive teaching methodology, and conduct a short live lesson. It’s a great opportunity to experience the learning atmosphere, discuss your language goals, and ask Parveen Sensei any questions before enrolling.",
  },
  {
    q: "How are classes scheduled across time zones?",
    a: "We currently accommodate learners across multiple time zones, including India, the UK, and Japan. While scheduling depends on slot availability, we always do our best to manage and align batch timings based on student requirements wherever possible.",
  },
  {
    q: "Do I need to buy separate textbooks/materials?",
    a: "No separate purchases are required! We provide all essential study materials, including PDF handouts, custom Kanji workbooks, vocabulary lists, and practice tests, directly through your official batch WhatsApp group.",
  },
  {
    q: "What’s your refund/cancellation policy?",
    a: "We strive to deliver complete satisfaction. Fee payments are non-refundable once a course batch begins, but if you face unforeseen circumstances, you may request to pause your enrollment or transfer to a future batch.",
  },
  {
    q: "Can I switch from group to 1-on-1 later?",
    a: "Yes, but with a few conditions. Since 1-on-1 coaching requires dedicated timing slots, switching depends on slot availability. Furthermore, if you are currently enrolled in a group batch for a specific level, you must complete that level with your group—you can only transition to 1-on-1 coaching when you start your next level. Please note that fee structures for 1-on-1 personalized classes differ from group batches.",
  },
];

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
