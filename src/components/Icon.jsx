import {
  Brain, Dumbbell, Star, BookOpen, Music2, Languages,
  Flame, Trophy, Crown, Gem, Sunrise, User, PersonStanding,
  Eye, Sparkles, Delete, Check, Play, Pause, RotateCcw, Calendar,
} from 'lucide-react'

// Named string → lucide component. Add aliases here as new icons are needed.
const LUCIDE = {
  brain:             Brain,
  dumbbell:          Dumbbell,
  star:              Star,
  'book-open':       BookOpen,
  music:             Music2,
  languages:         Languages,
  flame:             Flame,
  trophy:            Trophy,
  crown:             Crown,
  gem:               Gem,
  sunrise:           Sunrise,
  user:              User,
  'person-standing': PersonStanding,
  eye:               Eye,
  sparkles:          Sparkles,
  backspace:         Delete,
  check:             Check,
  play:              Play,
  pause:             Pause,
  'rotate-ccw':      RotateCcw,
  calendar:          Calendar,
}

// Lucide doesn't ship basketball/baseball/soccer/dancer — render them inline.
const CUSTOM = {
  basketball: BasketballSvg,
  baseball:   BaseballSvg,
  soccer:     SoccerSvg,
  dancer:     DancerSvg,
}

export default function Icon({ name, size = 20, color, strokeWidth = 2, ...rest }) {
  const L = LUCIDE[name]
  if (L) return <L size={size} color={color} strokeWidth={strokeWidth} {...rest} />

  const C = CUSTOM[name]
  if (C) return <C size={size} color={color} strokeWidth={strokeWidth} {...rest} />

  return null
}

// ─── Custom sport SVGs (lucide doesn't have these) ───────────────────────────

function BasketballSvg({ size, color, strokeWidth }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color ?? 'currentColor'} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M4.5 5.5c4 4 4 9 0 13" />
      <path d="M19.5 5.5c-4 4-4 9 0 13" />
    </svg>
  )
}

function BaseballSvg({ size, color, strokeWidth }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color ?? 'currentColor'} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M6 6c2.5 2 2.5 10 0 12" strokeDasharray="1.5 2" />
      <path d="M18 6c-2.5 2-2.5 10 0 12" strokeDasharray="1.5 2" />
    </svg>
  )
}

function DancerSvg({ size, color, strokeWidth }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color ?? 'currentColor'} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round">
      {/* head */}
      <circle cx="12" cy="4" r="2" />
      {/* torso */}
      <path d="M12 6 L11 13" />
      {/* arm raised */}
      <path d="M12 7 Q9 3 6 4" />
      {/* arm extended */}
      <path d="M12 8 Q15 9 19 9" />
      {/* standing leg */}
      <path d="M11 13 L10 21" />
      {/* extended leg sweeping out */}
      <path d="M11 13 Q15 14 20 13" />
    </svg>
  )
}

function SoccerSvg({ size, color, strokeWidth }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color ?? 'currentColor'} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="12,7.5 15.6,10.2 14.2,14.4 9.8,14.4 8.4,10.2" />
      <line x1="12" y1="7.5" x2="12" y2="3" />
      <line x1="15.6" y1="10.2" x2="20" y2="9" />
      <line x1="14.2" y1="14.4" x2="16.5" y2="19" />
      <line x1="9.8" y1="14.4" x2="7.5" y2="19" />
      <line x1="8.4" y1="10.2" x2="4" y2="9" />
    </svg>
  )
}
