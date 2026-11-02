'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LEGAL } from '@/lib/legal'

const linkClass =
  'text-brand/60 underline-offset-4 duration-300 hover:text-brand hover:underline'

const LegalFooter = () => {
  const pathname = usePathname()

  // The onboarding intro is a full-screen experience; keep it clean.
  if (pathname.startsWith('/onboarding')) return null

  return (
    <footer className="mt-auto border-t border-brand/10 bg-[#f7f3f4] py-4 max-[639px]:py-3">
      <div className="containerMain flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] font-semibold tracking-[0.18em] uppercase max-[639px]:text-[10px] max-[639px]:tracking-[0.14em]">
        <span className="text-brand/45">
          &copy; {new Date().getFullYear()} {LEGAL.brand}
        </span>
        <span className="h-1 w-1 rotate-45 bg-brand/30" aria-hidden="true" />
        <Link href="/privacy" className={linkClass}>
          Privacy
        </Link>
        <Link href="/terms" className={linkClass}>
          Terms
        </Link>
      </div>
    </footer>
  )
}

export default LegalFooter
