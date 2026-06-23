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

        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-white/45">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/15 border-t-violet-400" />
          Syncing your study data…
        </div>
      </div>
    </div>
  )
}
