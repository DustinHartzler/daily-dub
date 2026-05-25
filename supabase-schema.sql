-- ─────────────────────────────────────────────────────────────────────────────
-- DC Tracker — Supabase Schema
-- Paste this into: Supabase Dashboard → SQL Editor → New Query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- Kids table
CREATE TABLE IF NOT EXISTS kids (
  id         TEXT PRIMARY KEY,        -- 'kenley' | 'kellen'
  name       TEXT NOT NULL,
  emoji      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO kids (id, name, emoji) VALUES
  ('kenley', 'Kenley', '🏀'),
  ('kellen', 'Kellen', '⛹️')
ON CONFLICT (id) DO NOTHING;

-- Daily logs — one row per kid per calendar day
CREATE TABLE IF NOT EXISTS daily_logs (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kid_id           TEXT NOT NULL REFERENCES kids(id),
  date             DATE NOT NULL DEFAULT CURRENT_DATE,
  chores           JSONB NOT NULL DEFAULT '{}',   -- { "Make bed": true, ... }
  reading_seconds  INT NOT NULL DEFAULT 0,
  piano_seconds    INT NOT NULL DEFAULT 0,
  spanish_seconds  INT NOT NULL DEFAULT 0,
  spanish_note     TEXT NOT NULL DEFAULT '',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(kid_id, date)  -- enforces one row per kid per day (used by upsert)
);

-- Shot sessions — each log entry is one session
-- TODO: rename to practice_sessions when baseball/soccer get real forms
CREATE TABLE IF NOT EXISTS shot_sessions (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kid_id     TEXT NOT NULL REFERENCES kids(id),
  date       DATE NOT NULL DEFAULT CURRENT_DATE,
  sport      TEXT NOT NULL DEFAULT 'basketball',  -- 'basketball' | 'baseball' | 'soccer'
  shot_type  TEXT NOT NULL,                       -- 'Free Throws' | '3-Pointers' | etc.
  makes      INT NOT NULL CHECK (makes >= 0),
  attempts   INT NOT NULL CHECK (attempts >= 0),
  metrics    JSONB NOT NULL DEFAULT '{}'::jsonb,  -- sport-specific extra fields
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS shot_sessions_kid_sport_date_idx
  ON shot_sessions(kid_id, sport, date);

-- Weekly challenges — one Bible verse + a few fun challenges per week
CREATE TABLE IF NOT EXISTS weekly_challenges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start  DATE NOT NULL,                                       -- Monday of the week
  kind        TEXT NOT NULL CHECK (kind IN ('bible_verse','fun_challenge')),
  title       TEXT,                                                -- verse reference or challenge name
  body        TEXT NOT NULL,                                       -- verse text or challenge description
  sort_order  INT  NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS weekly_challenges_week_idx
  ON weekly_challenges(week_start, kind);

-- Daily Ws — one row per kid per day when all three pillars (Mind/Body/Character) hit.
CREATE TABLE IF NOT EXISTS daily_ws (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kid_id     TEXT NOT NULL REFERENCES kids(id),
  date       DATE NOT NULL,
  earned_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(kid_id, date)
);

CREATE INDEX IF NOT EXISTS daily_ws_kid_date_idx ON daily_ws(kid_id, date DESC);

-- Streaks — one row per kid per task, updated nightly (or on completion)
CREATE TABLE IF NOT EXISTS streaks (
  id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kid_id              TEXT NOT NULL REFERENCES kids(id),
  task_type           TEXT NOT NULL,  -- 'reading' | 'piano' | 'spanish' | 'shooting' | 'all_tasks'
  current_streak      INT NOT NULL DEFAULT 0,
  longest_streak      INT NOT NULL DEFAULT 0,
  last_completed_date DATE,
  updated_at          TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(kid_id, task_type)
);

-- Seed streaks rows
INSERT INTO streaks (kid_id, task_type) VALUES
  ('kenley', 'reading'), ('kenley', 'piano'), ('kenley', 'spanish'),
  ('kenley', 'shooting'), ('kenley', 'all_tasks'),
  ('kellen', 'reading'), ('kellen', 'piano'), ('kellen', 'spanish'),
  ('kellen', 'shooting'), ('kellen', 'all_tasks')
ON CONFLICT (kid_id, task_type) DO NOTHING;

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- This is a private family app — no auth needed, but we lock it to anon reads.
-- The anon key is safe to ship in the frontend for this use case.
ALTER TABLE kids               ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE shot_sessions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_challenges  ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_ws           ENABLE ROW LEVEL SECURITY;

-- Allow anon role to read and write all tables (family app, no login needed)
CREATE POLICY "anon full access" ON kids               FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon full access" ON daily_logs         FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon full access" ON shot_sessions      FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon full access" ON streaks            FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon full access" ON weekly_challenges  FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon full access" ON daily_ws           FOR ALL TO anon USING (true) WITH CHECK (true);
