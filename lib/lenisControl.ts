let lenisInstance: { stop: () => void; start: () => void } | null = null

export function setLenisInstance(
  instance: { stop: () => void; start: () => void } | null
) {
  lenisInstance = instance
}

export function stopLenis() {
  lenisInstance?.stop()
}

export function startLenis() {
  lenisInstance?.start()
}
