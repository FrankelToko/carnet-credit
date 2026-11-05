import type { Money } from './types'

const formatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 })

/** Ex. 45000 -> "45 000" (sans l'unité). */
export const formatAmount = (value: Money): string => formatter.format(value)
