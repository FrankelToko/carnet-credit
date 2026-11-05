const pad = (value: number): string => String(value).padStart(2, '0')

/** Date du jour (heure locale) au format AAAA-MM-JJ. */
export const todayIso = (now: Date = new Date()): string =>
  `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

/** "2026-11-05" ou "2026-11-05T10:00:00Z" -> "05/11/2026". */
export const formatDate = (iso: string): string => {
  const [year, month, day] = iso.slice(0, 10).split('-')
  return `${day}/${month}/${year}`
}
