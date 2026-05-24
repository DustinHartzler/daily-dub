// All week math runs in local TZ — fine for a one-family app.

export function mondayOf(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()                // 0 = Sun, 1 = Mon, ... 6 = Sat
  const offset = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + offset)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
