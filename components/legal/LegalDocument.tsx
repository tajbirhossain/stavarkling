import Link from 'next/link'
import Header from '@/components/Header'
import { LEGAL } from '@/lib/legal'

type LegalDocumentProps = {
  kicker: string
  title: string
  intro: string
  summary: string[]
  children: React.ReactNode
}

export default function LegalDocument({
  kicker,
  title,
  intro,
  summary,
  children,
}: LegalDocumentProps) {
  return (
    <div>
      <div className="bg-[url('/images/main-bg2.png')] bg-cover bg-center bg-no-repeat">
        <Header ind={-1} />
        <section className="pt-14 pb-16 max-[1023px]:pt-12 max-[639px]:pt-8 max-[639px]:pb-12">
          <div className="containerMain max-w-3xl text-center">
            <p className="mb-4 text-lg font-bold tracking-wide text-brand max-[639px]:text-base">
              {kicker}
            </p>
            <h1 className="relative mb-12 text-6xl leading-none font-semibold text-brand max-[767px]:text-5xl max-[639px]:mb-10 max-[639px]:text-[2.5rem] before:absolute before:bottom-[-1.5rem] before:left-1/2 before:h-0.5 before:w-10 before:-translate-x-1/2 before:bg-brand before:content-['']">
              {title}
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-8 font-medium max-[639px]:text-lg max-[639px]:leading-7">
              {intro}
            </p>
            <p className="mt-5 text-sm font-bold tracking-[0.16em] text-brand/70 uppercase">
              Last updated {LEGAL.lastUpdated}
            </p>
          </div>
        </section>
      </div>

      <div className="bg-[#f7f3f4]">
        <article className="containerMain max-w-3xl py-16 max-[639px]:py-10">
          <aside className="mb-14 rounded-[15px] border border-[rgba(154,35,73,0.15)] bg-[rgba(154,35,73,0.04)] px-8 py-7 max-[639px]:mb-10 max-[639px]:px-5 max-[639px]:py-5">
            <h2 className="mb-3 text-sm font-bold tracking-[0.18em] text-brand uppercase">
              In brief
            </h2>
            <ul className="space-y-2 text-lg leading-7 font-medium max-[639px]:text-base">
              {summary.map((item) => (
                <li key={item} className="flex gap-x-3">
                  <span
                    className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-brand"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-6 font-medium text-[#767676]">
              This summary is for convenience only. The full text below is what applies.
            </p>
          </aside>

          <div className="space-y-12 max-[639px]:space-y-9">{children}</div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-brand/15 pt-8 text-base font-semibold max-[639px]:mt-12">
            <Link href="/artwork" className="text-brand underline-offset-4 hover:underline">
              &larr; Return to the artwork
            </Link>
            <span className="text-[#767676]">
              Questions? Write to{' '}
              <a
                href={`mailto:${LEGAL.contactEmail}`}
                className="text-brand underline-offset-4 hover:underline"
              >
                {LEGAL.contactEmail}
              </a>
            </span>
          </div>
        </article>
      </div>
    </div>
  )
}

export function LegalSection({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="mb-4 flex items-baseline gap-x-3 text-2xl font-semibold text-brand max-[639px]:text-xl">
        <span className="fontCinzel text-lg font-medium text-brand/60">{number}</span>
        {title}
      </h2>
      <div className="space-y-4 text-lg leading-8 font-medium max-[639px]:text-base max-[639px]:leading-7">
        {children}
      </div>
    </section>
  )
}

export function LegalList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="space-y-2 pl-1">
      {children}
    </ul>
  )
}

export function LegalItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-x-3">
      <span
        className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-brand/70"
        aria-hidden="true"
      />
      <span>{children}</span>
    </li>
  )
}
