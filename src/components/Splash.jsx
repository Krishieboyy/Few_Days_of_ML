// Warm welcome splash shown right after unlocking, while data loads.

// Drifting cherry blossom petals — each gets a random column, size, speed & delay.
const PETALS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: `${1 + Math.random() * 1.6}rem`,
  duration: `${7 + Math.random() * 7}s`,
  delay: `${-Math.random() * 10}s`,
}))

export default function Splash() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* Floating petals */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {PETALS.map((p) => (
          <span
            key={p.id}
            className="animate-petal"
            style={{
              left: p.left,
              fontSize: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          >
            🌸
          </span>
        ))}
      </div>

      <div className="animate-pop-in relative text-center">
        <h1
          className="font-display text-5xl font-extrabold leading-tight tracking-tight
                     bg-gradient-to-r from-violet-300 via-fuchsia-300 to-amber-200
                     bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(167,139,250,0.35)]
                     sm:text-7xl"
        >
          Good morning,
          <br />
          Cherry Blossom{' '}
          <span className="inline-block animate-bounce-slow align-middle">🌸</span>
        </h1>

        <p className="mx-auto mt-5 max-w-md font-display text-base font-medium text-white/65 sm:text-lg">
          “Keep blooming, the way you make my day bloom 🌸
        </p>

        <div className="mt-10 flex flex-col items-center gap-3.5">
          {/* Progress track with a cherry blossom guiding the fill */}
          <div className="relative h-2.5 w-64 rounded-full bg-white/10 sm:w-80">
            <div
              className="animate-loadbar relative h-full rounded-full
                         bg-gradient-to-r from-violet-400 via-fuchsia-400 to-rose-300
                         shadow-[0_0_14px_rgba(244,114,182,0.6)]"
            >
              <span className="animate-petal-guide absolute -right-3 top-1/2 text-xl drop-shadow-[0_2px_6px_rgba(244,114,182,0.6)]">
                🌸
              </span>
            </div>
          </div>
          <p className="text-sm font-medium text-white/55">Syncing your study data…</p>
        </div>
      </div>
    </div>
  )
}
