import { createClient } from '@supabase/supabase-js'

// Reads config from Vite env vars (set locally in .env, on Vercel as project
// env vars). If they're missing, the app falls back to localStorage so it still
// works offline / in local dev without a backend.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isCloud = Boolean(url && anonKey)

export const supabase = isCloud ? createClient(url, anonKey) : null
