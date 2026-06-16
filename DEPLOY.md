# Deploying Dora & Sailorr

Stack: **Vite + React** front end · **Supabase** for shared realtime data · **Vercel** hosting · a shared **passcode** to gate the UI.

The app works with **no backend** too — without Supabase env vars it just uses
`localStorage` (per-device, not shared). The steps below turn on real sharing.

---

## 1. Set up Supabase (the shared database)

1. Create a free account at <https://supabase.com> and make a **New project**.
   Pick a region close to you/Bhumika; save the database password somewhere.
2. When it's ready, open **SQL Editor → New query**, paste the contents of
   [`supabase-schema.sql`](./supabase-schema.sql), and click **Run**.
   This creates the `entries` table, its access policies, and turns on realtime.
3. Go to **Project Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon / public key** → `VITE_SUPABASE_ANON_KEY`

## 2. Try it locally first (optional but recommended)

```bash
cp .env.example .env      # then edit .env with your real values
npm install
npm run dev               # http://localhost:5173
```

Open it in two different browsers, log a task in one, and watch it appear in the
other — that confirms Supabase + realtime are wired up. The footer dot turns
**green** ("Synced & shared in real time") when cloud mode is active.

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "Dora & Sailorr"
# create an empty repo on github.com, then:
git remote add origin https://github.com/<you>/dora-sailorr.git
git branch -M main
git push -u origin main
```

> `.env` is gitignored, so your keys are **not** committed. Good.

## 4. Deploy on Vercel

1. Go to <https://vercel.com>, sign in with GitHub, **Add New → Project**, and
   import the repo. Vercel auto-detects Vite (build `npm run build`, output `dist`).
2. Before deploying, expand **Environment Variables** and add all three:
   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | your Project URL |
   | `VITE_SUPABASE_ANON_KEY` | your anon public key |
   | `VITE_APP_PASSCODE` | a passcode you both share |
3. Click **Deploy**. You'll get a `https://<project>.vercel.app` URL.
   Every future `git push` to `main` auto-deploys.

Share the URL **and** the passcode with Bhumika — that's all she needs.

---

## Security — please read

The passcode and the Supabase anon key are bundled into the public JavaScript,
so the gate keeps **casual** visitors out but is not real security: someone
technical who has the URL could reach the database directly. That's an
acceptable trade-off for two friends tracking study habits.

If you ever want real privacy, switch to **Supabase Auth** (email login) with
row-level policies tied to each user — say the word and it can be added.
