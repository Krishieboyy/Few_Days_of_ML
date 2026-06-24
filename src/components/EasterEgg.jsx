import { useState } from 'react'
import { createPortal } from 'react-dom'

// 💌 Customize this note for her:
const MESSAGE = {
  title: 'Hiiiiiiii',
  body: `If you found this, I just want to let you know that -

I'm so proud of how hard you work. Take a breath, drink your water, and remember someone across the miles is cheering for you. Always. 💌`,
  sign: '— Sailorr',
}

// Realistic egg fill (cream highlight → soft cherry-blossom pink).
const EGG_FILL =
  'radial-gradient(58% 48% at 38% 30%, #ffffff 0%, #fff0f6 30%, #ffd2e6 64%, #f3a9cc 100%)'

// Jagged crack edges (mirror each other so the halves fit together).
const TOP_CLIP =
  'polygon(0 0, 100% 0, 100% 78%, 88% 86%, 78% 76%, 67% 88%, 56% 77%, 45% 90%, 34% 78%, 23% 88%, 12% 79%, 0 87%)'
const BOTTOM_CLIP =
  'polygon(0 87%, 12% 79%, 23% 88%, 34% 78%, 45% 90%, 56% 77%, 67% 88%, 78% 76%, 88% 86%, 100% 78%, 100% 100%, 0 100%)'

const eggShape = { borderRadius: '50% 50% 50% 50% / 60% 60% 42% 42%' }

function Speckles() {
  const dots = [
    { top: '24%', left: '30%', s: 5 },
    { top: '40%', left: '62%', s: 4 },
    { top: '58%', left: '34%', s: 6 },
    { top: '70%', left: '60%', s: 4 },
    { top: '33%', left: '50%', s: 3 },
  ]
  return (
    <>
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-rose-300/50"
          style={{ top: d.top, left: d.left, width: d.s, height: d.s }}
        />
      ))}
    </>
  )
}

export default function EasterEgg() {
  const [open, setOpen] = useState(false)
  const [cracked, setCracked] = useState(false)
  const [shaking, setShaking] = useState(false)

  const summon = () => {
    setOpen(true)
    setCracked(false)
  }
  const close = () => {
    setOpen(false)
    setCracked(false)
    setShaking(false)
  }
  const crack = () => {
    if (cracked || shaking) return
    setShaking(true)
    setTimeout(() => {
      setShaking(false)
      setCracked(true)
    }, 480)
  }

  return (
    <>
      {/* Hidden little egg (placed by its parent, e.g. above the Avg Sleep card) */}
      <button
        onClick={summon}
        aria-label="A little surprise"
        title="hmm… what's this?"
        className="animate-egg-float relative h-12 w-9 opacity-70 shadow-lg
                   transition-all duration-300 hover:scale-125 hover:opacity-100"
        style={{ ...eggShape, background: EGG_FILL }}
      >
        <span className="absolute inset-0 overflow-hidden" style={eggShape}>
          <Speckles />
        </span>
      </button>

      {/* Reveal overlay — portaled to <body> so a transformed ancestor
          (e.g. the -translate-x-1/2 wrapper) can't anchor this fixed layer. */}
      {open && createPortal(
        <div
          className="animate-fade-in fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          <div className="flex flex-col items-center">
            {!cracked ? (
              <>
                {/* Tappable whole egg */}
                <button
                  onClick={crack}
                  aria-label="Tap to open"
                  className={`relative h-56 w-44 cursor-pointer drop-shadow-2xl
                              ${shaking ? 'animate-egg-shake' : 'animate-egg-float'}`}
                  style={{ ...eggShape, background: EGG_FILL }}
                >
                  <span
                    className="absolute inset-0"
                    style={{
                      ...eggShape,
                      boxShadow: 'inset -14px -20px 36px rgba(192,90,140,0.35), inset 12px 12px 26px rgba(255,255,255,0.6)',
                    }}
                  />
                  <span className="absolute inset-0 overflow-hidden" style={eggShape}>
                    <Speckles />
                  </span>
                </button>
                <p className="mt-6 animate-pulse text-sm font-medium text-white/70">
                  tap the egg 🌸
                </p>
              </>
            ) : (
              <>
                {/* Cracked shell halves flying apart + glow */}
                <div className="relative h-56 w-44">
                  <span
                    className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(255,196,224,0.45), transparent 65%)' }}
                  />
                  <span
                    className="animate-shell-top absolute inset-x-0 top-0 h-56 w-44"
                    style={{ ...eggShape, background: EGG_FILL, clipPath: TOP_CLIP }}
                  />
                  <span
                    className="animate-shell-bottom absolute inset-x-0 top-0 h-56 w-44"
                    style={{ ...eggShape, background: EGG_FILL, clipPath: BOTTOM_CLIP }}
                  />
                </div>

                {/* The message */}
                <div className="animate-msg-rise -mt-16 w-full max-w-sm rounded-3xl border border-white/10 bg-[#15112a]/95 p-6 text-center shadow-2xl shadow-black/50">
                  <h3 className="font-display text-xl font-bold tracking-tight text-white">
                    {MESSAGE.title}
                  </h3>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/70">
                    {MESSAGE.body}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-rose-200">{MESSAGE.sign}</p>
                  <button
                    onClick={close}
                    className="mt-6 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-8 py-2.5
                               text-sm font-semibold text-white shadow-lg shadow-violet-900/40
                               transition hover:from-violet-400 hover:to-fuchsia-400 active:scale-95"
                  >
                    close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
