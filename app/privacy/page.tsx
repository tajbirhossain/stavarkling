import type { Metadata } from 'next'
import LegalDocument, {
  LegalItem,
  LegalList,
  LegalSection,
} from '@/components/legal/LegalDocument'
import { LEGAL } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Privacy Policy | Stavarkling',
  description:
    'How Stavarkling collects, uses and protects personal data when you visit the site or apply for access.',
}

export default function PrivacyPage() {
  return (
    <LegalDocument
      kicker="LEGAL"
      title="Privacy Policy"
      intro="We collect as little as we need, we use it only for the private process you ask to take part in, and we never sell it. This page explains exactly what that means."
      summary={[
        'We collect your name, email, country and optional note only when you apply for access.',
        'We use cookies and browser storage only to make the site work. No advertising or analytics trackers.',
        'We never sell your data. A small number of service providers process it on our behalf.',
        `You can ask us to see, correct or delete your data at any time: ${LEGAL.contactEmail}.`,
      ]}
    >
      <LegalSection number="01" title="Who we are">
        <p>
          This website is operated by {LEGAL.entityName} (&ldquo;{LEGAL.brand}&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo;) and presents a single original artwork,{' '}
          <em>Stavarkle #1 &mdash; Universe. Decided.</em> We are the controller of the personal data
          described in this policy.
        </p>
        <p>
          Contact for anything related to privacy:{' '}
          <a
            href={`mailto:${LEGAL.contactEmail}`}
            className="text-brand underline-offset-4 hover:underline"
          >
            {LEGAL.contactEmail}
          </a>
          {LEGAL.postalAddress ? <>. Postal address: {LEGAL.postalAddress}</> : null}.
        </p>
      </LegalSection>

      <LegalSection number="02" title="What we collect">
        <p>
          Browsing the public pages does not require you to give us any personal data. We collect
          data only in the situations below.
        </p>
        <LegalList>
          <LegalItem>
            <strong>When you apply for access:</strong> your full name, email address, country and,
            if you choose to write one, a personal note explaining your interest.
          </LegalItem>
          <LegalItem>
            <strong>When you verify your email to enter Access:</strong> your email address and a
            one-time six-digit code. The code is stored only in scrambled (hashed) form and expires
            after {LEGAL.verificationCodeMinutes} minutes.
          </LegalItem>
          <LegalItem>
            <strong>While you use Access:</strong> which stage you have been granted and are viewing,
            and any request you make to move to the next stage, with the time it was made.
          </LegalItem>
          <LegalItem>
            <strong>Technical data with your submissions:</strong> your IP address and browser or
            device details (user agent), recorded when you submit an application or a request. We use
            these to protect the site against abuse and duplicate or automated submissions.
          </LegalItem>
          <LegalItem>
            <strong>When you write to us:</strong> your email address, the content of your messages
            and any information you choose to share, including during a private acquisition
            conversation.
          </LegalItem>
        </LegalList>
        <p>
          We do not ask for payment details on this website. If an acquisition goes ahead, payment is
          arranged privately and separately.
        </p>
      </LegalSection>

      <LegalSection number="03" title="Why we use it, and our legal basis">
        <LegalList>
          <LegalItem>
            <strong>To review your application and run the Access journey</strong> &mdash; so that we
            can take the steps you ask for before any possible agreement (GDPR Art. 6(1)(b)).
          </LegalItem>
          <LegalItem>
            <strong>To keep the site secure and prevent misuse,</strong> including limiting repeated
            attempts and detecting duplicate submissions &mdash; our legitimate interest in protecting
            the site and the people who use it (Art. 6(1)(f)).
          </LegalItem>
          <LegalItem>
            <strong>To reply to you and keep a record of our correspondence</strong> &mdash; the same
            steps-before-agreement basis, and our legitimate interest in keeping accurate records.
          </LegalItem>
          <LegalItem>
            <strong>To meet legal duties.</strong> Sales of artworks of this value can be subject to
            anti-money-laundering and tax rules. If an acquisition progresses, we may be required to
            verify identity and the source of funds. We will tell you what is needed at that point and
            use that information only for that purpose (Art. 6(1)(c)).
          </LegalItem>
        </LegalList>
        <p>
          We do not use your data for marketing. We will not send you promotional email unless you
          clearly ask us to. Decisions about applications are made by a person, not by automated
          decision-making or profiling.
        </p>
      </LegalSection>

      <LegalSection number="04" title="Cookies and browser storage">
        <p>
          We use only what is needed to make the site work. We do not use advertising, tracking or
          analytics cookies, and we do not embed third-party trackers.
        </p>
        <LegalList>
          <LegalItem>
            <strong>stavarkling_access_session</strong> (cookie): keeps you signed in to Access after
            you verify your email. Strictly necessary and not readable by scripts on the page. Lasts up
            to {LEGAL.accessSessionDays} days.
          </LegalItem>
          <LegalItem>
            <strong>stavarkling_onboarding_complete</strong> (cookie and local storage): remembers that
            you have already seen the introduction, so it is not shown again. Lasts up to one year.
          </LegalItem>
          <LegalItem>
            <strong>Session storage</strong> (cleared when you close the tab): holds the draft of an
            application you are filling in, so you do not lose it by going back a step, and notes which
            animations have already played.
          </LegalItem>
        </LegalList>
        <p>
          You can clear cookies and storage at any time in your browser settings. Doing so will sign
          you out of Access and show the introduction again.
        </p>
      </LegalSection>

      <LegalSection number="05" title="Who we share data with">
        <p>We do not sell or rent personal data. We use a few service providers who process data only on our instructions:</p>
        <LegalList>
          <LegalItem>Database hosting (Supabase) &mdash; stores applications, access records and requests.</LegalItem>
          <LegalItem>Email delivery (Resend) &mdash; sends your verification codes.</LegalItem>
          <LegalItem>Mailbox provider (Zoho Mail) &mdash; hosts the mailbox we use to correspond with you.</LegalItem>
          <LegalItem>Website hosting &mdash; serves the site and processes technical request data.</LegalItem>
        </LegalList>
        <p>
          We may also disclose data where the law requires it, to respond to valid requests from
          authorities, or to professional advisers bound by confidentiality.
        </p>
      </LegalSection>

      <LegalSection number="06" title="International transfers">
        <p>
          Some providers may process data outside the European Economic Area or the United Kingdom.
          Where they do, we rely on safeguards recognised by law, such as the European Commission&rsquo;s
          standard contractual clauses or an adequacy decision.
        </p>
      </LegalSection>

      <LegalSection number="07" title="How long we keep it">
        <LegalList>
          <LegalItem>
            <strong>Verification codes</strong> expire after {LEGAL.verificationCodeMinutes} minutes.
          </LegalItem>
          <LegalItem>
            <strong>Sign-in sessions</strong> expire after {LEGAL.accessSessionDays} days, or sooner if
            you clear your cookies.
          </LegalItem>
          <LegalItem>
            <strong>Applications and related records</strong> are kept while your application is active
            and for up to {LEGAL.applicationRetentionMonths} months after our last contact, then
            deleted or anonymised.
          </LegalItem>
          <LegalItem>
            <strong>If an acquisition takes place,</strong> we keep the records of it for as long as tax,
            accounting and anti-money-laundering law requires.
          </LegalItem>
        </LegalList>
        <p>You can ask us to delete your data earlier, as described below.</p>
      </LegalSection>

      <LegalSection number="08" title="Your rights">
        <p>Depending on where you live, you can ask us to:</p>
        <LegalList>
          <LegalItem>give you a copy of the personal data we hold about you;</LegalItem>
          <LegalItem>correct anything that is inaccurate or incomplete;</LegalItem>
          <LegalItem>delete your data, or restrict how we use it;</LegalItem>
          <LegalItem>give you your data in a portable format;</LegalItem>
          <LegalItem>stop using your data where we rely on legitimate interests;</LegalItem>
          <LegalItem>withdraw consent, where we rely on it, without affecting what came before.</LegalItem>
        </LegalList>
        <p>
          Write to{' '}
          <a
            href={`mailto:${LEGAL.contactEmail}`}
            className="text-brand underline-offset-4 hover:underline"
          >
            {LEGAL.contactEmail}
          </a>{' '}
          and we will reply within one month. We may need to confirm your identity first. You also have
          the right to complain to the data protection authority in the country where you live or work.
        </p>
      </LegalSection>

      <LegalSection number="09" title="How we protect it">
        <p>
          Data is sent over encrypted connections. Verification codes and sign-in tokens are stored
          only in hashed form. Access to the systems that hold applications is limited to the people who
          need it and protected by authentication. No system is perfectly secure, but we take
          reasonable steps to protect your data and will notify you and the authorities where the law
          requires if something goes wrong.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Age">
        <p>
          This site is intended for adults. You must be at least 18 to apply for access, and we do not
          knowingly collect data from anyone younger. If you believe a young person has given us data,
          please tell us and we will delete it.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Changes to this policy">
        <p>
          If we change how we use personal data we will update this page and the date at the top. If a
          change is significant, we will also tell people with an active application by email.
        </p>
      </LegalSection>
    </LegalDocument>
  )
}
