import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { SENSEI_EMAIL, SITE, pageMeta } from "@/lib/seo";
import "../legal.css";

/* Written against what this site verifiably does, not a template:
   - the trial form is the ONLY place it collects anything;
   - the form posts to /api/contact, which emails Sensei and stores nothing;
   - there are no analytics, no trackers, no third-party embeds;
   - it sets no cookies at all (verified against the deployment's headers);
   - fonts are self-hosted by next/font, so no request leaves for Google Fonts.
   If any of that changes, this page has to change in the same commit. */

const TITLE = "Privacy Policy";
const DESC =
  "What Yume Ga Kanau collects when you request a trial class, who can see it, how long it is kept, and how to have it deleted.";

export const metadata: Metadata = pageMeta({
  title: TITLE,
  description: DESC,
  path: "/privacy",
  ogDescription: "What we collect, who sees it, and how to have it deleted.",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy · プライバシー"
      title="Privacy Policy"
      standfirst="This site asks for as little as possible. The only information it collects is what you type into the trial-class form, and the only thing that happens to it is that it arrives in Sensei's inbox."
      summary={
        <>
          <p>
            We collect your <strong>name, email address, your current level, what you
            want from the classes, and anything you write in the notes box</strong> — only
            when you choose to submit the trial-class form.
          </p>
          <p>
            That form sends one email to Parveen Kaur Sensei. It is not saved to any
            database, not sold, not shared for advertising, and not used to build a
            profile of you. This website sets <strong>no cookies</strong> and runs
            <strong> no analytics or tracking</strong> of any kind.
          </p>
          <p>
            You can ask us to delete everything we hold about you at any time, and we
            will.
          </p>
        </>
      }
      path="/privacy"
      metaTitle={TITLE}
      metaDescription={DESC}
    >
      <section id="who-we-are">
        <h2>
          <span className="lg-n">01</span>Who we are
        </h2>
        <p>
          Yume Ga Kanau™ (Yume Ga Kanau Japanese Learning Institute) is an online
          Japanese language institute founded in December 2025 by Parveen Kaur, who
          teaches the classes and is the person responsible for the information
          described here. We operate from India and teach students worldwide.
        </p>
        <p>
          For anything in this policy, including a request to see or delete your data,
          write to <a href={`mailto:${SENSEI_EMAIL}`}>{SENSEI_EMAIL}</a>. That address
          is also our point of contact for grievances under India&rsquo;s Digital
          Personal Data Protection Act, 2023.
        </p>
      </section>

      <section id="what-we-collect">
        <h2>
          <span className="lg-n">02</span>What we collect, and why
        </h2>
        <p>
          There is exactly one place on this website where you can give us
          information: the trial-class form on the{" "}
          <Link href="/contact">contact page</Link>. Nothing is collected as you browse.
        </p>
        <dl className="lg-defs">
          <dt>Name</dt>
          <dd>So Sensei knows who she is replying to.</dd>
          <dt>Email address</dt>
          <dd>So she can reply to you. Replies go to this address and nowhere else.</dd>
          <dt>Current level</dt>
          <dd>
            To judge which of the four stages to suggest, and which batch might suit you.
          </dd>
          <dt>What you want</dt>
          <dd>
            Whether you are aiming at the JLPT, at conversation, or at Business Japanese,
            so the trial class is pitched usefully.
          </dd>
          <dt>Your notes</dt>
          <dd>
            Anything else you choose to tell us — your timezone, your schedule, a
            question. This box is optional, and it is entirely up to you what goes in it.
          </dd>
        </dl>
        <p>
          Our lawful basis for using this is simple: you asked us to contact you about
          classes, and we cannot answer without it. If you later enrol, we will use the
          same details to run your classes.
        </p>
        <h3>What we deliberately do not collect</h3>
        <ul>
          <li>
            <strong>No account, no password.</strong> There is nothing to sign up for on
            this website.
          </li>
          <li>
            <strong>No payment details.</strong> No payment is taken through this site.
            Fees, when they apply, are arranged separately with Sensei.
          </li>
          <li>
            <strong>No tracking.</strong> No analytics, no advertising pixels, no
            fingerprinting, no session recording, no third-party scripts.
          </li>
          <li>
            <strong>No cookies.</strong> See the <Link href="/cookies">Cookie Policy</Link>.
          </li>
        </ul>
      </section>

      <section id="where-it-goes">
        <h2>
          <span className="lg-n">03</span>Where your information goes
        </h2>
        <p>
          When you submit the form, our server composes a single email and sends it to
          Sensei&rsquo;s inbox. The website itself keeps no copy — there is no database
          behind it. Three companies are unavoidably involved, and it is fair that you
          know who they are:
        </p>
        <dl className="lg-defs">
          <dt>Vercel</dt>
          <dd>
            Hosts this website and runs the code that sends the email. Like any web host,
            its servers process your IP address and browser type in order to serve pages,
            and keep short-lived operational logs. It does not receive a copy of your
            enquiry.
          </dd>
          <dt>Google (Gmail)</dt>
          <dd>
            Carries and stores the email once it is sent, because Sensei&rsquo;s inbox is
            a Gmail account. Your enquiry therefore sits in that mailbox, subject to
            Google&rsquo;s terms.
          </dd>
          <dt>WhatsApp (Meta)</dt>
          <dd>
            Only if you choose it. The WhatsApp button opens a chat with our number — at
            which point Meta processes that conversation under its own policies. Enrolled
            students also receive study materials through a batch WhatsApp group, which
            means the other students in that group can see your display name and number.
          </dd>
        </dl>
        <p>
          We do not sell your information, we do not rent it, and we do not pass it to
          advertisers or data brokers. We would only ever disclose it if the law
          required us to.
        </p>
        <p>
          Because Sensei teaches internationally and these services operate globally,
          your information may be processed on servers outside your country, including
          outside India and the EEA.
        </p>
      </section>

      <section id="how-long">
        <h2>
          <span className="lg-n">04</span>How long we keep it
        </h2>
        <ul>
          <li>
            <strong>If you enquire and do not enrol:</strong> the email stays in
            Sensei&rsquo;s inbox so she can follow up, and is deleted on request. We
            review and clear old enquiries periodically.
          </li>
          <li>
            <strong>If you enrol:</strong> we keep what we need to teach you and to meet
            any tax or accounting obligation, and no longer.
          </li>
          <li>
            <strong>If you ask us to delete it:</strong> we delete it, except where we
            are legally required to retain a record.
          </li>
        </ul>
      </section>

      <section id="your-rights">
        <h2>
          <span className="lg-n">05</span>Your rights
        </h2>
        <p>
          Wherever you are, you can ask us to do any of the following, free of charge,
          by writing to <a href={`mailto:${SENSEI_EMAIL}`}>{SENSEI_EMAIL}</a>:
        </p>
        <ul>
          <li>tell you what we hold about you, and give you a copy;</li>
          <li>correct anything that is wrong or out of date;</li>
          <li>delete what we hold;</li>
          <li>stop using it for a particular purpose;</li>
          <li>
            raise a complaint about how we have handled it — and, if we cannot resolve it
            between us, take that complaint to your data protection authority.
          </li>
        </ul>
        <p>
          Students in India have these rights under the Digital Personal Data Protection
          Act, 2023, and may complain to the Data Protection Board of India. Students in
          the UK and the EU have equivalent rights under the UK GDPR and the GDPR,
          including the right to complain to their national supervisory authority. We
          aim to answer any such request within 30 days.
        </p>
      </section>

      <section id="children">
        <h2>
          <span className="lg-n">06</span>Learners under 18
        </h2>
        <p>
          We teach younger learners, and we take this seriously. If the student is under
          18, the trial-class form should be filled in by a parent or legal guardian,
          who is the person we will then correspond with. We do not knowingly collect
          information directly from a child without that consent, we do not use a
          child&rsquo;s information for advertising or profiling of any kind, and if we
          find we have collected something we should not have, we delete it. A parent or
          guardian can contact us at any time to see, correct or delete their
          child&rsquo;s information.
        </p>
      </section>

      <section id="security">
        <h2>
          <span className="lg-n">07</span>Keeping it safe
        </h2>
        <p>
          The site is served over HTTPS, so what you type into the form is encrypted in
          transit, and the email is sent over an authenticated, encrypted connection to
          Google&rsquo;s mail servers. Because we store nothing ourselves, there is no
          database of student enquiries to be breached. Access to Sensei&rsquo;s inbox is
          protected by two-step verification.
        </p>
        <p>
          No method of transmission is perfectly secure, and we will not pretend
          otherwise — but we have kept the amount of information at risk as small as we
          reasonably can.
        </p>
      </section>

      <section id="changes">
        <h2>
          <span className="lg-n">08</span>Changes to this policy
        </h2>
        <p>
          If we start doing something new with your information — adding analytics, say,
          or taking payments on the site — we will update this page and change the
          &ldquo;last reviewed&rdquo; date at the top before that change goes live. This
          policy applies to {SITE.url.replace(/^https?:\/\//, "")} only; pages we link to
          elsewhere have their own.
        </p>
      </section>
    </LegalPage>
  );
}
