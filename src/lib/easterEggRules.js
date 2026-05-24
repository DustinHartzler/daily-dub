// Easter-egg rule registry. Each rule fires once per day per kid (dedup via the
// id pattern below — `<rule_id>:<kid_id>:<date>`).
//
// `check(ctx)` receives:
//   ctx.kidId      — current kid
//   ctx.log        — daily log row (chores object, *_seconds fields, *_note fields)
//   ctx.now        — Date()
//
// Return TRUTHY to fire. Add new rules to the array below.

export const EASTER_EGG_RULES = [
  {
    id: 'early-bird',
    label: 'Early Bird',
    emoji: '🌅',
    message: 'All chores done before 8am — you crushed it!',
    check: (_ctx) => false, // TODO: return true when all chores done AND now.getHours() < 8
  },
  // Add more rules here. Examples:
  //   - 'streak-7'  → fires the day a 7-day streak lands
  //   - 'no-zero'   → fires when every timed task hit its target
  //   - 'shot-record' → fires on a new shot-percentage personal best
]

export function rewardKey(ruleId, kidId, dateStr) {
  return `${ruleId}:${kidId}:${dateStr}`
}
