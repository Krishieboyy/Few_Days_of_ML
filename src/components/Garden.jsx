import { toKey, getMonthGrid, isSameMonth, MONTHS } from '../utils/date'

// A flower garden that blooms with productivity: every day with completed
// tasks grows a flower, fuller-bloomed the more tasks were done that day.
// She can pick which flower grows — and the garden's sky shifts to match.

export const FLOWER_TYPES = {
  blossom: {
    emoji: '🌸',
    label: 'Blossom',
    bg: 'linear-gradient(180deg, rgba(167,139,250,0.16) 0%, rgba(244,114,182,0.08) 55%, transparent 100%)',
    note: 'text-rose-200/80',
  },
  rose: {
    emoji: '🌹',
    label: 'Rose',
    bg: 'linear-gradient(180deg, rgba(244,63,94,0.18) 0%, rgba(190,18,60,0.09) 55%, transparent 100%)',
    note: 'text-rose-200/80',
  },
  tulip: {
    emoji: '🌷',
    label: 'Tulip',
    bg: 'linear-gradient(180deg, rgba(168,85,247,0.18) 0%, rgba(217,70,239,0.09) 55%, transparent 100%)',
    note: 'text-fuchsia-200/80',
  },
  sunflower: {
    emoji: '🌻',
    label: 'Sunflower',
    bg: 'linear-gradient(180deg, rgba(56,189,248,0.18) 0%, rgba(250,204,21,0.12) 60%, transparent 100%)',
    note: 'text-amber-200/80',
  },
}

function Flower({ level, emoji, delay }) {
  // Taller stem + bigger bloom at higher levels.
  const stemH = level === 3 ? 86 : level === 2 ? 64 : 42
  const size = level === 3 ? 40 : level === 2 ? 30 : 22

  return (
    <div className="animate-grow-up" style={{ animationDelay: delay }}>
      <div className="animate-sway flex flex-col items-center" style={{ animationDelay: delay }}>
        <span
          className="leading-none drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)]"
          style={{ fontSize: `${size}px` }}
        >
          {emoji}
        </span>
        <div className="relative -mt-1 w-[3px] rounded-full bg-[#6fbf73]" style={{ height: stemH }}>
          <span
            className="absolute left-1/2 top-1/2 h-2 w-3.5 -translate-y-1/2 rounded-full bg-[#6fbf73]"
            style={{ transform: 'rotate(35deg)' }}
          />
        </div>
      </div>
    </div>
  )
}

export default function Garden({ year, month, entries, flower = 'blossom', onFlowerChange }) {
  const theme = FLOWER_TYPES[flower] ?? FLOWER_TYPES.blossom
  const cells = getMonthGrid(year, month).filter((d) => isSameMonth(d, year, month))

  const flowers = []
  for (const date of cells) {
    const done = (entries[toKey(date)]?.checklist || []).filter((i) => i.done).length
    if (done > 0) {
      flowers.push({ key: toKey(date), level: done >= 4 ? 3 : done >= 2 ? 2 : 1 })
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-4">
        <h3 className="text-base font-bold tracking-tight">Your garden {theme.emoji}</h3>
        <span className="text-xs text-white/45">
          {flowers.length
            ? `${flowers.length} ${flowers.length === 1 ? 'flower' : 'flowers'} this ${MONTHS[month]}`
            : MONTHS[month]}
        </span>
      </div>

      {/* Flower picker */}
      <div className="mt-3 flex flex-wrap gap-1.5 px-5">
        {Object.entries(FLOWER_TYPES).map(([key, t]) => {
          const active = key === flower
          return (
            <button
              key={key}
              onClick={() => onFlowerChange?.(key)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition
                          ${active
                            ? 'border-white/25 bg-white/15 text-white'
                            : 'border-white/10 bg-white/5 text-white/55 hover:bg-white/10 hover:text-white/80'}`}
            >
              <span className="text-sm">{t.emoji}</span>
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Garden bed */}
      <div
        className="relative mt-3 flex min-h-[150px] flex-wrap items-end justify-center gap-x-1 gap-y-0 px-4 pt-4"
        style={{ background: theme.bg }}
      >
        {flowers.length === 0 ? (
          <div className="flex flex-col items-center gap-2 pb-8 text-center">
            <span className="text-3xl">🌱</span>
            <p className="text-sm text-white/50">
              Complete tasks to grow your garden — every day blooms a flower.
            </p>
          </div>
        ) : (
          flowers.map((f, i) => (
            <Flower key={f.key} level={f.level} emoji={theme.emoji} delay={`${(i % 12) * 0.06}s`} />
          ))
        )}

        {/* Soil */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-emerald-950/70 to-emerald-900/10" />
      </div>

      {flowers.length > 0 && (
        <p className={`px-5 py-3 text-center text-xs font-medium ${theme.note}`}>
          Look how much you’ve grown this month — keep blooming {theme.emoji}
        </p>
      )}
    </section>
  )
}
