const ConfidentialFooter = () => {
  return (
    <footer className="pb-16 pt-4">
      <div className="containerMain flex flex-col items-center">
        <div className="access-reveal flex flex-col items-center">
          <img
            src="/images/icons/lotus-solid-icon.png"
            alt=""
            className="w-6 mb-4"
          />
          <p className="text-brand text-sm font-bold tracking-[0.18em] text-center leading-7 mb-5">
            ONE ARTWORK. ONE COLLECTOR. ONE DECISION.
          </p>
          <div className="flex items-center gap-x-3">
            <span className="w-28 h-px bg-brand/30" />
            <span className="w-2 h-2 rotate-45 border border-brand/50 shrink-0" />
            <span className="w-28 h-px bg-brand/30" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default ConfidentialFooter
