import { useState } from 'react'

// Cute water-drinking reminder popup, shown once after the app finishes loading.
export default function WaterReminder({ onClose }) {
  // When she picks "sorii yrr meri mrzi", switch to the playful scolding view.
  const [scolded, setScolded] = useState(false)

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4
                 backdrop-blur-sm animate-fade-in"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Water reminder"
        className="animate-pop-in w-full max-w-sm overflow-hidden rounded-3xl border border-white/10
                   bg-[#15112a]/95 shadow-2xl shadow-black/50"
      >
        <img
          src="/reminder_water.jpeg"
          alt="Reminder to drink water"
          className="max-h-[55vh] w-full bg-black/20 object-contain"
        />

        <div className="p-6 text-center">
          {scolded ? (
            <>
              <h3 className="text-xl font-bold tracking-tight">Hawwww abhi pee c'mon</h3>

              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  onClick={onClose}
                  className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-6 py-3
                             text-sm font-semibold text-white shadow-lg shadow-sky-900/40
                             transition hover:from-sky-400 hover:to-cyan-300 active:scale-95"
                >
                  okkie
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold tracking-tight">Daily Reminder! 💧</h3>
              <p className="mt-1 text-sm text-white/55">Thoda paani pee lo yrrr</p>

              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  onClick={onClose}
                  className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-6 py-3
                             text-sm font-semibold text-white shadow-lg shadow-sky-900/40
                             transition hover:from-sky-400 hover:to-cyan-300 active:scale-95"
                >
                  abhi peeti hu yrrr
                </button>
                <button
                  onClick={() => setScolded(true)}
                  className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold
                             text-white/70 transition hover:bg-white/10 hover:text-white active:scale-95"
                >
                  sorii yrr meri mrzi
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
