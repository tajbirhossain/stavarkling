import type { Metadata } from 'next'
import Link from 'next/link'
import LegalDocument, {
  LegalItem,
  LegalList,
  LegalSection,
} from '@/components/legal/LegalDocument'
import { LEGAL } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Stavarkling',
  description:
    'The terms that apply to using the Stavarkling website, applying for access and enquiring about the artwork.',
}

export default function TermsPage() {
  return (
    <LegalDocument
      kicker="LEGAL"
      title="Terms & Conditions"
      intro="These terms explain what this website is, what applying for access does and does not mean, and how the artwork may eventually be acquired. Please read them before you apply."
      summary={[
        'This website presents one artwork. It is not a shop, and nothing here is a binding offer or a sale.',
        'Applying for access or starting a private conversation does not confirm a purchase, reserve the artwork or transfer ownership.',
        'Any acquisition happens only through a separate written agreement signed by both sides.',
        'Access is personal, selective and granted at our discretion.',
      ]}
    >
      <LegalSection number="01" title="About these terms">
        <p>
          These terms apply to your use of this website, operated by {LEGAL.entityName}{' '}
          (&ldquo;{LEGAL.brand}&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), including applying for
          access and contacting us about the artwork. By using the site you agree to them. If you do
          not agree, please do not use it. How we handle personal data is explained in our{' '}
          <Link href="/privacy" className="text-brand underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection number="02" title="What this website is">
        <p>
          The site presents a single original artwork, <em>Stavarkle #1 &mdash; Universe. Decided.</em>,
          and the experiment around it. It is an artistic and informational presentation. It is not an
          online shop, an auction, or a financial or investment product.
        </p>
        <p>
          Descriptions, dimensions, images and the price shown are provided to inform your interest.
          Colours and detail on screen may differ from the physical work, and measurements are
          approximate.
        </p>
      </LegalSection>

      <LegalSection number="03" title="No offer, no sale, no reservation">
        <p>
          Nothing on this website is an offer capable of acceptance. The price shown is the price at
          which the artist is willing to begin a private conversation, not a binding price. Applying
          for access, moving through the stages, or contacting us through the private acquisition
          page:
        </p>
        <LegalList>
          <LegalItem>does not confirm a purchase;</LegalItem>
          <LegalItem>does not reserve the artwork for you; and</LegalItem>
          <LegalItem>does not transfer ownership of, or any right in, the artwork.</LegalItem>
        </LegalList>
        <p>
          The artwork remains available only until it is sold, and the artist may withdraw, change or
          decline any enquiry at any time and without giving a reason.
        </p>
      </LegalSection>

      <LegalSection number="04" title="Applying for access">
        <p>
          Access is selective. By applying, you confirm that:
        </p>
        <LegalList>
          <LegalItem>you are at least 18 years old and able to enter into a legal agreement;</LegalItem>
          <LegalItem>the information you give is accurate, and you will keep it up to date; and</LegalItem>
          <LegalItem>you are applying for yourself, or are authorised to act for the person you name.</LegalItem>
        </LegalList>
        <p>
          We review applications personally and decide at our sole discretion. You have no right to be
          granted access or to move to a particular stage. We may change, pause or withdraw access at
          any time, including after it has been granted. Access is personal and may not be shared or
          transferred, and you are responsible for activity on your access.
        </p>
      </LegalSection>

      <LegalSection number="05" title="Private acquisition">
        <p>
          If you begin a private conversation about acquiring the artwork, we will discuss price,
          taxes and duties, payment, delivery, insurance and any other terms with you directly. An
          acquisition exists only once a written agreement has been signed by you and by us, and only
          on the terms of that agreement.
        </p>
        <p>
          Before any agreement, we may need to verify your identity and the source of funds to comply
          with the law. If we cannot complete those checks to our satisfaction, we may decline to
          proceed. Either side may end the conversation at any time before an agreement is signed.
        </p>
      </LegalSection>

      <LegalSection number="06" title="Using the site responsibly">
        <p>You agree not to:</p>
        <LegalList>
          <LegalItem>give false or misleading information or impersonate anyone;</LegalItem>
          <LegalItem>use bots, scrapers or other automated means to submit forms or collect content;</LegalItem>
          <LegalItem>attempt to bypass access controls or gain unauthorised access to any part of the site or its systems;</LegalItem>
          <LegalItem>interfere with the site&rsquo;s operation or security; or</LegalItem>
          <LegalItem>use the site for any unlawful purpose.</LegalItem>
        </LegalList>
        <p>We may suspend or refuse access if we reasonably believe these terms are being breached.</p>
      </LegalSection>

      <LegalSection number="07" title="Intellectual property">
        <p>
          The artwork, its images, the texts, design, logo and name &ldquo;{LEGAL.brand}&rdquo; are
          protected by copyright and other rights and belong to the artist or us. You may view them
          for your own personal consideration of the artwork. You may not copy, publish, reproduce or
          use them commercially without our prior written permission.
        </p>
        <p>
          Owning the physical artwork does not by itself give you copyright or reproduction rights.
          Any such rights are granted only if set out in writing in an acquisition agreement.
        </p>
      </LegalSection>

      <LegalSection number="08" title="Artistic statements are not advice">
        <p>
          The texts on this site, including statements about value, decision and belief, are part of
          the artwork&rsquo;s concept. They are artistic expression, not financial, investment, tax or
          legal advice, and we make no promise that the artwork will hold or increase in value. If you
          need advice, please take it from a qualified professional before deciding.
        </p>
      </LegalSection>

      <LegalSection number="09" title="Availability and accuracy">
        <p>
          We work to keep the site accurate and available, but we provide it &ldquo;as is&rdquo; and
          cannot promise it will be uninterrupted or free of errors. We may change or remove content,
          features or access at any time.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Our liability">
        <p>
          Nothing in these terms limits liability that cannot be limited by law, including liability
          for death or personal injury caused by negligence, for fraud, or for fraudulent
          misrepresentation, or any rights you have as a consumer under mandatory law.
        </p>
        <p>
          Subject to that, we are not liable for loss arising from your use of, or inability to use,
          the website, or from reliance on its content, except where we have caused it through our own
          breach of these terms or negligence. Once an acquisition agreement exists, its own terms
          govern the acquisition.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Changes to these terms">
        <p>
          We may update these terms from time to time. The version on this page, with the date at the
          top, is the one that applies when you use the site. Changes do not affect any acquisition
          agreement already signed.
        </p>
      </LegalSection>

      <LegalSection number="12" title="Law and disputes">
        <p>
          These terms, and any dispute about the use of this website, are governed by the law of the
          country in which {LEGAL.entityName} is established, and the courts of that country have
          jurisdiction, unless mandatory consumer law gives you the right to rely on the law or courts
          of the country where you live. Any acquisition agreement will state its own governing law
          and forum.
        </p>
        <p>
          If any part of these terms is found to be unenforceable, the rest remains in effect. Our
          failure to enforce a term is not a waiver of it.
        </p>
      </LegalSection>

      <LegalSection number="13" title="Contact">
        <p>
          Questions about these terms:{' '}
          <a
            href={`mailto:${LEGAL.contactEmail}`}
            className="text-brand underline-offset-4 hover:underline"
          >
            {LEGAL.contactEmail}
          </a>
          {LEGAL.postalAddress ? <>. Postal address: {LEGAL.postalAddress}</> : null}.
        </p>
      </LegalSection>
    </LegalDocument>
  )
}
