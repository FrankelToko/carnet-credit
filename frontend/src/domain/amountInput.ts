import type { Money } from './types'

export type Key =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | '000'
  | 'backspace'

const MAX_DIGITS = 9

/** Applique une touche du pavé à la saisie en cours (chaîne de chiffres). */
export const pressKey = (current: string, key: Key): string => {
  if (key === 'backspace') return current.slice(0, -1)
  const next = (current + key).replace(/^0+/, '')
  return next.length > MAX_DIGITS ? current : next
}

export const parseAmount = (value: string): Money =>
  value === '' ? 0 : Number(value)
