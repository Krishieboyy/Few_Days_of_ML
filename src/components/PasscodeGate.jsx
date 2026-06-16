import { useState } from 'react'

// Lightweight shared-passcode gate for the whole app.
//
// SECURITY NOTE: this only hides the UI. The passcode lives in the JS bundle
// (VITE_ vars are public), so it keeps casual visitors out but is NOT real
// security. For true privacy, switch to Supabase Auth + row-level policies.
const PASSCODE = import.meta.env.VITE_APP_PASSCODE
const UNLOCK_KEY = 'dora-sailorr:unlocked'

export default function PasscodeGate({ children }) {
  // No passcode configured -> no gate (handy for local dev).
  const gated = Boolean(PASSCODE)

  const [unlocked, setUnlocked] = useState(
    () => !gated || sessionStorage.getItem(UNLOCK_KEY) === '1',
  )
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  if (unlocked) return children

  const submit = (e) => {
    e.preventDefault()
    if (value === PASSCODE) {
      sessionStorage.setItem(UNLOCK_KEY, '1')
      setUnlocked(true)
    } else {
      setError(true)
      setValue('')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.04] p-8
                   text-center shadow-2xl shadow-black/40 backdrop-blur-xl animate-pop-in"
      >
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg"
          style={{ background: 'linear-gradient(135deg, #a78bfa, #f0abfc)' }}
        >
          D&S
        </div>
        <h1 className="text-xl font-bold tracking-tight">Dora &amp; Sailorr</h1>
        <p className="mt-1 mb-6 text-sm text-white/45">Enter the passcode to continue</p>

        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(false)
          }}
          placeholder="Passcode"
          className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-center text-sm text-white
                      placeholder:text-white/30 outline-none transition focus:bg-white/10
                      ${error ? 'border-rose-400/70 focus:ring-2 focus:ring-rose-400/30' : 'border-white/10 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/30'}`}
        />
        {error && <p className="mt-2 text-xs text-rose-300">Incorrect passcode — try again.</p>}

        <button
          type="submit"
          className="mt-5 w-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3
                     text-sm font-semibold text-white shadow-lg shadow-violet-900/40
                     transition hover:from-violet-400 hover:to-fuchsia-400 active:scale-95"
        >
          Unlock
        </button>
      </form>
    </div>
  )
}
