# DC Tracker

Dayton Christian daily task + basketball shot tracker for Kenley and Kellen.

Built with React + Vite + Supabase, deployed as a PWA on Vercel.

---

## Setup (one-time, ~20 minutes)

### 1. GitHub

```bash
git init
git add .
git commit -m "Initial scaffold"
# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/dc-tracker.git
git push -u origin main
```

### 2. Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project (choose a region close to Ohio)
3. Go to **SQL Editor → New Query**, paste the contents of `supabase-schema.sql`, and click **Run**
4. Go to **Project Settings → API** and copy:
   - **Project URL** → this is your `VITE_SUPABASE_URL`
   - **anon / public key** → this is your `VITE_SUPABASE_ANON_KEY`

### 3. Local development

```bash
# Install dependencies
npm install

# Copy env template and fill in your Supabase values
cp .env.example .env.local
# Edit .env.local with your URL and anon key

# Start dev server
npm run dev
```

Open http://localhost:5173

### 4. Vercel

1. Create a free account at [vercel.com](https://vercel.com) — sign in with GitHub
2. Click **Add New Project** → import your `dc-tracker` GitHub repo
3. Vercel auto-detects Vite — no build config needed
4. Add environment variables under **Settings → Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**

Every `git push main` triggers an automatic redeploy.

### 5. Install as PWA on iPad

1. Open the Vercel URL in **Safari** on the iPad
2. Tap the **Share** button (box with arrow)
3. Tap **Add to Home Screen**
4. Name it "DC Tracker" → tap **Add**

It will appear on the home screen as a standalone app with the purple icon.

---

## Project Structure

```
dc-tracker/
├── src/
│   ├── lib/
│   │   ├── supabase.js      # Supabase client singleton
│   │   └── constants.js     # Kids, tasks, theme colors
│   ├── hooks/
│   │   ├── useDailyLog.js   # Daily chores + timed tasks ↔ Supabase
│   │   └── useShotSessions.js # Shot sessions ↔ Supabase
│   ├── pages/
│   │   ├── DailyPage.jsx    # Chores + timers
│   │   ├── ShotsPage.jsx    # Shot logger
│   │   └── StatsPage.jsx    # Weekly/monthly stats + streaks
│   ├── styles/
│   │   └── global.css       # CSS variables, reset, base styles
│   ├── App.jsx              # Shell: header, kid switcher, tab nav
│   └── main.jsx             # Entry point
├── public/
│   └── icons/               # Add icon-192.png and icon-512.png here
│                            # Generate at: appicon.co
├── .env.example             # Template — copy to .env.local
├── supabase-schema.sql      # Run this in Supabase SQL editor
├── vite.config.js           # Vite + PWA plugin config
└── index.html               # Apple PWA meta tags
```

---

## Icons

Generate icons at [appicon.co](https://appicon.co):
1. Upload a 1024×1024 PNG (purple background, DC or basketball icon)
2. Download the iOS set
3. Place in `public/icons/` as `icon-192.png` and `icon-512.png`
4. Place `apple-touch-icon.png` (180×180) in `public/`

---

## What's next

- [ ] Streak calculation logic (nightly Supabase function or client-side)
- [ ] Per-kid customizable chore lists
- [ ] Shot goals / weekly targets with alerts
- [ ] Parent dashboard view
- [ ] Midnight reset (Supabase scheduled function)
