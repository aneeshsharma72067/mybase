/**
 * Suspense fallback shown while a lazily-loaded page chunk is fetched. Kept
 * minimal and centered so it reads as a brief loading beat, not a layout shift.
 */
export function PageFallback() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}
