import { PROFILES, PROFILE_IDS } from '../utils/storage'

// Sliding two-option toggle between Sailorr (Krish) and Dora (Bhumika).
export default function ProfileSwitcher({ active, onChange }) {
  const activeIndex = PROFILE_IDS.indexOf(active)

  return (
    <div
      className="relative grid grid-cols-2 gap-1 rounded-full border border-white/10
                 bg-white/5 p-1 backdrop-blur-md shadow-lg shadow-black/20"
      role="tablist"
      aria-label="Switch profile"
    >
      {/* Sliding highlight */}
      <span
        className="absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-full
                   transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(${activeIndex * 100}%)`,
          background: `linear-gradient(135deg, ${PROFILES[active].color}cc, ${PROFILES[active].color}77)`,
          boxShadow: `0 6px 20px -6px ${PROFILES[active].color}aa`,
        }}
        aria-hidden="true"
      />
      {PROFILE_IDS.map((id) => {
        const p = PROFILES[id]
        const isActive = id === active
        return (
          <button
            key={id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className={`relative z-10 flex items-center justify-center gap-2 rounded-full
                        px-4 py-2 text-sm font-semibold transition-colors duration-200
                        ${isActive ? 'text-white' : 'text-white/55 hover:text-white/80'}`}
          >
            <span
              className="h-2.5 w-2.5 rounded-full ring-2 ring-white/30"
              style={{ background: p.color }}
            />
            <span className="leading-none">
              {p.name}
              <span className="ml-1 hidden font-normal opacity-70 sm:inline">
                · {p.realName}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
