import ConfidentialFooter from '@/components/access/ConfidentialFooter'
import Header from '@/components/Header'
import { requireAccessStage } from '@/lib/requireAccessStage'

const CONTACT_EMAIL = 'private@stavarkling.com'

export default async function PrivateAcquisitionPage() {
  await requireAccessStage(3)

  return (
    <div>
      <div className="relative overflow-hidden bg-[url('/images/hero-bg.png')] bg-cover bg-[position:center_top] max-[639px]:bg-[position:72%_center]">
        <Header ind={4} />
        <section className="relative pt-22 pb-36 max-[1023px]:pt-18 max-[1023px]:pb-28 max-[639px]:pt-14 max-[639px]:pb-20">
          <div className="containerMain max-w-3xl text-left max-[1023px]:text-center">
            <h4 className="mb-4 text-lg font-bold tracking-wide text-brand max-[639px]:text-base">
              PRIVATE ACQUISITION
            </h4>
            <h1 className="mb-5 text-5xl leading-none font-semibold text-brand max-[767px]:text-[42px] max-[767px]:leading-14 max-[639px]:text-[2.625rem] max-[639px]:leading-tight">
              Begin the conversation
            </h1>
            <p className="relative mb-10 max-w-2xl text-2xl font-semibold italic max-[767px]:text-xl max-[639px]:text-lg before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:bg-brand before:content-[''] max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2">
              This opens a private process. It does not confirm a purchase,
              reserve the artwork, or transfer ownership.
            </p>
            <p className="mb-8 max-w-2xl text-[22px] font-semibold leading-8 max-[639px]:text-lg max-[639px]:leading-7">
              When you are ready, write to us. We will continue the acquisition
              of Stavarkle #1 —{' '}
              <span className="text-brand">Universe. Decided.</span> — with you
              personally.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                'Private acquisition — Stavarkle #1'
              )}`}
              className="btnGradient inline-flex items-center justify-center gap-x-7 px-6 py-3 text-lg duration-300 hover:gap-x-9 max-[639px]:gap-x-5 max-[639px]:px-5 max-[639px]:text-base"
            >
              CONTACT PRIVATE ACCESS
              <img
                src="/images/icons/arrow-right.png"
                alt=""
                className="w-5 brightness-[100]"
              />
            </a>
            <p className="mt-5 text-base font-medium text-brand/80">
              {CONTACT_EMAIL}
            </p>
          </div>
        </section>
      </div>

      <div className="bg-[#f7f3f4]">
        <ConfidentialFooter />
      </div>
    </div>
  )
}
