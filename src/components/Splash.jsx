// Warm welcome splash shown right after unlocking, while data loads.
export default function Splash() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="animate-pop-in text-center">
        <h1
          className="font-display text-5xl font-extrabold leading-tight tracking-tight
                     bg-gradient-to-r from-violet-300 via-fuchsia-300 to-amber-200
                     bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(167,139,250,0.35)]
                     sm:text-7xl"
        >
          Good morning,
          <br />
          Sunshine{' '}
          <span className="inline-block animate-bounce-slow align-middle">☀️</span>
        </h1>

        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-white/45">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/15 border-t-violet-400" />
          Syncing your study data…
        </div>
      </div>
    </div>
  )
}
