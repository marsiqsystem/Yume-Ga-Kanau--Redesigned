import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { SENSEI_EMAIL, pageMeta } from "@/lib/seo";
import "../legal.css";

/* The commitments here are taken from what the site already tells students —
   principally the FAQ in lib/faq.ts, which is also the source of the FAQPage
   structured data. The refund wording, the batch-transfer option, the materials
   promise and the group-to-1-on-1 rules must stay in step with lib/faq.ts:
   if one is reworded, reword the other in the same commit, or the site
   contradicts itself in a place students will reasonably rely on. */

const TITLE = "Terms of Service";
const DESC =
  "The terms for booking a trial class and studying with Yume Ga Kanau — enrolment, fees, materials, scheduling and cancellations.";

export const metadata: Metadata = pageMeta({
  title: TITLE,
  description: DESC,
  path: "/terms",
  ogDescription: "Enrolment, fees, materials, scheduling and cancellations.",
});

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms · 利用規約"
      title="Terms of Service"
      standfirst="These terms cover using this website and studying with Yume Ga Kanau. They are written to be read — if anything here is unclear, ask before you enrol rather than after."
      summary={
        <>
          <p>
            Booking a trial class costs nothing and commits you to nothing. Enrolment
            begins when a place is confirmed and the fee for that batch is paid.
          </p>
          <p>
            <strong>Fees are non-refundable once a batch begins</strong> — but if
            something unforeseen happens, you can ask to pause your enrolment or move to
            a future batch, and we will do our best to accommodate you.
          </p>
          <p>
            All study materials are included. They are for your own study and may not be
            redistributed or resold.
          </p>
        </>
      }
      path="/terms"
      metaTitle={TITLE}
      metaDescription={DESC}
    >
      <section id="agreement">
        <h2>
          <span className="lg-n">01</span>These terms
        </h2>
        <p>
          &ldquo;We&rdquo; and &ldquo;us&rdquo; mean Yume Ga Kanau™, the online Japanese
          language institute founded by Parveen Kaur Sensei. &ldquo;You&rdquo; means the
          person using this website or attending our classes. By using the site or
          enrolling, you accept these terms.
        </p>
        <p>
          If the student is under 18, a parent or legal guardian must agree to these
          terms and make the booking, and we will treat that adult as the person
          responsible for the enrolment.
        </p>
      </section>

      <section id="trial">
        <h2>
          <span className="lg-n">02</span>The free trial class
        </h2>
        <p>
          The trial class is genuinely free and carries no obligation to enrol. In it we
          assess your current level, demonstrate how the classes are taught, and give you
          the chance to ask questions before deciding anything.
        </p>
        <p>
          Trial slots depend on availability. We schedule them by agreement after you
          submit the form on the <Link href="/contact">contact page</Link>. We reserve
          the right to decline or reschedule a trial booking — for example if no suitable
          slot exists in your timezone.
        </p>
      </section>

      <section id="enrolment">
        <h2>
          <span className="lg-n">03</span>Enrolment and classes
        </h2>
        <p>
          A place is confirmed when we have agreed a batch with you and the fee for that
          batch has been paid. Teaching is delivered online, live, in small batches or
          one-to-one.
        </p>
        <h3>Scheduling</h3>
        <p>
          We teach students across several timezones, including India, the UK and Japan.
          Batch timings depend on slot availability, and we align them with student
          requirements wherever we reasonably can — but we cannot guarantee a particular
          time before a batch is formed.
        </p>
        <h3>Moving between group and one-to-one</h3>
        <p>
          You can move from a group batch to one-to-one coaching, subject to conditions
          we apply consistently: because one-to-one requires a dedicated slot, the change
          depends on availability; and if you are part-way through a level with a group,
          you complete that level with your group and switch at the start of your next
          level. Fees for one-to-one coaching differ from group batches.
        </p>
        <h3>What we ask of you</h3>
        <ul>
          <li>Attend at the agreed times, and tell us in advance when you cannot.</li>
          <li>Treat your teacher and the other students in your batch with respect.</li>
          <li>
            Do not record, photograph or stream a class without permission. Other
            students are present, and their privacy matters as much as yours.
          </li>
        </ul>
        <p>
          We may remove a student from a batch, without refund, for conduct that is
          abusive or that repeatedly disrupts other students&rsquo; learning. We would
          always raise the problem with you first.
        </p>
      </section>

      <section id="fees">
        <h2>
          <span className="lg-n">04</span>Fees, pauses and cancellations
        </h2>
        <p>
          Fees are agreed with you directly before enrolment; no payment is taken through
          this website. Fees are quoted per level and per batch, and they differ between
          group and one-to-one coaching.
        </p>
        <p>
          <strong>Once a batch has begun, fees are non-refundable.</strong> We do not
          apply that as a technicality: if you face unforeseen circumstances, you may
          request to <strong>pause your enrolment</strong> or{" "}
          <strong>transfer to a future batch</strong>, and we will do our best to
          accommodate it. Ask as early as you can — the sooner we know, the more we can
          do.
        </p>
        <p>
          If <em>we</em> cancel a class, we will reschedule it or make up the time. If we
          cannot run a batch at all after you have paid, we refund the unused portion of
          your fee.
        </p>
      </section>

      <section id="materials">
        <h2>
          <span className="lg-n">05</span>Study materials
        </h2>
        <p>
          All essential materials are included in your fee, and no separate textbook
          purchase is required: PDF handouts, custom kanji workbooks, vocabulary lists
          and practice tests, shared through your official batch WhatsApp group.
        </p>
        <p>
          These materials, and everything on this website — text, artwork, photographs,
          the Yume Ga Kanau™ name and logo — belong to us or are used with permission.
          You may use the materials for your own study. You may not republish, resell,
          share them outside your batch, or use them to teach others, without our written
          permission.
        </p>
      </section>

      <section id="results">
        <h2>
          <span className="lg-n">06</span>What we do and do not promise
        </h2>
        <p>
          We promise to teach well, prepare you properly, and answer your questions. We
          cannot promise a JLPT result. Passing an exam depends on your own study,
          practice and attendance, and the JLPT is administered by the Japan Foundation
          and Japan Educational Exchanges and Services — organisations we are not
          affiliated with and have no influence over.
        </p>
        <p>
          Nothing on this website is a guarantee of a particular outcome, and stage
          recommendations from the stage-finder test are guidance, not an assessment.
        </p>
      </section>

      <section id="site">
        <h2>
          <span className="lg-n">07</span>Using this website
        </h2>
        <p>
          You may read and share this site freely. Please do not attempt to break it,
          scrape it at a scale that degrades it for other people, or use the trial form
          to send unsolicited or abusive messages.
        </p>
        <p>
          We work to keep the site accurate and available, but we do not guarantee it
          will be uninterrupted or error-free. Where the site links out — to WhatsApp or
          Instagram, for instance — those services have their own terms, and we are not
          responsible for their content.
        </p>
      </section>

      <section id="liability">
        <h2>
          <span className="lg-n">08</span>Liability
        </h2>
        <p>
          Nothing in these terms limits any liability that cannot lawfully be limited,
          including liability for death or personal injury caused by negligence, or for
          fraud. Subject to that, our total liability to you in connection with our
          classes is limited to the fees you have paid us for the batch in question, and
          we are not liable for indirect or consequential loss.
        </p>
      </section>

      <section id="law">
        <h2>
          <span className="lg-n">09</span>Governing law, and changes
        </h2>
        <p>
          These terms are governed by the laws of India, and the courts of India have
          jurisdiction over any dispute. If you are a consumer elsewhere, this does not
          deprive you of the protection of mandatory consumer-protection rules in your
          own country.
        </p>
        <p>
          If we change these terms, we will update this page and the &ldquo;last
          reviewed&rdquo; date at the top. Changes are not retrospective: the terms that
          apply to your enrolment are the ones in force when you enrolled. If a change
          materially affects a current student, we will tell them.
        </p>
        <p>
          If any part of these terms turns out to be unenforceable, the rest continues to
          apply. Questions about any of this go to{" "}
          <a href={`mailto:${SENSEI_EMAIL}`}>{SENSEI_EMAIL}</a> — please ask before you
          enrol rather than after.
        </p>
      </section>
    </LegalPage>
  );
}
