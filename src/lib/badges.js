export const BADGES = [
  { days: 3,  emoji: '🔥',  label: 'Hot Streak'   },
  { days: 7,  emoji: '⭐',  label: 'One Week'     },
  { days: 14, emoji: '💪',  label: 'Two Weeks'    },
  { days: 30, emoji: '🏆',  label: 'Champion'     },
  { days: 60, emoji: '👑',  label: 'Royalty'      },
  { days: 100, emoji: '💎', label: 'Diamond'      },
]

export function badgesEarned(currentStreak = 0) {
  return BADGES.map(b => ({ ...b, earned: currentStreak >= b.days }))
}
