export const BADGES = [
  { days: 3,   icon: 'flame',    label: 'Hot Streak' },
  { days: 7,   icon: 'star',     label: 'One Week'   },
  { days: 14,  icon: 'dumbbell', label: 'Two Weeks'  },
  { days: 30,  icon: 'trophy',   label: 'Champion'   },
  { days: 60,  icon: 'crown',    label: 'Royalty'    },
  { days: 100, icon: 'gem',      label: 'Diamond'    },
]

export function badgesEarned(currentStreak = 0) {
  return BADGES.map(b => ({ ...b, earned: currentStreak >= b.days }))
}
