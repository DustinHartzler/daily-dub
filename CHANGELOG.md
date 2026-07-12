# Changelog

All notable changes to Daily Dub are documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added
- **Today tab** — a new kid-facing tab showing pinned announcements, today's
  schedule, and upcoming events. Each kid sees family-wide items plus their own.
- **Announcements & Events manager** in the Parent Dashboard — add / edit / delete
  dated events (with optional time window) and undated standing announcements,
  targeted at Everyone or a specific kid.
- `announcements` table + RLS policy in `supabase-schema.sql`.

### Changed
- **Streaks are now live on the Stats page.** They're computed straight from
  history (`daily_logs`, `shot_sessions`, `daily_ws`) instead of a placeholder
  `0`, so no nightly job is required. When a streak is at 0, the row shows the
  personal best instead of a dash.
